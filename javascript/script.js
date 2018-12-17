/* 
* id is simply the id of the rotor,
* alphabet is the list of letters that will substitute a base letter. 
* cipherArr is the 2D array of letter to cipherLetter relation
* position is the current notch / postion the rotor is at
* turnOver is the notch / position at which this rotor causes the next rotor to rotate
*
*/
class Rotor {
    constructor(id, alphabet, position, turnOver) {
        this.id = id;
        this.alphabet = alphabet;
        this.cipherArr = this.createSubstitutionCipher();
        this.position = position;
        this.turnOver = turnOver;
    }

    // takes an alphabet string for a rotor and creates a 2D array with a base (regular) alphabet with each letter's
    // corresponding cipher letter, provided by the rotor's alphabet string.
    createSubstitutionCipher(){
        var baseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var cipherArr = [];
    
        for (i = 0; i < 26; i++) {
            var plainLetter = baseAlphabet.charCodeAt(i);
            var cipherLetter = this.alphabet.charCodeAt(i);
            cipherArr.push([plainLetter,cipherLetter]);
        }
        return cipherArr;
    }
}

var availableKeys = getAvailableKeys();
var rotors = getRotors();
$(document).ready(function() {
    init();
    detectKeyPress();
});

// run at start of webpage
function init(){
    
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
function detectKeyPress() {
    var pressedKeyNum = 0;
    var cipherKeyNum = 0;

    $(document).keydown(function(key) {
        pressedKeyNum = key.which;
        if (availableKeys.includes(pressedKeyNum)) {
            cipherKeyNum = rotorProcess(pressedKeyNum);
            var keyLetter = String.fromCharCode(cipherKeyNum);
            $('#key-' + keyLetter).addClass('key-highlight');
        }
    });

    $(document).keyup(function(key) {
        var keyNum = key.which;
        if (availableKeys.includes(keyNum)) {
            if (keyNum == pressedKeyNum) {
                var keyLetter = String.fromCharCode(cipherKeyNum);
                $('#key-' + keyLetter).removeClass('key-highlight');
            }
        }

        // catch all to ensure no keys are left on
        setTimeout(function() {
            $('.key').removeClass('key-highlight');
        }, 10);
    });
};

// controls the rotors. Gets the active rotors, passes through the plaintext letter through each rotor
// and advances the rotors. Returns the ciphertext letter after passing through all rotors.
function rotorProcess(charNum) {
    // var activeRotors = getActiveRotors(); returns array of active rotors
    rotors.forEach(function(rotor) {
        charNum = getCipherLetter(rotor.cipherArr, charNum);
    });

    return charNum;
};

// creates the rotors.
function getRotors() {
    var rotorIAlphabet = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
    var rotorIIAlphabet = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
    var rotorIIIAlphabet = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
    
    // array of rotor objects
    var rotors = [
        rotorI = new Rotor(1, rotorIAlphabet, 1, 18),
        rotorII = new Rotor(1, rotorIIAlphabet, 1, 6),
        rotorIII = new Rotor(1, rotorIIIAlphabet, 1, 24)
    ];

    return rotors;
}

// takes the passed rotor's cipher array and passed letter to be processed.
// loops through the array until it finds the passed letter and the returns that letter's
// cipher letter
function getCipherLetter(rotorArr, charNum) {
    for (i = 0; i < rotorArr.length; i++) {
        var charArr = rotorArr[i];
        if (charNum === charArr[0]) {
            return charArr[1];
        }
    }
    return -1;
}