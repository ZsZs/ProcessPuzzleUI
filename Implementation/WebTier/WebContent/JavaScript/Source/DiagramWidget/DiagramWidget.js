/*
Name: 
    - DiagramWidget

Description: 
    - Shows an editable Visio like diagram to the user.

Requires:
    - BrowserWidget, Draw2d

Provides:
    - DiagramWidget

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
//= require ../BrowserWidget/BrowserWidget.js

var DiagramWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['drawDiagram', 'eraseDiagram', 'onDiagramDraw','onDiagramErase'],
   
   options : {
      componentName : "DiagramWidget",
      widgetContainerId : "DiagramWidget",
      widgetDefinitionURI : "DiagramWidgetDefinition.xml"
   },
   
   //Constructor
   initialize : function( options, resourceBundle ){
      this.parent( options, resourceBundle );
      
      this.diagram;
   },
   
   //Public accessor and mutator methods
   construct : function() {
      this.parent();
   },
   
   destroy : function() {
      this.parent();
   },
   
   onDiagramDraw: function(){
      this.constructionChain.callChain();
   },
   
   onDiagramErase: function(){
      this.destructionChain.callChain();
   },
      
   unmarshall: function(){
      return this.parent();
   },
   
   //Properties
   getDiagram: function(){ return this.diagram; },
   
   //Private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.drawDiagram, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.eraseDiagram, this.finalizeDestruction );
   }.protect(),
   
   drawDiagram: function(){
      this.diagram.draw( this.containerElement );
   }.protect(),
   
   eraseDiagram: function(){
      this.diagram.erase();
   }.protect(),
   
   unmarshallComponents: function(){
      this.diagram = new Diagram(  this.dataXml, this.i18Resource, this.elementFactory, { onDraw : this.onDiagramDraw, onErase : this.onDiagramErase });
      this.diagram.unmarshall();
   }.protect()
   
});
