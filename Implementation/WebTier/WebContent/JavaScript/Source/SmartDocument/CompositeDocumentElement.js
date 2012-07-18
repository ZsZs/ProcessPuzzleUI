/*
Name: CompositeDocumentElement

Description: Represents a composite constituent element of a SmartDocument which can have nested elements.

Requires: 
    - DocumentElement

Provides:
    - CompositeDocumentElement

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
//= require ../SmartDocument/DocumentElement.js

var CompositeDocumentElement = new Class({
   Extends: DocumentElement,
   Binds: ['constructNestedElements', 'onNestedElementConstructed', 'onNestedElementConstructionError'],
   
   options: {
      componentName : "CompositeDocumentElement",
      subElementsSelector : "sd:compositeElement | sd:element | sd:compositeDataElement | sd:dataElement | sd:formElement | sd:formField | sd:tableElement",
      tagName : "div"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, dataXml, options ){
      this.parent( definitionElement, bundle, options );
      this.dataXml = dataXml;
      this.elements = new LinkedHashMap();
      this.nestedElementsConstructionChain = new Chain();
      this.nestedElementsContext;
      this.numberOfConstructedNestedElements = 0;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         if( nestedElement.getState() > DocumentElement.States.INITIALIZED ) nestedElement.destroy();
      }, this );
      this.numberOfConstructedNestedElements = 0;
      this.parent();
   },
   
   onNestedElementConstructed: function( nestedElement ){
      this.numberOfConstructedNestedElements++;
      this.nestedElementsConstructionChain.callChain();
   },
   
   onNestedElementConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'constructionError', this.error );
   },
   
   unmarshall: function(){
      this.parent();
      if( !this.tag ) this.tag = this.options.tagName;
      this.unmarshallNestedElements();
   },

   //Properties
   getElement: function( name ) { return this.elements.get( name ); },
   getElements: function() { return this.elements; },
   
   //Protected, private helper methods
   addElement: function( documentElement ){
      this.elements.put( documentElement.getId(), documentElement );
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.createHtmlElement, 
         this.injectHtmlElement, 
         this.associateEditor, 
         this.constructPlugin, 
         this.constructNestedElements, 
         this.authorization, 
         this.finalizeConstruction 
      );
   }.protect(),
   
   constructNestedElements: function( contextElement ){
      if( contextElement ) this.nestedElementsContext = contextElement;
      else this.nestedElementsContext = this.htmlElement;
      
      if( this.elements.size() > 0 ){
         this.elements.each( function( elementsEntry, index ){
            var nestedElement = elementsEntry.getValue();
            this.nestedElementsConstructionChain.chain(
               function(){
                  nestedElement.construct( this.nestedElementsContext );
               }.bind( this )
            );
         }, this );
         
         this.nestedElementsConstructionChain.chain(
            function(){
               this.nestedElementsConstructionChain.clearChain();
               this.constructionChain.callChain(); 
            }.bind( this )
         );
         this.nestedElementsConstructionChain.callChain();
      }else this.constructionChain.callChain();
   }.protect(),
   
   instantiateDocumentElement: function( elementDefinition ){
      var documentElementOptions = { onConstructed : this.onNestedElementConstructed, onConstructionError : this.onNestedElementConstructionError };
      if( this.options.variables ) documentElementOptions['variables'] = this.options.variables;
      return DocumentElementFactory.create( elementDefinition, this.resourceBundle, this.dataXml, documentElementOptions );
   }.protect(),
   
   revertConstruction: function(){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         if( nestedElement.getState() > DocumentElement.States.INITIALIZED ) nestedElement.destroy();
      }, this );
      this.elements.clear();
      this.numberOfConstructedNestedElements = 0;
      this.parent();
   }.protect(),
   
   unmarshallNestedElement: function( subElementDefinition, options ){
      var nestedDesktopElement = this.instantiateDocumentElement( subElementDefinition );
      nestedDesktopElement.unmarshall();
      this.addElement( nestedDesktopElement );
      return nestedDesktopElement;
   }.protect(),
   
   unmarshallNestedElements: function(){
      var subElements = XmlResource.selectNodes( this.options.subElementsSelector, this.definitionElement );
      subElements.each( function( subElementDefinition, index ){
         this.unmarshallNestedElement( subElementDefinition );
      }, this );
   }.protect()
   
});