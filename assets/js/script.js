// Jab user scroll kare toh header ka color thoda badal jaye (Royal Effect)
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = '#05000a';
        nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
    } else {
        nav.style.background = '#090116';
        nav.style.boxShadow = 'none';
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

console.log("Mahadev Astrologer MA site is ready!");