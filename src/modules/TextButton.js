var PIXI = require('pixi.js')
var BasicText = require('./BasicText');

/**
 * Represents a Custom Button based on PIXI Text.
 * @constructor
 * @param {string, number} text - text to be displayed.
 * @param {object} style - Text's styling.
 * @param {object} appendTO - Sprite's parent.
 * @param {number} x - x coordinate relative to parent.
 * @param {number} y - y coordinate relative to parent.
 * @param {function} onCLick - click event handler.
 */
function TextButton(text, style, appendTO, x, y, onCLick) {
    BasicText.call(this, text, style, false, true, x, y);
    this.buttonMode = true;
    this.interactive = true;
    this.on('pointerdown', onCLick);
    appendTO.addChild(this);
}

TextButton.prototype = Object.create(BasicText.prototype);

module.exports = TextButton;
