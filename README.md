# vibe.js

ViBE background removing [Tracking.js](http://trackingjs.com) tracker

## About

A JavaScript library by Roman Bartusiak.

See the [project homepage](http://riomus.github.io/vibe.js).

## Installation

Using Bower:

bower install vibe.js

Or grab the [source](https://github.com/riomus/vibe.js/dist/vibe.js) ([minified](https://github.com/riomus/vibe.js/dist/vibe.min.js)).

## Usage

Basic usage is as follows:
var vibeTracker=new ViBETracker();
vibeTracker.on('track',function(data){
  data.frame 
});
tracking.track(document.getElementsByTagName('video')[0], vibeTracker, { camera: true });

## License

MIT. See `LICENSE.txt` in this directory.
