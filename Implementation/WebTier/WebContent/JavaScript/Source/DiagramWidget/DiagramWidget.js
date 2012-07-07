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

//= require_directory ../FundamentalTypes
//= require ../BrowserWidget/BrowserWidget.js

var DiagramWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['destroyCanvas', 'destroyFigures', 'drawCanvas', 'drawFigures', 'onFigureConstructed', 'onFigureConstructionError'],
   
   options : {
      authorSelector : "//pp:widgetDefinition/author",
      canvasHeightDefault : 200,
      canvasHeightSelector : "//pp:widgetDefinition/canvas/@height",
      canvasWidthDefault : 300,
      canvasWidthSelector : "//pp:widgetDefinition/canvas/@width",
      componentName : "DiagramWidget",
      descriptionSelector : "//pp:widgetDefinition/description",
      figuresSelector : "//pp:widgetDefinition/figures/annotation | //pp:widgetDefinition/figures/class | //pp:widgetDefinition/figures/inheritanceConnection",
      nameSelector : "//pp:widgetDefinition/name",
      paintAreaId : "paintarea",
      titleSelector : "//pp:widgetDefinition/title",
      widgetContainerId : "DiagramWidget",
      widgetDefinitionURI : "MenuDefinition.xml"
   },
   
   //Constructor
   initialize : function( options, resourceBundle ){
      this.parent( options, resourceBundle );
      
      this.author;
      this.canvas;
      this.canvasHeight;
      this.canvasWidth;
      this.description;
      this.figures = new ArrayList();
      this.figuresConstructionChain = new Chain();
      this.name;
      this.title;
      this.paintArea;
   },
   
   //Public accessor and mutator methods
   construct : function( configurationOptions ) {
      this.parent();
   },
   
   destroy : function() {
      this.parent();
   },
      
   onFigureConstructed: function( figure ){
      this.figuresConstructionChain.callChain();
   },
   
   onFigureConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallFigures();
      return this.parent();
   },
   
   //Properties
   getAuthor : function() { return this.author; },
   getCanvas : function() { return this.canvas; },
   getCanvasHeight : function() { return this.canvasHeight; },
   getCanvasWidth : function() { return this.canvasWidth; },
   getDescription : function() { return this.i18Resource.getText( this.description ); },
   getFigures : function() { return this.figures; },
   getName : function() { return this.name; },
   getTitle : function() { return this.i18Resource.getText( this.title ); },
   getPaintArea : function() { return this.paintArea; },
   
   //Private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.drawCanvas, this.drawFigures, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyFigures, this.destroyCanvas, this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
   
   destroyCanvas : function(){
      if( this.paintArea && this.paintArea.destroy ) this.paintArea.destroy();
      
      this.destructionChain.callChain();
   }.protect(),
   
   destroyFigures : function(){
      this.figures.each( function( figure, index ){
         figure.destroy();
      }.bind( this ));
      
      this.figures.clear();
      
      this.destructionChain.callChain();
   }.protect(),
   
   drawCanvas : function(){
      this.paintArea = this.elementFactory.create( 'div', null, this.containerElement, WidgetElementFactory.Positions.LastChild, { 
            id : this.options.paintAreaId,
            styles : { height : this.canvasHeight, width : this.canvasWidth }
         });
      this.canvas = new draw2d.Workflow( this.options.paintAreaId );
      
      this.constructionChain.callChain();
   }.protect(),
   
   drawFigures : function(){
      if( this.figures.size() > 0 ){
         this.figures.each( function( figure, index ){
            this.figuresConstructionChain.chain( function(){ figure.draw( this ); }.bind( this ));
         }, this );
            
         this.figuresConstructionChain.chain(
            function(){
               this.figuresConstructionChain.clearChain();
               this.constructionChain.callChain(); 
            }.bind( this )
         );
         this.figuresConstructionChain.callChain();
      }else this.constructionChain.callChain();
   }.protect(),
   
   unmarshallFigures: function(){
      var figuresElement = this.definitionXml.selectNodes( this.options.figuresSelector );
      if( figuresElement ){
         figuresElement.each( function( figureElement, index ){
            var figure = DiagramFigureFactory.create( figureElement, this.i18Resource, { 
               onFigureConstructed : this.onFigureConstructed, 
               onFigureConstructionError : this.onFigureConstructionError 
            });
            figure.unmarshall();
            this.figures.add( figure );
         }, this );
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.name = this.unmarshallWidgetProperty( null, this.options.nameSelector );
      this.description = this.unmarshallWidgetProperty( "", this.options.descriptionSelector );
      this.title = this.unmarshallWidgetProperty( "", this.options.titleSelector );
      this.author = this.unmarshallWidgetProperty( "", this.options.authorSelector );
      this.canvasHeight = parseInt( this.unmarshallWidgetProperty( this.options.canvasHeightDefault, this.options.canvasHeightSelector ));
      this.canvasWidth = parseInt( this.unmarshallWidgetProperty( this.options.canvasWidthDefault, this.options.canvasWidthSelector ));
   }.protect(),
   
   unmarshallWidgetProperty: function( defaultValue, selector ){
      var propertyValue = this.definitionXml.selectNodeText( selector );
      if( propertyValue ) return propertyValue;
      else return defaultValue;
   }.protect()
});
