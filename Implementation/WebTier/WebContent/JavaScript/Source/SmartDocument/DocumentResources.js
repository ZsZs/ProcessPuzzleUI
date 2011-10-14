/*
Name: DocumentResources

Description: Represents a collection of DocumentResorce objects and provides common handling methods like load unLoad.

Requires:

Provides:
    - DocumentResources

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

var DocumentResources = new Class({
   Implements: Options,
   Binds: ['onResourcesLoadReady'],   

   options: {
      documentImagesSelector: "//images/image",
      documentScriptsSelector: "//javascripts/javascript",
      documentStyleSheetsSelector: "//styleSheets/styleSheet",
      type : null
   },
   
   //Constructor
   initialize: function( documentDefinition ){
      this.documentDefinition = documentDefinition;
      this.resourceUri = null;
      this.resourceChain = new Chain();
      this.resources = new ArrayList();
      this.styleSheets = new ArrayList();
   },
   
   //Public mutators and accessor methods
   load: function(){
      this.resources.each( function( documentResource, index ){
         documentResource.setResourceChain( this.resourceChain );
      }, this );
      
      this.resourceChain.callChain();
   },
   
   onResourcesLoadReady: function(){
      this.resourceChain.callChain();      
   },
   
   release: function(){
      this.resources.each( function( documentResource, index ){
         documentResource.release();
      }, this );
      
      this.styleSheets.clear();
      this.resources.clear();
      this.resourceChain.clearChain();
   },
   
   unmarshall: function(){
      this.unmarshallResources();
      this.configureResourceChain();      
   },

   //Properties
   getResourceChain: function() { return this.resourceChain; },
   getResources: function() { return this.resources; },
   getResourceType: function() { return this.options.type; },
   getResourceUri: function() { return resourceUri; },
   getStyleSheets: function() { return this.styleSheets; },
   
   //Protected, private helper methods
   configureResourceChain: function() {
      this.resources.each( function( documentResource, index ){
         this.resourceChain.chain( documentResource.load );
      }, this );
      this.resourceChain.chain( this.onResourcesLoadReady );
   }.protect(),
      
   unmarshallResource: function( selector, resourceClass ) {
      var resourceElements = this.documentDefinition.selectNodes( selector );
      resourceElements.each( function( resourceElement, index ){
         var documentResource = new resourceClass( resourceElement );
         documentResource.unmarshall();
         this.resources.add( documentResource );
         if( instanceOf( documentResource, DocumentStyleSheet )) this.styleSheets.add( documentResource );
      }, this );
   }.protect(),
   
   unmarshallResources: function() {
      this.unmarshallResource( this.options.documentScriptsSelector, DocumentScript );
      this.unmarshallResource( this.options.documentStyleSheetsSelector, DocumentStyleSheet );
      this.unmarshallResource( this.options.documentImagesSelector, DocumentImage );
   }.protect()
});