# Gaza News Feed 📰

A real-time news aggregator for Gaza-related news from trusted international sources.

## Features

- 🔄 **Auto-refresh**: Updates every 10 minutes automatically
- 📱 **Responsive Design**: Works perfectly on all devices
- 🌍 **Multiple Sources**: Aggregates news from Al Jazeera, BBC, Reuters, and The Guardian
- 🔍 **Smart Filtering**: Filter news by source
- 🌙 **Dark Mode Support**: Automatic dark mode based on system preferences
- 🍪 **Privacy Focused**: Minimal data collection, all stored locally
- ⚡ **Fast Loading**: Intelligent caching system
- 📊 **Clean UI**: Modern, accessible interface

## Live Demo

Visit: [https://yourusername.github.io/gaza-news-feed](https://yourusername.github.io/gaza-news-feed)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gaza-news-feed.git
cd gaza-news-feed
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

3. Visit `http://localhost:8000` in your browser

### Deployment on GitHub Pages

1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click Save
6. Your site will be available at `https://yourusername.github.io/gaza-news-feed`

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS (no frameworks required)
- **RSS Feeds**: Real-time news aggregation
- **CORS Proxy**: AllOrigins API for cross-origin requests

## Configuration

Edit `config.js` to:
- Add/remove news sources
- Adjust update interval
- Modify Gaza-related keywords
- Change cache duration

## Project Structure

```
gaza-news-feed/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # Main JavaScript
├── config.js           # Configuration file
├── README.md           # Documentation
├── LICENSE            # MIT License
└── .gitignore         # Git ignore file
```

## News Sources

The application aggregates news from:
- **Al Jazeera**: Middle East coverage
- **BBC News**: International perspective
- **Reuters**: Breaking news
- **The Guardian**: In-depth reporting

## Privacy

- No personal data is sent to external servers
- All preferences stored locally in browser
- No tracking or analytics
- Open source and transparent

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- News sources for providing RSS feeds
- AllOrigins API for CORS proxy service
- Open source community

## Roadmap

- [ ] Add more news sources
- [ ] Implement language translation
- [ ] Add push notifications
- [ ] Create mobile app version
- [ ] Add article search functionality
- [ ] Implement article saving/bookmarking
- [ ] Add social sharing features
- [ ] Create API for developers

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: contact@gazanewsfeed.com

## Disclaimer

This application aggregates publicly available news content. All rights to the news articles belong to their respective publishers.

---

**Made with ❤️ for keeping the world informed**