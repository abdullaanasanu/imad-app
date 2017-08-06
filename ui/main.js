console.log('Loaded!');

//moving image

var img = document.getElementById("madi");
var marginLeft = 0;
function moveRight() {
    marginLeft = marginLeft + 2;
    img.style.marginLeft = marginLeft + 'px';
}
img.onclick = function() {
    var interval = setInterval(moveRight, 30);
};

var counter = 0;

var like_button = document.getElementById("likes");
like_button.onclick = function(){
    
    
    counter = counter + 1;
    var span = document.getElementById("result");
    span.innerHTML = counter.toString();
};