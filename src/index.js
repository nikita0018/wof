var PIXI = require('pixi.js');
var gsap = require('gsap').gsap;
var TweenMax = require('gsap').TweenMax;
var PixiPlugin = require('gsap/PixiPlugin').PixiPlugin;
var BasicSprite = require('./modules/BasicSprite');
var BasicGraphics = require('./modules/BasicGraphics');
var BasicText = require('./modules/BasicText');
var Button = require('./modules/Button');
var FinishScreen = require('./modules/FinishScreen');
var utils = require('./utils');

var app = new PIXI.autoDetectRenderer({
    autoDensity: true,
    antialias: true,
    resolution: devicePixelRatio
});

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

var ticker = PIXI.Ticker.shared;

document.body.appendChild(app.view);

var stage = new PIXI.Container();

var loader = PIXI.Loader.shared;

var balance = 200;
var bet = 5;
var win = 0;

var wheelMeta = {};
var startingAngle = 15;
var rotationRatio = 0;

var textStyles = {
    fontSize: 28,
    fill: '#ffffff',
    fontWeight: 'bold'
};

var WHEEL = [1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 5, 5];

// create bet buttons
var betButtons = [1, 3, 5];

loader
    .add('bg', 'assets/background.jpg')
    .add('bottom', 'assets/bottom.png')
    .add('externalCircle', 'assets/external_circle.png')
    .add('internalCircle', 'assets/internal_Circle.png')
    .add('yellowCircle', 'assets/round-yellow.png')
    .add('spinner', 'assets/spinner.png');

loader.load(function (loader, resources) {
    // create BG
    new BasicSprite(resources.bg.texture, stage);

    // create bottom
    var bottom = new BasicSprite(resources.bottom.texture, stage, true, stage.width / 2, stage.height / 1.5);

    // create external circle
    var externalCircle = new BasicSprite(resources.externalCircle.texture, bottom, true, 0, -200);

    // create internal circle
    new BasicSprite(resources.internalCircle.texture, bottom, true, 0, -200);

    // create internal circle
    new BasicSprite(resources.spinner.texture, bottom, true, 0, -externalCircle.height - 60);

    // create black rectangle
    var rect = new BasicGraphics(stage, 0x00000, 0, stage.height - 100, stage.width, 100);

    // create finish screen
    var finishScreen = new FinishScreen(stage.width, stage.height, {
        message: 'Try again?', onClick: function () {
            balance = 200;
            bet = 5;
            win = 0;
            balanceScore.updateInnerText('Balance: ' + balance);
            betScore.updateInnerText('Bet: ' + bet);
            winScore.updateInnerText('Win: ' + win);
            stage.removeChild(finishScreen);
        }
    });

    var balanceScore = new BasicText('Balance: ' + balance, textStyles, stage, true, stage.width / 2 - 230, stage.height - 35);
    var betScore = new BasicText('Bet: ' + bet, textStyles, stage, true, stage.width / 2, stage.height - 35);
    var winScore = new BasicText('Win: ' + win, textStyles, stage, true, stage.width / 2 + 230, stage.height - 35);

    // configure wheel
    utils.shuffle(WHEEL).forEach(function (item, i) {
        var coordinates = utils.getCoordinateByAngle(externalCircle.height / 2 - 40, startingAngle)
        var innerText = new BasicText(item, {}, externalCircle, true, coordinates[0], coordinates[1]);
        innerText.rotation = -(0.2 + 0.53 * i);
        wheelMeta[startingAngle] = item;
        startingAngle += 30;
    });

    // configure bet buttons
    betButtons.forEach(function (buttonScore, i) {
        var handleButtonClick = function () {
            rect.children.forEach(function (button) {
                button.interactive = false;
            })
            var wheelKeys = Object.keys(wheelMeta);
            var rotation = wheelKeys[utils.getRandomIndex(wheelKeys)];
            balance -= buttonScore;
            bet = buttonScore;
            var isWin = wheelMeta[rotation] === bet
            balanceScore.updateInnerText('Balance: ' + balance);
            betScore.updateInnerText('Bet: ' + bet);
            rotationRatio += 2880;
            TweenMax.to(externalCircle, 5, {
                pixi: {rotation: (rotationRatio + +rotation) + '_ccw'},
                onComplete: function () {
                    balance < 5 && setTimeout(function () {
                        stage.addChild(finishScreen);
                    }, 500)
                    rect.children.forEach(function (button) {
                        button.interactive = true;
                    })
                    if (!isWin) return;
                    win += bet * utils.getWinRatio(bet);
                    winScore.updateInnerText('Win: ' + win);
                }
            });
        }
        new Button(
            resources.yellowCircle.texture,
            buttonScore,
            rect,
            stage.width / 2 + ((i - 1) * 100),
            stage.height - 100,
            handleButtonClick
        );
    });

    ticker.add(function () {
        app.render(stage);
    });

});
