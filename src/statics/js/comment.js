function display() {
    var btn1 = document.getElementById('btn1');
    var btn2 = document.getElementById('btn2');
    var btn3 = document.getElementById('btn3');
    var control = document.getElementById('control');
    control.style.display = 'block';
    btn0.style.display = '';
    btn1.style.display = 'none';
    btn2.style.display = '';
    btn3.style.display = '';
}

function hide() {
    var btn1 = document.getElementById('btn1');
    var btn2 = document.getElementById('btn2');
    var btn3 = document.getElementById('btn3');
    var control = document.getElementById('control');
    control.style.display = 'none';
    btn0.style.display = 'none';
    btn1.style.display = '';
    btn2.style.display = 'none';
    btn3.style.display = 'none';
}