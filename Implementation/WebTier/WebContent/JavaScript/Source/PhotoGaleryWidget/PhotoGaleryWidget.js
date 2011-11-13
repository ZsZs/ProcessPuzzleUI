/*
Name: 
    - PhotoGaleryWidget

Description: 
    - Represents a collection of images with thumbnails, displays the selected one in original size and runs slide show. 

Requires:
    - PhotoGaleryImage, BrowserWidget, WidgetElementFactory
    
Provides:
    - PhotoGaleryWidget

Part of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. 
http://www.processpuzzle.com

Authors: 
    - Zsolt Zsuffa

Copyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the 
GNU General Public License as published by the Free Software Foundation, either version 3 of the License, 
or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var PhotoGaleryWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['onComplete', 'onEnd', 'onStart'],
   options : {
      accessKeysDefault : null,
      accessKeysSelector : "pp:widgetDefinition/properties/accessKeys",
      automaticallyLinkSlideDefault : false,
      automaticallyLinkSlideSelector : "pp:widgetDefinition/properties/automaticallyLinkSlideToFullSizedImage",
      centerImagesDefault : true,
      centerImagesSelector : "pp:widgetDefinition/properties/centerImages",
      componentName : "PhotoGaleryWidget",
      descriptionSelector : "/pp:widgetDefinition/description", 
      effectDurationDefault : 750,
      effectDurationSelector : "pp:widgetDefinition/properties/effectDuration",
      firstSlideDefault: 0,
      firstSlideSelector: "pp:widgetDefinition/properties/firstSlide",
      galeryLinkDefault: null,
      galeryLinkSelector: "pp:widgetDefinition/properties/galeryLink",
      heightDefault: 300,
      heightSelector: "pp:widgetDefinition/properties/height",
      imageFolderUriDefault: "",
      imageFolderUriSelector: "pp:widgetDefinition/properties/imageFolderUri",
      imagesSelector: "/pp:widgetData/images/image",
      loopShowDefault: true,
      loopShowSelector: "pp:widgetDefinition/properties/loopShow",
      nameSelector : "/pp:widgetDefinition/name",
      overlapImagesDefault : true,
      overlapImagesSelector : "pp:widgetDefinition/properties/overlapImages",
      resizeImagesDefault : true,
      resizeImagesSelector : "pp:widgetDefinition/properties/resizeImages",
      showControllerDefault : true,
      showControllerSelector : "pp:widgetDefinition/properties/showController",
      showImageCaptionsDefault : true,
      showImageCaptionsSelector : "pp:widgetDefinition/properties/showImageCaptions",
      showSlidesRandomDefault : false,
      showSlidesRandomSelector : "pp:widgetDefinition/properties/showSlidesRandom",
      showThumbnailsDefault : true,
      showThumbnailsSelector : "pp:widgetDefinition/properties/showThumbnails",
      skipTransitionDefault : null,
      skipTransitionSelector : "pp:widgetDefinition/properties/skipTransition",
      slideChangeDelayDefault : 2000,
      slideChangeDelaySelector : "pp:widgetDefinition/properties/slideChangeDelay",
      slideTransitionDefault : "Sine",
      slideTransitionSelector : "pp:widgetDefinition/properties/slideTransition",
      startPausedDefault : true,
      startPausedSelector : "pp:widgetDefinition/properties/startPaused",
      thumbnailFileNameRuleDefault : null,
      thumbnailFileNameRuleSelector : "pp:widgetDefinition/properties/thumbnailFileNameRule",
      widthDefault : 450,
      widthSelector : "pp:widgetDefinition/properties/width"
   },

   //Constructor
   initialize: function( options, internationalization ){
      this.setOptions( options );
      this.parent( options, internationalization );
      
      //Private attributes
      this.accessKeys;
      this.automaticallyLinkSlide;
      this.centerImages;
      this.data;
      this.dataAsText = "";
      this.effectDuration;
      this.firstSlide;
      this.galeryLink;
      this.height;
      this.images = new LinkedHashMap();
      this.imageFolderUri;
      this.loopShow;
      this.overlapImages;
      this.resizeImages;
      this.showController;
      this.showImageCaptions;
      this.showSlidesRandom;
      this.showThumbnails;
      this.skipTransition;
      this.slideChangeDelay;
      this.slideShow;
      this.slideTransition;
      this.startPaused;
      this.thumbnailFileNameRule;
      this.width;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.compileDataObject();
      this.instantiateSlideShow();
      return this.parent();
   },
   
   destroy: function(){
      this.accessKeys = null;
      this.automaticallyLinkSlide = null;
      this.centerImages = null;
      this.data = null;
      this.dataAsText = "";
      this.effectDuration = null;
      this.firstSlide = null;
      this.galeryLink = null;
      this.height = null;
      this.imageFolderUri = null;
      this.loopShow = null;
      this.overlapImages = null;
      this.resizeImages = null;
      this.showController = null;
      this.showImageCaptions = null;
      this.showSlidesRandom = null;
      this.showThumbnails = null;
      this.skipTransition = null;
      this.slideChangeDelay = null;
      this.slideTransition = null;
      this.startPaused = null;
      this.thumbnailFileNameRule = null;
      this.width = null;
      this.images.clear();
      this.slideShow.destroy();
      this.parent();
   },
   
   onComplete: function(){
      if( this.state < BrowserWidget.States.CONSTRUCTED ){
         this.logger.trace( this.options.componentName + ".onComplete() completed to load Slideshow 2." );
         this.onConstructed();
      }
   },
   
   onEnd: function(){
      this.logger.trace( this.options.componentName + ".onEnd() ended Slideshow 2." );
   },
   
   onStart: function(){
      this.logger.trace( this.options.componentName + ".onStart() started to load Slideshow 2." );
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallImages();
      return this.parent();
   },
   
   //Properties
   getAccessKeys: function() { return this.accessKeys; },
   getAutomaticallyLinkSlide: function() { return this.automaticallyLinkSlide; },
   getCenterImages: function() { return this.centerImages; },
   getData: function() { return this.data; },
   getEffectDuration: function() { return this.effectDuration; },
   getFirstSlide: function() { return this.firstSlide; },
   getGaleryLink: function() { return this.galeryLink; },
   getHeight: function() { return this.height; },
   getImages: function() { return this.images; },
   getImageFolderUri: function() { return this.imageFolderUri; },
   getLoopShow: function() { return this.loopShow; },
   getOverlapImages: function() { return this.overlapImages; },
   getResizeImages: function() { return this.resizeImages; },
   getShowController: function() { return this.showController; },
   getShowImageCaptions: function() { return this.showImageCaptions; },
   getShowSlidesRandom: function() { return this.showSlidesRandom; },
   getShowThumbnails: function() { return this.showThumbnails; },
   getSkipTransition: function() { return this.skipTransition; },
   getSlideChangeDelay: function() { return this.slideChangeDelay; },
   getSlideShow: function() { return this.slideShow; },
   getSlideTransition: function() { return this.slideTransition; },
   getStartPaused: function() { return this.startPaused; },
   getThumbnailFileNameRule: function() { return this.thumbnailFileNameRule; },
   getWidth: function() { return this.width; },
   
   //Protected and private helper methods
   compileDataObject: function(){
      this.images.each( function( imageEntry, index ){
         var image = imageEntry.getValue();
         image.construct();
         if( this.dataAsText ) this.dataAsText += ", ";
         this.dataAsText += image.getDataAsText();
      }, this );
      
      this.data = eval( "({" + this.dataAsText + "})" );
   }.protect(),
   
   instantiateSlideShow: function(){
      var slideShowOptions = {
         captions : this.showImageCaptions,
         center : this.centerImages,
         controller : this.showController,
         delay : this.slideChangeDelay,
         duration : this.effectDuration,
         fast : this.skipTransition,
         height : this.height,
         href : this.galeryLink,
         hu : this.imageFolderUri,
         linked : this.automaticallyLinkSlide,
         loop : this.loopShow,
         onComplete : this.onComplete,
         onEnd : this.onEnd,
         onStart : this.onStart,
         overlap : this.overlapImages,
         paused : this.startPaused,
         random : this.showSlidesRandom,
         replace : this.thumbnailFileNameRule,
         resize : this.resizeImages,
         slide : this.firstSlide,
         thumbnails : this.showThumbnails,
         transition : this.slideTransition,
         width : this.width
      };
      this.slideShow = new Slideshow( this.containerElement, this.data, slideShowOptions );
   }.protect(),
   
   unmarshallImages: function(){
      var imagesElement = this.dataXml.selectNodes( this.options.imagesSelector );
      if( imagesElement ){
         imagesElement.each( function( imageElement, index ){
            var image = new PhotoGaleryImage( imageElement, this.i18Resource );
            image.unmarshall();
            this.images.put( image.getUri(), image );
         }, this );
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.accessKeys = this.unmarshallProperty( this.options.accessKeysDefault, this.options.accessKeysSelector );
      this.automaticallyLinkSlide = this.unmarshallProperty( this.options.automaticallyLinkSlideDefault, this.options.automaticallyLinkSlideSelector );
      this.centerImages = parseBoolean( this.unmarshallProperty( this.options.centerImagesDefault, this.options.centerImagesSelector ));
      this.effectDuration = parseInt( this.unmarshallProperty( this.options.effectDurationDefault, this.options.effectDurationSelector ));
      this.firstSlide = parseInt( this.unmarshallProperty( this.options.firstSlideDefault, this.options.firstSlideSelector ));
      this.galeryLink = this.unmarshallProperty( this.options.galeryLinkDefault, this.options.galeryLinkSelector );
      this.height = parseInt( this.unmarshallProperty( this.options.heightDefault, this.options.heightSelector ));
      this.imageFolderUri = this.unmarshallProperty( this.options.imageFolderUriDefault, this.options.imageFolderUriSelector );
      this.loopShow = parseBoolean( this.unmarshallProperty( this.options.loopShowDefault, this.options.loopShowSelector ));
      this.overlapImages = parseBoolean( this.unmarshallProperty( this.options.overlapImagesDefault, this.options.overlapImagesSelector ));
      this.resizeImages = parseBoolean( this.unmarshallProperty( this.options.resizeImagesDefault, this.options.resizeImagesSelector ));
      this.showController = parseBoolean( this.unmarshallProperty( this.options.showControllerDefault, this.options.showControllerSelector ));
      this.showImageCaptions = parseBoolean( this.unmarshallProperty( this.options.showImageCaptionsDefault, this.options.showImageCaptionsSelector ));
      this.showSlidesRandom = parseBoolean( this.unmarshallProperty( this.options.showSlidesRandomDefault, this.options.showSlidesRandomSelector ));
      this.showThumbnails = parseBoolean( this.unmarshallProperty( this.options.showThumbnailsDefault, this.options.showThumbnailsSelector ));
      this.skipTransition = eval( "(" + this.unmarshallProperty( this.options.skipTransitionDefault, this.options.skipTransitionSelector ) + ")" );
      this.slideChangeDelay = parseInt( this.unmarshallProperty( this.options.slideChangeDefault, this.options.slideChangeDelaySelector ));
      this.slideTransition = this.unmarshallProperty( this.options.slideTransitionDefault, this.options.slideTransitionSelector );
      this.startPaused = parseBoolean( this.unmarshallProperty( this.options.startPausedDefault, this.options.startPausedSelector ));
      this.thumbnailFileNameRule = this.unmarshallProperty( this.options.thumbnailFileNameRuleDefault, this.options.thumbnailFileNameRuleSelector );
      this.width = parseInt( this.unmarshallProperty( this.options.widthDefault, this.options.widthSelector ));
   }.protect(),
   
   unmarshallProperty: function( defaultValue, selector ){
      var propertyValue = this.definitionXml.selectNodeText( selector );
      if( propertyValue ) return propertyValue;
      else return defaultValue;
   }.protect()
});