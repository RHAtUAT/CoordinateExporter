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

// Toggle the switch
function showCoordinates() {
    let input = <HTMLInputElement>document.getElementById('coordinate-switch');
    if (input.checked == true) document.getElementById('coordinates').style.display = 'block';
    else document.getElementById('coordinates').style.display = 'none';
}

// For opening the side bar
function clickNavBtn() {

    if (document.getElementById('sideNav').style.width == '30%' &&
        document.getElementById('side-nav-btn').style.marginLeft == '30%') {
        document.getElementById('sideNav').style.width = '0';
        document.getElementById('side-nav-btn').style.marginLeft = '0';
        document.getElementById('coordinates').style.marginLeft = '0';
    }
    else {
        document.getElementById('sideNav').style.width = '30%';
        document.getElementById('side-nav-btn').style.marginLeft = '30%';
        document.getElementById('coordinates').style.marginLeft = '30%';
    }
}

function clickItem(dropdownId: string) {
    if (document.getElementById(dropdownId).style.display == 'none' || document.getElementById(dropdownId).style.display == '') {
        document.getElementById(dropdownId).style.display = 'block';
        if (dropdownId == "options-tab") {
            document.getElementById("options-btn").style.backgroundColor = "#57a773";
            document.getElementById("options-btn").style.color = "white";
        } else if (dropdownId == "points-tab") {
            document.getElementById("points").style.backgroundColor = "#57a773";
            document.getElementById("points").style.color = "white";
        }
    }
    else {
        document.getElementById(dropdownId).style.display = 'none';
        if (dropdownId == "options-tab") {
            document.getElementById("options-btn").style.backgroundColor = "#6cd4f7";
            document.getElementById("options-btn").style.color = "#818181";
        } else if (dropdownId == "points-tab") {
            document.getElementById("points").style.backgroundColor = "#6cd4f7";
            document.getElementById("points").style.color = "#818181";
        }
    }
}
