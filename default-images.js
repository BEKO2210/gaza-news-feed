// Enhanced default images for each news source
const NEWS_SOURCE_IMAGES = {
    bbc: [
        'https://ichef.bbci.co.uk/news/976/cpsprodpb/4F3C/production/_132066669_mediaitem132066668.jpg',
        'https://ichef.bbci.co.uk/news/976/cpsprodpb/0E1B/production/_131935826_gazadestruction.jpg',
        'https://ichef.bbci.co.uk/news/976/cpsprodpb/1686B/production/_131912157_gettyimages-1806201120.jpg',
        'https://ichef.bbci.co.uk/news/976/cpsprodpb/7a00/live/a20c7f00-867c-11f0-b391-6936825093bd.jpg'
    ],
    guardian: [
        'https://i.guim.co.uk/img/media/4f3a8ff958723f3e1ad0d87f7c8c9e4c9bcb3597/0_236_5315_3189/master/5315.jpg',
        'https://i.guim.co.uk/img/media/82c67d00e1cb32b5c89ca009f6f1547c9d5fb509/0_400_6000_3600/master/6000.jpg',
        'https://i.guim.co.uk/img/media/bba5cb0c088d8096e6f13c8c6c9e6e5dd7cf3d97/0_187_5616_3370/master/5616.jpg',
        'https://i.guim.co.uk/img/media/7882cf7b51cc80d200b29c4d580e93d10b9e564f/552_0_4662_3730/master/4662.jpg'
    ],
    aljazeera: [
        'https://www.aljazeera.com/wp-content/uploads/2024/01/2024-01-18T120515Z_1074444384_RC2LK5AQQ9XO_RTRMADP_3_ISRAEL-PALESTINIANS-GAZA-DISPLACED-1705605089.jpg',
        'https://www.aljazeera.com/wp-content/uploads/2024/01/2024-01-15T142318Z_1280707447_RC2YJ5AZFHDK_RTRMADP_3_ISRAEL-PALESTINIANS-1705336166.jpg',
        'https://www.aljazeera.com/wp-content/uploads/2023/12/2023-12-29T144851Z_1395177285_RC2Q95A23E01_RTRMADP_3_ISRAEL-PALESTINIANS-2-1703864043.jpg',
        'https://www.aljazeera.com/wp-content/uploads/2023/10/2023-10-31T152926Z_1141721100_RC2TT3AUPYXN_RTRMADP_3_ISRAEL-PALESTINIANS-1698771373.jpg',
        'https://www.aljazeera.com/wp-content/uploads/2024/01/AFP__20240123__34FW9VL__v1__HighRes__PalestinianIsraelConflict-1706017932.jpg'
    ],
    reuters: [
        'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/QWZQB7MXNNPZPFXTLC5UZX5O5U.jpg',
        'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/UVZDPQNXZJOHPBQW5HZPBRNHQU.jpg',
        'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/7AZRLVOCVJNQVJ3VX4YH2JQUAI.jpg',
        'https://www.reuters.com/resizer/SFFeH5WMHJMUTIT4fYSTKUwJZhA=/1920x0/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/V6KZTHAPAZJJTFJNRCQYZUFH5I.jpg',
        'https://www.reuters.com/resizer/sGKV9n-W1JiKOKgQiqNQxcGE7YU=/1920x0/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/A6U7KI7HBFMD5DWVYUSL3CQ5TI.jpg'
    ],
    middleeasteye: [
        'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/000_34G83LV.jpg',
        'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/GettyImages-1241037034.jpg',
        'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/2024-01-18T141017Z_1305848652_RC2LK5AVYRZK_RTRMADP_3_ISRAEL-PALESTINIANS-GAZA.JPG',
        'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/ISRAEL-PALESTINIANS-GAZA_0.JPG',
        'https://www.middleeasteye.net/sites/default/files/styles/article_page/public/images-story/000_34FA7TJ.jpg'
    ],
    apnews: [
        'https://dims.apnews.com/dims4/default/8fd8c8f/2147483647/strip/true/crop/6000x3375+0+313/resize/1440x810!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F2f%2F2a%2F5e850bd7430eb7f398c346ecebf9%2Fc7396b2668d84c96be73066b2b5ced89',
        'https://dims.apnews.com/dims4/default/dc3e8af/2147483647/strip/true/crop/3000x1688+0+156/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F8e%2F1e%2F3c77ed5a4082a248ea9aa2a96fd5%2Fc7a7db623f9d44669b8e7e0ed49e91f1',
        'https://dims.apnews.com/dims4/default/77c3f3c/2147483647/strip/true/crop/5472x3078+0+285/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F4d%2F1c%2F5f1e6e3c40719b54dc513b7b2287%2Ff7fa2c4fc0384a97bd0e4c12d8c3a1a6',
        'https://dims.apnews.com/dims4/default/f4d2c17/2147483647/strip/true/crop/8256x4644+0+430/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F3d%2F0e%2F4e8a3e9540e6a0c6f8e6d8f6d0f6%2F3b8f3c4a8e5f4c5a9d6e7f8a9b0c1d2e',
        'https://dims.apnews.com/dims4/default/8c3e4f5/2147483647/strip/true/crop/5464x3073+0+284/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F2e%2F3f%2F4d5e6f7a8b9c0d1e2f3a4b5c6d7e%2F1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
    ]
};

// Get random image for a source
function getSourceSpecificImage(source) {
    const images = NEWS_SOURCE_IMAGES[source];
    if (images && images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }
    // Ultimate fallback
    return 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=1200&auto=format&fit=crop';
}