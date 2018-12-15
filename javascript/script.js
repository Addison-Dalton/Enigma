$(document).ready(function() {
    init();
    lightKey();
});

// run at start of webpage
function init(){
    var keyObjArr = [];
    for (i = 0; i < 26; i++) {
        var keyCode = i + 65;
        var keyObj = {
            code: keyCode,
            letter: String.fromCharCode(keyCode)
        }
        keyObjArr.push(keyObj);
    };
};

// returns array containing the ascii codes for a-z.
function getAvailableKeys() {
    var keysArr = [];
    for (i = 0; i < 26; i++) {
        keysArr.push(i + 65);
    };
    return keysArr;
}

// controls lighting effect of pressed keys
// takes key's ascii code on keyDown and adds appropriate class
// on keyUp, removes the class
function lightKey() {
    var availableKeys = getAvailableKeys();
    $(document).keydown(function(key) {
        var keyCode = key.which;
        if(availableKeys.includes(keyCode)) {
            var keyLetter = String.fromCharCode(keyCode);
            $('#key-' + keyLetter).addClass('key-highlight');
        }
    });

    $(document).keyup(function(key) {
        var keyCode = key.which;
        if(availableKeys.includes(keyCode)) {
            var keyLetter = String.fromCharCode(keyCode);
            $('#key-' + keyLetter).removeClass('key-highlight');
        }
    });
};