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
   Binds: ['createScreenElement', 'destroyScreenElement', 'finalizeConstruction', 'finalizeDestruction', 'onImageLoaded'],
   
   options : {
      eventDeliveryDelay : 5,
      height: 300,
      resize : 'fill',
      screenClass: 'images',
      slideShowClass: 'slideshow',
      width: 450
   },

   //Constructor
   initialize: function( containerElement, options ){
      this.setOptions( options );
      this.assertThat( containerElement, not( nil() ), "Screen.containerElement" );

      this.anchorElement;
      this.constructionChain = new Chain();
      this.containerElement = containerElement;
      this.destructionChain = new Chain();
      this.height;
      this.imageElement;
      this.screenElement;
      this.width;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.compileConstructionChain();
      
      try{ this.constructionChain.callChain(); }
      catch( exception ){ this.revertConstruction( exception ); }
   },
   
   coordinateIsWithinScreen : function( coordinate ){
      var screenCoordinates = this.screenElement.getCoordinates();
      return ( coordinate.x > screenCoordinates.left && coordinate.x < screenCoordinates.right && coordinate.y > screenCoordinates.top && coordinate.y < screenCoordinates.bottom );
   },
   
   destroy: function(){
      this.compileDestructionChain();
      this.destructionChain.callChain();
   },
   
   update: function( imageUri ){
      if( this.imageElement ) this.imageElement.destroy();
      this.createImageElement( imageUri );
   },
   
   //Properties
   getElement : function(){ return this.screenElement; },
   getElementClass : function(){ return this.options.slideShowClass + "-" + this.options.screenClass; },
   isConstructed : function(){ return !(typeof this.screenElement == 'undefined');},
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.createScreenElement, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyScreenElement, this.finalizeDestruction );
   }.protect(),
   
   createImageElement : function( imageUri ){
      this.imageElement = new Asset.image( imageUri, {
         'onload' : this.onImageLoaded
      });
   }.protect(),
   
   createScreenElement : function(){
      this.screenElement = new Element( 'div', { 'class' : this.getElementClass() });
      this.screenElement.inject( this.containerElement );
      
      this.height = this.options.height || this.screenElement.getSize().y;
      this.width = this.options.width || this.screenElement.getSize().x;
      this.screenElement.setStyles({ 'height' : this.height, 'width' : this.width });
      
      this.anchorElement = new Element( 'a' );
      this.anchorElement.inject( this.screenElement );
      
      this.constructionChain.callChain();
   }.protect(),
   
   destroyImageElements : function(){
      if( this.imageElement && this.imageElement.destroy ){ this.imageElement.destroy(); }
      if( this.anchorElement && this.anchorElement.destroy ){ this.anchorElement.destroy(); }
      this.anchorElement = null;
      this.imageElement = null;
   }.protect(),
   
   destroyScreenElement : function(){
      if( this.screenElement && this.screenElement ) this.screenElement.destroy();
      this.screenElement = null;
      this.destructionChain.callChain();
   }.protect(),
   
   finalizeConstruction : function(){
      this.constructionChain.clearChain();
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   finalizeDestruction : function(){
      this.destructionChain.clearChain();
      this.fireEvent( 'destroyed', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   finalizeUpdate : function(){
      this.fireEvent( 'updated', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   onImageLoaded : function(){
      this.imageElement.inject( this.anchorElement );
      this.resizeImage( this.imageElement );
      this.finalizeUpdate();
   },
   
   resizeImage : function(img) {
      var h = img.get( 'height' ).toFloat(), w = img.get( 'width' ).toFloat(), dh = this.height / h, dw = this.width / w;
      if( this.options.resize == 'fit') dh = dw = dh > dw ? dw : dh;
      if( this.options.resize == 'fill') dh = dw = dh > dw ? dh : dw;
      img.set( 'styles', { 'height' : Math.ceil( h * dh ), 'width' : Math.ceil( w * dw ) });
   }.protect()
   
});
