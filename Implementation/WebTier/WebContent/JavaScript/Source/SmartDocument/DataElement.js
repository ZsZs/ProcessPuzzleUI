/*
Name: DataElement

Description: A specialized subclass of DekstopElement which can display data from a given source.

Requires:

Provides:
    - DataElement

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

var DataElement = new Class({
   Extends: DocumentElement,
   Binds: ['constructSiblings', 'finalizeConstruction', 'onSiblingConstructed', 'retrieveData'],
   Implements: DataElementBehaviour,
   
   options: {
      componentName : "DataElement",
      isEditable : true,
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, data, options ){
      this.parent( definitionElement, bundle, options );
      
      //Private variables
      this.setUp( data );
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.destroySiblings();
      this.parent();
      this.numberOfConstructedSiblings = 0;
   },
   
   unmarshall: function(){
      this.unmarshallDataProperties();
      this.loadDataSource();
      this.determineDataElementsNumber();
      this.instantiateSiblings();
      this.parent();
   },

   //Properties
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.retrieveData, 
         this.constructSiblings, 
         this.createHtmlElement, 
         this.injectHtmlElement, 
         this.constructPlugin, 
         this.authorization, 
         this.associateEditor, 
         this.finalizeConstruction 
      );
   }.protect(),
   
   injectHtmlElement: function(){
      this.htmlElement.addClass( DataElement.CLASS );
      this.parent();
   }.protect(),
   
   setUp: function( data ){
      this.dataXml = data;
      this.numberOfConstructedSiblings = 0;
      this.siblings = new ArrayList();
   }.protect(),
});

DataElement.CLASS = "dataElement";