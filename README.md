voronoi-map-node-js
==============

JavaScript nodejs port of Amit Patel's mapgen2 https://github.com/amitp/mapgen2 Map generator for games. Generates island maps with a focus on mountains, rivers, coastlines in nodejs.

Based on the awesome work from Amit Patel and the js port from Richard Janicek.

[Try the demo from Richard Janicek](http://rjanicek.github.io/voronoi-map-js/)

[Install me from NPM](https://npmjs.org/package/node-voronoi-map)

[Fork me on GitHub](https://github.com/mrmoor/voronoi-map-js)

Installation & usage
--------------------

Using [`npm`](http://npmjs.org/):

```bash
npm install --save node-voronoi-map
```

```js
var MapGenerator = require('node-voronoi-map');
var mapGenerator = new MapGenerator({
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
});
var map = mapGenerator.generate();
```

Tasks
-----

* implement generate Map from Image