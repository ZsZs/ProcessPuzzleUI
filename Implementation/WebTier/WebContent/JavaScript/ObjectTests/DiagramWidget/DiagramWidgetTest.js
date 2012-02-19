window.DiagramWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'unmarshall_determinesCanvasProperties', isAsynchron : false },
         { method : 'unmarshall_unmarshallsFigures', isAsynchron : false },
         { method : 'construct_drawsDefinedDiagram', isAsynchron : true },
         { method : 'construct_drawsFigures', isAsynchron : true },
         { method : 'destroy_removesFiguresAndDestroyHtmlElements', isAsynchron : true }]
   },

   constants : {
      LANGUAGE : "hu",
      DIAGRAM_DATA_URI : "../DiagramWidget/DiagramData.xml",
      DIAGRAM_DEFINITION_URI : "../DiagramWidget/DiagramDefinition.xml",
      DIAGRAM_CONTAINER_ID : "DiagramContainer",
      FIGURES_SELECTOR : "pp:widgetDefinition/figures/class",
      WEBUI_CONFIGURATION_URI : "../DiagramWidget/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.componentStateManager;
      this.diagram;
      this.diagramContainerElement;
      this.diagramData;
      this.diagramDefinition;
      this.diagramInternationalization;
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
      
      this.diagram = new DiagramWidget( {
         onConstructed : this.onConstructed,
         onDestroyed : this.onDestroyed,
         widgetContainerId : this.constants.DIAGRAM_CONTAINER_ID, 
         widgetDefinitionURI : this.constants.DIAGRAM_DEFINITION_URI, 
         widgetDataURI : this.constants.DIAGRAM_DATA_URI 
      }, this.diagramInternationalization );
      this.diagramContainerElement = $( this.constants.DIAGRAM_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      this.diagram.destroy();
      this.diagramData.release();
      this.diagramDefinition.release();
   },
   
   unmarshall_determinesProperties : function() {
      this.diagram.unmarshall();
      
      assertThat( this.diagram.getName(), equalTo( this.diagramDefinition.selectNodeText( 'pp:widgetDefinition/name' )));
      assertThat( this.diagram.getDescription(), equalTo( this.diagramInternationalization.getText( this.diagramDefinition.selectNodeText( 'pp:widgetDefinition/description' ))));
      assertThat( this.diagram.getTitle(), equalTo( this.diagramInternationalization.getText( this.diagramDefinition.selectNodeText( 'pp:widgetDefinition/title' ))));
   },
   
   unmarshall_determinesCanvasProperties : function() {
      this.diagram.unmarshall();
      
      assertThat( this.diagram.getCanvasHeight(), equalTo( parseInt( this.diagramDefinition.selectNodeText( 'pp:widgetDefinition/canvas/@height' ))));
      assertThat( this.diagram.getCanvasWidth(), equalTo( parseInt( this.diagramDefinition.selectNodeText( 'pp:widgetDefinition/canvas/@width' ))));
   },
   
   unmarshall_unmarshallsFigures : function(){
      this.diagram.unmarshall();
      
      assertThat( this.diagram.getFigures().size(), equalTo( this.diagramDefinition.selectNodes( this.constants.FIGURES_SELECTOR ).length ));
      this.diagram.getFigures().each( function( figureEntry, index ){
         var figure = figureEntry.getValue();
         var selectorIndex = index +1;
         assertThat( figure.getId(), equalTo( this.diagramDefinition.selectNodeText( "pp:widgetDefinition/figures/class[" + selectorIndex + "]/@id" )));
         assertThat( figure.getName(), equalTo( this.diagramDefinition.selectNodeText( "pp:widgetDefinition/figures/class[" + selectorIndex + "]/@name" )));
         assertThat( figure.getPositionX(), equalTo( this.diagramDefinition.selectNodeText( "pp:widgetDefinition/figures/class[" + selectorIndex + "]/@positionX" )));
         assertThat( figure.getPositionY(), equalTo( this.diagramDefinition.selectNodeText( "pp:widgetDefinition/figures/class[" + selectorIndex + "]/@positionY" )));
      }.bind( this ));
   },
   
   construct_drawsDefinedDiagram : function() {
      this.testCaseChain.chain(
         function(){ this.diagram.unmarshall(); this.diagram.construct(); }.bind( this ),
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
   
   construct_drawsFigures : function(){
      this.testCaseChain.chain(
         function(){ this.diagram.unmarshall(); this.diagram.construct(); }.bind( this ),
         function(){
            this.diagram.getFigures().each( function( figureEntry, index ){
               var figure = figureEntry.getValue();
               assertThat( figure.getState(), equalTo( DiagramFigure.States.CONSTRUCTED ));
            }.bind( this ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesFiguresAndDestroyHtmlElements : function(){
      this.testCaseChain.chain(
         function(){ this.diagram.unmarshall(); this.diagram.construct(); }.bind( this ),
         function(){
            this.diagram.destroy();
         }.bind( this ),
         function(){
            assertThat( this.diagram.getFigures().size(), equalTo( 0 ));
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