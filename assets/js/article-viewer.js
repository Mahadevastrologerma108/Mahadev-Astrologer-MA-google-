/**
 * Mahadev Astrologer - Single Article Viewer
 * Loads full content inside your site's frame
 */

const BLOG_NAME = "mahadevastrologerma";

function loadSingleArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        const contentDiv = document.getElementById('article-full-content');
        if(contentDiv) contentDiv.innerHTML = "<p style='text-align:center; color:var(--gold);'>Post not found. 🚩</p>";
        return;
    }

    const script = document.createElement('script');
    script.src = `https://${BLOG_NAME}.blogspot.com/feeds/posts/default/${postId}?alt=json-in-script&callback=renderFullPost`;
    document.body.appendChild(script);
}

window.renderFullPost = function(data) {
    if(!data.entry) return;
    
    // Update Browser Tab Title
    document.title = `${data.entry.title.$t} | Mahadev Astrologer`;
    
    // Fill Content
    const titleEl = document.getElementById('post-title');
    const contentEl = document.getElementById('article-full-content');
    
    if(titleEl) titleEl.innerText = data.entry.title.$t;
    if(contentEl) contentEl.innerHTML = data.entry.content.$t;
};

document.addEventListener('DOMContentLoaded', loadSingleArticle);
