/**
 * Mahadev Astrologer - Premium Blogger Fetcher
 * Features: Internal Linking, Pagination (Load More), & Fade Animation
 */

const BLOG_ID = "mahadevastrologerma";
let startIndex = 1; 
const maxResults = 8; // Per batch articles

function loadRoyalArticles() {
    const grid = document.getElementById('blogger-posts');
    if (!grid) return;

    const btn = document.getElementById('load-more-btn');
    if(btn) btn.innerHTML = "Seeking Wisdom... 🔱";

    const script = document.createElement('script');
    script.src = `https://${BLOG_ID}.blogspot.com/feeds/posts/default?alt=json-in-script&callback=renderBloggerPosts&max-results=${maxResults}&start-index=${startIndex}`;
    document.body.appendChild(script);
}

window.renderBloggerPosts = function(data) {
    const grid = document.getElementById('blogger-posts');
    const entries = data.feed.entry;

    if (!entries || entries.length === 0) {
        const btnContainer = document.getElementById('btn-container');
        if(btnContainer) btnContainer.innerHTML = `<p style="color:var(--gold); font-family:'Cinzel'; opacity:0.6;">— All Wisdom Revealed —</p>`;
        return;
    }

    let htmlContent = '';
    entries.forEach((post, index) => {
        const title = post.title.$t;
        const postId = post.id.$t.split('post-')[1]; 
        const internalLink = `article.html?id=${postId}`;
        let imgUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's1600') : '';
        let contentBody = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
        let summary = contentBody.replace(/<[^>]*>?/gm, '').substring(0, 100);

        htmlContent += `
            <article class="article-card" style="animation: fadeInUp 0.6s ease forwards; animation-delay: ${index * 0.1}s; opacity:0;">
                ${imgUrl ? `<img src="${imgUrl}" alt="${title}" style="width:100%; height:200px; object-fit:cover; border-radius:4px; margin-bottom:15px;">` : ''}
                <div>
                    <h3>${title}</h3>
                    <p>${summary}...</p>
                </div>
                // Is line ko dhundiye aur aise badaliye:
<a href="${internalLink}" class="read-btn" data-key="btn_read_more">READ ARTICLE 🔱</a>
            </article>`;
    });

    if(startIndex === 1) grid.innerHTML = htmlContent;
    else grid.insertAdjacentHTML('beforeend', htmlContent);

    updateLoadMoreButton(entries.length);
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
       // updateLoadMoreButton function ke andar:
btnContainer.innerHTML = `<button id="load-more-btn" onclick="fetchNextBatch()" class="premium-load-btn" data-key="btn_view_more">VIEW MORE GUIDES 🔱</button>`;
    } else {
        btnContainer.innerHTML = `<button id="load-more-btn" onclick="fetchNextBatch()" class="premium-load-btn">VIEW MORE GUIDES 🔱</button>`;
    }
}

function fetchNextBatch() {
    startIndex += maxResults;
    loadRoyalArticles();
}

document.addEventListener('DOMContentLoaded', loadRoyalArticles);
// ... baki code ...
    updateLoadMoreButton(entries.length);

    // Ye line jarur jodein, warna translation nahi chalega!
    if(window.updateContent) {
        window.updateContent(localStorage.getItem('selectedLanguage') || 'hi');
    }
};
