var PIXI = require('pixi.js');
var gsap = require('gsap').gsap;
var config = require('./config');
var TweenMax = require('gsap').TweenMax;
var PixiPlugin = require('gsap/PixiPlugin').PixiPlugin;
var BasicSprite = require('./modules/BasicSprite');
var Scene = require('./modules/Scene');
var BasicText = require('./modules/BasicText');
var Button = require('./modules/Button');
var FinishScreen = require('./modules/FinishScreen');
var utils = require('./utils');

function initGameContainer() {
    var app = new PIXI.autoDetectRenderer({
        autoDensity: true,
        antialias: true,
        resolution: devicePixelRatio
    });

    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
    document.body.appendChild(app.view);
    return app;
}

var app = initGameContainer()

var ticker = PIXI.Ticker.shared;

var stage = new PIXI.Container();
var loader = PIXI.Loader.shared;

var balance = config.balance;
var bet = config.balance;
var win = config.win;
var rotationRatio = config.rotationRatio;
var wheelMeta = config.wheelMeta;

var textStyles = {
    fontSize: 28,
    fill: '#ffffff',
    fontWeight: 'bold'
};

loader
    .add('bg', 'assets/background.jpg')
    .add('bottom', 'assets/bottom.png')
    .add('externalCircle', 'assets/external_circle.png')
    .add('internalCircle', 'assets/internal_circle.png')
    .add('yellowCircle', 'assets/round-yellow.png')
    .add('spinner', 'assets/spinner.png');

loader.load(function (loader, resources) {
    new Scene(stage, resources.bg.texture);

    // create bottom
    var bottom = new BasicSprite(resources.bottom.texture, stage, true, stage.width / 2, stage.height / 1.5);

    // create external circle
    var externalCircle = new BasicSprite(resources.externalCircle.texture, bottom, true, 0, -200);

    // create internal circle
    new BasicSprite(resources.internalCircle.texture, bottom, true, 0, -200);

    // create internal circle
    new BasicSprite(resources.spinner.texture, bottom, true, 0, -externalCircle.height - 60);

    // create finish screen
    var finishScreen = new FinishScreen(stage.width, stage.height, {
        message: 'Try again?', onClick: function () {
            balanceScore.updateInnerText('Balance: ' + config.balance);
            betScore.updateInnerText('Bet: ' + config.bet);
            winScore.updateInnerText('Win: ' + config.win);
            stage.removeChild(finishScreen);
        }
    });

    var balanceWidth = stage.width / 2 - 230;
    var balanceHeight = stage.height - 35;
    var balanceScore = new BasicText('Balance: ' + balance, textStyles, stage, true, balanceWidth, balanceHeight);

    var barWidth = stage.width / 2 + 80;
    var barHeight = stage.height - 35;
    var betScore = new BasicText('Bet: ' + bet, textStyles, stage, true, barWidth, barHeight);

    var winWidth = stage.width / 2 + 230;
    var winHeight = stage.height - 35;
    var winScore = new BasicText('Win: ' + win, textStyles, stage, true, winWidth, winHeight);

    var startingAngle = config.startingAngle;

    // configure wheel
    utils.shuffle(config.wheelElements).forEach(function (item, i) {
        var coordinates = utils.getCoordinateByAngle(externalCircle.height / 2 - 40, startingAngle)
        var innerText = new BasicText(item, {}, externalCircle, true, coordinates[0], coordinates[1]);
        var defaultShift = 0.2;
        var shiftRadian = 0.53;
        innerText.rotation = -(defaultShift + shiftRadian * i);
        wheelMeta[startingAngle] = item;
        startingAngle += config.elementDistance;
    });
    // configure bet buttons
    config.bets.forEach(function (buttonScore, i) {
        var handleButtonClick = function () {
            stage.children.forEach(function (el) {
                el.interactive = false;
            })
            var wheelKeys = Object.keys(wheelMeta);
            var rotation = wheelKeys[utils.getRandomIndex(wheelKeys)];
            balance -= buttonScore;
            bet = buttonScore;
            var isWin = wheelMeta[rotation] === bet
            balanceScore.updateInnerText('Balance: ' + balance);
            betScore.updateInnerText('Bet: ' + bet);
            rotationRatio += 360 * config.rollsBeforeStop;
            TweenMax.to(externalCircle, config.animationDuration, {
                pixi: {rotation: (rotationRatio + +rotation) + '_ccw'},
                onComplete: function () {
                    balance < 5 && setTimeout(function () {
                        stage.addChild(finishScreen);
                    }, 500)
                    stage.children.forEach(function (el) {
                        el.interactive = true;
                    })
                    if (!isWin) return;
                    win += bet * utils.getWinRatio(bet);
                    winScore.updateInnerText('Win: ' + win);
                }
            });
        }

        var buttonText = {
            text: buttonScore,
            styles: {
                fill: '#ffffff',
                strokeThickness: 1,
                fontWeight: "bold"
            }
        }

        new Button(
            resources.yellowCircle.texture,
            buttonText,
            stage,
            stage.width / 2 + ((i - 1) * 100),
            stage.height - 100,
            handleButtonClick
        );
    });

    ticker.add(function () {
        app.render(stage);
    });

});
