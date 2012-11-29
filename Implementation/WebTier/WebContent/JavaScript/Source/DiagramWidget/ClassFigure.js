/*
Name: 
    - ClassFigure

Description: 
    - Represents a figure of UML class. 

Requires:

Provides:
    - ClassFigure

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
//= require ../DiagramWidget/DiagramFigure.js
//= require ../DiagramWidget/DiagramWidget.js

var ClassFigure = new Class({
   Extends : DiagramFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject', 'drawAttributes', 'drawOperations'],
   
   options : {
      attributesSelector : "uml:attributes/uml:attribute",
      componentName : "ClassFigure",
      operationsSelector : "uml:operations/uml:operation",
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      
      this.attributes = new ArrayList();
      this.operations = new ArrayList();
   },
   
   //Public accessor and mutator methods
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   erase: function(){
      this.parent();
   },
   
   unmarshall: function(){
      this.unmarshallAttributes();
      this.unmarshallOperations();
      this.parent();
   },
   
   //Properties
   getAttributes : function() { return this.attributes; },
   getOperations : function() { return this.operations; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.drawAttributes, this.drawOperations, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),

   drawAttributes : function(){
      this.attributes.each( function( attribute, index ){
         this.draw2dObject.addAttribute( attribute.getInternationalizedName(), attribute.getType(), attribute.getDefaultValue() );
      }.bind( this ));
      
      this.drawChain.callChain();
   }.protect(),
   
   drawOperations : function(){
      this.operations.each( function( operation, index ){
         this.draw2dObject.addOperation( operation.getInternationalizedName(), operation.getType() );
      }.bind( this ));
      
      this.drawChain.callChain();
   }.protect(),
   
   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.shape.uml.Class( this.getInternationalizedName() );
      this.drawChain.callChain();
   }.protect(),
   
   unmarshallAttributes: function(){
      var attributesElement = this.definitionXml.selectNodes( this.options.attributesSelector );
      if( attributesElement ){
         if( !attributesElement.each ) attributesElement = Array.from( attributesElement );
         attributesElement.each( function( attributeElement, index ){
            var attribute = new AttributeFigure( attributeElement, this.internationalization );
            attribute.unmarshall();
            this.attributes.add( attribute );
         }, this );
      }
   }.protect(),
   
   unmarshallOperations: function(){
      var operationsElement = this.definitionXml.selectNodes( this.options.operationsSelector );
      if( operationsElement ){
         if( !operationsElement.each ) operationsElement = Array.from( operationsElement );
         operationsElement.each( function( operationElement, index ){
            var operation = new OperationFigure( operationElement, this.internationalization );
            operation.unmarshall();
            this.operations.add( operation );
         }, this );
      }
   }.protect()
});

