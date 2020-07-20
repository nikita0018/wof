var PIXI = require('pixi.js')

var app = new PIXI.autoDetectRenderer({
    autoDensity: true,
    resolution: devicePixelRatio,
    antialias: true
});

document.body.appendChild(app.view);

var stage = new PIXI.Container();

var loader = PIXI.Loader.shared;

var balance = 200;
var bet = 5;
var win = 0;

var textStyles = {
    fontSize: 28,
    fill: '#ffffff',
    fontWeight: 'bold'
}

var WHEEL = [1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 5, 5]

loader
    .add('bg', 'assets/background.jpg')
    .add('bottom', 'assets/bottom.png')
    .add('externalCircle', 'assets/external_circle.png')
    .add('internalCircle', 'assets/internal_Circle.png')
    .add('yellowCircle', 'assets/round-yellow.png')
    .add('spinner', 'assets/spinner.png');

loader.load(function (loader, resources) {
    console.log(resources);
    // create BG
    var bg = new PIXI.Sprite(resources.bg.texture);
    stage.addChild(bg);

    // create bottom
    var bottom = new PIXI.Sprite(resources.bottom.texture);

    // configure bottom
    bottom.anchor.set(0.5);
    bottom.position.set(stage.width / 2, stage.height / 1.5);
    stage.addChild(bottom);

    // create external circle
    var externalCircle = new PIXI.Sprite(resources.externalCircle.texture);
    // configure external circle
    externalCircle.anchor.set(0.5);
    externalCircle.position.set(0, -200);
    bottom.addChild(externalCircle);

    // create internal circle
    var internalCircle = new PIXI.Sprite(resources.internalCircle.texture);
    // configure internal circle
    internalCircle.anchor.set(0.5);
    externalCircle.addChild(internalCircle);

    // create internal circle
    var spinner = new PIXI.Sprite(resources.spinner.texture);
    // configure internal circle
    spinner.anchor.set(0.5);
    spinner.position.set(0, -360);
    bottom.addChild(spinner);

    // create black rectangle
    var rect = new PIXI.Graphics();
    // configure black rectangle
    rect.beginFill(0x00000);
    rect.drawRect(0, stage.height - 100, stage.width, 100);
    rect.interactive = true;
    stage.addChild(rect);

    // create bet buttons
    var betButtons = [
        {
            sprite: new PIXI.Sprite(resources.yellowCircle.texture),
            bet: 1
        },
        {
            sprite: new PIXI.Sprite(resources.yellowCircle.texture),
            bet: 3
        },
        {
            sprite: new PIXI.Sprite(resources.yellowCircle.texture),
            bet: 5
        }
    ]

    // configure info text
    var balanceScore = new PIXI.Text('Balance: ' + balance, textStyles);
    balanceScore.anchor.set(0.5);
    balanceScore.position.set(stage.width / 2 - 230, stage.height - 35);
    rect.addChild(balanceScore);
    var betScore = new PIXI.Text('Bet: ' + bet, textStyles);
    betScore.anchor.set(0.5);
    betScore.position.set(stage.width / 2, stage.height - 35);
    rect.addChild(betScore);
    var winScore = new PIXI.Text('Win: ' + win, textStyles);
    winScore.anchor.set(0.5);
    winScore.position.set(stage.width / 2 + 230, stage.height - 35);
    rect.addChild(winScore);

    // configure bet buttons
    betButtons.forEach(function (button, i) {
        button.sprite.anchor.set(0.5);
        button.sprite.position.set(stage.width / 2 + ((i - 1) * 100), stage.height - 100);
        rect.addChild(button.sprite);
        var innerText = new PIXI.Text(button.bet);
        innerText.anchor.set(0.5);
        button.sprite.interactive = true;
        button.sprite.buttonMode = true;
        button.sprite.on('pointerdown', function(){
            balance -= button.bet
            bet = button.bet
            externalCircle.rotation -= 0.15;
            balanceScore.text = 'Balance: ' + balance
            betScore.text = 'Bet: ' + bet
        })
        button.sprite.addChild(innerText);
    })

    // configure bet buttons
    var angle = 15
    var wheelMeta = shuffle(WHEEL).map(function (item, i) {
        var innerText = new PIXI.Text(item)
        var coordinates = getCoordinateByAngle(externalCircle.height / 2 - 40, angle)
        angle += 30
        innerText.anchor.set(0.5);
        innerText.position.set(coordinates[0], coordinates[1])
        innerText.rotation = 0.2 + 0.53 * i;
        externalCircle.addChild(innerText)
        return innerText
    })
    animationLoop(externalCircle)
})

// helpers
function animationLoop(obj) {
    requestAnimationFrame(animationLoop);

    obj.rotation += 0.05;
    app.render(stage);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getCoordinateByAngle(distance, angle) {
    var angleInRadian = angle * Math.PI / 180
    return [distance * Math.sin(angleInRadian), -(distance * Math.cos(angleInRadian))]
}