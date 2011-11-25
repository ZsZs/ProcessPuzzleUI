/*
Name: ResourceManager

Description: Represents a collection of DocumentResorce objects and provides common handling methods like load unLoad.

Requires:

Provides:
    - ResourceManager

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

var ResourceManager = new Class({
   Implements: [Events, Options],
   Binds: ['onResourceError', 'onResourceLoaded'],   

   options: {
      documentImagesSelector: "images/image",
      documentScriptsSelector: "javaScripts/javaScript",
      documentStyleSheetsSelector: "styleSheets/styleSheet",
      type : null
   },
   
   //Constructor
   initialize: function( resourceDefinition, options ){
      this.setOptions( options );
      
      this.error = null;
      this.numberOfResourcesLoaded = 0;
      this.resourceDefinition = resourceDefinition;
      this.resourceUri = null;
      this.resources = new ArrayList();
      this.state = ResourceManager.States.INITIALIZED;
      this.styleSheets = new ArrayList();
   },
   
   //Public mutators and accessor methods
   load: function(){
      if( this.resources.size() > 0 ){
         this.resources.each( function( documentResource, index ){
            documentResource.load();
         }, this );
      }else{
         this.state = ResourceManager.States.LOADED;
         this.fireEvent( 'resourcesLoaded', this );
      }
   },
   
   onResourceError: function( resourceUri ){
      this.error = new UndefinedDocumentResourceException( resourceUri );
      this.fireEvent( 'resourceError', this.error );
      this.onResourceLoaded( resourceUri );
   },
   
   onResourceLoaded: function( resource ){
      this.numberOfResourcesLoaded++;
      if( this.resources.size() > 0 && this.numberOfResourcesLoaded >= this.resources.size() ){
         this.state = ResourceManager.States.LOADED;
         this.fireEvent( 'resourcesLoaded', this );
      }
   },
   
   release: function(){
      this.resources.each( function( documentResource, index ){
         documentResource.release();
      }, this );
      
      this.styleSheets.clear();
      this.resources.clear();
      this.numberOfResourcesLoaded = 0;
   },
   
   unmarshall: function(){
      this.unmarshallResources();
      this.state = ResourceManager.States.UNMARSHALLED;
   },

   //Properties
   getError: function() { return this.error; },
   getResources: function() { return this.resources; },
   getResourceType: function() { return this.options.type; },
   getResourceUri: function() { return resourceUri; },
   getState: function() { return this.state; },
   getStyleSheets: function() { return this.styleSheets; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   unmarshallResource: function( selector, resourceClass ) {
      var resourceElements = XmlResource.selectNodes( selector, this.resourceDefinition );
      resourceElements.each( function( resourceElement, index ){
         var documentResource = new resourceClass( resourceElement, { onResourceLoaded : this.onResourceLoaded, onResourceError : this.onResourceError } );
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

ResourceManager.States = { INITIALIZED : 0, UNMARSHALLED : 1, LOADED : 2 };
