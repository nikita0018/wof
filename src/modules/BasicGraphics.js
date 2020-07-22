var PIXI = require('pixi.js');

/**
 * Represents an Extended Pixi Graphics.
 * @constructor
 * @param {object} appendTO - Object's parent.
 * @param {number} color - Graphics's fill color.
 * @param {number} x - x coordinate relative to parent.
 * @param {number} y - y coordinate relative to parent.
 * @param {number} width - Object's width.
 * @param {number} height - Object's height.
 */
function BasicGraphics(appendTO, color, x, y, width, height) {
    PIXI.Graphics.call(this);
    this.beginFill(color);
    this.drawRect(x, y, width, height);
    appendTO && appendTO.addChild(this);
}

BasicGraphics.prototype = Object.create(PIXI.Graphics.prototype);

module.exports = BasicGraphics;
