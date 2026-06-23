const BLOG_ID = "mahadevastrologerma";
let startIndex = 1; 
const maxResults = 8; 

// SEO ke liye Title se URL (Slug) banane ka function
function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Special characters hatane ke liye
        .replace(/\s+/g, '-')         // Spaces ko dash (-) banane ke liye
        .replace(/-+/g, '-')          // Extra dashes hatane ke liye
        .trim();
}

function loadRoyalArticles() {
    const grid = document.getElementById('blogger-posts');
    if (!grid) return;

    const script = document.createElement('script');
    script.src = `https://${BLOG_ID}.blogspot.com/feeds/posts/default?alt=json-in-script&callback=renderBloggerPosts&max-results=${maxResults}&start-index=${startIndex}`;
    document.body.appendChild(script);
}

window.renderBloggerPosts = function(data) {
    const grid = document.getElementById('blogger-posts');
    if (!data.feed.entry) {
        updateLoadMoreButton(0);
        return;
    }

    const entries = data.feed.entry;
    let htmlContent = '';

    entries.forEach((post, index) => {
        const title = post.title.$t;
        
        // Blogger post ki asali Numeric ID nikalna
        const postId = post.id.$t.split('post-')[1]; 
        
        // SEO-friendly slug generate karna
        const slug = createSlug(title); 
        
        // ✅ Hybrid URL: ID (API ke liye) aur Title (SEO ke liye) dono
        const internalLink = `article.html?id=${postId}&title=${slug}`;
        
        let imgUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's1600') : '';
        let contentBody = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
        
        // HTML tags hatakar clean text nikalna
        let cleanText = contentBody.replace(/<[^>]*>?/gm, '');
        let summary = cleanText.length > 100 ? cleanText.substring(0, 100).trim() + '...' : cleanText;

        htmlContent += `
            <article class="article-card" style="animation: fadeInUp 0.6s ease forwards; animation-delay: ${index * 0.1}s; opacity:0;">
                ${imgUrl ? `<img src="${imgUrl}" alt="${title}">` : ''}
                <div>
                    <h3>${title}</h3>
                    <p>${summary}</p>
                </div>
                <a href="${internalLink}" class="read-btn" data-key="btn_read_more">READ ARTICLE 🔱</a>
            </article>`;
    });

    if(startIndex === 1) {
        grid.innerHTML = htmlContent;
    } else {
        grid.insertAdjacentHTML('beforeend', htmlContent);
    }

    updateLoadMoreButton(entries.length);

    if (window.updateContent) {
        window.updateContent(localStorage.getItem('selectedLanguage') || 'hi');
    }
};

function updateLoadMoreButton(lastResultCount) {
    let btnContainer = document.getElementById('btn-container');
    if(!btnContainer) {
        btnContainer = document.createElement('div');
        btnContainer.id = 'btn-container';
        btnContainer.style.cssText = "text-align:center; padding: 50px 0; grid-column: 1/-1;";
        document.getElementById('blogger-posts').after(btnContainer);
    }

    if(lastResultCount < maxResults) {
        btnContainer.innerHTML = `<p style="color:var(--gold); font-family:'Cinzel'; opacity:0.6;">— All Wisdom Revealed —</p>`;
    } else {
        btnContainer.innerHTML = `<button id="load-more-btn" onclick="fetchNextBatch()" class="premium-load-btn" data-key="btn_view_more">VIEW MORE GUIDES 🔱</button>`;
    }
}

function fetchNextBatch() {
    startIndex += maxResults;
    loadRoyalArticles();
}

document.addEventListener('DOMContentLoaded', loadRoyalArticles);
