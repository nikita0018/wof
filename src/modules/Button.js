var PIXI = require('pixi.js')

/**
 * Represents a Custom Button based on PIXI Text and Sprite.
 * @constructor
 * @param {object} texture - Texture for buttons background.
 * @param {number, string} innerText - Button's text.
 * @param {object} appendTO - Button's parent.
 * @param {number} x - x coordinate relative to parent.
 * @param {number} y - y coordinate relative to parent.
 * @param {function} onCLick - click event handler.
 */
function Button(texture, innerText, appendTO, x, y, onCLick) {
    PIXI.Sprite.call(this, texture);
    var text = new PIXI.Text(innerText);
    this.anchor.set(0.5);
    this.position.set(x, y);
    this.buttonMode = true;
    this.interactive = true;
    this.on('pointerdown', onCLick);
    text.anchor.set(0.5);
    this.addChild(text);
    appendTO.addChild(this);
}

Button.prototype = Object.create(PIXI.Sprite.prototype);

module.exports = Button;
