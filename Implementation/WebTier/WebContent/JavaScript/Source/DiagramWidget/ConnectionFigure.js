/*
Name: 
    - ConnectionFigure

Description: 
    - Represents a connection between two figures. 

Requires:

Provides:
    - ConnectionFigure

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

var ConnectionFigure = new Class({
   Extends : DiagramFigure,
   Implements : [Events, Options],
   Binds: ['instantiateDraw2dObject', 'linkSourceAndTarget'],
   
   options : {
      componentName : "ConnectionFigure",
      sourceSelector : "@source",
      targetSelector : "@target"
   },

   //Constructor
   initialize: function( definition, internationalization, options ){
      this.parent( definition, internationalization, options );
      
      this.sourceFigureName;
      this.targetFigureName;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
      this.parent();
   },
   
   draw: function( diagram ){
      this.parent( diagram );
   },
   
   unmarshall: function(){
      this.parent();
   },
   
   //Properties
   getSourceFigureName : function() { return this.sourceFigureName; },
   getTargetFigureName : function() { return this.targetFigureName; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.instantiateDraw2dObject, this.linkSourceAndTarget, this.addFigureToCanvas, this.finalizeDraw );
   }.protect(),

   instantiateDraw2dObject : function(){
      this.draw2dObject = new draw2d.Connection( this.name );
      this.drawChain.callChain();
   }.protect(),
   
   linkSourceAndTarget : function(){
      var sourceFigure = this.lookUpDiagramFigure( this.sourceFigureName );
      var targetFigure = this.lookUpDiagramFigure( this.targetFigureName );
      this.draw2dObject.setSource( sourceFigure.getDraw2dObject().portTop );
      this.draw2dObject.setTarget( targetFigure.getDraw2dObject().portTop );
      this.drawChain.callChain();
   }.protect(),
   
   unmarshallProperties: function(){
      this.sourceFigureName = XmlResource.selectNodeText( this.options.sourceSelector, this.definitionXml );
      this.targetFigureName = XmlResource.selectNodeText( this.options.targetSelector, this.definitionXml );
   }.protect()
});

