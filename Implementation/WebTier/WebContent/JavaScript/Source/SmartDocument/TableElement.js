/*
Name: TableElement

Description: Represents a composite constituent element of a SmartDocument which retrieves and presents data in table form from a given data source.

Requires:
    - CompositeDocumentElement, DocumentElement

Provides:
    - TableElement

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
//= require ../SmartDocument/CompositeDataElement.js

var TableElement = new Class({
   Extends: CompositeDataElement,
   Binds: ['constructBody', 'constructHeader', 'createTableElement', 'onBodyConstructed', 'onBodyConstructionError', 'onHeaderConstructed', 'onHeaderConstructionError'],
   
   options: {
      componentName : "TableElement",
      editableClass : "editableContainer",
      readOnlyClass : "readOnlyContainer"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, dataXml, options ){
      this.parent( definitionElement, bundle, dataXml, options );
      
      this.body;
      this.header;
      this.maxRowCount;
      this.tableElement;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   onBodyConstructed: function( body ){
      this.constructionChain.callChain();
   },
   
   onBodyConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
   },
   
   onHeaderConstructed: function( header ){
      this.constructionChain.callChain();
   },
   
   onHeaderConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
   },
   
   unmarshall: function(){
      this.parent();
   },

   //Properties
   getBody: function() { return this.body; },
   getContainerClass: function() { return this.isEditable() ? this.options.editableClass : this.options.readOnlyClass; },
   getHeader: function() { return this.header; },
   getMaxRowCount: function() { return this.maxRowCount; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain(
         this.createHtmlElement, 
         this.createTableElement,
         this.injectHtmlElement, 
         this.associateEditor, 
         this.constructPlugin, 
         this.constructNestedElements, 
         this.authorization, 
         this.constructHeader,
         this.constructBody,
         this.finalizeConstruction 
      );
   }.protect(),
   
   constructBody : function(){
      this.body.construct( this.tableElement, "bottom" );
   }.protect(),
   
   constructHeader : function(){
      this.header.construct( this.tableElement, "bottom" );
   }.protect(),
   
//   constructNestedElements : function(){
//      this.parent( this.fieldsContainerElement );
//   }.protect(),
//   
   createHtmlElement : function(){
      this.tag = "div";
      this.style = this.getContainerClass();
      this.parent();
   }.protect(),
   
   createTableElement : function(){
      this.tableElement = this.elementFactory.create( "table", null, this.htmlElement, WidgetElementFactory.Positions.LastChild, { id : this.id });
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallBody: function(){
      this.body = new TableBody( this.definitionElement, this.resourceBundle, this.bindedData, this.header.getColumnHeaders(), {
         isEditable : this.isEditable(),
         onConstructed : this.onBodyConstructed, 
         onConstructionError : this.onBodyConstructionError });
      this.body.unmarshall();
   }.protect(),
   
   unmarshallDataBehaviour: function(){
      this.unmarshallDataProperties();
      this.loadDataSource();
      this.determineDataElementsNumber();
      this.unmarshallHeader();
      this.unmarshallBody();
   }.protect(),
   
   unmarshallHeader: function(){
      this.header = new TableHeader( this.definitionElement, this.resourceBundle, { onConstructed : this.onHeaderConstructed, onConstructionError : this.onHeaderConstructionError });
      this.header.unmarshall();
   }.protect()
   
});