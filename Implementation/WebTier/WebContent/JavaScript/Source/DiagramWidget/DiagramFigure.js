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
   Binds: [],
   
   options : {
      componentName : "DiagramFigure",
      idSelector : "@id",
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
      this.id;
      this.internationalization = internationalization;
      this.name;
      this.positionX;
      this.positionY;
      this.state = DiagramFigure.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   construct: function( canvas ){
      assertThat( canvas, not( nil() ));
      this.canvas = canvas;
      this.draw();
      this.state = DiagramFigure.States.CONSTRUCTED;
   },
   
   destroy: function(){
      if( this.state == DiagramFigure.States.CONSTRUCTED ){
         this.removeFigureFromCanvas();
         this.state = DiagramFigure.States.INITIALIZED;
      }
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = DiagramFigure.States.UNMARSHALLED;
   },
   
   //Properties
   getId: function() { return this.id; },
   getName: function() { return this.name; },
   getPositionX: function() { return this.positionX; },
   getPositionY: function() { return this.positionY; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   draw : function(){
      this.instantiateDraw2dObject();
      this.draw2dObject.addAttribute( this.id, "String" );
      this.canvas.addFigure( this.draw2dObject, this.positionX, this.positonY );
      
   }.protect(),
   
   removeFigureFromCanvas : function(){
      this.canvas.removeFigure( this.draw2dObject );
   }.protect(),
   
   unmarshallProperties: function(){
      this.id = XmlResource.selectNodeText( this.options.idSelector, this.definitionXml );
      this.name = XmlResource.selectNodeText( this.options.nameSelector, this.definitionXml );
      this.positionX = XmlResource.selectNodeText( this.options.positionXSelector, this.definitionXml );
      this.positionY = XmlResource.selectNodeText( this.options.positionYSelector, this.definitionXml );
   }.protect(),
});

DiagramFigure.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
