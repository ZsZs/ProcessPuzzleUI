/*
Name: SmartDocument

Description: Represents a document of a Panel. Reads it's own structure and content from xml files and constructs HTML based on them.

Requires:

Provides:
    - SmartDocument

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
//= require ../AbstractDocument/AbstractDocument.js

var SmartDocument = new Class({
   Extends: AbstractDocument,
   Binds : ['constructBody', 
            'constructFooter', 
            'constructHeader', 
            'destroyHeaderBodyAndFooter',
            'determineContainerElement', 
            'loadResources', 
            'onBodyConstructed', 
            'onConstructionError',
            'onFooterConstructed', 
            'onHeaderConstructed',
            'onResourceError',
            'onResourcesLoaded'],
   
   options : {
      componentName : "SmartDocument",
      bodySelector : "sd:documentBody",
      documentContentLocaleSpecificVersionsExists : false,
      footerSelector : "sd:documentFooter",
      headerSelector : "sd:documentHeader",
      rootElementName : "/sd:smartDocumentDefinition",
   },
   
   //Constructor
   initialize : function( i18Resource, options ) {
      this.parent( i18Resource, options );

      this.documentBody = null;
      this.documentFooter = null;
      this.documentHeader = null;
   },

   //Public accesors and mutators
   construct: function(){
      this.parent();
   },
   
   destroy: function() {
      this.parent();
   },
   
   onBodyConstructed: function(){
      this.constructionChain.callChain();
   },
   
   onFooterConstructed: function(){
      this.constructionChain.callChain();
   },
   
   onHeaderConstructed: function(){
      this.constructionChain.callChain();
   },
   
   unmarshall: function(){
      var documentComponentOptions = { onConstructed : this.onHeaderConstructed, onConstructionError : this.onConstructionError };
      if( this.options.documentVariables ) documentComponentOptions['variables'] = this.options.documentVariables;
      this.documentHeader = this.unmarshallDocumentComponent( this.options.rootElementName + "/" + this.options.headerSelector, documentComponentOptions );
      this.documentBody = this.unmarshallDocumentComponent( this.options.rootElementName + "/" + this.options.bodySelector, documentComponentOptions );
      this.documentFooter = this.unmarshallDocumentComponent( this.options.rootElementName + "/" + this.options.footerSelector, documentComponentOptions );
      this.parent();
   },
   
   //Properties
   getBody: function() { return this.documentBody; },
   getFooter: function() { return this.documentFooter; },
   getHeader: function() { return this.documentHeader; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain(
         this.determineContainerElement,
         this.loadResources,
         this.constructHeader,
         this.constructBody,
         this.constructFooter,
         this.finalizeConstruction
      );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain(  this.destroyHeaderBodyAndFooter, this.releseResource, this.detachEditor, this.resetProperties, this.finalizeDestruction );
   }.protect(),
   
   constructBody : function(){
      if( this.documentBody ) this.documentBody.construct( this.containerElement, 'bottom' );
      else this.constructionChain.callChain();
   }.protect(),
   
   constructFooter: function(){
      if( this.documentFooter ) this.documentFooter.construct( this.containerElement, 'bottom' );
      else this.constructionChain.callChain();
   }.protect(),
   
   constructHeader: function(){
      if( this.documentHeader ) this.documentHeader.construct( this.containerElement, 'bottom' );
      else this.constructionChain.callChain();
   }.protect(),
   
   destroyHeaderBodyAndFooter: function(){
      if( this.documentHeader && this.documentHeader.getState() > DocumentElement.States.INITIALIZED ) this.documentHeader.destroy();
      if( this.documentBody && this.documentBody.getState() > DocumentElement.States.INITIALIZED ) this.documentBody.destroy();
      if( this.documentFooter && this.documentFooter.getState() > DocumentElement.States.INITIALIZED ) this.documentFooter.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   resetProperties: function(){
      this.documentHeader = null;
      this.documentBody = null;
      this.documentFooter = null;
      this.parent();
   }.protect(),
   
   revertConstruction: function(){
      this.destroyHeaderBodyAndFooter();
      if( this.resources ) this.resources.release();
      this.parent();
   }.protect(),
   
   unmarshallDocumentComponent: function( selector, options ){
      var documentComponent = null;
      var componentDefinition = this.documentDefinition.selectNode( selector );
      if( componentDefinition ) documentComponent = DocumentElementFactory.create( componentDefinition, this.i18Resource, this.documentContent, options );
      if( documentComponent ) documentComponent.unmarshall();
      return documentComponent;
   }.protect()
   
});
