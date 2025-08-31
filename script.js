// Global variables
let allArticles = [];
let currentFilter = 'all';
let updateTimer = null;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadAllFeeds();
    setupEventListeners();
    startAutoUpdate();
    checkCookieConsent();
    setupScrollHeader();
});

// Setup collapsible header on scroll with better performance
function setupScrollHeader() {
    const header = document.querySelector('.header');
    const logo = document.querySelector('.logo-image');
    let isScrolling = false;
    let ticking = false;
    
    // Add smooth transition to logo
    logo.style.transition = 'height 0.3s ease';
    header.style.transition = 'padding 0.3s ease';
    
    function updateHeader() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 150) {
            // Scrolling down - collapse header
            if (!header.classList.contains('collapsed')) {
                header.classList.add('collapsed');
            }
        } else {
            // At top - expand header
            if (header.classList.contains('collapsed')) {
                header.classList.remove('collapsed');
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    // Use passive listener for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Initialize application
function initializeApp() {
    console.log('Gaza News Feed initialized');
    updateLastUpdateTime();
}

// Setup event listeners
function setupEventListeners() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadAllFeeds();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.source;
            filterAndDisplayArticles();
        });
    });

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('articleModal').addEventListener('click', (e) => {
        if (e.target.id === 'articleModal') closeModal();
    });

    // Cookie banner
    document.getElementById('acceptCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        document.getElementById('cookieBanner').classList.remove('show');
    });

    document.getElementById('rejectCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        document.getElementById('cookieBanner').classList.remove('show');
    });

    // Footer links
    document.getElementById('aboutLink').addEventListener('click', (e) => {
        e.preventDefault();
        showAboutModal();
    });

    document.getElementById('privacyLink').addEventListener('click', (e) => {
        e.preventDefault();
        showPrivacyModal();
    });

    document.getElementById('contactLink').addEventListener('click', (e) => {
        e.preventDefault();
        showContactModal();
    });
}

// Load all RSS feeds
async function loadAllFeeds() {
    showLoading(true);
    hideError();
    allArticles = [];

    try {
        // Check cache first
        const cached = getCachedData();
        if (cached && cached.length > 0) {
            allArticles = cached;
            filterAndDisplayArticles();
            showLoading(false);
            console.log('Loaded from cache:', cached.length, 'articles');
            return;
        }

        // Load feeds in parallel
        const feedPromises = Object.entries(RSS_FEEDS).map(([key, feed]) => 
            loadFeed(key, feed).catch(err => {
                console.error(`Error loading ${feed.name}:`, err);
                return [];
            })
        );

        const results = await Promise.all(feedPromises);
        allArticles = results.flat();

        console.log('Total articles loaded:', allArticles.length);
        
        // Sort by date (newest first)
        allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        // If no articles found, show message
        if (allArticles.length === 0) {
            console.warn('No articles found from any feed!');
            // Try with alternative proxy
            console.log('Retrying with alternative proxy...');
            await retryWithAlternativeProxy();
        } else {
            // Cache the data
            setCachedData(allArticles);
        }

        // Display articles
        filterAndDisplayArticles();
        updateLastUpdateTime();
    } catch (error) {
        console.error('Error loading feeds:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

// Retry with alternative proxy
async function retryWithAlternativeProxy() {
    console.log('Trying alternative proxy for all feeds...');
    
    const alternativeProxy = 'https://corsproxy.io/?';
    const feedPromises = Object.entries(RSS_FEEDS).map(([key, feed]) => {
        const altFeed = { ...feed, proxy: alternativeProxy };
        return loadFeed(key, altFeed).catch(err => {
            console.error(`Alternative proxy failed for ${feed.name}:`, err);
            return [];
        });
    });
    
    const results = await Promise.all(feedPromises);
    allArticles = results.flat();
    
    if (allArticles.length > 0) {
        console.log('Alternative proxy successful! Loaded:', allArticles.length, 'articles');
        allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        setCachedData(allArticles);
    }
}

// Load individual RSS feed
async function loadFeed(source, feedConfig) {
    try {
        const proxyUrl = `${feedConfig.proxy}${encodeURIComponent(feedConfig.url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Check for parse errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            console.error(`XML Parse error for ${feedConfig.name}`);
            return [];
        }
        
        const items = xmlDoc.querySelectorAll('item, entry'); // Support both RSS and Atom
        const articles = [];

        items.forEach(item => {
            // Handle both RSS and Atom feeds
            const title = getTextContent(item, 'title');
            
            // Get description - try multiple fields
            let description = getTextContent(item, 'description') || 
                            getTextContent(item, 'summary') || 
                            getTextContent(item, 'content') ||
                            getTextContent(item, 'content\\:encoded') ||
                            '';
            
            // Get the full content if available (often has images)
            const contentEncoded = item.querySelector('content\\:encoded, encoded');
            if (contentEncoded) {
                description = contentEncoded.textContent || description;
            }
            
            const link = getTextContent(item, 'link') || item.querySelector('link')?.getAttribute('href');
            const pubDate = getTextContent(item, 'pubDate') || getTextContent(item, 'published') || getTextContent(item, 'updated');
            
            // Filter for Gaza-related content
            if (isGazaRelated(title, description)) {
                const cleanedDescription = cleanText(description);
                let image = extractImage(item, description, source); // Pass original HTML description
                
                // Ensure we ALWAYS have an image
                if (!image || image === null || image === undefined || image === '') {
                    image = getDefaultImage(source);
                    console.log(`Using fallback for ${source} article: ${title.substring(0, 50)}...`);
                }
                
                articles.push({
                    title: cleanText(title),
                    description: cleanedDescription,
                    link: link,
                    pubDate: pubDate,
                    source: source,
                    sourceName: feedConfig.name,
                    sourceColor: feedConfig.color,
                    image: image
                });
            }
        });

        console.log(`Loaded ${articles.length} Gaza-related articles from ${feedConfig.name}`);
        return articles;
    } catch (error) {
        console.error(`Error loading ${feedConfig.name}:`, error);
        return [];
    }
}

// Check if content is Gaza-related
function isGazaRelated(title, description) {
    const content = `${title} ${description}`.toLowerCase();
    return GAZA_KEYWORDS.some(keyword => content.includes(keyword.toLowerCase()));
}

// Extract text content from XML element
function getTextContent(parent, tagName) {
    const element = parent.querySelector(tagName);
    return element ? element.textContent : '';
}

// Clean HTML from text
function cleanText(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
}

// Extract image from item with better detection
function extractImage(item, description, source) {
    // Try media:thumbnail first (BBC uses this)
    const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
    if (mediaThumbnail) {
        const url = mediaThumbnail.getAttribute('url');
        if (url) {
            // BBC thumbnails need size upgrade
            const fullSizeUrl = url.replace('/240/', '/976/').replace('/standard/', '/branded_news/');
            console.log(`Found BBC thumbnail: ${fullSizeUrl}`);
            return fullSizeUrl;
        }
    }
    
    // Try media:content (often contains images)
    const mediaContent = item.querySelectorAll('media\\:content, content');
    for (let media of mediaContent) {
        const url = media.getAttribute('url');
        const type = media.getAttribute('type');
        const medium = media.getAttribute('medium');
        if (url && (medium === 'image' || (type && type.startsWith('image')))) {
            console.log(`Found media:content image for ${source}: ${url}`);
            return url;
        }
    }

    // Try enclosure tag (common in podcasts but also used for images)
    const enclosures = item.querySelectorAll('enclosure');
    for (let enclosure of enclosures) {
        const type = enclosure.getAttribute('type');
        const url = enclosure.getAttribute('url');
        if (url && type && type.startsWith('image')) {
            console.log(`Found enclosure image for ${source}: ${url}`);
            return url;
        }
    }
    
    // For Google News, try to extract from source URL
    const sourceElement = item.querySelector('source');
    if (sourceElement) {
        const sourceUrl = sourceElement.getAttribute('url');
        if (sourceUrl && sourceUrl.includes('google.com')) {
            // Google News specific extraction
            const link = item.querySelector('link')?.textContent;
            if (link) {
                // Try to get image from the actual article URL
                console.log(`Google News link found, but no direct image`);
            }
        }
    }

    // Try to extract from description/content HTML
    const contentToSearch = description || item.querySelector('content\\:encoded, content, description')?.textContent || '';
    
    if (contentToSearch) {
        // Look for img tags with various quote styles
        const imgPatterns = [
            /<img[^>]+src=["']([^"'>]+)["']/gi,
            /<img[^>]+src=([^\s>]+)/gi,
            /img src=["']([^"'>]+)["']/gi
        ];
        
        for (let pattern of imgPatterns) {
            const matches = contentToSearch.matchAll(pattern);
            for (let match of matches) {
                if (match[1] && !match[1].includes('tracking') && !match[1].includes('pixel')) {
                    console.log(`Found image in description for ${source}: ${match[1]}`);
                    return match[1];
                }
            }
        }
        
        // Look for image URLs directly in text
        const urlPattern = /(https?:\/\/[^\s<>"]+\.(jpg|jpeg|png|gif|webp)[^\s<>"]*)/gi;
        const urlMatch = contentToSearch.match(urlPattern);
        if (urlMatch && urlMatch[0]) {
            console.log(`Found image URL in content for ${source}: ${urlMatch[0]}`);
            return urlMatch[0];
        }
    }
    
    // Try itunes:image (for podcast feeds that might have news)
    const itunesImage = item.querySelector('itunes\\:image');
    if (itunesImage) {
        const href = itunesImage.getAttribute('href');
        if (href) {
            console.log(`Found iTunes image for ${source}: ${href}`);
            return href;
        }
    }
    
    // Try image tag directly
    const imageTag = item.querySelector('image');
    if (imageTag) {
        const url = imageTag.querySelector('url')?.textContent || imageTag.textContent;
        if (url && url.startsWith('http')) {
            console.log(`Found direct image tag for ${source}: ${url}`);
            return url;
        }
    }

    // ALWAYS return an image - use intelligent fallback
    const fallbackImage = getDefaultImage(source);
    console.log(`No RSS image for ${source}, using fallback: ${fallbackImage}`);
    return fallbackImage;
}

// Get default image for source
function getDefaultImage(source) {
    // First try to use the enhanced source-specific images
    if (typeof getSourceSpecificImage !== 'undefined') {
        return getSourceSpecificImage(source);
    }
    
    // Then try the image database
    if (typeof getSourceImage !== 'undefined') {
        return getSourceImage(source);
    }
    
    // Finally use static fallback images
    const defaultImages = {
        aljazeera: 'https://www.aljazeera.com/wp-content/uploads/2024/01/2024-01-18T120515Z_1074444384_RC2LK5AQQ9XO_RTRMADP_3_ISRAEL-PALESTINIANS-GAZA-DISPLACED-1705605089.jpg',
        bbc: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/4F3C/production/_132066669_mediaitem132066668.jpg',
        reuters: 'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/QWZQB7MXNNPZPFXTLC5UZX5O5U.jpg',
        guardian: 'https://i.guim.co.uk/img/media/4f3a8ff958723f3e1ad0d87f7c8c9e4c9bcb3597/0_236_5315_3189/master/5315.jpg',
        middleeasteye: 'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/000_34G83LV.jpg',
        apnews: 'https://dims.apnews.com/dims4/default/8fd8c8f/2147483647/strip/true/crop/6000x3375+0+313/resize/1440x810!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F2f%2F2a%2F5e850bd7430eb7f398c346ecebf9%2Fc7396b2668d84c96be73066b2b5ced89'
    };
    
    return defaultImages[source] || 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=800&auto=format&fit=crop';
}

// Filter and display articles
function filterAndDisplayArticles() {
    const filtered = currentFilter === 'all' 
        ? allArticles 
        : allArticles.filter(article => article.source === currentFilter);
    
    displayArticles(filtered);
}

// Display articles in grid
function displayArticles(articles) {
    const newsGrid = document.getElementById('newsGrid');
    
    if (articles.length === 0) {
        newsGrid.innerHTML = `
            <div class="no-results">
                <p>No news articles found. Try refreshing or changing filters.</p>
            </div>
        `;
        return;
    }

    newsGrid.innerHTML = articles.map(article => createArticleCard(article)).join('');
    
    // Add click listeners to cards
    document.querySelectorAll('.news-card').forEach((card, index) => {
        card.addEventListener('click', () => showArticleModal(articles[index]));
    });
}

// Create article card HTML
function createArticleCard(article) {
    const date = formatDate(article.pubDate);
    const image = article.image || getDefaultImage(article.source);
    
    return `
        <article class="news-card" data-source="${article.source}">
            <img src="${image}" alt="${article.title}" class="news-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=800&auto=format&fit=crop'; this.onerror=null;">
            <div class="news-content">
                <span class="news-source" style="background-color: ${article.sourceColor}">${article.sourceName}</span>
                <h2 class="news-title">${article.title}</h2>
                <p class="news-description">${article.description}</p>
                <div class="news-meta">
                    <span class="news-date">📅 ${date}</span>
                    <span class="read-more">Read more →</span>
                </div>
            </div>
        </article>
    `;
}

// Show article modal
function showArticleModal(article) {
    const modal = document.getElementById('articleModal');
    const modalBody = document.getElementById('modalBody');
    const date = formatDate(article.pubDate);
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${article.title}</h2>
            <div class="modal-meta">
                <span style="color: ${article.sourceColor}">📰 ${article.sourceName}</span>
                <span>📅 ${date}</span>
            </div>
        </div>
        ${article.image ? `<img src="${article.image}" alt="${article.title}" class="modal-image">` : ''}
        <div class="modal-text">
            <p>${article.description}</p>
        </div>
        <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="modal-link">
            Read Full Article on ${article.sourceName} →
        </a>
    `;
    
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('articleModal').classList.remove('active');
}

// Show about modal
function showAboutModal() {
    const modal = document.getElementById('articleModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">About Gaza News Feed</h2>
        </div>
        <div class="modal-text">
            <p>Gaza News Feed is a real-time news aggregator that collects and displays the latest news about Gaza from multiple trusted international news sources.</p>
            <p>Our mission is to provide comprehensive, up-to-date coverage of events in Gaza, ensuring that important stories reach a global audience.</p>
            <p>The feed updates automatically every 10 minutes, bringing you the latest developments as they happen.</p>
            <h3>Features:</h3>
            <ul>
                <li>Real-time updates from major news sources</li>
                <li>Automatic refresh every 10 minutes</li>
                <li>Filter by news source</li>
                <li>Mobile-responsive design</li>
                <li>Direct links to original articles</li>
            </ul>
        </div>
    `;
    
    modal.classList.add('active');
}

// Show privacy modal
function showPrivacyModal() {
    const modal = document.getElementById('articleModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">Privacy Policy</h2>
        </div>
        <div class="modal-text">
            <p><strong>Last updated: ${new Date().toLocaleDateString()}</strong></p>
            <h3>Information We Collect</h3>
            <p>Gaza News Feed respects your privacy. We only collect minimal data necessary for the functioning of the website:</p>
            <ul>
                <li>Cookie preferences (stored locally)</li>
                <li>Cached news data (stored locally for performance)</li>
            </ul>
            <h3>How We Use Information</h3>
            <p>All data is stored locally in your browser. We do not send any personal information to external servers.</p>
            <h3>Third-Party Content</h3>
            <p>News content is fetched from external news sources. When you click on article links, you will be directed to third-party websites which have their own privacy policies.</p>
            <h3>Contact</h3>
            <p>For privacy concerns, please use the contact form.</p>
        </div>
    `;
    
    modal.classList.add('active');
}

// Show contact modal
function showContactModal() {
    const modal = document.getElementById('articleModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">Contact Us</h2>
        </div>
        <div class="modal-text">
            <p>We welcome your feedback and suggestions to improve Gaza News Feed.</p>
            <h3>Get in Touch</h3>
            <p>Email: contact@gazanewsfeed.com</p>
            <p>GitHub: <a href="https://github.com/yourusername/gaza-news-feed" target="_blank">github.com/yourusername/gaza-news-feed</a></p>
            <h3>Report Issues</h3>
            <p>If you encounter any technical issues or have suggestions for improvement, please open an issue on our GitHub repository.</p>
            <h3>Contribute</h3>
            <p>Gaza News Feed is open source. We welcome contributions from developers who want to help improve the platform.</p>
        </div>
    `;
    
    modal.classList.add('active');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
        const days = Math.floor(hours / 24);
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Update last update time
function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    lastUpdate.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

// Start auto-update timer
function startAutoUpdate() {
    if (updateTimer) clearInterval(updateTimer);
    updateTimer = setInterval(() => {
        loadAllFeeds();
    }, UPDATE_INTERVAL);
}

// Show/hide loading indicator
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
    document.getElementById('newsGrid').style.display = show ? 'none' : 'grid';
}

// Show/hide error message
function showError() {
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('newsGrid').style.display = 'none';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Cache management
function getCachedData() {
    try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const now = new Date().getTime();
        
        if (now - data.timestamp > CACHE_DURATION) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        
        return data.articles;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

function setCachedData(articles) {
    try {
        const data = {
            timestamp: new Date().getTime(),
            articles: articles
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

// Check cookie consent
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        setTimeout(() => {
            document.getElementById('cookieBanner').classList.add('show');
        }, 2000);
    }
}

// Handle visibility change (pause/resume updates when tab is not visible)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (updateTimer) clearInterval(updateTimer);
    } else {
        startAutoUpdate();
        loadAllFeeds();
    }
});