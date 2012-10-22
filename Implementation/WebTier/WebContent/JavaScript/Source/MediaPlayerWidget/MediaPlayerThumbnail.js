/*
Name: 
    - MediaPlayerThumbnail

Description: 
    - Represents a thumbnail, displayed in the thumbnails bar. 

Requires:
   - 

Provides:
    - MediaPlayerThumbnail

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

var MediaPlayerThumbnail = new Class( {
   Implements : [AssertionBehavior, Events, Options],
   Binds : ['onImageLoaded', 'onSelection'],
   options : {
      componentName : 'MediaPlayerThumbnail',
      hiddenClass : "hidden",
      morphProperties : { duration: 500, fps : 50, link: 'cancel', transition: Fx.Transitions.Sine.easeInOut, unit: false },
      slideShowClass : "slideshow",
      thumbnailsClass : "thumbnails",
      title : null,
      visibleClass : "visible"
   },

   initialize : function( containerElement, thumbnailUri, index, options ) {
      this.setOptions( options );
      this.assertThat( containerElement, not( nil()), this.options.componentName + ".containerElement" );
      this.assertThat( thumbnailUri, not( nil()), this.options.componentName + ".thumbnailUri" );
      this.assertThat( index, not( nil()), "SlidesThumbnails.index" );
      
      this.anchorElement;
      this.containerElement = containerElement;
      this.id = "Slideshow-" + Date.now() + index;
      this.imageElement;
      this.index = index;
      this.listItemElement;
      this.thumbnailUri = thumbnailUri;
   },
   
   //Public accessor and mutator methods
   construct : function(){
      this.createListItemElement();
      this.createAnchorElement();
      this.createImageElement();
   },

   destroy : function(){
      this.destroyImageElement();
      this.destroyAnchorElement();
      this.destroyListItemElement();
   },
   
   //Properties
   getElement : function(){ return this.listItemElement; },
   getElementClass : function(){ return this.options.slideShowClass + "-" + this.options.thumbnailsClass; },
   getHiddenClass : function(){ return this.getElementClass() + "-" + this.options.hiddenClass; },
   getId : function(){ return this.id; },
   getVisibleClass : function(){ return this.getElementClass() + "-" + this.options.visibleClass; },
   
   //Protected, private helper methods
   createListItemElement : function(){
      this.listItemElement = new Element( 'li', { 'id' : this.id });
      this.listItemElement.inject( this.containerElement );
   }.protect(),
   
   createAnchorElement : function( thumbnailUri, index ){
      this.anchorElement = new Element( 'a', {
         'class' : this.getHiddenClass(),
         'href' : this.thumbnailUri,
         'role' : 'menuitem',
         'tabindex' : index
      });
      
      if( this.options.title ) this.anchorElement.set( 'title', this.options.title );
      this.anchorElement.inject( this.listItemElement );
      
      this.anchorElement.addEvent( 'click', this.onSelection );
   }.protect(),
   
   createImageElement : function(){
      this.imageElement = new Asset.image( this.thumbnailUri, {
         'onload' : this.onImageLoaded
      });
   }.protect(),
   
   destroyAnchorElement : function(){
      if( this.anchorElement ){
         this.anchorElement.removeEvents();
         this.anchorElement.destroy();
      }
   }.protect(),

   destroyListItemElement : function(){
      if( this.listItemElement ) this.listItemElement.destroy();
   }.protect(),
   
   destroyImageElement : function(){
      if( this.imageElement ) this.imageElement.destroy();
   }.protect(),
   
   onImageLoaded : function(){
      this.imageElement.inject( this.anchorElement );
   },

   onSelection : function( clickEvent ) {
      this.fireEvent( 'selected', this );
      return false;
   }
});