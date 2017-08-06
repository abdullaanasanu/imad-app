console.log('Loaded!');

//changing element of id main div

var element = document.getElementById("main");
element.innerHTML = "Hello Friends :)";

//moving image

var img = document.getElementById("madi");
var marginLeft = 0;
function moveRight() {
    marginLeft = marginLeft + 10;
    img.style.marginLeft = marginLeft + 'px';
}
img.onclick = function() {
    var interval = setInterval(moveRight, 100);
};