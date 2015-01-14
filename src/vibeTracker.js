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
