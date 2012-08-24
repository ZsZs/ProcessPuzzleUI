/*
Name: 
    - BusyElement

Description: 
    - Displays a spinner to indicate a process in progress. 

Requires:

Provides:
    - SlideshowControllerButton

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

var BusyElement = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds: ['animate', 'createElements', 'finalizeConstruction', 'loadBackgroundImage', 'onImageLoaded'],
   
   options : {
      animationFrequency : 1000,
      elementClass : 'spinner',
      hiddenClass : "hidden",
      imageUri : null,
      morphProperties : { duration: 500, fps: 20, link: 'cancel', transition: Fx.Transitions.Sine.easeInOut, unit: false },
      visibleClass : "visible"
   },

   //Constructor
   initialize: function( containerElement, options ){
      this.assertThat( containerElement, not( nil() ), "BusyElement.containerElement" );
      this.setOptions( options );
      
      this.animationTimer;
      this.backgroundImageElement;
      this.backgroundSlideDirection;
      this.backgroundSlideValue;
      this.busyElement;
      this.constructionChain = new Chain();
      this.containerElement = containerElement;
      this.currentFrame = 0;
      this.morph;
      this.numberOfFrames;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.constructionChain.chain(
         this.createElements,
         this.loadBackgroundImage,
         this.finalizeConstruction
      );
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      if( this.animationTimer ) clearInterval( this.animationTimer );
      this.destroyElements();
      this.fireEvent( 'destroyed', this, 5 );
   },
   
   hide : function() {
      if( this.busyElement.get( 'aria-hidden' ) == 'false') {
         this.busyElement.set( 'aria-hidden', true );
         this.morph = new Fx.Morph( this.busyElement, this.options.morphProperties );
         this.morph.start( "." + this.getHiddenClass() );
         
         if( this.animationTimer ) clearInterval( this.animationTimer );
      }
   },
   
   show : function() {
      if( this.busyElement.get( 'aria-hidden' ) == 'true' ) {
         this.busyElement.set( 'aria-hidden', false );
         this.morph = new Fx.Morph( this.busyElement, this.options.morphProperties );
         this.morph.start( "." + this.getVisibleClass() );
      }
      
      this.animationTimer = this.animate.periodical( this.options.animationFrequency, this );
   },
   
   //Properties
   getBackgroundImageElement : function(){ return this.backgroundImageElement; },
   getElement : function(){ return this.busyElement; },
   getElementClass : function(){ return this.options.elementClass; },
   getHiddenClass : function(){ return this.getElementClass() + "-" + this.options.hiddenClass; },
   getVisibleClass : function(){ return this.getElementClass() + "-" + this.options.visibleClass; },
   
   //Protected, private helper methods
   animate : function() {
      var currenShift = ( this.currentFrame * this.backgroundSlideValue ) + 'px';
      
      switch( this.backgroundSlideDirection ){
      case BusyElement.BackgroundSlideDirections.horizontal:
         this.busyElement.setStyle( 'backgroundPosition', currenShift + ' 0px' ); break;
      case BusyElement.BackgroundSlideDirections.vertical:
         this.busyElement.setStyle( 'backgroundPosition', '0px ' + currenShift ); break;
      }
      
      this.currentFrame = this.currentFrame < this.numberOfFrames ? this.currentFrame +1 : 0;
   },
   
   createElements : function(){
      this.busyElement = new Element( 'div', {
         'aria-hidden' : false,
         'class' : this.options.elementClass,
         'morph' : this.options,
         'role' : 'progressbar'
      });
      
      if( this.options.imageUri ) this.busyElement.setStyle( 'background', 'url(' + this.options.imageUri + ')' );
      
      this.busyElement.inject( this.containerElement );
      this.constructionChain.callChain();
   }.protect(),
   
   destroyElements : function(){
      if( this.busyElement ) this.busyElement.destroy();
      this.busyElement = null;
   }.protect(),
   
   determineAnimationProperties : function(){
      if( this.backgroundImageElement.get( 'width' ) > this.backgroundImageElement.get( 'height' ) ){
         this.backgroundSlideDirection = BusyElement.BackgroundSlideDirections.horizontal;
         this.backgroundSlideValue = this.busyElement.getSize().x;
         this.numberOfFrames = ( this.backgroundImageElement.get( 'width' ) / this.backgroundSlideValue ).toInt();
      }
      else{
         this.backgroundSlideDirection = BusyElement.BackgroundSlideDirections.vertical;
         this.backgroundSlideValue = this.busyElement.getSize().y;
         this.numberOfFrames = ( this.backgroundImageElement.get( 'height' ) / this.backgroundSlideValue ).toInt();
      }
   }.protect(),
   
   determineImageUriFromElementStyle : function(){
      this.options.imageUri = this.busyElement.getStyle( 'backgroundImage' ).replace( /url\(['"]?(.*?)['"]?\)/, '$1' ).trim();
   }.protect(),
   
   finalizeConstruction : function(){
      this.constructionChain.clearChain();
      this.fireEvent( 'constructed', this, 5 );
   }.protect(),

   loadBackgroundImage : function(){
      if( !this.options.imageUri ) this.determineImageUriFromElementStyle();
      
      this.backgroundImageElement = new Asset.image( this.options.imageUri, { 'onload' : this.onImageLoaded  });
   }.protect(),
   
   onImageLoaded : function(){
      this.determineAnimationProperties();
      this.constructionChain.callChain();
   }

});

BusyElement.BackgroundSlideDirections = { vertical : 'vertical', horizontal : 'horizontal' };