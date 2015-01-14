(function(root, undefined) {

  "use strict";


/* ViBE.js main */

// Base function.
var ViBE =function(providedConfig){
    this.config={
      width:400,
      height:300,
      samplesNumber:10,
      colorDistanceSphereRadius:20,
      numberOfCloseSamplesForBeingPartOfBackground:1,
      ammountOfRandomSubsampling:5,
      randomNeighbourMovements:[-1,0,1]
    };

    for (var attrname in providedConfig)  {
      this.config[attrname] = providedConfig[attrname];
    }


    var imageInOneDimensionLength=this.config.width*this.config.height*4;
    this.initializeModel=function(image){
      this.backgroundModels=[];
      var generateSample=function(x,y){
        var currentIndex=this._calculateIndexFromCoordinates(x,y),
        randomNeighbour=this._getRandomNeighbour(x,y),
        randomNeighbourIndex=this._calculateIndexFromCoordinates(randomNeighbour[0],randomNeighbour[1]);
        this._rewriteColors(image,this.backgroundModels[i],randomNeighbourIndex,currentIndex);
      }.bind(this);
      for(var i=0;i<this.config.samplesNumber;i++){
        this.backgroundModels[i]=new Uint8ClampedArray(imageInOneDimensionLength);
        this._forEachPixel(generateSample);
      }
    };

    this.getNextFrame=function(currentImage){
      var outputFrame=new Uint8ClampedArray(imageInOneDimensionLength);
      this._forEachPixel(function(x,y){
        var closeSamplesCount=0,
        sampleIndex=0,
        currentIndex=this._calculateIndexFromCoordinates(x,y);
        while((closeSamplesCount<this.config.numberOfCloseSamplesForBeingPartOfBackground)&&(sampleIndex<this.config.samplesNumber)){
          var currentSample=this.backgroundModels[sampleIndex];
          if(this.config.colorDistanceSphereRadius>this._distanceBetweanPixels(currentSample,currentImage,currentIndex)){
            closeSamplesCount++;
          }
          sampleIndex++;
        }
        if(closeSamplesCount>=this.config.numberOfCloseSamplesForBeingPartOfBackground){
          for(var i=0;i<3;i++){
            outputFrame[currentIndex+i]=0;
          }
          outputFrame[currentIndex+3]=255;

          if(this._shouldRandomSubsample()){
            sampleIndex=Math.round(Math.random()*(this.config.samplesNumber-1));
            this._rewriteColors(currentImage,this.backgroundModels[sampleIndex],currentIndex,currentIndex);
          }
          if(this._shouldRandomSubsample()){
            sampleIndex=Math.round(Math.random()*(this.config.samplesNumber-1));
            var randomNeighbour=this._getRandomNeighbour(x,y),
            randomNeighbourIndex=this._calculateIndexFromCoordinates(randomNeighbour[0],randomNeighbour[1]);
            this._rewriteColors(currentImage,this.backgroundModels[sampleIndex],currentIndex,randomNeighbourIndex);
          }
        }else{
          this._rewriteColors(currentImage,outputFrame,currentIndex,currentIndex);
        }


      }.bind(this));
      return outputFrame;
    };

    this._rewriteColors=function(from,to,fromIndex,toIndex){
      for(var i=0;i<4;i++){
        to[toIndex+i]=from[fromIndex+i];
      }
    };

    this._shouldRandomSubsample=function(){
      return Math.round(Math.random()*(this.config.ammountOfRandomSubsampling-1))===0;
    };

    this._distanceBetweanPixels=function(image1,image2,index){
      var differenceSum=0;
      for(var i=0;i<4;i++){
        differenceSum+=image1[index+i]-image2[index+i];
      }
      return Math.abs(differenceSum/4);
    };

    this._forEachPixel=function(callback){
      for(var x=0;x<this.config.width;x++){
        for(var y=0;y<this.config.height;y++){
          callback(x,y);
        }
      }
    };

    this._calculateIndexFromCoordinates=function(x,y){
      return (x + y * this.config.width) * 4;
    };

    this._betweanValues=function(value,min,max){
      return Math.max(min,Math.min(max,value));
    };
    this._getRandomMovement=function(){
      var randomMovementIndex=Math.round(Math.random()*(this.config.randomNeighbourMovements.length-1));
      return this.config.randomNeighbourMovements[randomMovementIndex];
    };
    this._getRandomNeighbour=function(x,y){
      var neighbourX=this._betweanValues(x+this._getRandomMovement(),0,this.config.width-1);
      var neighbourY=this._betweanValues(y+this._getRandomMovement(),0,this.config.height-1);
      return [neighbourX,neighbourY];
    };

};


// Version.
ViBE.VERSION = '0.0.0';


// Export to the root, which is probably `window`.
root.ViBE = ViBE;


 var ViBETracker=function(providedConfig){
    this.config={

    };
    for (var attrname in providedConfig)  {
      this.config[attrname] = providedConfig[attrname];
    }
    ViBETracker.base(this, 'constructor');
  };

  root.tracking.inherits(ViBETracker, tracking.Tracker);

  ViBETracker.prototype.track = function(pixels,width,height) {
    if(!this.initialized2&&pixels[0]!==0){
      this.config.width=width;
      this.config.height=height;
      this.vibeService=new ViBE(this.config);
      this.vibeService.initializeModel(new Uint8ClampedArray(pixels));
      this.initialized2=true;
    }
    if(this.initialized2){
    var processedFrame=this.vibeService.getNextFrame(new Uint8ClampedArray(pixels));
    this.emit('track',{
      frame:processedFrame,
      beforeProcessingFrame:pixels
    });
    }
  };

ViBETracker.VERSION = '0.0.0';

root.ViBETracker = ViBETracker;


}(this));
