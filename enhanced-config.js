// Proxy service configuration with fallbacks
const PROXY_SERVICES = [
    {
        name: 'CorsProxy',
        url: 'https://corsproxy.io/?',
        active: true
    },
    {
        name: 'AllOrigins',
        url: 'https://api.allorigins.win/raw?url=',
        active: true
    },
    {
        name: 'CorsAnywhere',
        url: 'https://cors-anywhere.herokuapp.com/',
        active: false // Usually requires demo activation
    },
    {
        name: 'Thingproxy',
        url: 'https://thingproxy.freeboard.io/fetch/',
        active: true
    }
];

// Get working proxy
async function getWorkingProxy(url) {
    for (const proxy of PROXY_SERVICES) {
        if (!proxy.active) continue;
        
        try {
            const testUrl = `${proxy.url}${encodeURIComponent(url)}`;
            const response = await fetch(testUrl, {
                method: 'HEAD',
                signal: AbortSignal.timeout(3000) // 3 second timeout
            });
            
            if (response.ok || response.status === 200) {
                console.log(`Using proxy: ${proxy.name}`);
                return proxy.url;
            }
        } catch (error) {
            console.log(`Proxy ${proxy.name} failed, trying next...`);
        }
    }
    
    // Fallback to first active proxy
    return PROXY_SERVICES.find(p => p.active).url;
}

// Enhanced RSS Feed Configuration
const ENHANCED_RSS_FEEDS = {
    aljazeera: {
        urls: [
            'https://news.google.com/rss/search?q=site:aljazeera.com+gaza+OR+palestine&hl=en&gl=US&ceid=US:en',
            'https://www.aljazeera.com/xml/rss/all.xml',
            'https://www.aljazeera.com/feed/rss'
        ],
        name: 'Al Jazeera',
        color: '#fa9000',
        keywords: ['gaza', 'palestine', 'israel']
    },
    bbc: {
        urls: [
            'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
            'https://news.google.com/rss/search?q=site:bbc.com+gaza+OR+palestine&hl=en&gl=US&ceid=US:en'
        ],
        name: 'BBC News',
        color: '#bb1919',
        keywords: ['gaza', 'palestine', 'israel']
    },
    reuters: {
        urls: [
            'https://news.google.com/rss/search?q=gaza+OR+palestine+site:reuters.com&hl=en&gl=US&ceid=US:en',
            'https://news.google.com/rss/search?q=gaza+palestine&hl=en&gl=US&ceid=US:en'
        ],
        name: 'Reuters',
        color: '#ff8000',
        keywords: ['gaza', 'palestine', 'israel']
    },
    guardian: {
        urls: [
            'https://www.theguardian.com/world/middleeast/rss',
            'https://news.google.com/rss/search?q=site:theguardian.com+gaza+OR+palestine&hl=en&gl=US&ceid=US:en'
        ],
        name: 'The Guardian',
        color: '#052962',
        keywords: ['gaza', 'palestine', 'israel']
    },
    middleeasteye: {
        urls: [
            'https://www.middleeasteye.net/rss',
            'https://news.google.com/rss/search?q=site:middleeasteye.net+gaza&hl=en&gl=US&ceid=US:en'
        ],
        name: 'Middle East Eye',
        color: '#c4462a',
        keywords: ['gaza', 'palestine', 'israel']
    },
    apnews: {
        urls: [
            'https://news.google.com/rss/search?q=gaza+OR+palestine+site:apnews.com&hl=en&gl=US&ceid=US:en'
        ],
        name: 'AP News',
        color: '#ff322e',
        keywords: ['gaza', 'palestine', 'israel']
    }
};

// Load feed with automatic fallback
async function loadFeedEnhanced(source, feedConfig) {
    const errors = [];
    
    for (const url of feedConfig.urls) {
        try {
            // Try to get a working proxy for this URL
            const proxy = await getWorkingProxy(url);
            const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
            
            console.log(`Trying ${feedConfig.name} with URL: ${url.substring(0, 50)}...`);
            
            const response = await fetch(proxyUrl, {
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Check for parse errors
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error('XML parsing failed');
            }
            
            const items = xmlDoc.querySelectorAll('item, entry');
            if (items.length > 0) {
                console.log(`✓ Successfully loaded ${items.length} items from ${feedConfig.name}`);
                return { xmlDoc, items, url };
            }
            
        } catch (error) {
            errors.push(`${url}: ${error.message}`);
            continue;
        }
    }
    
    console.error(`Failed to load ${feedConfig.name}. Errors:`, errors);
    return null;
}