// ===== DOM ELEMENTS =====

const whyItems = document.querySelectorAll(".why-item");
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");
const navbar = document.getElementById("navbar");
const carouselDots = document.querySelectorAll(".carousel-dot");

let currentWhy = 0;
let whyInterval;

// ===== WHY CAROUSEL =====

function showWhy(index){
    if(typeof index === "number"){
        currentWhy = index;
    }

    whyItems.forEach(item => {
        item.classList.remove("active");
    });

    carouselDots.forEach(dot => {
        dot.classList.remove("active");
    });

    whyItems[currentWhy].classList.add("active");
    if(carouselDots[currentWhy]){
        carouselDots[currentWhy].classList.add("active");
    }

    currentWhy++;
    if(currentWhy >= whyItems.length){
        currentWhy = 0;
    }
}

// Initialize carousel
showWhy();
whyInterval = setInterval(showWhy, 3000);

// Dot click handlers
carouselDots.forEach(dot => {
    dot.addEventListener("click", () => {
        clearInterval(whyInterval);
        const idx = parseInt(dot.dataset.index);
        showWhy(idx);
        whyInterval = setInterval(showWhy, 3000);
    });
});

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

// ===== SMOOTH SCROLL =====

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if(target){
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====

let lastScroll = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if(currentScroll > 50){
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
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

// ===== COUNTER ANIMATION =====

function animateCounter(el){
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || "+";
    let current = 0;
    const increment = Math.max(1, Math.floor(target / 40));
    const duration = 1500;
    const stepTime = duration / (target / increment);

    const timer = setInterval(() => {
        current += increment;
        if(current >= target){
            current = target;
            clearInterval(timer);
        }
        el.textContent = current + suffix;
    }, stepTime);
}

const statNumbers = document.querySelectorAll('.stat-item h3[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => {
    counterObserver.observe(el);
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====

const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('nav a').forEach(a => {
                a.classList.remove('nav-active');
                if(a.getAttribute('href') === '#' + id){
                    a.classList.add('nav-active');
                }
            });
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
});

sections.forEach(section => {
    navObserver.observe(section);
});