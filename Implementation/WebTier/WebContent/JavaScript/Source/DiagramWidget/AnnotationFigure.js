/*
Name: 
    - AnnotationFigure

Description: 
    - Represents an annotation figure. 

Requires:

Provides:
    - AnnotationFigure

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

var AnnotationFigure = new Class({
   Extends : DiagramFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject', 'drawAttributes', 'setDimension'],
   
   options : {
      componentName : "AnnotationFigure",
      textSelector : "text",
      heightSelector : "@height",
      widthSelector : "@width"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      
      this.height;
      this.text;
      this.width;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.parent();
   },
   
   draw: function( canvas ){
      this.parent( canvas );
   },
   
   unmarshall: function(){
      this.parent();
   },
   
   //Properties
   getHeight : function() { return this.height; },
   getText : function() { return this.text; },
   getWidth : function() { return this.width; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.setDimension, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),

   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.Annotation( this.text );
      this.drawChain.callChain();
   }.protect(),
   
   setDimension : function(){
      this.draw2dObject.setDimension( this.width, this.height );
      this.drawChain.callChain();
   }.protect(),
   
   unmarshallProperties: function(){
      this.text = XmlResource.selectNodeText( this.options.textSelector, this.definitionXml );
      if( this.text ) this.text = this.internationalization.getText( this.text );
      this.height = parseInt( XmlResource.selectNodeText( this.options.heightSelector, this.definitionXml ));
      this.width = parseInt( XmlResource.selectNodeText( this.options.widthSelector, this.definitionXml ));
      
      this.parent();
   }.protect()
   
});

