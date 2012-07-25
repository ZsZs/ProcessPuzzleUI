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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes
//= require ../SmartDocument/DocumentElement.js
//= require ../SmartDocument/DataElementBehaviour.js

var DataElement = new Class({
   Extends: DocumentElement,
   Binds: ['constructSiblings', 'destroySiblings', 'finalizeConstruction', 'onSiblingConstructed', 'onSiblingConstructionError', 'retrieveData'],
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
   unmarshall: function(){
      this.unmarshallDataBehaviour();
      this.parent();
   },
   
   //Properties
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.retrieveData, 
         this.createHtmlElement, 
         this.injectHtmlElement, 
         this.constructPlugin, 
         this.authorization, 
         this.associateEditor, 
         this.constructSiblings, 
         this.finalizeConstruction 
      );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroySiblings, this.destroyPlugin, this.destroyHtmlElements, this.detachEditor, this.finalizeDestruction );
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