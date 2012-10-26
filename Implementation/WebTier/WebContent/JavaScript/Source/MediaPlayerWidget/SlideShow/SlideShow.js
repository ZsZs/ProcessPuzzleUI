/*
Name: 
    - SlideShow

Description: 
    - Defines a slide show media, playable withing the Media Player Widget. 

Requires:
    - Media
    
Provides:
    - SlideShow

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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes
//= require ../MediaPlayerWidget/Media.js

var SlideShow = new Class({
   Extends : Media,
   Binds : ['compileDataObject', 'destroyImages', 'destroySlideShow', 'instantiateSlideShow', 'resetFields'],
   options : {
      accessKeysDefault : null,
      accessKeysSelector : "/sh:slideShow/sh:properties/sh:accessKeys",
      automaticallyLinkSlideDefault : false,
      automaticallyLinkSlideSelector : "/sh:slideShow/sh:properties/sh:automaticallyLinkSlideToFullSizedImage",
      centerImagesDefault : true,
      centerImagesSelector : "/sh:slideShow/sh:properties/sh:centerImages",
      componentName : "SlideShow",
      dataXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com' xmlns:pg='http://www.processpuzzle.com/SlideShow'",
      descriptionSelector : "//sh:slideShow/sh:description", 
      effectDurationDefault : 750,
      effectDurationSelector : "/sh:slideShow/sh:properties/sh:effectDuration",
      eventDeliveryDelay : 50,
      firstSlideDefault: 0,
      firstSlideSelector: "/sh:slideShow/sh:properties/sh:firstSlide",
      galeryLinkDefault: null,
      galeryLinkSelector: "/sh:slideShow/sh:properties/sh:galeryLink",
      heightDefault: 300,
      heightSelector: "/sh:slideShow/sh:properties/sh:height",
      imageFolderUriDefault: "",
      imageFolderUriSelector: "/sh:slideShow/sh:properties/sh:imageFolderUri",
      imagesSelector: "/sh:slideShow/sh:images/sh:image",
      loopShowDefault: true,
      loopShowSelector: "/sh:slideShow/sh:properties/sh:loopShow",
      nameSelector : "//sh:slideShow/sh:name",
      overlapImagesDefault : true,
      overlapImagesSelector : "/sh:slideShow/sh:properties/sh:overlapImages",
      resizeImagesDefault : true,
      resizeImagesSelector : "/sh:slideShow/sh:properties/sh:resizeImages",
      showControllerDefault : true,
      showControllerSelector : "/sh:slideShow/sh:properties/sh:showController",
      showImageCaptionsDefault : true,
      showImageCaptionsSelector : "/sh:slideShow/sh:properties/sh:showImageCaptions",
      showSlidesRandomDefault : false,
      showSlidesRandomSelector : "/sh:slideShow/sh:properties/sh:showSlidesRandom",
      showThumbnailsDefault : true,
      showThumbnailsSelector : "/sh:slideShow/sh:properties/sh:showThumbnails",
      skipTransitionDefault : null,
      skipTransitionSelector : "/sh:slideShow/sh:properties/sh:skipTransition",
      slideChangeDelayDefault : 2000,
      slideChangeDelaySelector : "/sh:slideShow/sh:properties/sh:slideChangeDelay",
      slideTransitionDefault : "Sine",
      slideTransitionSelector : "/sh:slideShow/sh:properties/sh:slideTransition",
      startPausedDefault : true,
      startPausedSelector : "/sh:slideShow/sh:properties/sh:startPaused",
      thumbnailFileNameRuleDefault : null,
      thumbnailFileNameRuleSelector : "/sh:slideShow/sh:properties/sh:thumbnailFileNameRule",
      widthDefault : 450,
      widthSelector : "/sh:slideShow/sh:properties/sh:width"
   },

   //Constructor
   initialize: function( internationalization, mediaDefinitionXml, options ){
      this.parent( internationalization, mediaDefinitionXml, options );
      
      //Private attributes
      this.accessKeys;
      this.automaticallyLinkSlide;
      this.centerImages;
      this.constructionChain = new Chain();
      this.currentSlide;
      this.data;
      this.dataAsText = "";
      this.effectDuration;
      this.firstSlide;
      this.galeryLink;
      this.height;
      this.slides = new LinkedHashMap();
      this.imageFolderUri;
      this.isRunning = false;
      this.loopShow;
      this.overlapImages;
      this.resizeImages;
      this.showController;
      this.showImageCaptions;
      this.showSlidesRandom;
      this.showThumbnails;
      this.skipTransition;
      this.slideChangeDelay;
      this.slideTransition;
      this.startPaused;
      this.thumbnailFileNameRule;
      this.width;
   },
   
   //Public accessor and mutator methods
   backward: function(){
      this.currentSlide = this.slides.previous( this.currentSlide.getUri() );
      if( !this.currentSlide ) this.currentSlide = this.slides.first();
      this.updateDisplyeWithCurrentSlide();
   },
   
   beginning: function(){
      this.currentSlide = this.slides.first();
      this.updateDisplyeWithCurrentSlide();
   },
   
   collectThumbnailUris : function(){
      this.thumbnailsUri.erase();
      this.slides.each( function( slideEntry, index ){
         var slide = slideEntry.getValue();
         this.thumbnailsUri.include( this.imageFolderUri + '/' + slide.getThumbnailUri() );
      }.bind( this ));
      
      return this.thumbnailsUri;
   },
   
   end: function(){
      this.currentSlide = this.slides.last();
      this.updateDisplyeWithCurrentSlide();
   },
   
   forward: function(){
      this.currentSlide = this.slides.next( this.currentSlide.getUri() );
      if( !this.currentSlide ) this.currentSlide = this.slides.last();
      this.updateDisplyeWithCurrentSlide();
   },
   
   release: function(){
      this.destroySlides();
   },
   
   start: function(){
      this.beginning();
   },
   
   stop: function(){
      this.isRunning = false;
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallSlides();
      this.appendSlashToImageFolder();
      this.collectThumbnailUris();
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
   getSlides: function() { return this.slides; },
   getSlideShow: function() { return this.slideShow; },
   getSlideTransition: function() { return this.slideTransition; },
   getStartPaused: function() { return this.startPaused; },
   getThumbnailFileNameRule: function() { return this.thumbnailFileNameRule; },
   getWidth: function() { return this.width; },
   
   //Protected and private helper methods
   appendSlashToImageFolder : function(){
      if( this.imageFolderUri.length && !this.imageFolderUri.test( /\/$/ )) this.imageFolderUri += '/';
   }.protect(),
   
   compileDataObject: function(){
      this.slides.each( function( imageEntry, index ){
         var image = imageEntry.getValue();
         image.construct();
         if( this.dataAsText ) this.dataAsText += ", ";
         this.dataAsText += image.getDataAsText();
      }, this );
      
      this.data = eval( "({" + this.dataAsText + "})" );
      this.constructionChain.callChain();
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( this.compileDataObject, this.instantiateSlideShow, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyImages, this.destroySlideShow, this.destroyChildHtmlElements, this.resetFields, this.finalizeDestruction );
   }.protect(),
   
   destroySlideShow: function(){
      if( this.slideShow ) this.slideShow.destroy();
      else this.destructionChain.callChain();
   }.protect(),
   
   destroySlides: function(){
      this.slides.each( function( slideEntry, index ){
         var slide = slideEntry.getValue();
         slide.destroy();
      }.bind( this ));
      this.slides.clear();
   }.protect(),
   
   resetFields: function(){
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
      this.destructionChain.callChain();
   }.protect(),
   
   unmarshallSlides: function(){
      var imagesElement = this.mediaDefinitionXml.selectNodes( this.options.imagesSelector );
      if( imagesElement ){
         imagesElement.each( function( imageElement, index ){
            var image = new Slide( imageElement, this.internationalization );
            image.unmarshall();
            this.slides.put( image.getUri(), image );
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
      var propertyValue = this.mediaDefinitionXml.selectNodeText( selector );
      if( propertyValue ) return propertyValue;
      else return defaultValue;
   }.protect(),
   
   updateDisplyeWithCurrentSlide : function(){
      var imageData = { imageUri: this.imageFolderUri + this.currentSlide.getUri(), thumbnailIndex: 1, title: this.currentSlide.getCaption() };
      this.fireEvent( 'updateDisplay', imageData );
   }.protect()
});

SlideShow.OnStart = 1 << 2;
SlideShow.WhenPaused = 1 << 0;
SlideShow.WhenPlaying = 1 << 1;
