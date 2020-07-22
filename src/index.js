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
var styles = require('./styles');
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

function bindAssets(loader) {
    loader
        .add('bg', 'assets/background.jpg')
        .add('bottom', 'assets/bottom.png')
        .add('externalCircle', 'assets/external_circle.png')
        .add('internalCircle', 'assets/internal_circle.png')
        .add('yellowCircle', 'assets/round-yellow.png')
        .add('spinner', 'assets/spinner.png');
}

function initStage() {
    loader.stage = new PIXI.Container();
}

function initScene(loader, resources) {
    new Scene(loader.stage, resources.bg.texture);
}

function initBottom(loader, resources) {
    var width = loader.stage.width / 2;
    var height = loader.stage.height / 1.5;
    loader.spriteStorage.bottom = new BasicSprite(resources.bottom.texture, loader.stage, true, width, height);
}

function initExternalCircle(loader, resources) {
    var width = 0;
    var height = -200;
    loader.spriteStorage.externalCircle = new BasicSprite(resources.externalCircle.texture, loader.spriteStorage.bottom, true, width, height);
}

function initInternalCircle(loader, resources) {
    var width = 0;
    var height = -200;
    loader.spriteStorage.internalCircle = new BasicSprite(resources.internalCircle.texture, loader.spriteStorage.bottom, true, width, height);
}

function initSpinner(loader, resources) {
    var width = 0;
    var height = -loader.spriteStorage.externalCircle.height - 60;
    loader.spriteStorage.spinner = new BasicSprite(resources.spinner.texture, loader.spriteStorage.bottom, true, width, height);
}

function initBalanceScore(loader) {
    var width = loader.stage.width / 2 - 230;
    var height = loader.stage.height - 35;
    loader.spriteStorage.balanceScore = new BasicText('Balance: ' + balance, styles.score, loader.stage, true, width, height);
}

function initBetScore(loader) {
    var width = loader.stage.width / 2 + 80;
    var height = loader.stage.height - 35;
    loader.spriteStorage.betScore = new BasicText('Bet: ' + bet, styles.score, loader.stage, true, width, height);
}

function initWinScore(loader) {
    var width = loader.stage.width / 2 + 230;
    var height = loader.stage.height - 35;
    loader.spriteStorage.winScore = new BasicText('Win: ' + win, styles.score, loader.stage, true, width, height);
}

function initFinishScreen(loader) {
    var actionButton = {
        message: 'Try again?',
        onClick: function () {
            loader.spriteStorage.balanceScore.updateInnerText('Balance: ' + config.balance);
            loader.spriteStorage.betScore.updateInnerText('Bet: ' + config.bet);
            loader.spriteStorage.winScore.updateInnerText('Win: ' + config.win);
            loader.stage.removeChild(loader.spriteStorage.finishScreen);
            resetScores();
        }
    };
    loader.spriteStorage.finishScreen = new FinishScreen(loader.stage.width, loader.stage.height, actionButton);
}

function initWheelNumbers(loader) {
    var defaultShift = 0.2;
    var radianShift = 0.53;
    var numbers = utils.shuffle(config.wheelElements);

    numbers.forEach(function (wheelNumber, i) {
        var coordinates = utils.getCoordinateByAngle(loader.spriteStorage.externalCircle.height / 2 - 40, startingAngle)
        var innerText = new BasicText(wheelNumber, {}, loader.spriteStorage.externalCircle, true, coordinates[0], coordinates[1]);
        innerText.rotation = -(defaultShift + radianShift * i);
        wheelMeta[startingAngle] = wheelNumber;
        startingAngle += config.elementDistance;
    });
}

function initSpriteStorage(loader) {
    loader.spriteStorage = {};
}

function resetScores() {
    balance = config.balance;
    bet = config.bet;
    win = config.win;
}

function betButtonHandler(loader, buttonScore) {
    loader.stage.children.forEach(function (el) {
        el.interactive = false;
    })
    var wheelKeys = Object.keys(wheelMeta);
    var rotation = wheelKeys[utils.getRandomIndex(wheelKeys)];
    balance -= buttonScore;
    bet = buttonScore;
    var isWin = wheelMeta[rotation] === bet;
    loader.spriteStorage.balanceScore.updateInnerText('Balance: ' + balance);
    loader.spriteStorage.betScore.updateInnerText('Bet: ' + bet);
    rotationRatio += 360 * config.rollsBeforeStop;
    TweenMax.to(loader.spriteStorage.externalCircle, config.animationDuration, {
        pixi: {rotation: (rotationRatio + +rotation) + '_ccw'},
        onComplete: function () {
            balance < 5 && setTimeout(function () {
                loader.stage.addChild(loader.spriteStorage.finishScreen);
            }, 500)
            loader.stage.children.forEach(function (el) {
                el.interactive = true;
            })
            if (!isWin) return;
            win += bet * utils.getWinRatio(bet);
            loader.spriteStorage.winScore.updateInnerText('Win: ' + win);
        }
    });
}

function initBetButton(loader, resources, buttonScore, iterator) {
    var handleButtonClick = function () {
        betButtonHandler(loader, buttonScore)
    }
    var buttonText = {
        text: buttonScore,
        styles: styles.betButton
    }

    var width = loader.stage.width / 2 + ((iterator - 1) * 100);
    var height = loader.stage.height - 100;

    new Button(
        resources.yellowCircle.texture,
        buttonText,
        loader.stage,
        width,
        height,
        handleButtonClick
    );

}

function initBetButtons(loader, resources) {
    config.bets.forEach(function (buttonScore, i) {
        initBetButton(loader, resources, buttonScore, i);
    });
}

function bindToTicker(loader) {
    ticker.add(function () {
        app.render(loader.stage);
    });
}

var app = initGameContainer();

var ticker = PIXI.Ticker.shared;

var loader = PIXI.Loader.shared;

var balance = config.balance;
var bet = config.balance;
var win = config.win;
var rotationRatio = config.rotationRatio;
var wheelMeta = config.wheelMeta;
var startingAngle = config.startingAngle;

loader
    .load(initStage)
    .load(initSpriteStorage)
    .load(bindAssets)
    .load(initScene)
    .load(initBottom)
    .load(initExternalCircle)
    .load(initInternalCircle)
    .load(initSpinner)
    .load(initBalanceScore)
    .load(initBetScore)
    .load(initWinScore)
    .load(initFinishScreen)
    .load(initWheelNumbers)
    .load(initBetButtons)
    .load(bindToTicker);
