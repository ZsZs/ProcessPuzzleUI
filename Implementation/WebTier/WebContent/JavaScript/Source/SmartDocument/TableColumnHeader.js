/*
Name: TableColumnHeader

Description: Represents the header cell element of a TableElment.

Requires:
    - DocumentElement

Provides:
    - TableColumnHeader

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

var TableColumnHeader = new Class({
   Extends: DocumentElement,
   
   options: {
      bindSelector : "@bind",
      componentName : "TableColumnHeader",
      labelSelector : "@label"
   },
   
   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      
      this.bind;
      this.label;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      this.tag = "TH";
      this.text = this.label;
      this.parent( contextElement, where );
   },
   
   destroy: function(){
      this.parent();
   },
   
   selectDataDefinition: function( rowData ){
      return XmlResource.selectNode( this.bind, rowData );
   },
   
   unmarshall: function(){
      this.unmarshallBind();
      this.unmarshallLabel();
      this.parent();
   },

   //Properties
   getBind: function() { return this.bind; },
   getLabel: function() { return this.label; },
   
   //Protected, private helper methods
   unmarshallBind : function(){
      this.bind = XmlResource.selectNodeText( this.options.bindSelector, this.definitionElement );
   }.protect(),
   
   unmarshallLabel : function(){
      this.label = XmlResource.selectNodeText( this.options.labelSelector, this.definitionElement );      
   }
});