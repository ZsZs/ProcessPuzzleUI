window.DiagramFigureTest = new Class({
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : []
   },

   constants : {
      LANGUAGE : "hu",
      DIAGRAM_DATA_URI : "../DiagramWidget/DiagramData.xml",
      DIAGRAM_DEFINITION_URI : "../DiagramWidget/DiagramDefinition.xml",
      DIAGRAM_CONTAINER_ID : "DiagramContainer",
      FIGURE_SELECTOR : "//pp:widgetDefinition/figures/class[@name='ClassFigure']",
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
      this.componentStateManager;
      this.diagram;
      this.diagramContainerElement;
      this.diagramData;
      this.diagramDefinition;
      this.diagramInternationalization;
      this.paintArea;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
      
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.componentStateManager = new ComponentStateManager();
      this.diagramInternationalization = new XMLResourceBundle( this.webUIConfiguration );
      this.diagramInternationalization.load( this.locale );
      this.diagramData = new XmlResource( this.constants.DIAGRAM_DATA_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com'" } );
      this.diagramDefinition = new XmlResource( this.constants.DIAGRAM_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com'" } );
      this.figureDefinition = this.diagramDefinition.selectNode( this.constants.FIGURE_SELECTOR );

      this.instantiateDiagram();
      this.instantiateFigure();
      this.diagram.getFigures().add( this.figure );
      
      this.diagramContainerElement = $( this.constants.DIAGRAM_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.diagramContainerElement, this.diagramInternationalization );
      this.drawCanvas();
      this.diagram.canvas = this.canvas;
   },
   
   afterEachTest : function (){
      this.diagram.destroy();
      this.figure.destroy();
      this.destroyCanvas();
      this.diagramData.release();
      this.diagramDefinition.release();
      this.elementFactory = null;
      this.componentStateManager.reset();
   },
      
   //Event handling methods
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function(){
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
      this.diagram = new DiagramWidget( {
         onConstructed : this.onConstructed,
         onDestroyed : this.onDestroyed,
         widgetContainerId : this.constants.DIAGRAM_CONTAINER_ID, 
         widgetDefinitionURI : this.constants.DIAGRAM_DEFINITION_URI, 
         widgetDataURI : this.constants.DIAGRAM_DATA_URI 
      }, this.diagramInternationalization );
   }.protect()
   
});