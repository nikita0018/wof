var PIXI = require('pixi.js')

/**
 * Represents a Custom Button based on PIXI Text and Sprite.
 * @constructor
 * @param {object} texture - Texture for buttons background.
 * @param {object} innerText - Button's text.
 * @param {object} appendTO - Button's parent.
 * @param {number} x - x coordinate relative to parent.
 * @param {number} y - y coordinate relative to parent.
 * @param {number} scale - Button's scale.
 * @param {function} onCLick - click event handler.
 */
function Button(texture, innerText, appendTO, x, y, scale, onCLick) {
    PIXI.Sprite.call(this, texture);
    var text = new PIXI.Text(innerText.text, innerText.styles);
    this.anchor.set(0.5);
    this.position.set(x, y);
    this.buttonMode = true;
    this.interactive = true;
    this.scale.set(scale);
    this.on('pointerdown', onCLick);
    text.anchor.set(0.5);
    this.makeTint = function (shouldApplyTint) {
        this.tint = shouldApplyTint ? 0xffffff : 0x686868;
    }
    this.addChild(text);
    appendTO.addChild(this);
}

Button.prototype = Object.create(PIXI.Sprite.prototype);

module.exports = Button;
