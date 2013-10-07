window.DiagramTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onDraw', 'onErase'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'unmarshall_determinesCanvasProperties', isAsynchron : false },
         { method : 'unmarshall_unmarshallsFigures', isAsynchron : false },
         { method : 'draw_drawsDefinedDiagram', isAsynchron : true },
         { method : 'draw_drawsFigures', isAsynchron : true },
         { method : 'erase_removesFiguresAndDestroyHtmlElements', isAsynchron : true }]
   },

   constants : {
      LANGUAGE : "hu",
      DIAGRAM_CONTAINER_ID : "DiagramContainer",
      DIAGRAM_DEFINITION_URI : "../DiagramWidget/DiagramDefinition.xml",
      FIGURES_SELECTOR : "/dd:diagramDefinition/dd:figures/dd:annotation | //dd:diagramDefinition/dd:figures/uml:class | /dd:diagramDefinition/dd:figures/uml:associationConnection | //dd:diagramDefinition/dd:figures/uml:inheritanceConnection",
      WEBUI_CONFIGURATION_URI : "../DiagramWidget/WebUIConfiguration.xml",
      WIDGET_DEFINITION_URI : "../DiagramWidget/DiagramWidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.componentStateManager;
      this.elementFactory;
      this.diagram;
      this.diagramContainerElement;
      this.diagramDefinition;
      this.diagramLocalization;
      this.messageBus;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.diagramLocalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.diagramLocalization.load( this.locale );
      this.diagramDefinition = new XmlResource( this.constants.DIAGRAM_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com/' xmlns:dd='http://www.processpuzzle.com/Diagram' xmlns:uml='http://www.processpuzzle.com/Diagram/UML'" } );
      
      this.diagramContainerElement = $( this.constants.DIAGRAM_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.diagramContainerElement, this.diagramLocalization );
      
      this.diagram = new Diagram( this.diagramDefinition, this.diagramLocalization, this.elementFactory, { onDraw : this.onDraw, onErase : this.onErase, });
   },
   
   afterEachTest : function (){
      this.diagram.erase();
      this.diagramDefinition.release();
   },
   
   unmarshall_determinesProperties : function() {
      this.diagram.unmarshall();
      
      assertThat( this.diagram.getDescription(), equalTo( this.diagramLocalization.getText( this.diagramDefinition.selectNodeText( '/dd:diagramDefinition/dd:description' ))));
      assertThat( this.diagram.getTitle(), equalTo( this.diagramLocalization.getText( this.diagramDefinition.selectNodeText( '/dd:diagramDefinition/dd:title' ))));
      assertThat( this.diagram.getAuthor(), equalTo( this.diagramLocalization.getText( this.diagramDefinition.selectNodeText( '/dd:diagramDefinition/dd:author' ))));
   },
   
   unmarshall_determinesCanvasProperties : function() {
      this.diagram.unmarshall();
      
      assertThat( this.diagram.getCanvasHeight(), equalTo( parseInt( this.diagramDefinition.selectNodeText( '/dd:diagramDefinition/dd:canvas/@height' ))));
      assertThat( this.diagram.getCanvasWidth(), equalTo( parseInt( this.diagramDefinition.selectNodeText( '/dd:diagramDefinition/dd:canvas/@width' ))));
   },
   
   unmarshall_unmarshallsFigures : function(){
      this.diagram.unmarshall();
      
      assertThat( this.diagram.getFigures().size(), equalTo( this.diagramDefinition.selectNodes( this.constants.FIGURES_SELECTOR ).length ));
      var figures = this.diagramDefinition.selectNodes( this.constants.FIGURES_SELECTOR );
      this.diagram.getFigures().each( function( figure, index ){
         var figureElement = figures[index];
         assertThat( figure.getName(), equalTo(  XmlResource.selectNodeText( "@name", figureElement )));
         assertThat( figure.getPositionX(), equalTo( XmlResource.selectNodeText( "@positionX", figureElement )));
         assertThat( figure.getPositionY(), equalTo( XmlResource.selectNodeText( "@positionY", figureElement )));
      }.bind( this ));
   },
   
   draw_drawsDefinedDiagram : function() {
      this.testCaseChain.chain(
         function(){ this.diagram.unmarshall(); this.diagram.draw( this.diagramContainerElement ); }.bind( this ),
         function(){
            assertThat( this.diagram.getPaintArea().get( 'tag' ).toUpperCase(), equalTo( 'DIV' ));
            assertThat( this.diagram.getPaintArea().get( 'id' ), equalTo( this.diagram.options.paintAreaId ));
            assertThat( this.diagram.getPaintArea().getStyle('height'), equalTo( this.diagram.getCanvasHeight() + "px" ));
            assertThat( this.diagram.getPaintArea().getStyle('width'), equalTo( this.diagram.getCanvasWidth() + "px" ));
            assertThat( this.diagram.getCanvas(), not( nil() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   draw_drawsFigures : function(){
      this.testCaseChain.chain(
         function(){ this.diagram.unmarshall(); this.diagram.draw( this.diagramContainerElement ); }.bind( this ),
         function(){
            this.diagram.getFigures().each( function( figure, index ){
               assertThat( figure.getState(), equalTo( DiagramFigure.States.CONSTRUCTED ));
               assertThat( figure.getId(), equalTo( figure.draw2dObject.id ));
            }.bind( this ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   erase_removesFiguresAndDestroyHtmlElements : function(){
      this.testCaseChain.chain(
         function(){ this.diagram.unmarshall(); this.diagram.draw( this.diagramContainerElement ); }.bind( this ),
         function(){
            this.diagram.erase();
         }.bind( this ),
         function(){
            assertThat( this.diagram.getFigures().size(), equalTo( 0 ));
            assertThat( this.diagramContainerElement.getChildren( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Event handling methods
   onDraw : function(){
      this.testCaseChain.callChain();
   },
   
   onErase : function(){
      this.testCaseChain.callChain();
   },
   
   waitForImageLoading : function(){
      //NOP
   }.protect()

});