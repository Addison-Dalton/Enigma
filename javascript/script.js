/* 
* id is simply the id of the rotor,
* cipherLetters is the list of letters that will substitute a base letter. 
* cipherArr is the 2D array of letter to cipherLetter relation
* notchPosition is the current notch / postion the rotor is at starting at 0
* machinePosition is the current position in the machine of the rotor. i.e. is it in position 1, 2, or 3.
* turnOver is the notch / position at which this rotor causes the next rotor to rotate
*
*/
class Rotor {
    constructor(id, cipherLetters, notchPosition, machinePosition, turnOver) {
        this.id = id;
        this.cipherLetters = cipherLetters;
        this.defaultCipherLetters = cipherLetters;
        this.cipherArr = this.createSubstitutionCipher();
        this.notchPosition = notchPosition;
        this.machinePosition = machinePosition;
        this.turnOver = turnOver;
    }

    // takes a cipherLetters string for a rotor and creates a 2D array with a base (regular) alphabet with each letter's
    // corresponding cipher letter, provided by the rotor's cipherLetters string.
    createSubstitutionCipher(){
        var baseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var cipherArr = [];
    
        for (i = 0; i < 26; i++) {
            var plainLetter = baseAlphabet.charCodeAt(i);
            var cipherLetter = this.cipherLetters.charCodeAt(i);
            cipherArr.push([plainLetter,cipherLetter]);
        }
        return cipherArr;
    }

    rotote() {
        var movedLetter = this.cipherLetters[0];
        this.cipherLetters = this.cipherLetters.slice(1,26) + movedLetter;
        this.cipherArr = this.createSubstitutionCipher();
        this.notchPosition = (this.notchPosition + 1) % 26;
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
        switch (rotor.machinePosition) {
            case 1:
                rotor.rotote();
                break;
            case 2:
                var rotorI = rotors[0];
                if (rotorI.notchPosition == rotorI.turnOver) {
                    rotor.rotote();
                }
                break;
            case 3:
                var rotorII = rotors[1];
                if (rotorII.notchPosition == rotorII.turnOver) {
                    rotor.rotote();
                }
                break;
            default:
                rotor.rotote();
        }
    });

    return charNum;
};

// creates the rotors.
function getRotors() {
    var rotorICipherLetters = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
    var rotorIICipherLetters = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
    var rotorIIICipherLetters = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
    
    // array of rotor objects
    // rotor: (id, cipherLetters, notchPosition, machinePosition, turnOverCharNum)
    var rotors = [
        rotorI = new Rotor(1, rotorICipherLetters, 0, 1, 17),
        rotorII = new Rotor(1, rotorIICipherLetters, 0, 2, 5),
        rotorIII = new Rotor(1, rotorIIICipherLetters, 0, 3, 23)
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