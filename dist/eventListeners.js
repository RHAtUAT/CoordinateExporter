"use strict";
// Open the options tab
document.getElementById('options-btn').addEventListener('click', function () {
    clickItem('options-tab');
});
// Toggle the coordinates
document.getElementById('coordinate-switch').addEventListener('click', showCoordinates);
// Open the points tab
document.getElementById('points').addEventListener('click', function () {
    clickItem('points-tab');
});
// Open the Side Navigation bar
document.getElementById('side-nav-btn').addEventListener('click', clickNavBtn);
// Remove the point
// document.getElementById('delete-btn').addEventListener('click', removePoint);
// function removePoint(){
// }
// Toggle the switch
function showCoordinates() {
    var input = document.getElementById('coordinate-switch');
    if (input.checked == true)
        document.getElementById('coordinates').style.display = 'block';
    else
        document.getElementById('coordinates').style.display = 'none';
}
//For opening the side bar
function clickNavBtn() {
    if (document.getElementById('sideNav').style.width == '30%' &&
        document.getElementById('side-nav-btn').style.marginLeft == '30%') {
        document.getElementById('sideNav').style.width = '0';
        document.getElementById('side-nav-btn').style.marginLeft = '0';
    }
    else {
        document.getElementById('sideNav').style.width = '30%';
        document.getElementById('side-nav-btn').style.marginLeft = '30%';
    }
}
function clickItem(dropdownId) {
    if (document.getElementById(dropdownId).style.display == 'none' || document.getElementById(dropdownId).style.display == '')
        document.getElementById(dropdownId).style.display = 'block';
    else
        document.getElementById(dropdownId).style.display = 'none';
}
