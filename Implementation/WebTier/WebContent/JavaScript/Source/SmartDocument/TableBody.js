/*
Name: TableBody

Description: Represents the body element of a TableElement.

Requires:
    - DocumentElement

Provides:
    - TableBody

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

var TableBody = new Class({
   Extends: DocumentElement,
   Binds: ['createRowElement', 'constructRows', 'onRowConstructed', 'onRowConstructionError'],
   
   options: {
      componentName : "TableBody",
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, dataSet, columnHeaders, options ){
      this.parent( definitionElement, bundle, options );
      
      this.columnHeaders = columnHeaders;
      this.dataSet = dataSet;
      this.rowsConstructionChain = new Chain();
      this.rows = new ArrayList();
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.tag = "TBODY";
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   onRowConstructed : function( columnHeader ){
      this.rowsConstructionChain.callChain();
   },
   
   onRowConstructionError : function( error ){
      this.error = error;
      this.revertConstruction();
   },
   
   unmarshall: function(){
      this.unmarshallRows();
      this.parent();
   },

   //Properties
   getRows: function() { return this.rows; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.createHtmlElement,
         this.injectHtmlElement, 
         this.constructPlugin, 
         this.authorization, 
         this.associateEditor, 
         this.constructRows, 
         this.finalizeConstruction 
      );
   }.protect(),
   
   constructRows : function(){
      this.rows.each( function( row, index ){
         this.rowsConstructionChain.chain(
            function(){ 
               row.construct( this.htmlElement ); 
            }.bind( this )
         );
      }.bind( this ));
      this.rowsConstructionChain.chain(
         function(){
            this.rowsConstructionChain.clearChain();
            this.constructionChain.callChain(); 
         }.bind( this )
      );
      this.rowsConstructionChain.callChain();
   }.protect(),
   
   deleteHtmlElement : function(){
      this.destroyRows();
      this.parent();
   }.protect(),
   
   destroyRows : function(){
      this.rows.each( function( row, index ){
         row.destroy(); 
      }.bind( this ));
   }.protect(),
   
   unmarshallRows: function(){
      this.dataSet.each( function( columnHeaderDefinition, index ){
         var row = new TableRow( this.definitionElement, this.resourceBundle, this.dataSet[index], this.columnHeaders, { 
            isEditable : this.isEditable(),
            onConstructed : this.onRowConstructed, 
            onConstructionError : this.onRowConstructionError 
         });
         row.unmarshall();
         this.rows.add( row );
      }, this );
   }.protect(),
   
});