/*
Name: 
    - MediaPlayerScreen

Description: 
    - Represents the display area of the Media Player. 

Requires:
   - 

Provides:
   - MediaPlayerScreen

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

var MediaPlayerScreen = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds: [],
   
   options : {
      eventDeliveryDelay : 5,
      height: 300,
      screenClass: 'images',
      slideShowClass: 'slideshow',
      width: 450
   },

   //Constructor
   initialize: function( containerElement, options ){
      this.setOptions( options );
      this.assertThat( containerElement, not( nil() ), "Screen.containerElement" );
      
      this.containerElement = containerElement;
      this.height;
      this.screenElement;
      this.width;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.createScreenElement();
      this.finalizeConstruction();
   },
   
   coordinateIsWithinScreen : function( coordinate ){
      var screenCoordinates = this.screenElement.getCoordinates();
      return ( coordinate.x > screenCoordinates.left && coordinate.x < screenCoordinates.right && coordinate.y > screenCoordinates.top && coordinate.y < screenCoordinates.bottom );
   },
   
   destroy: function(){
      //this.destroySlides();
      this.destroyScreenElement();
   },
   
   //Properties
   getCurrentSlide : function(){ return this.currentSlide; },
   getElement : function(){ return this.screenElement; },
   getElementClass : function(){ return this.options.slideShowClass + "-" + this.options.screenClass; },
   getNextSlide : function(){ return this.nextSlide; },
   
   //Protected, private helper methods
   createScreenElement : function(){
      this.screenElement = new Element( 'div', { 'class' : this.getElementClass() });
      this.screenElement.inject( this.containerElement );
      
      this.height = this.options.height || this.screenElement.getSize().y;
      this.width = this.options.width || this.screenElement.getSize().x;
      this.screenElement.setStyles({ 'height' : this.height, 'width' : this.width });
   }.protect(),
   
   destroyScreenElement : function(){
      if( this.screenElement ) this.screenElement.destroy();
   }.protect(),
   
   destroySlides : function(){
      if( this.currentSlide ) this.currentSlide.destroy();
      if( this.nextSlide ) this.nextSlide.destroy();
   }.protect(),
   
   finalizeConstruction : function(){
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );      
   }.protect()
   
});
