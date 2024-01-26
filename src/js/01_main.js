let burger_btn = document.querySelector(".headerContent_burgerBtn");
let burger_btn_cross = document.querySelector(".headerContent_burgerBtn_cross");
let burger_menu = document.querySelector(".burgerMenu");


window.onclick = function(event){
    let targetElement = event.target;
    if(targetElement == burger_btn || targetElement == burger_btn_cross){
        toglgleBurger();
    }else if(burger_btn.contains(targetElement) || burger_btn_cross.contains(targetElement)){
        toglgleBurger();
    }else if(burger_btn_cross.classList.contains("active_burgerBtn") && !burger_menu.contains(targetElement)){
        toglgleBurger();
    }
}
window.addEventListener('resize', function(){
    if (window.innerWidth >= 520 && burger_btn_cross.classList.contains("active_burgerBtn")) {
        toglgleBurger();
    }
});
function toglgleBurger(){
    burger_btn.classList.toggle("active_burgerBtn");
    burger_btn_cross.classList.toggle("active_burgerBtn");
    burger_menu.classList.toggle("active_burgerMenu");
}
function changeImage() {
    document.querySelector('#logoImg').src = "/img/logo-hover\ 1.png";
}
function restoreImage() {
    document.querySelector('#logoImg').src = '/img/Logo.png';
}
