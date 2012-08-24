/**
 * Script: Slideshow.js Slideshow - A javascript class for Mootools to stream
 * and animate the presentation of images on your website.
 * 
 * License: MIT-style license.
 * 
 * Copyright: Copyright (c) 2011 [Aeron
 * Glemann](http://www.electricprism.com/aeron/).
 * 
 * Dependencies: Mootools 1.3.1 Core: Fx.Morph, Fx.Tween, Selectors,
 * Element.Dimensions. Mootools 1.3.1.1 More: Assets.
 */

// = require_directory ../FundamentalTypes
var Slideshow = new Class({
   Implements : [AssertionBehavior, Chain, Events, Options],
   Binds : ['addKeyUpEventHandler', 'constructComponents', 'createComponents', 'createImageElement', 'createImagesWrapper', 'finalizeConstruction'],
   constants : {
      OnStart : 1 << 2,
      WhenPaused : 1 << 0,
      WhenPlaying : 1 << 1
   },
   
   options : {
      captions : true,
      center : true,
      classes : [],
      controller : true,
      data : null,
      delay : 2000,
      duration : 1000,
      eventDeliveryDelay : 5,
      fast : false,
      height : false,
      href : '',
      imageFolder : '',
      linked : false,
      busyWidget : true,
      loop : true,
      match : /\?slide=(\d+)$/,
      overlap : true,
      paused : false,
      random : false,
      replace : [ /(\.[^\.]+)$/, 't$1' ],
      resize : 'fill',
      slide : 0,
      thumbnails : true,
      titles : false,
      transition : 'sine:in:out',
      width : false
   },

   initialize : function( containerElement, imageDefinitions, options ) {
      this.setOptions( options );
      this.assertThat( containerElement, not( nil() ), "Slideshow.containerElement" );
            
      this.cache = {};
      this.classes;
      this.constructionChain = new Chain();
      this.containerElement = containerElement;
      this.counter = 0;
      this.data = { 'images' : [], 'captions' : [], 'hrefs' : [], 'thumbnails' : [], 'targets' : [], 'titles' : [] };
      this.direction = 'left';
      this.events = {};
      this.imageDefinitions = imageDefinitions;
      this.imagesWrapperElement;
      this.showed = { 'array' : [], 'i' : 0 };
      this.slide = this.options.slide;
      this.paused = false;
      this.timeToNextTransition = 0;
      this.timeToTransitionComplete = 0;
      
      this.setUp();
   },
   
   construct : function(){
      this.compileConstructionChain();
      
      try{
         this.constructionChain.callChain();
      }catch( exception ){
         alert( "Construction exception." );
      }
   },

   destroy : function(p) {
      Object.each( this.events, function( array, e ) {
         if( 'each' in array ){
            array.each( function( fn ) {
               document.removeEvent( e, fn );
            });
         }
      });
      this.pause( 1 );
      'caption busyWidget thumbnails'.split( ' ' ).each( function(i, timer) {
         this.options[i] && this[i].retrieve && (timer = this[i].retrieve( 'timer' )) && clearTimeout( timer );
      }, this );
      typeOf( this.containerElement[p] ) == 'function' && this.containerElement[p]();
      if (this.containerElement.eliminate) this.containerElement.eliminate( 'uid' );
      if (this.preloader && this.preloader.removeEvents) this.preloader.removeEvents();
      if (this.preloader && this.preloader.destroy) this.preloader.destroy();

      this.fireEvent( 'destroy', this );
   },

   first : function() {
      this.prev( true );
   },

   go : function( n, direction ) {
      var nextSlide = (this.slide + this.data.images.length) % this.data.images.length;
      if (n == nextSlide || Date.now() < this.timeToTransitionComplete) return;
      clearTimeout( this.timer );
      this.timeToNextTransition = 0;
      this.direction = direction ? direction : n < this._slide ? 'right' : 'left';
      this.slide = this._slide = n;
      if( this.preloader ) this.preloader = this.preloader.destroy();
      this.preload( (this.options.fast & WhenPlaying) || (this.paused && this.options.fast & WhenPaused) );
   },

   last : function() {
      this.next( true );
   },

   next : function( last ) {
      var n = last ? this.data.images.length - 1 : this._slide;
      this.go( n, 'left' );
   },

   pause : function( p ) {
      if( p != undefined ) this.paused = p ? false : true;
      if( this.paused ) { // play
         this.paused = false;
         this.timeToTransitionComplete = Date.now() + this.timeToTransitionComplete;
         this.timer = this.preload.delay( 50, this );
         [this.a, this.b ].each( function(img) {
            ['morph', 'tween' ].each( function(p) {
               if (this.retrieve && this.retrieve( p )) this.get( p ).resume();
            }, img );
         });

         this.controller && this.containerElement.retrieve( 'pause' ).getParent().removeClass( this.classes.play );
      }else { // pause
         this.paused = true;
         this.timeToTransitionComplete = this.timeToTransitionComplete - Date.now();
         clearTimeout( this.timer );
         [ this.a, this.b ].each( function(img) {
            [ 'morph', 'tween' ].each( function(p) {
               if( this.retrieve && this.retrieve( p )) this.get( p ).pause();
            }, img );
         });

         if( this.controller && this.containerElement.retrieve && this.containerElement.retrieve( 'pause' )) {
            var pauseValue = this.containerElement.retrieve( 'pause' );
            if( pauseValue.getParent()) pauseValue.getParent().addClass( this.classes.play );
         };
      }
   },
   
   prev : function(first) {
      var n = 0;
      if( !first ) {
         if( this.options.random ) {
            if( this.showed.i < 2 ) return;
            this.showed.i -= 2;
            n = this.showed.array[this.showed.i];
         }else n = ( this.slide - 1 + this.data.images.length ) % this.data.images.length;
      }
      this.go( n, 'right' );
   },

   //Properties
   getAccessKeys : function(){ return this.accesskeys; },
   getDuration : function(){ return this.options.duration; },
   getElementsClasses : function(){ return this.classes; },
   getEvents : function(){ return this.events; },
   getFast : function(){ return this.options.fast; },
   getImageDefinitions : function(){ return this.imageDefinitions; },
   getImageFolder : function(){ return this.options.imageFolder; },
   getLink : function(){ return this.options.href; },
   getScreen : function(){ return this.screen; },
   
   //Protected, private helper methods
//   addKeyUpEventHandler : function(){
//      this.events.push( 'keyup', function( event ) {
//         this.accesskeys.each( function( accesskey, action ) {
//            if( event.key == accesskey.key && event.shift == accesskey.shift && event.control == accesskey.control && event.alt == accesskey.alt ) this[action]();
//         }, this );
//      }.bind( this ));
//      
//      this.constructionChain.callChain();
//   }.protect(),
   
   appendSlashToImageFolder : function(){
      if( this.options.imageFolder.length && !this.options.imageFolder.test( /\/$/ )) this.options.imageFolder += '/';
   }.protect(),
   
   _center : function(img) {
      var size = img.getSize(), h = size.y, w = size.x;
      img.set( 'styles', { 'left' : (w - this.width) / -2, 'top' : ( h - this.height ) / -2 });
   }.protect(),
   
   compileConstructionChain : function(){
      this.constructionChain.chain(
//         this.addKeyUpEventHandler,
         this.constructComponents,
//         function(){ this.preload( this.options.fast & OnStart ); }.bind( this ),
         this.finalizeConstruction
      );
   }.protect(),

   _complete : function() {
      if( this.firstrun && this.options.paused) this.pause( 1 );
      this.firstrun = false;
      this.fireEvent( 'complete', [], 10 );
   }.protect(),
   
   constructComponents : function(){
      this.screen = new Screen( this.containerElement ); this.screen.construct();
      if( this.options.captions ){ this.caption = new SlideCaption( this.containerElement ); this.caption.construct(); }
      if( this.options.controller ){ this.controller = new SlideshowController( this.containerElement, this.screen ); this.controller.construct(); }
      if( this.options.busyWidget ){ this.busyWidget = new BusyElement( this.containerElement ); this.busyWidget.construct(); }
//      if( this.options.thumbnails ) this.thumbnails = new Thumbnails( this );
      
      this.constructionChain.callChain();
   }.protect(),
   
   createImageData : function() {
      if( typeOf( this.imageDefinitions ) == 'array' ) {
         this.options.captions = false;
         this.imageDefinitions = new Array( this.imageDefinitions.length ).associate( this.imageDefinitions.map( function( image, i ) {
            return image + '?' + i;
         }));
      }
      
      for( var image = null in this.imageDefinitions ) {
         var obj = this.imageDefinitions[image] || {}; 
         image = this.options.imageFolder + image;
         var caption = obj.caption ? obj.caption.trim() : '';
         var href = obj.href ? obj.href.trim() : this.options.linked ? image : this.options.href;
         var target = obj.target ? obj.target.trim() : '_self';
         var thumbnail = obj.thumbnail ? this.options.imageFolder + obj.thumbnail.trim() : image.replace( this.options.replace[0], this.options.replace[1] );
         var title = caption.replace( /<.+?>/gm, '' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, "'" );
         this.data.images.push( image );
         this.data.captions.push( caption );
         this.data.hrefs.push( href );
         this.data.targets.push( target );
         this.data.thumbnails.push( thumbnail );
         this.data.titles.push( title );
      }
      
      if( this.options.random ) this.slide = this._slide = Number.random( 0, this.data.images.length - 1 );

//      if( this.options.thumbnails && this.containerElement.retrieve( 'thumbnails' )) this._thumbnails();
//      if( this.containerElement.retrieve( 'images' )) {
//         [this.a, this.b ].each( function(img) {
//            [ 'morph', 'tween' ].each( function(p) {
//               if (this.retrieve( p )) this.get( p ).cancel();
//            }, img );
//         });
//         this.slide = this._slide = this.timeToTransitionComplete = 0;
//         this.go( 0 );
//      }
   }.protect(),
   
   defineElementsClasses : function(){
      var keys = 'slideshow first prev play pause next last images captions controller thumbnails hidden visible inactive active busyWidget'.split( ' ' );
      var values = keys.map( function( key, i ) { return this.options.classes[i] || key; }, this );
      this.classes = values.associate( keys );
      this.classes.get = function() {
         var str = '.' + this.slideshow;
         for( var i = 0, l = arguments.length; i < l; i++ ) str += '-' + this[arguments[i]];
         return str;
      }.bind( this.classes );
   }.protect(),
   
   defineEventsPush : function(){
      this.events.push = function( type, fn ) {
         if( !this[type] ) this[type] = [];
         this[type].push( fn );
         document.addEvent( type, fn );
         return this;
      }.bind( this.events );
   }.protect(),
   
   doubleDurationWhenNoOverlap : function(){
      if( !this.options.overlap ) this.options.duration *= 2;
   }.protect(),
   
   finalizeConstruction : function(){
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   inferImageDefinitionsFromHtml : function(){
      if( !this.imageDefinitions ) {
         this.options.imageFolder = '';
         this.imageDefinitions = {};
         var thumbnails = this.containerElement.getElements( this.classes.get( 'thumbnails' ) + ' img' );
         this.containerElement.getElements( this.classes.get( 'images' ) + ' img' ).each( function( imageElement, i ) {
            var src = imageElement.get( 'src' );
            var caption = imageElement.get( 'alt' ) || imageElement.get( 'title' );
            var href = imageElement.getParent().get( 'href' );
            var thumbnail = thumbnails[i] ? thumbnails[i].get( 'src' ) : '';
            this.imageDefinitions[src] = { 'caption' : caption, 'href' : href, 'thumbnail' : thumbnail };
         }.bind( this ));
      }
   }.protect(),
   
   inferLinkFromHtml : function(){
      var anchor = this.containerElement.getElement( 'a' ) || new Element( 'a' );
      if( !this.options.href ) this.options.href = anchor.get( 'href' ) || '';
   }.protect(),
   
   initializeFastOption : function(){
      if( this.options.fast === true ) this.options.fast = this.constants.WhenPaused | this.constants.WhenPlaying;
   }.protect(),

   _loaded : function(fast) {
      this.counter++;
      this.timeToNextTransition = Date.now() + this.options.duration + this.options.delay;
      this.direction = 'left';
      this.timeToTransitionComplete = fast ? 0 : Date.now() + this.options.duration;
      if( this._slide == (this.data.images.length - 1) && !this.options.loop && !this.options.random) this.stopped = this.end = true;
      if( this.options.random) {
         this.showed.i++;
         if (this.showed.i >= this.showed.array.length) {
            var n = this._slide;
            if (this.showed.array.getLast() != n) this.showed.array.push( n );
            while (this._slide == n) this.slide = this._slide = Number.random( 0, this.data.images.length - 1 );
         }else
            this.slide = this._slide = this.showed.array[this.showed.i];
         } else {
            this.slide = this._slide;
            this._slide = (this.slide + 1) % this.data.images.length;
         }
      if( this.image.getStyle( 'visibility' ) != 'visible') (function() {
         this.image.setStyle( 'visibility', 'visible' );
      }).delay( 1, this );
      if( this.preloader ) this.preloader = this.preloader.destroy();
      this.paused || this.preload();
   }.protect(),
   
   preload : function( fast ) {
      var src = this.data.images[this._slide].replace( /([^?]+).*/, '$1' );
      var cached = loaded = !!this.cache[src];
      if( !cached ){
         if( !this.preloader) this.preloader = new Asset.image( src, { 
            'onerror' : function() {
               // do something
             },
             'onload' : function() {
                this.store( 'loaded', true );
             }
         });
         loaded = this.preloader.retrieve( 'loaded' ) && this.preloader.get( 'width' );
      }

      if( loaded && Date.now() > this.timeToNextTransition && Date.now() > this.timeToTransitionComplete) {
         var src = this.data.images[this._slide].replace( /([^?]+).*/, '$1' );
         if( this.preloader ) {
            this.cache[src] = {
               'height' : this.preloader.get( 'height' ),
               'src' : src,
               'width' : this.preloader.get( 'width' )
            };
         }
         if( this.stopped ){
            if (this.options.captions) this.caption.get( 'morph' ).cancel().start( this.classes.get( 'captions', 'hidden' ) );
            this.pause( 1 );
            if (this.end) this.fireEvent( 'end' );
            this.stopped = this.end = false;
            return;
         }
         this.image = this.counter % 2 ? this.b : this.a;
         this.image.set( 'styles', { 'display' : 'block', 'height' : null, 'visibility' : 'hidden', 'width' : null, 'zIndex' : this.counter });
         this.image.set( this.cache[src] );
         this.image.width = this.cache[src].width;
         this.image.height = this.cache[src].height;
         this.options.resize && this._resize( this.image );
         this.options.center && this._center( this.image );
         var anchor = this.image.getParent();
         if( this.data.hrefs[this._slide] ) {
            anchor.set( 'href', this.data.hrefs[this._slide] );
            anchor.set( 'target', this.data.targets[this._slide] );
         }else {
            anchor.erase( 'href' );
            anchor.erase( 'target' );
         }
         var title = this.data.titles[this._slide];
         this.image.set( 'alt', title );
         this.options.titles && anchor.set( 'title', title );
         this.options.busyWidget && this.busyWidget.fireEvent( 'hide' );
         this.options.captions && this.caption.fireEvent( 'update', fast );
         this.options.thumbnails && this.thumbnails.fireEvent( 'update', fast );
         this._show( fast );
         this._loaded( fast );
      }else {
         if (Date.now() > this.timeToNextTransition && this.options.busyWidget) {
            this.busyWidget.fireEvent( 'show' );
         }
         this.timer = this.preload.delay( 50, this, fast );
      }
   }.protect(),

   _resize : function(img) {
      var h = img.get( 'height' ).toFloat(), w = img.get( 'width' ).toFloat(), dh = this.height / h, dw = this.width / w;
      if( this.options.resize == 'fit') dh = dw = dh > dw ? dw : dh;
      if( this.options.resize == 'fill') dh = dw = dh > dw ? dh : dw;
      img.set( 'styles', { 'height' : Math.ceil( h * dh ), 'width' : Math.ceil( w * dw ) });
   }.protect(),
   
   setUp : function(){
      this.doubleDurationWhenNoOverlap();
      this.appendSlashToImageFolder();
      this.initializeFastOption();
//      this.defineElementsClasses();
//      this.inferLinkFromHtml();
//      this.inferImageDefinitionsFromHtml();
//      this.addModifierKeysToAccessKeys();
//      this.defineEventsPush();
      this.createImageData();
   }.protect(),

   _show : function(fast) {
      if(!this.image.retrieve( 'morph' )) {
         var options = this.options.overlap ? { 'link' : 'cancel' } : { 'link' : 'chain' };
         $$( this.a, this.b ).set( 'morph', Object.merge( options, {
            'duration' : this.options.duration,
            'onStart' : this._start.bind( this ),
            'onComplete' : this._complete.bind( this ),
            'transition' : this.options.transition
         }));
      }
      var hidden = this.classes.get( 'images', (this.direction == 'left' ? 'next' : 'prev' ));
      var visible = this.classes.get( 'images', 'visible' );
      var img = this.counter % 2 ? this.a : this.b;
      if( fast ) {
         img.get( 'morph' ).cancel().set( hidden );
         this.image.get( 'morph' ).cancel().set( visible );
      } else {
         if( this.options.overlap) {
            img.get( 'morph' ).set( visible );
            this.image.get( 'morph' ).set( hidden ).start( visible );
         }else {
            var fn = function(visible) {
               this.image.get( 'morph' ).start( visible );
            }.pass( visible, this );
            
            if (this.firstrun) return fn();
            hidden = this.classes.get( 'images', (this.direction == 'left' ? 'prev' : 'next') );
            this.image.get( 'morph' ).set( hidden );
            img.get( 'morph' ).set( visible ).start( hidden ).chain( fn );
         }
      }

      this.fireEvent( 'show' );
   }.protect(),


   _start : function() {
      this.fireEvent( 'start' );
   }.protect()
});
