/*
Name: CompositeDocumentElement

Description: Represents a composite constituent element of a SmartDocument which can have nested elements.

Requires:

Provides:
    - DocumentElement

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
   
   options: {
      subElementsSelector : "compositeElement | element"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, index ){
      this.options.type = "CompositeDocumentElement";
      this.parent( definitionElement, bundle, data, index );
      this.elements = new LinkedHashMap();
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
      this.constructNestedElements( contextElement, where );
   },
   
   destroy: function(){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         nestedElement.destroy();
      }, this );
      this.parent();
   },
   
   unmarshall: function( dataElementIndex ){
      this.parent();
      var subElements = XmlResource.selectNodes( this.options.subElementsSelector, this.definitionElement );
      subElements.each( function( subElementDefinition, index ){
         var nestedDocumentElement = this.unmarshallNestedElement( subElementDefinition, dataElementIndex );
         for( var i = 1; i < nestedDocumentElement.getDataElementsNumber(); i++ ){
            this.unmarshallNestedElement( subElementDefinition, i );
         }
      }, this );
   },

   //Properties
   getElement: function( name ) { return this.elements.get( name ); },
   getElements: function() { return this.elements; },
   
   //Protected, private helper methods
   addElement: function( documentElement ){
      this.elements.put( documentElement.getName(), documentElement );
   }.protect(),
   
   constructNestedElements: function( contextElement, where ){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         nestedElement.construct( this.htmlElement );
      }, this );      
   }.protect(),
   
   unmarshallNestedElement: function( subElementDefinition, index ){
      var nestedDocumentElement = DocumentElementFactory.create( subElementDefinition, this.resourceBundle, this.data, index );
      nestedDocumentElement.unmarshall( index );
      this.addElement( nestedDocumentElement );
      return nestedDocumentElement;
   }.protect()
   
});