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

//= require_directory ../FundamentalTypes
//= require ../DiagramWidget/DiagramFigure.js

var ClassFigure = new Class({
   Extends : DiagramFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject', 'drawAttributes'],
   
   options : {
      attributesSelector : "attributes/attribute",
      componentName : "ClassFigure"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      
      this.attributes = new ArrayList();
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.parent();
   },
   
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   unmarshall: function(){
      this.unmarshallAttributes();
      this.parent();
   },
   
   //Properties
   getAttributes : function() { return this.attributes; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.drawAttributes, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),

   drawAttributes : function(){
      this.attributes.each( function( attribute, index ){
         this.draw2dObject.addAttribute( attribute.getName(), attribute.getType(), attribute.getDefaultValue() );
      }.bind( this ));
      
      this.drawChain.callChain();
   }.protect(),
   
   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.shape.uml.Class( this.name );
      this.drawChain.callChain();
   }.protect(),
   
   unmarshallAttributes: function(){
      var attributesElement = this.definitionXml.selectNodes( this.options.attributesSelector );
      if( attributesElement ){
         attributesElement.each( function( attributeElement, index ){
            var attribute = new AttributeFigure( attributeElement, this.internationalization );
            attribute.unmarshall();
            this.attributes.add( attribute );
         }, this );
      }
   }.protect()
   
});

