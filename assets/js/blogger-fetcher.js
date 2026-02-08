/**
 * Mahadev Astrologer - Blogger Engine (CORS Bypass Version)
 */

const BLOG_ID = "mahadevastrologerma"; // Aapka blogspot name

function loadRoyalArticles() {
    const grid = document.getElementById('blogger-posts');
    if (!grid) return;

    // JSONP Call: Ye Browser ki security bypass kar deta hai
    const script = document.createElement('script');
    script.src = `https://${BLOG_ID}.blogspot.com/feeds/posts/default?alt=json-in-script&callback=renderBloggerPosts&max-results=12`;
    document.body.appendChild(script);
}

// Ye function tab chalega jab Google data bhej dega
window.renderBloggerPosts = function(data) {
    const grid = document.getElementById('blogger-posts');
    const entries = data.feed.entry;

    if (!entries) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gold);">Abhi koi lekh nahi mila. 🔱</p>`;
        return;
    }

    let htmlContent = '';
    entries.forEach(post => {
        const title = post.title.$t;
        const link = post.link.find(l => l.rel === 'alternate').href;
        
        // Image extraction
        let imgUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's1600') : '';
        
        // Summary cleaning
        let contentBody = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
        let summary = contentBody.replace(/<[^>]*>?/gm, '').substring(0, 120);

        htmlContent += `
            <article class="article-card">
                ${imgUrl ? `<img src="${imgUrl}" alt="${title}" style="width:100%; height:200px; object-fit:cover; border-radius:5px; margin-bottom:15px;">` : ''}
                <div>
                    <h3>${title}</h3>
                    <p>${summary}...</p>
                </div>
                <a href="${link}" target="_blank" class="read-btn">Pura Padhein 🔱</a>
            </article>`;
    });

    grid.innerHTML = htmlContent;
};

// Execute
document.addEventListener('DOMContentLoaded', loadRoyalArticles);
