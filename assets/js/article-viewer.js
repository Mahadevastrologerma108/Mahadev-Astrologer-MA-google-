/**
 * Mahadev Astrologer - Single Article Viewer
 * Loads full content inside your site's frame
 */

const BLOG_NAME = "mahadevastrologerma";

function loadSingleArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        // HTML ki sahi IDs ka istemal
        const titleEl = document.getElementById('article-title');
        const contentDiv = document.getElementById('article-content');
        
        if(titleEl) titleEl.innerHTML = "Post Not Found 🚩";
        if(contentDiv) contentDiv.innerHTML = "<p style='text-align:center; color:var(--gold);'>The requested wisdom could not be found or the link is broken.</p>";
        return;
    }

    const script = document.createElement('script');
    script.src = `https://${BLOG_NAME}.blogspot.com/feeds/posts/default/${postId}?alt=json-in-script&callback=renderFullPost`;
    document.body.appendChild(script);
}

window.renderFullPost = function(data) {
    if(!data.entry) return;
    
    // Update Browser Tab Title
    document.title = `${data.entry.title.$t} | Mahadev Astrologer MA`;
    
    // Fill Content (HTML File ke correct IDs ke sath)
    const titleEl = document.getElementById('article-title');
    const contentEl = document.getElementById('article-content');
    
    if(titleEl) titleEl.innerText = data.entry.title.$t;
    if(contentEl) contentEl.innerHTML = data.entry.content.$t;
};

document.addEventListener('DOMContentLoaded', loadSingleArticle);
