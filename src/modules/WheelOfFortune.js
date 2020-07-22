var PIXI = require('pixi.js');
var gsap = require('gsap').gsap;
var config = require('../config');
var TweenMax = require('gsap').TweenMax;
var PixiPlugin = require('gsap/PixiPlugin').PixiPlugin;
var BasicSprite = require('./BasicSprite');
var Scene = require('./Scene');
var BasicText = require('./BasicText');
var Button = require('./Button');
var FinishScreen = require('./FinishScreen');
var styles = require('../styles');
var utils = require('../utils');

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

function initAppStorage(loader, config) {
    loader.app = {
        spriteStorage: {},
        config: config,
        stage: new PIXI.Container(),
        vars: {
            balance: config.balance,
            bet: config.bet,
            win: config.win,
            rotationRatio: config.rotationRatio,
            wheelMeta: config.wheelMeta,
            startingAngle: config.startingAngle
        }
    };
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

function initScene(loader, resources) {
    new Scene(loader.app.stage, resources.bg.texture);
}

function initBottom(loader, resources) {
    var width = loader.app.stage.width / 2;
    var height = loader.app.stage.height / 1.5;
    loader.app.spriteStorage.bottom = new BasicSprite(resources.bottom.texture, loader.app.stage, true, width, height);
}

function initExternalCircle(loader, resources) {
    var width = 0;
    var height = -200;
    loader.app.spriteStorage.externalCircle = new BasicSprite(resources.externalCircle.texture, loader.app.spriteStorage.bottom, true, width, height);
}

function initInternalCircle(loader, resources) {
    var width = 0;
    var height = -200;
    loader.app.spriteStorage.internalCircle = new BasicSprite(resources.internalCircle.texture, loader.app.spriteStorage.bottom, true, width, height);
}

function initSpinner(loader, resources) {
    var width = 0;
    var height = -loader.app.spriteStorage.externalCircle.height - 60;
    loader.app.spriteStorage.spinner = new BasicSprite(resources.spinner.texture, loader.app.spriteStorage.bottom, true, width, height);
}

function initBalanceScore(loader) {
    var width = loader.app.stage.width / 2 - 230;
    var height = loader.app.stage.height - 35;
    loader.app.spriteStorage.balanceScore = new BasicText('Balance: ' + loader.app.vars.balance, styles.score, loader.app.stage, true, width, height);
}

function initBetScore(loader) {
    var width = loader.app.stage.width / 2 + 80;
    var height = loader.app.stage.height - 35;
    loader.app.spriteStorage.betScore = new BasicText('Bet: ' + loader.app.vars.bet, styles.score, loader.app.stage, true, width, height);
}

function initWinScore(loader) {
    var width = loader.app.stage.width / 2 + 230;
    var height = loader.app.stage.height - 35;
    loader.app.spriteStorage.winScore = new BasicText('Win: ' + loader.app.vars.win, styles.score, loader.app.stage, true, width, height);
}

function initFinishScreen(loader) {
    var actionButton = {
        message: 'Try again?',
        onClick: function () {
            loader.app.spriteStorage.balanceScore.updateInnerText('Balance: ' + loader.app.config.balance);
            loader.app.spriteStorage.betScore.updateInnerText('Bet: ' + loader.app.config.bet);
            loader.app.spriteStorage.winScore.updateInnerText('Win: ' + loader.app.config.win);
            loader.app.stage.removeChild(loader.app.spriteStorage.finishScreen);
            resetScores(loader);
        }
    };
    loader.app.spriteStorage.finishScreen = new FinishScreen(loader.app.stage.width, loader.app.stage.height, actionButton);
}

function initWheelNumbers(loader) {
    var defaultShift = 0.2;
    var radianShift = 0.53;
    var numbers = utils.shuffle(loader.app.config.wheelElements);

    numbers.forEach(function (wheelNumber, i) {
        var coordinates = utils.getCoordinateByAngle(loader.app.spriteStorage.externalCircle.height / 2 - 40, loader.app.vars.startingAngle)
        var innerText = new BasicText(wheelNumber, {}, loader.app.spriteStorage.externalCircle, true, coordinates[0], coordinates[1]);
        innerText.rotation = -(defaultShift + radianShift * i);
        loader.app.vars.wheelMeta[loader.app.vars.startingAngle] = wheelNumber;
        loader.app.vars.startingAngle += loader.app.config.elementDistance;
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

    var width = loader.app.stage.width / 2 + ((iterator - 1) * 100);
    var height = loader.app.stage.height - 100;

    new Button(
        resources.yellowCircle.texture,
        buttonText,
        loader.app.stage,
        width,
        height,
        handleButtonClick
    );

}

function initBetButtons(loader, resources) {
    loader.app.config.bets.forEach(function (buttonScore, i) {
        initBetButton(loader, resources, buttonScore, i);
    });
}

function resetScores(loader) {
    loader.app.vars.balance = loader.app.config.balance;
    loader.app.vars.bet = loader.app.config.bet;
    loader.app.vars.win = loader.app.config.win;
}

function betButtonHandler(loader, buttonScore) {
    loader.app.stage.children.forEach(function (el) {
        el.interactive = false;
    })
    var wheelKeys = Object.keys(loader.app.vars.wheelMeta);
    var rotation = wheelKeys[utils.getRandomIndex(wheelKeys)];
    loader.app.vars.balance -= buttonScore;
    loader.app.vars.bet = buttonScore;
    var isWin = loader.app.vars.wheelMeta[rotation] === loader.app.vars.bet;
    loader.app.spriteStorage.balanceScore.updateInnerText('Balance: ' + loader.app.vars.balance);
    loader.app.spriteStorage.betScore.updateInnerText('Bet: ' + loader.app.vars.bet);
    loader.app.vars.rotationRatio += 360 * loader.app.config.rollsBeforeStop;
    TweenMax.to(loader.app.spriteStorage.externalCircle, loader.app.config.animationDuration, {
        pixi: {rotation: (loader.app.vars.rotationRatio + +rotation) + '_ccw'},
        onComplete: function () {
            loader.app.vars.balance < 5 && setTimeout(function () {
                loader.app.stage.addChild(loader.app.spriteStorage.finishScreen);
            }, 500)
            loader.app.stage.children.forEach(function (el) {
                el.interactive = true;
            })
            if (!isWin) return;
            loader.app.vars.win += loader.app.vars.bet * utils.getWinRatio(loader.app.vars.bet);
            loader.app.spriteStorage.winScore.updateInnerText('Win: ' + loader.app.vars.win);
        }
    });
}

function WheelOfFortune(config) {
    this.app = initGameContainer();
    this.loader = PIXI.Loader.shared;

    initAppStorage(this.loader, config);

    this.loader
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
        .load(initBetButtons);

    var that = this;
    PIXI.Ticker.shared.add(function () {
        that.app.render(that.loader.app.stage);
    });
}

module.exports = WheelOfFortune;