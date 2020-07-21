var PIXI = require('pixi.js');
var gsap = require('gsap').gsap;
var TweenMax = require('gsap').TweenMax;
var PixiPlugin = require('gsap/PixiPlugin').PixiPlugin;
var BasicSprite = require('./modules/BasicSprite');
var BasicGraphics = require('./modules/BasicGraphics');
var BasicText = require('./modules/BasicText');
var Button = require('./modules/Button');
var utils = require('./utils');

var app = new PIXI.autoDetectRenderer({
    autoDensity: true,
    antialias: true,
    resolution: devicePixelRatio
});

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

var ticker = PIXI.Ticker.shared

document.body.appendChild(app.view);

var stage = new PIXI.Container();

var loader = PIXI.Loader.shared;

var balance = 200;
var bet = 5;
var win = 0;
var startingAngle = 15;
var wheelMeta = {};

var textStyles = {
    fontSize: 28,
    fill: '#ffffff',
    fontWeight: 'bold'
}

var WHEEL = [1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 5, 5]

// create bet buttons
var betButtons = [1, 3, 5]

loader
    .add('bg', 'assets/background.jpg')
    .add('bottom', 'assets/bottom.png')
    .add('externalCircle', 'assets/external_circle.png')
    .add('internalCircle', 'assets/internal_Circle.png')
    .add('yellowCircle', 'assets/round-yellow.png')
    .add('spinner', 'assets/spinner.png');

loader.load(function (loader, resources) {
    // create BG
    var bg = new BasicSprite(resources.bg.texture, stage);

    // create bottom
    var bottom = new BasicSprite(resources.bottom.texture, stage, true, stage.width / 2, stage.height / 1.5);

    // create external circle
    var externalCircle = new BasicSprite(resources.externalCircle.texture, bottom, true, 0, -200);

    // create internal circle
    var internalCircle = new BasicSprite(resources.internalCircle.texture, externalCircle, true);

    // create internal circle
    var spinner = new BasicSprite(resources.spinner.texture, bottom, true, 0, -externalCircle.height - 60);

    // create black rectangle
    var rect = new BasicGraphics(stage, 0x00000, 0, stage.height - 100, stage.width, 100);

    var balanceScore = new BasicText('Balance: ' + balance, textStyles, rect, true, stage.width / 2 - 230, stage.height - 35);
    var betScore = new BasicText('Bet: ' + bet, textStyles, rect, true, stage.width / 2, stage.height - 35);
    var winScore = new BasicText('Win: ' + win, textStyles, rect, true, stage.width / 2 + 230, stage.height - 35);
    var rotationRatio = 0

    // configure wheel
    utils.shuffle(WHEEL).forEach(function (item, i) {
        var coordinates = utils.getCoordinateByAngle(externalCircle.height / 2 - 40, startingAngle)
        var innerText = new BasicText(item, {}, externalCircle, true, coordinates[0], coordinates[1]);
        innerText.rotation = 0.2 + 0.53 * i;
        startingAngle += 30;
        wheelMeta[startingAngle] = item;
    })

    // configure bet buttons
    betButtons.forEach(function (buttonScore, i) {
        var handleButtonClick = function () {
            var wheelKeys = Object.keys(wheelMeta)
            balance -= buttonScore;
            bet = buttonScore;
            var rotation = wheelKeys[utils.getRandomIndex(wheelKeys)]
            rotationRatio += 360
            TweenMax.to(externalCircle, 1, {pixi: {rotation: -rotation}});
            balanceScore.updateInnerText('Balance: ' + balance);
            betScore.updateInnerText('Bet: ' + bet);
        }
        new Button(
            resources.yellowCircle.texture,
            buttonScore,
            rect,
            stage.width / 2 + ((i - 1) * 100),
            stage.height - 100,
            handleButtonClick
        );
    })

    console.log(wheelMeta);

    ticker.add(function () {
        app.render(stage);
    });

})
