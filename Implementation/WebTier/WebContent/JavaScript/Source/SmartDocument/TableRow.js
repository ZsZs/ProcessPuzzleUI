/*
Name: TableRow

Description: Represents the row element of a TableElement.

Requires:
    - DocumentElement

Provides:
    - TableRow

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

var TableRow = new Class({
   Extends: DocumentElement,
   Binds: ['createTableRowElement', 'constructTableCells', 'onTableCellConstructed', 'onTableCellConstructionError'],
   
   options: {
      componentName : "TableRow",
      tableColumnsSelector : "tableColumn"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, rowData, columnHeaders, options ){
      this.parent( definitionElement, bundle, options );
      
      this.columnHeaders = columnHeaders;
      this.rowData = rowData;
      this.tableCellsConstructionChain = new Chain();
      this.tableCells = new ArrayList();
      this.tableRowElement;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.tag = "TR";
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   onTableCellConstructed : function( columnHeader ){
      this.tableCellsConstructionChain.callChain();
   },
   
   onTableCellConstructionError : function( error ){
      this.error = error;
      this.revertConstruction();
   },
   
   unmarshall: function(){
      this.unmarshallTableCells();
      this.parent();
   },

   //Properties
   getTableCells : function() { return this.tableCells; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.createHtmlElement,
         this.injectHtmlElement, 
         this.constructPlugin, 
         this.authorization, 
         this.associateEditor, 
         this.constructTableCells, 
         this.finalizeConstruction 
      );
   }.protect(),
   
   constructTableCells : function(){
      this.tableCells.each( function( tableCell, index ){
         this.tableCellsConstructionChain.chain(
            function(){ 
               tableCell.construct( this.htmlElement ); 
            }.bind( this )
         );
      }.bind( this ));
      this.tableCellsConstructionChain.chain(
         function(){
            this.tableCellsConstructionChain.clearChain();
            this.constructionChain.callChain(); 
         }.bind( this )
      );
      this.tableCellsConstructionChain.callChain();
   }.protect(),
   
   deleteHtmlElement : function(){
      this.parent();
   }.protect(),
   
   unmarshallTableCells: function(){
      this.columnHeaders.each( function( columnHeader, index ){
         var dataDefinition = columnHeader.selectDataDefinition( this.rowData );
         var tableCell = new TableCell( columnHeader.getDefinitionElement(), this.resourceBundle, dataDefinition, { 
            isEditable : this.isEditable(),
            onConstructed : this.onTableCellConstructed, 
            onConstructionError : this.onTableCellConstructionError 
         });
         tableCell.unmarshall();
         this.tableCells.add( tableCell );
      }, this );
   }.protect(),
   
});