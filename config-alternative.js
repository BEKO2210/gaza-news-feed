// Alternative RSS Feed Configuration with multiple proxies and direct feeds
const RSS_FEEDS_ALTERNATIVE = {
    aljazeera: {
        urls: [
            'https://www.aljazeera.com/xml/rss/all.xml',
            'https://www.aljazeera.com/feed/rss',
            'https://news.google.com/rss/search?q=site:aljazeera.com+gaza&hl=en&gl=US&ceid=US:en'
        ],
        proxies: [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest='
        ],
        name: 'Al Jazeera',
        color: '#fa9000'
    },
    reuters: {
        urls: [
            'https://news.google.com/rss/search?q=gaza+palestine+site:reuters.com+when:3d&hl=en&gl=US&ceid=US:en',
            'https://www.reuters.com/world/middle-east/feed/',
            'https://news.google.com/rss/search?q=gaza+when:7d&hl=en&gl=US&ceid=US:en'
        ],
        proxies: [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest='
        ],
        name: 'Reuters',
        color: '#ff8000'
    }
};

// Function to try multiple URLs and proxies
async function loadFeedWithFallback(source, feedConfig) {
    const urls = feedConfig.urls || [feedConfig.url];
    const proxies = feedConfig.proxies || [feedConfig.proxy];
    
    for (const url of urls) {
        for (const proxy of proxies) {
            try {
                const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
                    }
                });
                
                if (response.ok) {
                    const xmlText = await response.text();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    
                    // Check if valid XML
                    if (!xmlDoc.querySelector('parsererror')) {
                        const items = xmlDoc.querySelectorAll('item, entry');
                        if (items.length > 0) {
                            console.log(`Successfully loaded ${feedConfig.name} from ${url} via ${proxy}`);
                            return { xmlDoc, url, proxy };
                        }
                    }
                }
            } catch (error) {
                console.log(`Failed attempt for ${feedConfig.name} with ${url} via ${proxy}`);
            }
        }
    }
    
    throw new Error(`All URLs and proxies failed for ${feedConfig.name}`);
}