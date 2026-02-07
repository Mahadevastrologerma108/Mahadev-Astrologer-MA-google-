/**
 * Mahadev Astrologer - Blogger Fetcher Engine
 * Mission: Premium, Ad-free Article Delivery
 */

const BLOGGER_URL = "https://yourblogname.blogspot.com"; // 👈 Yahan apna link dalo

async function loadRoyalArticles() {
    const grid = document.getElementById('blogger-posts');
    
    try {
        // Fetching the JSON feed
        const response = await fetch(`${BLOGGER_URL}/feeds/posts/default?alt=json&max-results=12`);
        const data = await response.json();
        const entries = data.feed.entry;

        if (!entries) {
            grid.innerHTML = `<p class="gold-text" style="grid-column: 1/-1; text-align: center;">Jald hi naye lekh prakashit honge. Pratiksha karein... 🔱</p>`;
            return;
        }

        let html = '';
        entries.forEach(post => {
            const title = post.title.$t;
            const link = post.link.find(l => l.rel === 'alternate').href;
            
            // Thumbnail extraction logic
            let imgUrl = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's1600') : '';
            
            // Clean summary logic
            let summary = post.summary ? post.summary.$t : post.content.$t.replace(/<[^>]*>?/gm, '');
            summary = summary.substring(0, 100) + "...";

            html += `
                <article class="article-card">
                    ${imgUrl ? `<img src="${imgUrl}" alt="${title}" style="width:100%; border-radius:4px; margin-bottom:15px; opacity:0.8; border:1px solid rgba(197, 160, 89, 0.2);">` : ''}
                    <div>
                        <h3>${title}</h3>
                        <p>${summary}</p>
                    </div>
                    <a href="${link}" target="_blank" class="read-btn">READ SACRED GUIDE 🔱</a>
                </article>
            `;
        });

        grid.innerHTML = html;

    } catch (error) {
        console.error("Connection Error:", error);
        grid.innerHTML = `<p class="gold-text" style="grid-column: 1/-1; text-align: center;">Brahmand se sampark judne mein samay lag raha hai. Kripya refresh karein.</p>`;
    }
}

// Execute when page is ready
document.addEventListener('DOMContentLoaded', loadRoyalArticles);
