var PIXI = require('pixi.js')

/**
 * Represents an Extended Pixi Text.
 * @constructor
 * @param {string, number} text - text to be displayed.
 * @param {object} style - Text's styling.
 * @param {object} appendTO - Sprite's parent.
 * @param {boolean} centerAnchor - Centering anchor.
 * @param {number} x - x coordinate relative to parent.
 * @param {number} y - y coordinate relative to parent.
 */
function BasicText(text, style, appendTO, centerAnchor, x, y) {
    PIXI.Text.call(this, text, style);
    centerAnchor && this.anchor.set(0.5);
    this.position.set(x, y);
    /**
     * Updates text.
     * @param {string} text - text to be displayed.
     */
    this.updateInnerText = function (text) {
        this.text = text
    }
    appendTO.addChild(this);
}

BasicText.prototype = Object.create(PIXI.Text.prototype);

module.exports = BasicText
