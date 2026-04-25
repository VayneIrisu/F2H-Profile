// ===== PRODUK PAGE SCRIPTS =====

// ===== DOM ELEMENTS =====

const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");
const navbar = document.getElementById("navbar");
const filterBtns = document.querySelectorAll(".filter-btn");
const produkCards = document.querySelectorAll(".produk-card");

// ===== MOBILE MENU =====

toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    nav.classList.toggle("active");
});

// Close mobile menu on link click
document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ===== NAVBAR SCROLL EFFECT =====

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if(currentScroll > 50){
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// ===== SCROLL REVEAL =====

const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// ===== FILTER FUNCTIONALITY =====

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        produkCards.forEach(card => {
            const category = card.dataset.category;

            if(filter === "all" || category === filter){
                card.classList.remove("hidden");
                // Re-trigger reveal animation
                card.style.opacity = "0";
                card.style.transform = "translateY(40px)";
                
                setTimeout(() => {
                    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, 50);
            } else {
                card.classList.add("hidden");
            }
        });
    });
});
