var WheelOfFortune = require('./modules/WheelOfFortune');
var config = require('./config');

var wof = new WheelOfFortune(config);
document.body.appendChild(wof.app.view);
