// header mobile menu script

 
const btn = document.querySelector(".mobile-menu-button");
const closebtn = document.querySelector(".mobile-menu-close-btn");
const menu = document.querySelector(".mobile-menu");
const btnsoc= [closebtn, btn];
btnsoc.forEach(buttonsoc => {
buttonsoc.addEventListener("click", () => {
menu.classList.toggle("hidden");
   });
});

// header mobile menu ends



$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        loop: true,
margin: 10,
nav: true,
navText: [
"<i class='fa fa-caret-left'></i>",
"<i class='fa fa-caret-right'></i>"
],
autoplay: true,
autoplayHoverPause: true,
responsive: {
0: {
items: 1
},
600: {
items: 2
},
1000: {
items: 4
}
}
    });
});