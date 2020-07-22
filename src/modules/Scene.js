var PIXI = require('pixi.js');
var BasicSprite = require('./BasicSprite');
var BasicGraphics = require('./BasicGraphics');

/**
 * Represents Game Scene.
 * @constructor
 * @param {object} appendTO - Object's parent.
 * @param {object} texture - Object's texture.
 */
function Scene(appendTO, texture) {
    BasicSprite.call(this, texture, appendTO);
    var rect = new BasicGraphics(this, 0x00000, 0, this.height - 100, this.width, 100);
    rect.alpha = 0.65;
}

Scene.prototype = Object.create(BasicSprite.prototype);

module.exports = Scene;
