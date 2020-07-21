var PIXI = require('pixi.js')

/**
 * Represents an Extended Pixi Sprite.
 * @constructor
 * @param {object} texture - Sprite's texture.
 * @param {object, undefined} appendTO - Sprite's parent.
 * @param {boolean} centerAnchor - Centering anchor.
 * @param {number} x - x coordinate relative to parent.
 * @param {number} y - y coordinate relative to parent.
 */
function BasicSprite(texture, appendTO, centerAnchor, x, y) {
    PIXI.Sprite.call(this, texture);
    centerAnchor && this.anchor.set(0.5);
    this.position.set(x, y);
    appendTO && appendTO.addChild(this);
}

BasicSprite.prototype = Object.create(PIXI.Sprite.prototype);

module.exports = BasicSprite
