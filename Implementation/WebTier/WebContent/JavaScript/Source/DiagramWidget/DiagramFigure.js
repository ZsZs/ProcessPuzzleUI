/*
Name: 
    - DiagramFigure

Description: 
    - Represents an abstract element of DiagramWidget's figure. 

Requires:

Provides:
    - DiagramFigure

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

var DiagramFigure = new Class({
   Implements : [Events, Options],
   Binds: ['addFigureToCanvas', 'finalizeDraw'],
   
   options : {
      componentName : "DiagramFigure",
      nameSelector : "@name",
      positionXSelector : "@positionX",
      positionYSelector : "@positionY"
   },

   //Constructor
   initialize: function( definitionXmlElement, internationalization, options ){
      this.setOptions( options );
      
      this.canvas;
      this.definitionXml = definitionXmlElement;
      this.draw2dObject;
      this.drawChain = new Chain();
      this.internationalization = internationalization;
      this.name;
      this.positionX;
      this.positionY;
      this.state = DiagramFigure.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      if( this.state == DiagramFigure.States.CONSTRUCTED ){
         this.removeFigureFromCanvas();
         this.state = DiagramFigure.States.INITIALIZED;
      }
   },
   
   draw: function( canvas ){
      assertThat( canvas, not( nil() ));
      this.canvas = canvas;
      this.compileDrawChain();
      this.drawChain.callChain();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = DiagramFigure.States.UNMARSHALLED;
   },
   
   //Properties
   getId: function() { return this.draw2dObject.id; },
   getName: function() { return this.name; },
   getPositionX: function() { return this.positionX; },
   getPositionY: function() { return this.positionY; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),
   
   addFigureToCanvas : function(){
      this.canvas.addFigure( this.draw2dObject, this.positionX, this.positionY );
      this.drawChain.callChain();
   }.protect(),
   
   finalizeDraw : function(){
      this.drawChain.clearChain();
      this.state = DiagramFigure.States.CONSTRUCTED;
      this.fireEvent( 'drawReady', this );
   }.protect(),
   
   removeFigureFromCanvas : function(){
      this.canvas.removeFigure( this.draw2dObject );
   }.protect(),
   
   unmarshallProperties: function(){
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionXml );
      this.positionX = XmlResource.selectNodeText( this.options.positionXSelector, this.definitionXml );
      this.positionY = XmlResource.selectNodeText( this.options.positionYSelector, this.definitionXml );
   }.protect(),
});

DiagramFigure.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
