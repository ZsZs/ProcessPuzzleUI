/*
Name: TableHeader

Description: Represents the header row element of a TableElement.

Requires:
    - DocumentElement

Provides:
    - TableHeader

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
//= require ../SmartDocument/DocumentElement.js

var TableHeader = new Class({
   Extends: DocumentElement,
   Binds: ['createHeaderRowElement', 'constructColumnHeaders', 'onColumnHeaderConstructed', 'onColumnHeaderConstructionError'],
   
   options: {
      componentName : "TableHeader",
      tableColumnsSelector : "tableColumn"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      
      this.columnHeaderConstructionChain = new Chain();
      this.columnHeaders = new ArrayList();
      this.headerRowElement;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.tag = "THEAD";
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   onColumnHeaderConstructed : function( columnHeader ){
      this.columnHeaderConstructionChain.callChain();
   },
   
   onColumnHeaderConstructionError : function( error ){
      this.error = error;
      this.revertConstruction();
   },
   
   unmarshall: function(){
      this.unmarshallColumnHeaders();
      this.parent();
   },

   //Properties
   getColumnHeaders: function() { return this.columnHeaders; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.createHtmlElement,
         this.createHeaderRowElement,
         this.injectHtmlElement, 
         this.constructPlugin, 
         this.authorization, 
         this.associateEditor, 
         this.constructColumnHeaders, 
         this.finalizeConstruction 
      );
   }.protect(),
   
   constructColumnHeaders : function(){
      this.columnHeaders.each( function( columnHeader, index ){
         this.columnHeaderConstructionChain.chain(
            function(){ 
               columnHeader.construct( this.headerRowElement ); 
            }.bind( this )
         );
      }.bind( this ));
      this.columnHeaderConstructionChain.chain(
         function(){
            this.columnHeaderConstructionChain.clearChain();
            this.constructionChain.callChain(); 
         }.bind( this )
      );
      this.columnHeaderConstructionChain.callChain();
   }.protect(),
   
   createHeaderRowElement : function(){
      this.headerRowElement = this.elementFactory.create( "tr", null, this.htmlElement, WidgetElementFactory.Positions.LastChild );
      this.constructionChain.callChain(); 
   }.protect(),
   
   deleteHtmlElement : function(){
      this.headerRowElement.removeEvents();
      this.headerRowElement.destroy();
      this.parent();
   }.protect(),
   
   unmarshallColumnHeaders: function(){
      var columnHeaderDefinitions = XmlResource.selectNodes( this.options.tableColumnsSelector, this.definitionElement );
      for( var i = 0; i < columnHeaderDefinitions.length; i++ ){
         var columnHeader = new TableColumnHeader( columnHeaderDefinitions[i], this.resourceBundle, { onConstructed : this.onColumnHeaderConstructed, onConstructionError : this.onColumnHeaderConstructionError });
         columnHeader.unmarshall();
         this.columnHeaders.add( columnHeader );
      }
   }.protect(),
   
});