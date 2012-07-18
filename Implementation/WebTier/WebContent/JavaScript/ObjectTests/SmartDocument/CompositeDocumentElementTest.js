window.CompositeDocumentElementTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
          { method : 'initialize_instantiatesElementsList', isAsynchron : false },
          { method : 'unmarshall_unmarshallsNestedElements', isAsynchron : false },
          { method : 'construct_setsStatusToConstructed', isAsynchron : true }, 
          { method : 'construct_whenPluginIsSpecified_setsStatusToConstructed', isAsynchron : true }, 
          { method : 'construct_constructsNestedElements', isAsynchron : true }, 
          { method : 'construct_whenNestedElementConstructionFails_firesError', isAsynchron : true }, 
          { method : 'destroy_whenConstructed_destroysHtmlElements', isAsynchron : true }, 
          { method : 'destroy_whenPluginConstructed_destroysHtmlAllElements', isAsynchron : true }]
   },

   constants : {
      CALL_CHAIN_DELAY : 500,
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      DOCUMENT_CONTAINER_ID : "documentContainer",
      ELEMENT_DEFINITION_WITH_PLUGIN : "/sd:smartDocumentDefinition/sd:documentBody/sd:compositeElement[@id='languageSelectorWrapper']",
      ELEMENT_SELECTOR : "/sd:smartDocumentDefinition/sd:documentHeader/sd:compositeElement",
      ELEMENT_NAME : "SmartDocumentTitle",
      ELEMENT_STYLE : "headerText",
      ELEMENT_TAG : "h1",
      ELEMENT_TEXT : "SmartDocument.headerText",
      ERRONEOUS_DOCUMENT_DEFINITION_URI : "../SmartDocument/ErroneousDocumentDefinition.xml",
      NESTED_SIMPLE_ELEMENT_NAME : "smartDocumentTitle",
      WEBUI_CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager;
      this.compositeElement;
      this.compositeElementWithPlugin;
      this.documentContainerElement;
      this.documentDefinition;
      this.elementDefinition;
      this.elementDefinitionWithPlugin;
      this.internationalization;
      this.webUIConfiguration;
      this.webUILogger;
      this.webUIMessageBus;
   },   

   beforeEachTest : function(){
      this.componentStateManager = new ComponentStateManager();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.webUIMessageBus = new WebUIMessageBus();
      this.internationalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.internationalization.load( new ProcessPuzzleLocale({ language : "en" }) );
      
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.elementDefinition = this.documentDefinition.selectNode( this.constants.ELEMENT_SELECTOR );
      this.elementDefinitionWidthPlugin = this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_WITH_PLUGIN );
      this.compositeElement = new CompositeDocumentElement( this.elementDefinition, this.internationalization, null, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError } );
      this.compositeElementWithPlugin = new CompositeDocumentElement( this.elementDefinitionWidthPlugin, this.internationalization, null, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError } );
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      this.webUIMessageBus.tearDown();
      this.componentStateManager.reset();
      this.documentDefinition.release();
      this.internationalization.release();
      
      if( this.compositeElement.getState() > DocumentElement.States.INITIALIZED ) this.compositeElement.destroy();
      if( this.compositeElementWithPlugin.getState() > DocumentElement.States.INITIALIZED ) this.compositeElementWithPlugin.destroy();
      
      this.compositeElement = null;         
      this.documentContainerElement = null;
   },
   
   initialize_instantiatesElementsList : function() {
      assertThat( this.compositeElement, not( nil() ));
      assertThat( this.compositeElement.getElements(), not( nil() ));
   },
   
   unmarshall_unmarshallsNestedElements : function() {
      this.compositeElement.unmarshall();
      assertThat( this.compositeElement.getElements().size(), equalTo( XmlResource.selectNodes( "sd:compositeElement | sd:element", this.elementDefinition ).length ));
   },
   
   construct_setsStatusToConstructed : function() {
      this.testCaseChain.chain(
         function(){ this.compositeElement.unmarshall(); this.compositeElement.construct( this.documentContainerElement, 'bottom' ); }.bind( this ),
         function(){
            assertThat( this.compositeElement.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenPluginIsSpecified_setsStatusToConstructed : function() {
      this.testCaseChain.chain(
         function(){ this.compositeElementWithPlugin.unmarshall(); this.compositeElementWithPlugin.construct( this.documentContainerElement, 'bottom' ); }.bind( this ),
         function(){
            assertThat( this.compositeElementWithPlugin.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            assertThat( this.compositeElementWithPlugin.getElements().get( "languageSelector" ).getPlugin().getState(), equalTo( DocumentPlugin.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_constructsNestedElements : function() {
      this.testCaseChain.chain(
         function(){ this.compositeElement.unmarshall(); this.compositeElement.construct( this.documentContainerElement, 'bottom' ); }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren(), hasItem( this.compositeElement.getHtmlElement() ));
            assertThat( this.documentContainerElement.getElements( '*' ), hasItem( this.compositeElement.getElement( this.constants.NESTED_SIMPLE_ELEMENT_NAME  ).getHtmlElement() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenNestedElementConstructionFails_firesError : function() {
      this.testCaseChain.chain(
         function(){
            this.documentDefinition = new XmlResource( this.constants.ERRONEOUS_DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
            this.elementDefinition = this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_WITH_PLUGIN );
            this.compositeElement = new CompositeDocumentElement( this.elementDefinition, this.internationalization, null, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError } );
            this.compositeElement.unmarshall();
            this.compositeElement.construct( this.documentContainerElement, 'bottom' );
         }.bind( this ),
         function(){
            assertThat( this.compositeElement.isSuccess(), is( false ));
            assertThat( this.compositeElement.getState(), equalTo( DocumentElement.States.INITIALIZED ));
            assertThat( this.documentContainerElement.getChildren().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenConstructed_destroysHtmlElements : function() {
      this.testCaseChain.chain(
         function(){ this.compositeElement.unmarshall(); this.compositeElement.construct( this.documentContainerElement, 'bottom' ); }.bind( this ),
         function(){
            this.compositeElement.destroy();
            assertThat( this.documentContainerElement.getChildren().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenPluginConstructed_destroysHtmlAllElements : function() {
      this.testCaseChain.chain(
         function(){ this.compositeElementWithPlugin.unmarshall(); this.compositeElementWithPlugin.construct( this.documentContainerElement, 'bottom' ); }.bind( this ),
         function(){
            this.compositeElementWithPlugin.destroy();
            assertThat( this.documentContainerElement.getChildren().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },

   onConstructionError : function( error ){
      this.error = error;
      this.testCaseChain.callChain();
   }
});