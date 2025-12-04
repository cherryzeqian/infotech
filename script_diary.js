var btns = document.querySelectorAll('.one_btn');
var okBtn = document.querySelector('.btn_ok');
var shuru = document.getElementById('txtInput');
var lst = document.getElementById('riZhiList');

var curAction = 'Water';

for(var i=0; i<btns.length; i++) {
    btns[i].onclick = function() {
        for(var j=0; j<btns.length; j++) {
            btns[j].classList.remove('xuanle');
        }
        this.classList.add('xuanle');
        curAction = this.querySelector('.zi').innerText;
    }
}

okBtn.onclick = function() {
    var val = shuru.value;
    if(val == '') {
        alert('Please write something in your diary!');
        return;
    }

    var bgC = '';
    var txC = '';
    var picUrl = '';

    if(curAction == 'Water') {
        bgC = 'bg_lan';
        txC = 'txt_lan';
        picUrl = 'assets/ActionIcon-5.svg';
    } 
    if(curAction == 'Fertilize') {
        bgC = 'bg_huang';
        txC = 'txt_huang';
        picUrl = 'assets/ActionIcon-6.svg';
    }
    if(curAction == 'Loosen Soil') {
        bgC = 'bg_ka';
        txC = 'txt_ka';
        picUrl = 'assets/ActionIcon-3.svg';
    }
    if(curAction == 'Remove Bugs') {
        bgC = 'bg_lv';
        txC = 'txt_lv';
        picUrl = 'assets/ActionIcon-7.svg';
    }

    var d = new Date();
    var yy = d.getFullYear();
    var mm = d.getMonth() + 1;
    if(mm<10) mm = '0'+mm;
    var dd = d.getDate();
    if(dd<10) dd='0'+dd;
    var hh = d.getHours();
    if(hh<10) hh='0'+hh;
    var min = d.getMinutes();
    if(min<10) min='0'+min;

    var timeee = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + min;

    var div = document.createElement('div');
    div.className = 'kapi_an';
    
    var html = '<div class="icon_bg ' + bgC + '">' +
               '<div class="da_icon"><img src="' + picUrl + '"></div>' +
               '</div>' + 
               '<div class="xinxi">' +
               '<div class="hang1">' + 
               '<div class="biaoqian ' + bgC + ' ' + txC + '">' + curAction + '</div>' +
               '<div class="tianqi"><img src="assets/WeatherIcon.svg"></div>' +
               '<div class="riqi">' + timeee + '</div>' +
               '</div>' +
               '<div class="miaoshu">' + val + '</div>' +
               '</div>';
              
    div.innerHTML = html;
    lst.insertBefore(div, lst.firstChild);
    
    shuru.value = '';
}
