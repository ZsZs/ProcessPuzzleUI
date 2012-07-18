/*
Name: 
    - Diagram

Description: 
    - Represents the diagram i.e. group of specifically placed diagram figures. 

Requires:
    - DigramFigure

Provides:
    - Diagram

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

var Diagram = new Class({
   Implements : [Events, Options],
   Binds: ['destroyCanvas', 'drawCanvas', 'drawFigures', 'eraseFigures', 'finalizeDraw', 'finalizeErase', 'onFigureConstructed', 'onFigureConstructionError'],
   
   options : {
      authorSelector : "/dd:diagramDefinition/dd:author",
      canvasHeightDefault : 200,
      canvasHeightSelector : "/dd:diagramDefinition/dd:canvas/@height",
      canvasWidthDefault : 300,
      canvasWidthSelector : "/dd:diagramDefinition/dd:canvas/@width",
      componentName : "Diagram",
      descriptionSelector : "/dd:diagramDefinition/dd:description",
      figuresSelector : "/dd:diagramDefinition/dd:figures/dd:annotation | /dd:diagramDefinition/dd:figures/uml:class | /dd:diagramDefinition/dd:figures/uml:inheritanceConnection",
      paintAreaId : "paintarea",
      positionXSelector : "@positionX",
      positionYSelector : "@positionY",
      titleSelector : "/dd:diagramDefinition/dd:title",
   },

   //Constructor
   initialize: function( definitionXml, localization, elementFactory, options ){
      this.setOptions( options );
      
      this.author;
      this.canvas;
      this.canvasHeight;
      this.canvasWidth;
      this.containerElement;
      this.definitionXml = definitionXml;
      this.description;
      this.eraseChain = new Chain();
      this.drawChain = new Chain();
      this.elementFactory = elementFactory;
      this.figures = new ArrayList();
      this.figuresDrawChain = new Chain();
      this.localization = localization;
      this.title;
      this.paintArea;
      this.state = DiagramFigure.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   draw: function( containerElement ){
      assertThat( containerElement, not( nil() ));
      this.containerElement = containerElement;

      this.compileDrawChain();
      this.drawChain.callChain();
   },
   
   erase: function(){
      if( this.state == DiagramFigure.States.CONSTRUCTED ){
         this.compileEraseChain();
         this.eraseChain.callChain();
      }
   },
   
   onFigureConstructed: function( figure ){
      this.figuresDrawChain.callChain();
   },
   
   onFigureConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallCanvas();
      this.unmarshallFigures();
      this.state = DiagramFigure.States.UNMARSHALLED;
   },
   
   //Properties
   getAuthor : function() { return this.author; },
   getCanvas : function() { return this.canvas; },
   getCanvasHeight : function() { return this.canvasHeight; },
   getCanvasWidth : function() { return this.canvasWidth; },
   getDescription : function() { return this.localization.getText( this.description ); },
   getFigures : function() { return this.figures; },
   getTitle : function() { return this.localization.getText( this.title ); },
   getPaintArea : function() { return this.paintArea; },
   getState: function() { return this.state; },
   
   //Protected, private helper methods
   compileDrawChain : function(){
      this.drawChain.chain( this.drawCanvas, this.drawFigures, this.finalizeDraw );
   }.protect(),
   
   compileEraseChain: function(){
      this.eraseChain.chain( this.eraseFigures, this.destroyCanvas, this.destroyChildHtmlElements, this.finalizeErase );
   }.protect(),
   
   destroyCanvas : function(){
      if( this.paintArea && this.paintArea.destroy ) this.paintArea.destroy();
      
      this.eraseChain.callChain();
   }.protect(),
   
   eraseFigures : function(){
      this.figures.each( function( figure, index ){
         figure.erase();
      }.bind( this ));
      
      this.figures.clear();
      
      this.eraseChain.callChain();
   }.protect(),
   
   drawCanvas : function(){
      this.paintArea = this.elementFactory.create( 'div', null, this.containerElement, WidgetElementFactory.Positions.LastChild, { 
            id : this.options.paintAreaId,
            styles : { height : this.canvasHeight, width : this.canvasWidth }
         });
      this.canvas = new draw2d.Workflow( this.options.paintAreaId );
      
      this.drawChain.callChain();
   }.protect(),
   
   drawFigures : function(){
      if( this.figures.size() > 0 ){
         this.figures.each( function( figure, index ){
            this.figuresDrawChain.chain( function(){ 
               figure.draw( this ); 
            }.bind( this ));
         }, this );
            
         this.figuresDrawChain.chain(
            function(){
               this.figuresDrawChain.clearChain();
               this.drawChain.callChain(); 
            }.bind( this )
         );
         this.figuresDrawChain.callChain();
      }else this.drawChain.callChain();
   }.protect(),
   
   finalizeDraw : function(){
      this.drawChain.clearChain();
      this.state = DiagramFigure.States.CONSTRUCTED;
      this.fireEvent( 'draw', this );
   }.protect(),
   
   finalizeErase : function(){
      this.eraseChain.clearChain();
      this.state = DiagramFigure.States.INITIALIZED;
      this.fireEvent( 'erase', this );
   }.protect(),
   
   lookUpDiagramFigure : function( figureName ){
      var searchedFigure = null;
      this.diagram.getFigures().each( function( figure, index ){
         if( figure.getName() == figureName ) 
            searchedFigure = figure;
      }.bind( this ));
      
      return searchedFigure;
   }.protect(),
   
   unmarshallCanvas: function(){
      this.canvasHeight = parseInt( this.definitionXml.selectNodeText( this.options.canvasHeightSelector, null, this.options.canvasHeightDefault ));
      this.canvasWidth = parseInt( this.definitionXml.selectNodeText( this.options.canvasWidthSelector, null, this.options.canvasWidthDefault ));
   }.protect(),
   
   unmarshallFigures: function(){
      var figuresElement = this.definitionXml.selectNodes( this.options.figuresSelector );
      if( figuresElement ){
         figuresElement.each( function( figureElement, index ){
            var figure = DiagramFigureFactory.create( figureElement, this.localization, { 
               onFigureConstructed : this.onFigureConstructed, 
               onFigureConstructionError : this.onFigureConstructionError 
            });
            figure.unmarshall();
            this.figures.add( figure );
         }, this );
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.title = this.definitionXml.selectNodeText( this.options.titleSelector );
      this.description = this.definitionXml.selectNodeText( this.options.descriptionSelector );
      this.author = this.definitionXml.selectNodeText( this.options.authorSelector );
   }.protect()
});

DiagramFigure.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
