/*
Name: CompositeDesktopElement

Description: Represents a composite constituent element of a ProcessPuzzleUI Desktop which can have nested elements.

Requires: 
    - DesktopElement

Provides:
    - CompositeDesktopElement

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

var CompositeDesktopElement = new Class({
   Extends: DesktopElement,
   Binds: ['onNestedElementConstructed'],
   
   options: {
      subElementsSelector : "compositeElement | element",
      type : "CompositeDesktopElement"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      this.elements = new LinkedHashMap();
      this.numberOfConstructedNestedElements = 0;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
      this.constructNestedElements( contextElement, where );
   },
   
   constructed: function(){
      if( this.numberOfConstructedNestedElements == this.elements.size() ) this.parent();
      else this.constructionChain.chain( this.constructed );
   },
   
   destroy: function(){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         nestedElement.destroy();
      }, this );
      this.numberOfConstructedNestedElements = 0;
      this.parent();
   },
   
   onNestedElementConstructed: function(){
      this.numberOfConstructedNestedElements++;
      this.constructionChain.callChain();
   },
   
   unmarshall: function(){
      this.parent();
      var subElements = XmlResource.selectNodes( this.options.subElementsSelector, this.definitionElement );
      subElements.each( function( subElementDefinition, index ){
         this.unmarshallNestedElement( subElementDefinition );
      }, this );
   },

   //Properties
   getElement: function( name ) { return this.elements.get( name ); },
   getElements: function() { return this.elements; },
   
   //Protected, private helper methods
   addElement: function( documentElement ){
      this.elements.put( documentElement.getId(), documentElement );
   }.protect(),
   
   constructNestedElements: function( contextElement, where ){
      this.elements.each( function( elementsEntry, index ){
         var nestedElement = elementsEntry.getValue();
         nestedElement.construct( this.htmlElement );
      }, this );      
   }.protect(),
   
   unmarshallNestedElement: function( subElementDefinition ){
      var nestedDesktopElement = DesktopElementFactory.create( subElementDefinition, this.resourceBundle, { onConstructed : this.onNestedElementConstructed } );
      nestedDesktopElement.unmarshall();
      this.addElement( nestedDesktopElement );
      return nestedDesktopElement;
   }.protect()
   
});