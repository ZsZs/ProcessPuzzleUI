window.DiagramWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'unmarshall_instantiatesAndUnmarshallsDiagram', isAsynchron : false },
         { method : 'construct_drawsDiagram', isAsynchron : true },
         { method : 'destroy_removesFiguresAndDestroyHtmlElements', isAsynchron : true }]
   },

   constants : {
      LANGUAGE : "hu",
      DIAGRAM_CONTAINER_ID : "DiagramContainer",
      DIAGRAM_DEFINITION_URI : "../DiagramWidget/DiagramDefinition.xml",
      DIAGRAM_NAMESPACES : "xmlns:pp='http://www.processpuzzle.com', xmlns:dd='http://www.processpuzzle.com/Diagram', xmlns:uml='http://www.processpuzzle.com/Diagram/UML'",
      FIGURES_SELECTOR : "/dd:diagramDefinition/dd:figures/dd:annotation | //dd:diagramDefinition/dd:figures/uml:class | //dd:diagramDefinition/dd:figures/uml:inheritanceConnection",
      WEBUI_CONFIGURATION_URI : "../DiagramWidget/WebUIConfiguration.xml",
      WIDGET_DEFINITION_URI : "../DiagramWidget/DiagramWidgetDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.componentStateManager;
      this.diagramWidget;
      this.diagramContainerElement;
      this.diagramDefinition;
      this.diagramLocalization;
      this.diagramWidgetDefinition;
      this.messageBus;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.messageBus = new WebUIMessageBus();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.componentStateManager = new ComponentStateManager();
      this.diagramLocalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.diagramLocalization.load( this.locale );
      this.diagramDefinition = new XmlResource( this.constants.DIAGRAM_DEFINITION_URI, { nameSpaces : this.constants.DIAGRAM_NAMESPACES } );
      this.diagramWidgetDefinition = new XmlResource( this.constants.WIDGET_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com'" } );
      
      this.diagramWidget = new DiagramWidget( {
         onConstructed : this.onConstructed,
         onDestroyed : this.onDestroyed,
         widgetContainerId : this.constants.DIAGRAM_CONTAINER_ID, 
         widgetDefinitionURI : this.constants.WIDGET_DEFINITION_URI, 
         widgetDataURI : this.constants.DIAGRAM_DEFINITION_URI 
      }, this.diagramLocalization );
      this.diagramContainerElement = $( this.constants.DIAGRAM_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      this.diagramWidget.destroy();
      this.diagramDefinition.release();
      this.diagramWidgetDefinition.release();
      this.messageBus.tearDown();
      this.componentStateManager.reset();
   },
   
   unmarshall_determinesProperties : function() {
      this.diagramWidget.unmarshall();
      
      assertThat( this.diagramWidget.getName(), equalTo( this.diagramWidgetDefinition.selectNodeText( '/sd:widgetDefinition/sd:name' )));
      assertThat( this.diagramWidget.getDescription(), equalTo( this.diagramWidgetDefinition.selectNodeText( '/sd:widgetDefinition/sd:description' )));
   },
   
   unmarshall_instantiatesAndUnmarshallsDiagram : function() {
      this.diagramWidget.unmarshall();
      
      assertThat( this.diagramWidget.getDiagram(), JsHamcrest.Matchers.instanceOf( Diagram ));
      assertThat( this.diagramWidget.getDiagram().getState(), equalTo( DiagramFigure.States.UNMARSHALLED ));
   },
   
   construct_drawsDiagram : function() {
      this.testCaseChain.chain(
         function(){ this.diagramWidget.unmarshall(); this.diagramWidget.construct(); }.bind( this ),
         function(){
            assertThat( this.diagramWidget.getDiagram().getState(), equalTo( DiagramFigure.States.CONSTRUCTED ));
            assertThat( this.diagramWidget.getDiagram().getFigures().size(), greaterThan( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesFiguresAndDestroyHtmlElements : function(){
      this.testCaseChain.chain(
         function(){ this.diagramWidget.unmarshall(); this.diagramWidget.construct(); }.bind( this ),
         function(){
            this.diagramWidget.destroy();
         }.bind( this ),
         function(){
            assertThat( this.diagramWidget.getDiagram().getState(), equalTo( DiagramFigure.States.INITIALIZED ));
            assertThat( this.diagramWidget.getDiagram().getFigures().size(), equalTo( 0 ));

            assertThat( this.diagramContainerElement.getChildren( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Event handling methods
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function(){
      this.testCaseChain.callChain();
   },
   
   waitForImageLoading : function(){
      //NOP
   }.protect()

});