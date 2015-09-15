/* jshint 
    browser: true, jquery: true, node: true,
    bitwise: true, camelcase: false, curly: true, eqeqeq: true, es3: true, evil: true, expr: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: single, regexdash: true, strict: true, sub: true, trailing: true, undef: true, unused: vars, white: true
*/

var _ = require('lodash');
var islandShape = require('./island-shape');
var lava = require('./lava');
var map = require('./map');
var mapLands = require('./map-lands');
var noisyEdges = require('./noisy-edges');
var pointSelector = require('./point-selector');
var roads = require('./roads');
var watersheds = require('./watersheds');

/**
 * create Generator
 * config param
 * {
    width:1920,
    height:960,
    seed:992878989,
    shapeSeed:60441019,
    islandShape:'perlin',
    pointSelection:'square',
    oceanRatio:0.5,
    islandFactor:1.07, //1.0 means no small islands; 2.0 leads to a lot
    numberOfLands:'',
    numberOfPoints:200,
    lakeThreshold:0.3,
    riverChance:100,
    roadElevationThresholds:'0, 0.05, 0.37, 0.64',//comma separated
    edgeNoise:0.5,
    lloydIterations:2,
    imageThreshold:1.07,
}
 * @param config
 * @constructor
 */
function Generator(config){
    this.config = config;
}
Generator.prototype.constructor=Generator;

/**
 * get screen size
 * @returns {{width: *, height: *}}
 */
Generator.prototype.getSize=function() {
    return {
        width: this.config.width,
        height: this.config.height
    };
}

/*Generator.prototype.updateThumb=function() {
    var threshold = $(S_imageThreshold).val();
    var color1 = style.displayColors.OCEAN;
    var color2 = style.displayColors.GRASSLAND;
    if ($(S_invertImage).is(':checked')) {
        var colorHold = color1;
        color1 = color2;
        color2 = colorHold;
    }
    var thresholdImageData = canvasCore.makeAverageThresholdImageData(canvasCore.getImageData(image), threshold, color1, color2);
    var imageDataUrl = canvasCore.makeImageDataUrlFromImageData(thresholdImageData);
    $(S_imageThumb).attr('src', imageDataUrl);
}*/

/**
 *
 * @param s
 * @returns {*}
 */
Generator.prototype.getIntegerOrStringSeed=function(s) {
    if (_(s).isNumber()) {
        return _(s).parseInt();
    }
    
    return Math.abs(prng.stringToSeed(s));
}

/**
 * generate map
 * @returns {{map: null, noisyEdges: null, roads: null, watersheds: null, lava: null}}
 */
Generator.prototype.generate=function() {
    console.time('generate');

    var size = this.getSize();

    var state = { map : null, noisyEdges : null, roads : null, watersheds : null, lava : null };
    
    state.map = map({ width: size.width + 0.0, height: size.height + 0.0 });

    var seed = this.getIntegerOrStringSeed(this.config.seed);
    var shapeSeed = this.getIntegerOrStringSeed(this.config.shapeSeed);
    
    switch (this.config.islandShape) {
    /*case 'bitmap' :
        var imageData = canvasCore.getImageData(image);
        var bitmap = canvasCore.makeAverageThresholdBitmap(imageData, config.imageThreshold);
        if (config.invertImage) {
            bitmap = canvasCore.invertBitmap(bitmap);
        }
        state.map.newIsland(islandShape.makeBitmap(bitmap), seed);
        break;*/
    case 'blob' :
        state.map.newIsland(islandShape.makeBlob(), seed);
        break;
    case 'noise' :
        state.map.newIsland(islandShape.makeNoise(shapeSeed), seed);
        break;
    case 'perlin' :
        state.map.newIsland(islandShape.makePerlin(shapeSeed, this.config.oceanRatio), seed);
        break;
    case 'radial' :
        state.map.newIsland(islandShape.makeRadial(shapeSeed, this.config.islandFactor), seed);
        break;
    case 'square' :
        state.map.newIsland(islandShape.makeSquare(), seed);
        break;
    }
    
    state.watersheds = watersheds();
    state.noisyEdges = noisyEdges();
    state.lava = lava();
    state.roads = roads();

    var ps = (function (pointSelection, width, height, seed) { switch (pointSelection) {
        case 'random': return pointSelector.generateRandom(width, height, seed);
        case 'relaxed': return pointSelector.generateRelaxed(width, height, seed, this.config.lloydIterations);
        case 'square': return pointSelector.generateSquare(width, height);
        case 'hex': return pointSelector.generateHexagon(width, height);
        default: throw 'unknown point selector ' + pointSelection;
    }})(this.config.pointSelection, state.map.SIZE.width, state.map.SIZE.height, state.map.mapRandom.seed);

    var numberOfLands = this.config.numberOfLands;
    if (numberOfLands.length > 0) {
        mapLands.tryMutateMapPointsToGetNumberLands(state.map, ps, parseInt(numberOfLands, 10));
    } else {
        state.map.go0PlacePoints(this.config.numberOfPoints, ps);
        state.map.go1BuildGraph();
        state.map.go2AssignElevations(this.config.lakeThreshold);
    }
    state.map.go3AssignMoisture(this.config.riverChance);
    state.map.go4DecorateMap();
    
    var thresholds = this.config.roadElevationThresholds;
    state.roads.createRoads(state.map, thresholds);
    state.watersheds.createWatersheds(state.map);
    state.noisyEdges.buildNoisyEdges(state.map, state.lava, seed, this.config.edgeNoise);

    console.timeEnd('generate');
    return state;
}
module.exports=Generator;