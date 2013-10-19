/*
Name: 
    - MediaPlayerThumbnailsBar

Description: 
    - Displays the list of thumbnails associated with the media. 

Requires:
   - 

Provides:
    - MediaPlayerThumbnailsBar

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

//= require_directory ../FundamentalTypes

var MediaPlayerThumbnailsBar = new Class({
   Implements : [AssertionBehavior, Events, Options, TimeOutBehaviour],
   Binds : [
      'addEvents',
      'calculateLimit',
      'checkTimeOut',
      'createListElement', 
      'createThumbnailElements',
      'createWrapperElement', 
      'destroyListElement', 
      'destroyThumnailElements', 
      'destroyWrapperElement',
      'determineDimensions',
      'finalizeConstruction',
      'finalizeDestruction', 
      'onMouseMove', 
      'onUpdateComplete',
      'onThumbnailConstructed',
      'onThumbnailSelected', 
      'onThumbnailUpdated',
      'scroll',
      'updateThumbnails'],
   options : {
      columns : null,
      componentName : 'MediaPlayerThumbnailsBar',
      dimensions : [],
      eventDeliveryDelay : 5,
      fastTransformation : false,
      position : null,
      rows : null,
      scroll : null,
      scrollingFrequency : 1000,
      slideShowClass : "slideshow",
      thumbnailsClass : "thumbnails",
      tweenProperties : { duration: 500, fps : 50, link: 'cancel', transition: Fx.Transitions.Sine.easeInOut, unit: false }
   },

   initialize : function( containerElement, thumbnailImageUris, options ) {
      this.setOptions( options );
      this.assertThat( containerElement, not( nil()), this.options.componentName + ".containerElement" );
      this.assertThat( thumbnailImageUris, not( nil()), this.options.componentName + ".thumbnailImageUris" );
      
      this.constructionChain = new Chain();
      this.containerElement = containerElement;
      this.currentThumbnailIndex = 0;
      this.delay = 1000 / this.options.scrollingFrequency;
      this.destructionChain = new Chain();
      this.dimensions;
      this.lastMouseMoveEvent;
      this.limit;
      this.listElement;
      this.scrollingTimer;
      this.thumbnails = new ArrayList();
      this.thumbnailsConstructionChain = new Chain();
      this.thumbnailImageUris = thumbnailImageUris;
      this.tween;
      this.updateChain = new Chain();
      this.wrapperElement;
      
      this.increaseConstructionTimeOut();
   },
   
   //Public accessor and mutator methods
   construct : function(){
      this.startTimeOutTimer( 'construct' );
      this.compileConstructionChain();
      
      try{ this.constructionChain.callChain(); }
      catch( exception ){ this.revertConstruction( exception ); }      
   },

   destroy : function(){
      this.compileDestructionChain();
      this.destructionChain.callChain();
   },
   
   update : function( slideIndex ){
      this.currentThumbnailIndex = slideIndex;
      this.updateThumbnails();
      this.scrollToCurrent();
   },
   
   //Properties
   getElement : function(){ return this.wrapperElement; },
   getElementClass : function(){ return this.options.slideShowClass + "-" + this.options.thumbnailsClass; },
   getListElement : function(){ return this.listElement; },
   getSlideThumbnails : function(){ return this.thumbnails; },
   
   //Protected, private helper methods
   addEvents : function(){
      document.addEvents({
         'mousemove' : this.onMouseMove
      });
      
      this.constructionChain.callChain();
   }.protect(),
   
   calculateLimit : function(){
      var length = this.dimensions[2];
      var width = this.dimensions[4];
      var lineItemElementCoordinates = this.wrapperElement.getElement( 'li:nth-child(' + 1 + ')' ).getCoordinates();
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      var units = wrapperElementCoordinates[width] >= lineItemElementCoordinates[width] ? Math.floor( wrapperElementCoordinates[width] / lineItemElementCoordinates[width] ) : 1;
      var x = Math.ceil( this.thumbnailImageUris.length / units );
      var len = x * lineItemElementCoordinates[length];
      this.listElement.setStyle( length, len );
      //this.listElement.getElements( 'li' ).setStyles({ 'height' : lineItemElementCoordinates.height, 'width' : lineItemElementCoordinates.width });
      
      this.limit = wrapperElementCoordinates[length] - len;
      this.constructionChain.callChain();
   }.protect(),
   
   compileConstructionChain : function(){
      this.constructionChain.chain( 
         this.createWrapperElement, 
         this.createListElement, 
         this.createThumbnailElements,
         this.determineDimensions,
         this.calculateLimit,
         this.updateThumbnails,
         this.addEvents,
         this.finalizeConstruction
      );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyThumnailElements, this.destroyListElement, this.destroyWrapperElement, this.finalizeDestruction );
   }.protect(),
   
   createListElement : function(){
      this.listElement = new Element( 'ul', { 'role' : 'menu', 'styles' : { 'left' : 0, 'position' : 'absolute', 'top' : 0 }});
      this.listElement.inject( this.wrapperElement );
      this.constructionChain.callChain();
   }.protect(),
   
   createThumbnailElements : function(){
      this.thumbnailImageUris.each( function( thumbnailUri, index ) {
         this.thumbnailsConstructionChain.chain(
            function(){
               var slideThumbnail = new MediaPlayerThumbnail( this.listElement, thumbnailUri, index, {
                  dimensions : this.dimensions,
                  fastTransformation : this.options.fastTransformation,
                  onConstructed : this.onThumbnailConstructed,
                  onSelected : this.onThumbnailSelected, 
                  onUpdated : this.onThumbnailUpdated 
               });
               slideThumbnail.construct();
               this.thumbnails.add( slideThumbnail );
            }.bind( this )
         );
      }, this );
      
      this.thumbnailsConstructionChain.chain(
         function(){
            this.thumbnailsConstructionChain.clearChain();
            this.constructionChain.callChain(); 
         }.bind( this )
      ).callChain();
   }.protect(),
   
   createWrapperElement : function(){
      this.wrapperElement = new Element( 'div', { 'class' : this.getElementClass() });
      this.wrapperElement.set({ 'role' : 'menubar', 'styles' : { 'overflow' : 'hidden' }});
      this.wrapperElement.inject( this.containerElement );
      
      this.constructionChain.callChain();
   }.protect(),
   
   destroyListElement : function(){
      if( this.listElement && this.listElement.destroy ) this.listElement.destroy();
      this.destructionChain.callChain();
   }.protect(),

   destroyThumnailElements : function(){
      this.thumbnails.each( function( slideThumbnail, index ){
         slideThumbnail.destroy();
      }.bind( this ));
      this.destructionChain.callChain();
   }.protect(),
   
   destroyWrapperElement : function(){
      if( this.wrapperElement ){
         if( this.wrapperElement.removeEvents ) this.wrapperElement.removeEvents();
         if( this.wrapperElement.destroy ) this.wrapperElement.destroy();
      }
      this.destructionChain.callChain();
   }.protect(),
   
   determineDimensions : function(){
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      if( !this.options.scroll )
         this.options.scroll = (wrapperElementCoordinates.height > wrapperElementCoordinates.width) ? 'y' : 'x';
      this.dimensions = ( this.options.scroll == 'y' ) ? 'top bottom height y width'.split( ' ' ) : 'left right width x height'.split( ' ' );
      this.constructionChain.callChain();
   }.protect(),
   
   finalizeConstruction : function(){
      this.stopTimeOutTimer();
      this.constructionChain.clearChain();
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );
   }.protect(),
   
   finalizeDestruction : function(){
      this.destructionChain.clearChain();
      this.fireEvent( 'destroyed', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   increaseConstructionTimeOut: function(){
      this.options.delay = 400;
   }.protect(),
   
   mouseIsWithinThumbnailsArea : function( mouseMoveEvent ){
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      return mouseMoveEvent.page.x > wrapperElementCoordinates.left && 
             mouseMoveEvent.page.x < wrapperElementCoordinates.right && 
             mouseMoveEvent.page.y > wrapperElementCoordinates.top && 
             mouseMoveEvent.page.y < wrapperElementCoordinates.bottom; 
   }.protect(),
   
   onMouseMove : function( mouseMoveEvent ) {
      this.lastMouseMoveEvent = mouseMoveEvent;
      if( this.mouseIsWithinThumbnailsArea( mouseMoveEvent )) {
         if( !this.scrollingTimer ) {
            this.scrollingTimer = this.scroll.periodical( this.options.scrollingFrequency / this.options.tweenProperties.fps );
         }
      }else {
         clearTimeout( this.scrollingTimer );
         this.scrollingTimer = null;
      }
   },

   onUpdateComplete : function(){
      this.fireEvent( 'updated', this );
   },
   
   onThumbnailConstructed: function( thumbnail ){
      this.thumbnailsConstructionChain.callChain();
   },
   
   onThumbnailSelected : function( thumbnail ){
      this.fireEvent( 'mediaPosition', thumbnail.getIndex() );
   },
   
   onThumbnailUpdated : function( thumbnail ){
      this.updateChain.callChain();
   },
   
   revertConstruction : function( error ){
      this.error =  error;
      this.stopTimeOutTimer();
      this.fireEvent( 'constructionError', this, this.error );
   }.protect(),

   scroll : function() {
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      var listElementPosition = this.listElement.getPosition();
      var axis = this.dimensions[3];
      var delta = null;
      var pos = this.dimensions[0];
      var size = this.dimensions[2];
      var value;
      
      var area = wrapperElementCoordinates[this.dimensions[2]] / 3;
      var page = this.lastMouseMoveEvent.page;
      var velocity = -(this.delay * 0.01 );
      if( page[axis] < ( wrapperElementCoordinates[pos] + area ))
         delta = ( page[axis] - wrapperElementCoordinates[pos] - area ) * velocity;
      else if( page[axis] > (wrapperElementCoordinates[pos] + wrapperElementCoordinates[size] - area ))
         delta = ( page[axis] - wrapperElementCoordinates[pos] - wrapperElementCoordinates[size] + area ) * velocity;
      if( delta ) {
         value = ( listElementPosition[axis] - wrapperElementCoordinates[pos] + delta ).limit( this.limit, 0 );
         this.tween = new Fx.Tween( this.listElement, Object.merge( this.options.tweenProperties, { 'property' : pos }));
         this.tween.set( value );
      }
   },
   
   scrollToCurrent : function(){
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      var listElementPosition = this.listElement.getPosition();
      var axis = this.dimensions[3];
      var delta = null;
      var pos = this.dimensions[0];
      var size = this.dimensions[2];
      var value;
      
      var thumbnailCoordinates = this.thumbnails.get( this.currentThumbnailIndex ).getCoordinates();
      delta = wrapperElementCoordinates[pos] + (wrapperElementCoordinates[size] / 2) - (thumbnailCoordinates[size] / 2) - thumbnailCoordinates[pos];
      value = (listElementPosition[axis] - wrapperElementCoordinates[pos] + delta).limit( this.limit, 0 );
      this.tween = new Fx.Tween( this.listElement, Object.merge( this.options.tweenProperties, { 'property' : pos, onComplete : this.onUpdateComplete }));
      if( this.options.fastTransformation ) this.tween.set( value );
      else this.tween.start( value );
   }.protect(),

   timeOut : function( exception ){
      this.revertConstruction( exception );
   }.protect(),
   
   updateThumbnails : function(){
      var delay = Math.max( 1000 / this.thumbnails.length, 100 );
      
      this.thumbnails.each(function( thumbnail, index ){
         this.updateChain.chain(
            function(){
               var isCurrent = this.currentThumbnailIndex == index;
               thumbnail.update.delay( delay, this, isCurrent );
            }.bind( this )
         );
      }.bind( this ));
      
      this.updateChain.chain(
         function(){
            this.updateChain.clearChain();
            this.constructionChain.callChain(); 
         }.bind( this )
      ).callChain();
   }.protect(),
   
});