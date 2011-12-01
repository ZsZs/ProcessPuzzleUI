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

var CompositeDocumentElement = new Class({
   Extends: DocumentElement,
   Binds: ['onNestedElementConstructed', 'onNestedElementConstructionError'],
   
   options: {
      componentName : "CompositeDocumentElement",
      subElementsSelector : "compositeElement | element | compositeDataElement | dataElement | formElement | formField",
      tagName : "div"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, dataXml, options ){
      this.parent( definitionElement, bundle, options );
      this.dataXml = dataXml;
      this.elements = new LinkedHashMap();
      this.nestedElementsContext;
      this.numberOfConstructedNestedElements = 0;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
      this.constructNestedElements();
   },
   
   constructed: function(){
      if( this.numberOfConstructedNestedElements == this.elements.size() ) this.parent();
      else this.constructionChain.chain( this.constructed );
   },
   
   destroy: function(){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         if( nestedElement.getState() > DocumentElement.States.INITIALIZED ) nestedElement.destroy();
      }, this );
      this.numberOfConstructedNestedElements = 0;
      this.parent();
   },
   
   onNestedElementConstructed: function( documentElement ){
      this.numberOfConstructedNestedElements++;
      this.constructionChain.callChain();
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
   
   constructNestedElements: function( contextElement ){
      if( contextElement ) this.nestedElementsContext = contextElement;
      else this.nestedElementsContext = this.htmlElement;
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         nestedElement.construct( this.nestedElementsContext );
      }, this );      
   }.protect(),
   
   instantiateDocumentElement: function( elementDefinition ){
      return DocumentElementFactory.create( elementDefinition, this.resourceBundle, this.dataXml, { onConstructed : this.onNestedElementConstructed, onConstructionError : this.onNestedElementConstructionError } );
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