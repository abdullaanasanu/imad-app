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
like_button.onclick = function() {
    
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200){
                var counter = request.responseText;
                var span = document.getElementById("result");
                span.innerHTML = counter.toString();
            }
        }
    };
    
    request.open('GET', 'http://abdullaanasanu.imad.hasura-app.io/counter', true);
    request.send(null);

};


var submit = document.getElementById('submit_button');
submit.onclick = function() {
    
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200){
                var namess = request.responseText;
                names = JSON.parse(names);
                var lists ='';
                for (var i = 0; i<namess.length;i++){
                    lists += '<li>' + namess[i] + '</li>';
                }
                var ul = document.getElementById('namelists');
                ul.innerHTML = lists;
            }
        }
    };
    
    var inputName = document.getElementById('name');
    var names = inputName.value;
    request.open('GET', 'http://abdullaanasanu.imad.hasura-app.io/submit-name?name' + names, true);
    request.send(null);
    

};