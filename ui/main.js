console.log('Loaded!');

//changing element of id main div

var element = document.getElementById("main");
element.innerHTML = "Hello Friends :)"

//moving image

var img = document.getElementById("img");
img.onClick = function() {
    img.style.marginleft = '100px';
};