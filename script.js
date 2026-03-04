const whyItems = document.querySelectorAll(".why-item");
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");

let currentWhy = 0;

function showWhy(){

    whyItems.forEach(item=>{
    item.classList.remove("active");
    });

    whyItems[currentWhy].classList.add("active");

    currentWhy++;

    if(currentWhy >= whyItems.length){
    currentWhy = 0;
    }

}

showWhy();

setInterval(showWhy,2500);

toggle.addEventListener("click", () => {

    toggle.classList.toggle("active");
    nav.classList.toggle("active");

});

// Smooth scroll untuk navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});