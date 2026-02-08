// assets/js/article-viewer.js
const BLOG_NAME = "mahadevastrologerma";

function loadSingleArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        document.getElementById('article-display').innerHTML = "Post not found. 🚩";
        return;
    }

    const script = document.createElement('script');
    script.src = `https://${BLOG_NAME}.blogspot.com/feeds/posts/default/${postId}?alt=json-in-script&callback=renderFullPost`;
    document.body.appendChild(script);
}

window.renderFullPost = function(data) {
    document.title = `${data.entry.title.$t} | Mahadev Astrologer`;
    document.getElementById('post-title').innerText = data.entry.title.$t;
    document.getElementById('article-full-content').innerHTML = data.entry.content.$t;
};

document.addEventListener('DOMContentLoaded', loadSingleArticle);
