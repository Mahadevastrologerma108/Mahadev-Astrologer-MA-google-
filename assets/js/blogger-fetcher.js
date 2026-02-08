/**
 * Mahadev Astrologer - Blogger Engine (Internal Link Version)
 * Purpose: Redirects users to article.html instead of external Blogger URL
 */

const BLOG_ID = "mahadevastrologerma"; // Aapka blogspot name

function loadRoyalArticles() {
    const grid = document.getElementById('blogger-posts');
    if (!grid) return;

    // JSONP Call to bypass CORS
    const script = document.createElement('script');
    script.src = `https://${BLOG_ID}.blogspot.com/feeds/posts/default?alt=json-in-script&callback=renderBloggerPosts&max-results=12`;
    document.body.appendChild(script);
}

// Function to handle the data from Blogger
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
        
        /* --- THE MAGIC PATCH START --- */
        // Yahan hum Blogger ka link nahi, balki Post ID nikal rahe hain
        const rawId = post.id.$t;
        const postId = rawId.split('post-')[1]; 
        // Ab link humari site ka article.html ban jayega
        const internalLink = `article.html?id=${postId}`;
        /* --- THE MAGIC PATCH END --- */
        
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
                <a href="${internalLink}" class="read-btn">Pura Padhein 🔱</a>
            </article>`;
    });

    grid.innerHTML = htmlContent;
};

// Start the engine
document.addEventListener('DOMContentLoaded', loadRoyalArticles);
