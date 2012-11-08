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
      'calculateLimit',
      'checkTimeOut',
      'createListElement', 
      'createThumbnailElements',
      'createWrapperElement', 
      'determineDimensions',
      'finalizeConstruction',
      'onMouseMove', 
      'onThumbnailConstructed',
      'onThumbnailSelected', 
      'scroll',
      'showThumbnails'],
   options : {
      columns : null,
      componentName : 'MediaPlayerThumbnailsBar',
      dimensions : [],
      eventDeliveryDelay : 5,
      morphProperties : { duration: 500, fps : 50, link: 'cancel', transition: Fx.Transitions.Sine.easeInOut, unit: false },
      position : null,
      rows : null,
      scroll : null,
      scrollingFrequency : 1000,
      slideShowClass : "slideshow",
      thumbnailsClass : "thumbnails"
   },

   initialize : function( containerElement, thumbnailImageUris, options ) {
      this.setOptions( options );
      this.assertThat( containerElement, not( nil()), this.options.componentName + ".containerElement" );
      this.assertThat( thumbnailImageUris, not( nil()), this.options.componentName + ".thumbnailImageUris" );
      
      this.constructionChain = new Chain();
      this.containerElement = containerElement;
      this.currentThumbnailIndex = 0;
      this.delay = 1000 / this.options.scrollingFrequency;
      this.dimensions;
      this.lastMouseMoveEvent;
      this.limit;
      this.listElement;
      this.scrollingTimer;
      this.thumbnails = new ArrayList();
      this.thumbnailsConstructionChain = new Chain();
      this.thumbnailImageUris = thumbnailImageUris;
      this.wrapperElement;
   },
   
   //Public accessor and mutator methods
   construct : function(){
      this.startTimeOutTimer( 'construct' );
      this.compileConstructionChain();
      
      try{ this.constructionChain.callChain(); }
      catch( exception ){ this.revertConstruction( exception ); }      
   },

   destroy : function(){
      this.destroyThumnailElements();
      this.destroyListElement();
      this.destroyWrapperElement();
   },
   
   //Properties
   getElement : function(){ return this.wrapperElement; },
   getElementClass : function(){ return this.options.slideShowClass + "-" + this.options.thumbnailsClass; },
   getListElement : function(){ return this.listElement; },
   getSlideThumbnails : function(){ return this.thumbnails; },
   
   //Protected, private helper methods
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
         this.showThumbnails,
         this.finalizeConstruction
      );
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
                  onSelected : this.onThumbnailSelected 
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
      
      this.wrapperElement.addEvent( 'mousemove', this.onMouseMove );
      this.constructionChain.callChain();
   }.protect(),
   
   destroyListElement : function(){
      if( this.listElement ) this.listElement.destroy();
   }.protect(),

   destroyThumnailElements : function(){
      this.thumbnails.each( function( slideThumbnail, index ){
         slideThumbnail.destroy();
      }.bind( this ));
   }.protect(),
   
   destroyWrapperElement : function(){
      if( this.wrapperElement ){
         this.wrapperElement.removeEvents();
         this.wrapperElement.destroy();
      }
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
            this.scrollingTimer = this.scroll.periodical( this.options.scrollingFrequency );
         }
      }else {
         clearTimeout( this.scrollingTimer );
         this.scrollingTimer = null;
      }
   },

   onThumbnailConstructed: function( thumbnail ){
      this.thumbnailsConstructionChain.callChain();
   },
   
   onThumbnailSelected : function( thumbnail ){
   },
   
   revertConstruction : function( error ){
      this.error =  error;
      this.stopTimeOutTimer();
      this.fireEvent( 'constructionError', this.error );
   }.protect(),

   scroll : function( n, fast ) {
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      var listElementPosition = this.listElement.getPosition();
      var axis = this.dimensions[3];
      var delta = null;
      var pos = this.dimensions[0];
      var size = this.dimensions[2];
      var value;
      var tween = this.getElement( 'ul' ).set( 'tween', { 'property' : pos }).get( 'tween' );
      
      if( n != undefined ) {
         var uid = this.retrieve( 'uid' );
         var li = document.id( uid + n ).getCoordinates();
         delta = wrapperElementCoordinates[pos] + (wrapperElementCoordinates[size] / 2) - (li[size] / 2) - li[pos];
         value = (listElementPosition[axis] - wrapperElementCoordinates[pos] + delta).limit( this.limit, 0 );
         tween[fast ? 'set' : 'start']( value );
      }else {
         var area = wrapperElementCoordinates[this.dimensions[2]] / 3;
         var page = this.lastMouseMoveEvent.page;
         var velocity = -(this.delay * 0.01 );
         if( page[axis] < ( wrapperElementCoordinates[pos] + area ))
            delta = ( page[axis] - wrapperElementCoordinates[pos] - area ) * velocity;
         else if( page[axis] > (wrapperElementCoordinates[pos] + wrapperElementCoordinates[size] - area ))
            delta = ( page[axis] - wrapperElementCoordinates[pos] - wrapperElementCoordinates[size] + area ) * velocity;
         if( delta ) {
            value = ( listElementPosition[axis] - wrapperElementCoordinates[pos] + delta ).limit( this.limit, 0 );
            tween.set( value );
         }
      }
   },
   
   showThumbnails : function(){
      var delay = Math.max( 1000 / this.thumbnails.length, 100 );
      this.thumbnails.each(function( thumbnail, index ){
         var isCurrent = this.currentThumbnailIndex == index;
         thumbnail.show.delay( delay, this, isCurrent );
      }.bind( this ));
      this.constructionChain.callChain();
   }.protect(),

   update : function(fast) {
      var thumbnails = this.thumbnails;
      //var uid = thumbnails.retrieve( 'uid' );
      thumbnails.getElements( 'a' ).each( function(a, i) {
         if (a.retrieve( 'loaded' )) {
            if (a.retrieve( 'uid' ) == this._slide) {
               if (!a.retrieve( 'active', false )) {
                  a.store( 'active', true );
                  var active = this.classes.get( 'thumbnails', 'active' );
                  if (fast)
                     a.get( 'morph' ).set( active );
                  else
                     a.morph( active );
               }
            } else {
               if (a.retrieve( 'active', true )) {
                  a.store( 'active', false );
                  var inactive = this.classes.get( 'thumbnails', 'inactive' );
                  if (fast)
                     a.get( 'morph' ).set( inactive );
                  else
                     a.morph( inactive );
               }
            }
         }
      }, this );

      if (!thumbnails.retrieve( 'mouseover' ))
         thumbnails.fireEvent( 'scroll', [ this._slide, fast ] );
   },
   
   timeOut : function( exception ){
      this.revertConstruction( exception );
   }.protect()
   
});