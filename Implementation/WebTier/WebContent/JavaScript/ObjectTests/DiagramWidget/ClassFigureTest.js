window.ClassFigureTest = new Class({
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'construct_callsInstantiateDraw2dObject', isAsynchron : false }]
   },

   constants : {
      LANGUAGE : "hu",
      DIAGRAM_DATA_URI : "../DiagramWidget/DiagramData.xml",
      DIAGRAM_DEFINITION_URI : "../DiagramWidget/DiagramDefinition.xml",
      DIAGRAM_CONTAINER_ID : "DiagramContainer",
      FIGURE_SELECTOR : "pp:widgetDefinition/figures/class[0]",
      PAINT_AREA_ID : "paintarea",
      WEBUI_CONFIGURATION_URI : "../DiagramWidget/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.canvas;
      this.elementFactory;
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.figure;
      this.figureDefinition;
      this.componentStateManager;
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
      
      this.figure = new ClassFigure( this.figureDefinition, this.diagramInternationalization );
      this.diagramContainerElement = $( this.constants.DIAGRAM_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.diagramContainerElement, this.diagramInternationalization );
      this.drawCanvas();
   },
   
   afterEachTest : function (){
      this.figure.destroy();
      this.destroyCanvas();
      this.diagramData.release();
      this.diagramDefinition.release();
      this.elementFactory = null;
   },
   
   construct_callsInstantiateDraw2dObject : function(){
      this.figure.unmarshall();
      this.figure.construct( this.canvas );
      
      assertThat( this.figure.getState(), equalTo( DiagramFigure.States.CONSTRUCTED ));
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
   }.protect()
   
});