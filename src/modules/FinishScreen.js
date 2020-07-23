var BasicGraphics = require('./BasicGraphics');
var BasicText = require('./BasicText');
var TextButton = require('./TextButton');

var messageStyles = {
    fontSize: 30,
    fill: '#ffffff'
}

var styles = {
    fontSize: 28,
    fill: '#f8bd3a'
}

/**
 * Represents an Extended Pixi Graphics.
 * @constructor
 * @param {number} width - Object's width.
 * @param {number} height - Object's height.
 * @param {object} actionButton - Action button props.
 */
function FinishScreen(width, height, actionButton) {
    BasicGraphics.call(this, false, 0x00000, 0, 0, width, height);
    new BasicText('You have balance less than 5!', messageStyles, this, true, width / 2, height / 2);
    new TextButton(actionButton.message, styles, this, width / 2, height / 2 + 50, actionButton.onClick);
}

FinishScreen.prototype = Object.create(BasicGraphics.prototype);

module.exports = FinishScreen;
