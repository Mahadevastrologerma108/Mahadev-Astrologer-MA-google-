/**
 * Mahadev Astrologer - Real-Time Blogger Engine
 * Address: mahadevastrologerma.in
 * Source: mahadevastrologerma.blogspot.com
 */

// Yahan humne wahi 'Rasoi' (Source) ka pata dala hai
const BLOGGER_URL = "https://mahadevastrologerma.blogspot.com"; 

async function loadRoyalArticles() {
    const grid = document.getElementById('blogger-posts');
    if (!grid) return;

    try {
        // Hum Blogger se JSON format mein data maang rahe hain
        const response = await fetch(`${BLOGGER_URL}/feeds/posts/default?alt=json&max-results=12`);
        const data = await response.json();
        const entries = data.feed.entry;

        if (!entries) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gold);">Abhi koi lekh nahi mila. Pratiksha karein... 🔱</p>`;
            return;
        }

        let htmlContent = '';

        entries.forEach(post => {
            const title = post.title.$t;
            // Blogger ka original link
            const link = post.link.find(l => l.rel === 'alternate').href;
            
            // Image extraction: Agar post mein photo hai toh wo dikhegi
            let imgUrl = "";
            if (post.media$thumbnail) {
                imgUrl = post.media$thumbnail.url.replace('s72-c', 's1600'); 
            }

            // Summary: Pehle 100 shabd
            let summary = post.summary ? post.summary.$t : post.content.$t.replace(/<[^>]*>?/gm, '');
            summary = summary.substring(0, 100) + "...";

            htmlContent += `
                <article class="article-card">
                    ${imgUrl ? `<img src="${imgUrl}" alt="${title}">` : ''}
                    <div>
                        <h3>${title}</h3>
                        <p>${summary}</p>
                    </div>
                    <a href="${link}" target="_blank" class="read-btn">Pura Padhein 🔱</a>
                </article>
            `;
        });

        grid.innerHTML = htmlContent;

    } catch (error) {
        console.error("Fetcher Error:", error);
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gold);">Network ki samasya hai. Refresh karein. 🚩</p>`;
    }
}

// Page load hote hi function chalega
document.addEventListener('DOMContentLoaded', loadRoyalArticles);
