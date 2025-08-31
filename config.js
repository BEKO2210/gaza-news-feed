// RSS Feed Configuration mit funktionierenden URLs
const RSS_FEEDS = {
    bbc: {
        url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
        proxy: 'https://api.allorigins.win/raw?url=',
        name: 'BBC News',
        color: '#bb1919'
    },
    guardian: {
        url: 'https://www.theguardian.com/world/middleeast/rss',
        proxy: 'https://api.allorigins.win/raw?url=',
        name: 'The Guardian',
        color: '#052962'
    },
    aljazeera: {
        url: 'https://www.aljazeera.com/xml/rss/all.xml',
        proxy: 'https://api.allorigins.win/raw?url=',
        name: 'Al Jazeera',
        color: '#fa9000'
    },
    reuters: {
        url: 'https://news.google.com/rss/search?q=gaza+OR+palestine+when:7d&hl=en&gl=US&ceid=US:en',
        proxy: 'https://api.allorigins.win/raw?url=',
        name: 'Reuters',
        color: '#ff8000'
    },
    middleeasteye: {
        url: 'https://www.middleeasteye.net/rss',
        proxy: 'https://api.allorigins.win/raw?url=',
        name: 'Middle East Eye',
        color: '#c4462a'
    },
    apnews: {
        url: 'https://news.google.com/rss/search?q=gaza+OR+palestine+when:7d&hl=en&gl=US&ceid=US:en',
        proxy: 'https://api.allorigins.win/raw?url=',
        name: 'AP News',
        color: '#ff322e'
    }
};

// Update interval in milliseconds (10 minutes)
const UPDATE_INTERVAL = 10 * 60 * 1000;

// Gaza-related keywords for filtering
const GAZA_KEYWORDS = [
    'gaza', 'palestine', 'palestinian', 'hamas', 'israel',
    'rafah', 'khan younis', 'deir al-balah', 'jabalia',
    'blockade', 'ceasefire', 'humanitarian', 'unrwa',
    'west bank', 'occupation', 'idf', 'netanyahu'
];

// Configuration for local storage
const STORAGE_KEY = 'gazaNewsCache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache