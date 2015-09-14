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
var MapGenerator = require('voronoi-js-node');
var mapGenerator = new MapGenerator();
var map = mapGenerator.generate();
```

Tasks
-----

* make comfortable config.
* implement generate Map from Image