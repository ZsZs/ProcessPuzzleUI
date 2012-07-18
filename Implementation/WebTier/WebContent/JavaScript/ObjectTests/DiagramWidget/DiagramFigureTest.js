window.DiagramFigureTest = new Class({
   Implements : [Events, JsTestClass, Options],
   Binds : ['onDraw', 'onErase'],

   options : {
      testMethods : []
   },

   constants : {
      LANGUAGE : "hu",
      DIAGRAM_DATA_URI : "../DiagramWidget/DiagramDefinition.xml",
      DIAGRAM_DEFINITION_URI : "../DiagramWidget/DiagramWidgetDefinition.xml",
      DIAGRAM_CONTAINER_ID : "DiagramContainer",
      DIAGRAM_NAMESPACES : "xmlns:pp='http://www.processpuzzle.com', xmlns:dd='http://www.processpuzzle.com/Diagram', xmlns:uml='http://www.processpuzzle.com/Diagram/UML'",
      FIGURE_SELECTOR : "//dd:widgetDefinition/dd:figures/uml:class[@name='ClassFigure']",
      PAINT_AREA_ID : "paintarea",
      WEBUI_CONFIGURATION_URI : "../DiagramWidget/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.canvas;
      this.elementFactory;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.figure;
      this.figureDefinition;
      this.diagram;
      this.diagramContainerElement;
      this.diagramDefinition;
      this.diagramInternationalization;
      this.paintArea;
      this.webUIConfiguration;
      this.webUILogger;
      
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.diagramInternationalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.diagramInternationalization.load( this.locale );
      this.diagramDefinition = new XmlResource( this.constants.DIAGRAM_DATA_URI, { nameSpaces : this.constants.DIAGRAM_NAMESPACES });
      this.figureDefinition = this.diagramDefinition.selectNode( this.constants.FIGURE_SELECTOR );

      this.diagramContainerElement = $( this.constants.DIAGRAM_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.diagramContainerElement, this.diagramInternationalization );
      
      this.instantiateDiagram();
      this.instantiateFigure();
      this.diagram.getFigures().add( this.figure );
      
      this.drawCanvas();
      this.diagram.canvas = this.canvas;
   },
   
   afterEachTest : function (){
      this.diagram.erase();
      this.figure.erase();
      this.destroyCanvas();
      this.diagramDefinition.release();
      this.elementFactory = null;
   },
      
   //Event handling methods
   onDraw : function(){
      this.testCaseChain.callChain();
   },
   
   onErase : function(){
      this.testCaseChain.callChain();
   },
   
   //Protected, private helper methods
   destroyCanvas : function(){
      this.paintArea.destroy();
   }.protect(),
   
   drawCanvas : function(){
      this.paintArea = this.elementFactory.create( 'div', null, this.diagramContainerElement, WidgetElementFactory.Positions.LastChild, { 
            id : this.constants.PAINT_AREA_ID,
            styles : { height : this.canvasHeight, width : this.canvasWidth }
         });
      
      this.canvas = new draw2d.Workflow( this.constants.PAINT_AREA_ID );
   }.protect(),
   
   instantiateDiagram : function(){
      this.diagram = new Diagram( this.diagramDefinition, this.diagramInternationalization, this.elementFactory, { onDraw : this.onDraw, onErase : this.onErase, });
   }.protect()
   
});