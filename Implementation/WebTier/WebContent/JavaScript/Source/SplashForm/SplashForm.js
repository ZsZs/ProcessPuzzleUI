/*
Name: 
    - SplashForm

Description: 
    - Shows an image animates the progress, while desktop load (or other long running task) finishes. 

Requires:

Provides:
    - SplashForm

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

var SplashForm = new Class({
   Implements: [Events, Options],
   Binds: ['constructForm', 'finalizeConstruction', 'onImageLoaded', 'onImageLoadError', 'preloadImage'],
   options : {
      componentName : "SplashForm",
      containerElementId : "splashForm",
      imageId : "splashFormImage",
      imageTitle : "Splashform Image",
      imageUri : "Desktops/Images/SplashForm.png"
   },

   // Constructor
   initialize : function( options ) {
      this.setOptions( options );

      this.constructionChain = new Chain();
      this.containerElement = $( this.options.containerElementId );
      this.imageElement;
      this.splashFormElement;
   },

   // public accessor and mutator methods
   construct : function() {
      this.constructionChain.chain( this.preloadImage, this.constructForm, this.finalizeConstruction );
      this.constructionChain.callChain();
   },

   destroy : function() {
      this.destroyElement( this.imageElement );
      this.destroyElement( this.splashFormElement );
   },
   
   onImageLoaded : function(){
      this.constructionChain.callChain();
   },
   
   onImageLoadError : function( error ){
      this.error = error;
      this.fireEvent( 'error', error );
      this.destroy();
   },

   // Properties
   getContainerElement : function() { return this.containerElement; },
   getImageElement : function() { return this.imageElement; },
   getSplashFormElement : function() { return this.splashFormElement; },
   
   // private methods
   constructForm : function() {
      
      this.splashFormElement = new Element( 'div', {
         id : 'splashForm',
         styles : {
            left : '50%',
            position : 'absolute',
            visibility : 'hidden',
            top : '50%',
            zIndex : '999'
         }
      });
      
      this.containerElement.grab( this.splashFormElement, 'top' );
      this.splashFormElement.grab( this.imageElement );

      this.splashFormElement.setStyle( 'margin-left', -(this.splashFormElement.getStyle( 'width' ).toInt() / 2) );
      this.splashFormElement.setStyle( 'margin-top', -(this.splashFormElement.getStyle( 'height' ).toInt() / 2) );
      this.splashFormElement.setStyle( 'visibility', 'visible' );
      
      this.constructionChain.callChain();
   }.protect(),
   
   destroyElement : function( element ){
      if( element ){
         if( element.removeEvents ) element.removeEvents();
         if( element.destroy ) element.destroy();
      }
   }.protect(),
   
   finalizeConstruction : function(){
      this.constructionChain.clearChain();
      this.fireEvent( 'constructed', this );
   }.protect(),

   preloadImage : function() {
      this.imageElement = Asset.image( this.options.imageUri, { 
         id: this.options.imageId, 
         title: this.options.imageTitle,
         onAbort: function(){ this.onImageLoadError(); }.bind( this ),
         onError: function(){ this.onImageLoadError(); }.bind( this ),
         onLoad: function(){ this.onImageLoaded(); }.bind( this )
      });
   }.protect()
});
