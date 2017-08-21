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


var submit = document.getElementById('submit-btn');
submit.onclick = function() {
    
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200){
                console.log("User Logged In");
                alert('Logged in Successfully!');
            }else if (request.status === 403) {
                alert('Incorrect Username/password');
            }else if (request.status === 500) {
                alert('Something went wrong!');
            }
        }
    };
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST', 'http://abdullaanasanu.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type: application/json');
    request.send(JSON.stringify({username : username, password : password}));
    

};