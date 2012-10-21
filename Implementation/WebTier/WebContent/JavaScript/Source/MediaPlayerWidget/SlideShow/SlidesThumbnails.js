/*
Name: 
    - SlidesThumbnails

Description: 
    - Displays the list of slide's thumbnails. 

Requires:
   - 

Provides:
    - SlidesThumbnails

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

var SlidesThumbnails = new Class( {
   Implements : [AssertionBehavior, Events, Options],
   Binds : ['onMouseMove', 'onThumbnailSelected'],
   options : {
      columns : null,
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
      this.assertThat( containerElement, not( nil()), "SlidesThumbnails.containerElement" );
      this.assertThat( thumbnailImageUris, not( nil()), "SlidesThumbnails.thumbnailImageUris" );
      
      this.containerElement = containerElement;
      this.listElement;
      this.scrollingTimer;
      this.slideThumbnails = new ArrayList();
      this.thumbnailImageUris = thumbnailImageUris;
      this.wrapperElement;
   },
   
   //Public accessor and mutator methods
   construct : function(){
      this.createWrapperElement();
      this.createListElement();
      this.createThumbnailElements();
      this.determineProperties();
      this.finalizeConstruction();
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
   getSlideThumbnails : function(){ return this.slideThumbnails; },
   
   //Protected, private helper methods
   createListElement : function(){
      this.listElement = new Element( 'ul', { 'role' : 'menu', 'styles' : { 'left' : 0, 'position' : 'absolute', 'top' : 0 }});
      this.listElement.inject( this.wrapperElement );
   }.protect(),
   
   createThumbnailElements : function(){
      this.thumbnailImageUris.each( function( thumbnailUri, index ) {
         var slideThumbnail = new SlideThumbnail( this.listElement, thumbnailUri, index, { onSelected : this.onThumbnailSelected });
         slideThumbnail.construct();
         this.slideThumbnails.add( slideThumbnail );
      }, this );
   }.protect(),
   
   createWrapperElement : function(){
      this.wrapperElement = new Element( 'div', { 'class' : this.getElementClass() });
      this.wrapperElement.set({ 'role' : 'menubar', 'styles' : { 'overflow' : 'hidden' }});
      this.wrapperElement.inject( this.containerElement );
      
      this.wrapperElement.addEvent( 'mousemove', this.onMouseMove );
   }.protect(),
   
   destroyListElement : function(){
      if( this.listElement ) this.listElement.destroy();
   }.protect(),

   destroyThumnailElements : function(){
      this.slideThumbnails.each( function( slideThumbnail, index ){
         slideThumbnail.destroy();
      }.bind( this ));
   }.protect(),
   
   destroyWrapperElement : function(){
      if( this.wrapperElement ){
         this.wrapperElement.removeEvents();
         this.wrapperElement.destroy();
      }
   }.protect(),
   
   determineProperties : function(){
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      if( !this.options.scroll )
         this.options.scroll = (wrapperElementCoordinates.height > wrapperElementCoordinates.width) ? 'y' : 'x';
      this.properties = ( this.options.scroll == 'y' ) ? 'top bottom height y width'.split( ' ' ) : 'left right width x height'.split( ' ' );
   }.protect(),
   
   finalizeConstruction : function(){
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   mouseIsWithinThumbnailsArea : function( mouseEvent ){
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      return mouseMoveEvent.page.x > wrapperElementCoordinates.left && 
             mouseMoveEvent.page.x < wrapperElementCoordinates.right && 
             mouseMoveEvent.page.y > wrapperElementCoordinates.top && 
             mouseMoveEvent.page.y < wrapperElementCoordinates.bottom; 
   }.protect(),
   
   onMouseMove : function( mouseMoveEvent ) {
      if( this.mouseIsWithinThumbnailsArea( mouseEvent )) {
         if( !this.scrollingTimer ) {
            this.scrollingTimer = this.scroll.periodical( this.options.scrollingFrequency );
         }
      }else {
         clearTimeout( this.scrollingTimer );
         this.scrollingTimer = null;
      }
   },

   onLoad : function(i) {
      var thumbnails = this.thumbnails;
      var a = thumbnails.getElements( 'a' )[i];
      if (a) {
         (function(a) {
            var visible = i == this.slide ? 'active' : 'inactive';
            if (a.store) {
               a.store( 'loaded', true );
               var morphProperty = a.get( 'morph' );
               morphProperty.set( this.classes.get( 'thumbnails', 'hidden' ) );
               morphProperty.start( this.classes.get( 'thumbnails', visible ) );

            }
         }).delay( Math.max( 1000 / this.data.thumbnails.length, 100 ), this, a );
      }

      if (thumbnails.retrieve( 'limit' ))
         return;

      var props = thumbnails.retrieve( 'props' ); // left right width x
      // height
      var options = this.options.thumbnails;
      //var pos = props ? props[1] : 'right';
      var length = props[2];
      var width = props[4];
      var li = thumbnails.getElement( 'li:nth-child(' + (i + 1) + ')' ).getCoordinates();

      if (options.columns || options.rows) {
         thumbnails.setStyles( {
            'height' : this.height,
            'width' : this.width
         } );
         if (options.columns.toInt())
            thumbnails.setStyle( 'width', li.width * options.columns.toInt() );
         if (options.rows.toInt())
            thumbnails.setStyle( 'height', li.height * options.rows.toInt() );
      }
      var div = thumbnails.getCoordinates();
      if (options.position) {
         if (options.position.test( /bottom|top/ )) {
            thumbnails.setStyles( {
               'bottom' : 'auto',
               'top' : 'auto'
            } ).setStyle( options.position, -div.height );
         }
         if (options.position.test( /left|right/ )) {
            thumbnails.setStyles( {
               'left' : 'auto',
               'right' : 'auto'
            } ).setStyle( options.position, -div.width );
         }
      }

      var units = div[width] >= li[width] ? Math.floor( div[width] / li[width] ) : 1;
      var x = Math.ceil( this.data.images.length / units );
      //var r = this.data.images.length % units;
      var len = x * li[length], ul = thumbnails.getElement( 'ul' ).setStyle( length, len );
      ul.getElements( 'li' ).setStyles( {
         'height' : li.height,
         'width' : li.width
      } );
      thumbnails.store( 'limit', div[length] - len );
   },
   
   onThumbnailSelected : function( thumbnail ){
      
   },

   scroll : function( n, fast ) {
      var wrapperElementCoordinates = this.wrapperElement.getCoordinates();
      var listElementPosition = this.listElement.getPosition();
      var axis = this.properties[3];
      var delta = null;
      var pos = this.properties[0];
      var size = this.properties[2];
      var value;
      var tween = this.getElement( 'ul' ).set( 'tween', { 'property' : pos }).get( 'tween' );
      
      if( n != undefined ) {
         var uid = this.retrieve( 'uid' );
         var li = document.id( uid + n ).getCoordinates();
         delta = wrapperElementCoordinates[pos] + (wrapperElementCoordinates[size] / 2) - (li[size] / 2) - li[pos];
         value = (listElementPosition[axis] - wrapperElementCoordinates[pos] + delta).limit( this.retrieve( 'limit' ), 0 );
         tween[fast ? 'set' : 'start']( value );
      }else {
         var area = wrapperElementCoordinates[this.properties[2]] / 3;
         var page = this.retrieve( 'page' );
         var velocity = -(this.retrieve( 'delay' ) * 0.01 );
         if( page[axis] < ( wrapperElementCoordinates[pos] + area ))
            delta = ( page[axis] - wrapperElementCoordinates[pos] - area ) * velocity;
         else if( page[axis] > (wrapperElementCoordinates[pos] + wrapperElementCoordinates[size] - area ))
            delta = ( page[axis] - wrapperElementCoordinates[pos] - wrapperElementCoordinates[size] + area ) * velocity;
         if( delta ) {
            value = ( listElementPosition[axis] - wrapperElementCoordinates[pos] + delta ).limit( this.retrieve( 'limit' ), 0 );
            tween.set( value );
         }
      }
   },

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
   }
});