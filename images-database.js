// Gaza-related images database
const GAZA_IMAGES = [
    // News and journalism images
    'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611956425642-d5a8169abd63?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584266450019-485c5d5c6852?w=800&auto=format&fit=crop',
    
    // Middle East architecture
    'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586799965032-1fab5c4dcac8?w=800&auto=format&fit=crop',
    
    // People and solidarity
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611175694989-4870fafa6ac0?w=800&auto=format&fit=crop',
    
    // Press and media
    'https://images.unsplash.com/photo-1621264448270-9ef00e88a935?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607872337349-cfa4c83b9e7a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585007198448-e5c5f12db9a7?w=800&auto=format&fit=crop'
];

// Source-specific default images with better quality
const SOURCE_DEFAULT_IMAGES = {
    aljazeera: {
        images: [
            'https://www.aljazeera.com/wp-content/uploads/2024/01/2024-01-18T120515Z_1074444384_RC2LK5AQQ9XO_RTRMADP_3_ISRAEL-PALESTINIANS-GAZA-DISPLACED-1705605089.jpg',
            'https://www.aljazeera.com/wp-content/uploads/2024/01/2024-01-15T142318Z_1280707447_RC2YJ5AZFHDK_RTRMADP_3_ISRAEL-PALESTINIANS-1705336166.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/7/71/Al_Jazeera_English_Newsdesk.jpg'
        ],
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Aljazeera.svg/1200px-Aljazeera.svg.png'
    },
    bbc: {
        images: [
            'https://ichef.bbci.co.uk/news/1024/cpsprodpb/4F3C/production/_132066669_mediaitem132066668.jpg',
            'https://ichef.bbci.co.uk/news/1024/branded_news/1686B/production/_131912157_gettyimages-1806201120.jpg',
            'https://ichef.bbci.co.uk/news/1024/cpsprodpb/0E1B/production/_131935826_gazadestruction.jpg'
        ],
        logo: 'https://static.bbci.co.uk/ws/simorgh-assets/public/news/images/metadata/poster-1024x576.png'
    },
    reuters: {
        images: [
            'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/QWZQB7MXNNPZPFXTLC5UZX5O5U.jpg',
            'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/UVZDPQNXZJOHPBQW5HZPBRNHQU.jpg',
            'https://s4.reutersmedia.net/resources_v2/images/rcom-default.png'
        ],
        logo: 'https://s4.reutersmedia.net/resources_v2/images/rcom-default.png'
    },
    guardian: {
        images: [
            'https://i.guim.co.uk/img/media/4f3a8ff958723f3e1ad0d87f7c8c9e4c9bcb3597/0_236_5315_3189/master/5315.jpg',
            'https://i.guim.co.uk/img/media/82c67d00e1cb32b5c89ca009f6f1547c9d5fb509/0_400_6000_3600/master/6000.jpg',
            'https://i.guim.co.uk/img/media/bba5cb0c088d8096e6f13c8c6c9e6e5dd7cf3d97/0_187_5616_3370/master/5616.jpg'
        ],
        logo: 'https://assets.guim.co.uk/images/guardian-logo-rss.c45beb1bafa34b347ac333af2e6fe23f.png'
    },
    middleeasteye: {
        images: [
            'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/000_34G83LV.jpg',
            'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/GettyImages-1241037034.jpg',
            'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/2024-01-18T141017Z_1305848652_RC2LK5AVYRZK_RTRMADP_3_ISRAEL-PALESTINIANS-GAZA.JPG'
        ],
        logo: 'https://www.middleeasteye.net/sites/all/themes/mee/logo.png'
    },
    apnews: {
        images: [
            'https://dims.apnews.com/dims4/default/8fd8c8f/2147483647/strip/true/crop/6000x3375+0+313/resize/1440x810!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F2f%2F2a%2F5e850bd7430eb7f398c346ecebf9%2Fc7396b2668d84c96be73066b2b5ced89',
            'https://dims.apnews.com/dims4/default/dc3e8af/2147483647/strip/true/crop/3000x1688+0+156/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F8e%2F1e%2F3c77ed5a4082a248ea9aa2a96fd5%2Fc7a7db623f9d44669b8e7e0ed49e91f1',
            'https://dims.apnews.com/dims4/default/77c3f3c/2147483647/strip/true/crop/5472x3078+0+285/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F4d%2F1c%2F5f1e6e3c40719b54dc513b7b2287%2Ff7fa2c4fc0384a97bd0e4c12d8c3a1a6'
        ],
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/AP_logo_2012.svg/1200px-AP_logo_2012.svg.png'
    }
};

// Get random image from array
function getRandomImage(images) {
    return images[Math.floor(Math.random() * images.length)];
}

// Enhanced function to get source-specific image
function getSourceImage(source) {
    const sourceData = SOURCE_DEFAULT_IMAGES[source];
    if (sourceData && sourceData.images && sourceData.images.length > 0) {
        return getRandomImage(sourceData.images);
    }
    // Fallback to general Gaza images
    return getRandomImage(GAZA_IMAGES);
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SOURCE_DEFAULT_IMAGES, GAZA_IMAGES, getSourceImage };
}