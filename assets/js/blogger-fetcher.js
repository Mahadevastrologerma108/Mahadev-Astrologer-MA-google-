// Blogger Details
const BLOG_URL = "https://yourblogname.blogspot.com"; // 👈 Apna blog URL yahan dalo

async function fetchRoyalArticles() {
    const container = document.getElementById('blogger-posts');
    
    try {
        const response = await fetch(`${BLOG_URL}/feeds/posts/default?alt=json`);
        const data = await response.json();
        const posts = data.feed.entry;

        if (!posts) {
            container.innerHTML = "<p class='gold-text'>Mahadev ki kripa se jald hi naye lekh aayenge.</p>";
            return;
        }

        let htmlContent = '';
        posts.forEach(post => {
            const title = post.title.$t;
            const link = post.link.find(l => l.rel === 'alternate').href;
            // Summary logic: 120 characters tak
            const summary = post.summary ? post.summary.$t.substring(0, 120) : post.content.$t.replace(/<[^>]*>?/gm, '').substring(0, 120);

            htmlContent += `
                <article class="article-card">
                    <div>
                        <h3>${title}</h3>
                        <p>${summary}...</p>
                    </div>
                    <a href="${link}" target="_blank" class="read-btn">READ GUIDE 🔱</a>
                </article>
            `;
        });

        container.innerHTML = htmlContent;

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = "<p class='gold-text'>Data connect karne mein samasya aa rahi hai.</p>";
    }
}

// Start fetching
document.addEventListener('DOMContentLoaded', fetchRoyalArticles);
