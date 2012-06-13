window.DocumentElementTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
          { method : 'initialize_setsStateToInitialized', isAsynchron : false },
          { method : 'unmarshall_setsStateToUnMarshalled', isAsynchron : false },
          { method : 'unmarshall_determinesElementProperties', isAsynchron : false },
          { method : 'unmarshall_whenElementIsImage_determinesSource', isAsynchron : false },
          { method : 'unmarshall_whenIdNotGiven_generatesOne', isAsynchron : false },
          { method : 'unmarshall_whenPluginIsSpecified_instantiatesAndUnmarshallsPluginObject', isAsynchron : false },
          { method : 'construct_setsStatusToConstructed', isAsynchron : true }, 
          { method : 'construct_createsNewHtmlElement', isAsynchron : true }, 
          { method : 'consturct_whenElementIsEditable_instantiatesAndassociatesEditor', isAsynchron : true }, 
          { method : 'construct_whenElementIsImage_addsSrcAttribute', isAsynchron : true }, 
          { method : 'construct_whenNotUnmarshalled_raisesException', isAsynchron : false }, 
          { method : 'construct_whenPluginIsSpecified_CallsPluginConstruct', isAsynchron : true }, 
          { method : 'construct_whenPluginResourceIsUnavailable_firesError', isAsynchron : true }, 
          { method : 'destroy_whenUnmarshalled_ResetsProperties', isAsynchron : true }, 
          { method : 'destroy_whenConstructed_RemovesHtmlElement', isAsynchron : true }, 
          { method : 'destroy_whenNotUnmarshalled_raisesException', isAsynchron : false }]
   },

   constants : {
      DOCUMENT_DEFINITION_URI : "../SmartDocument/SmartDocumentDefinition.xml",
      DOCUMENT_CONTAINER_ID : "smartDocument",
      ELEMENT_DEFINITION_WITH_LINK : "/smartDocumentDefinition/documentHeader/compositeElement/element[@id='smartDocumentTitle']",
      ELEMENT_DEFINITION_WITH_SOURCE : "/smartDocumentDefinition/documentHeader/compositeElement/element[@id='processPuzzleLogo']",
      ELEMENT_DEFINITION_WITH_PLUGIN : "/smartDocumentDefinition/documentBody/compositeElement/element[@id='languageSelector']",
      ELEMENT_DEFINITION_WITHOUT_ID : "/smartDocumentDefinition/documentFooter/compositeElement/element[@elementStyle='footerText']",
      ERRONEOUS_DOCUMENT_DEFINITION_URI : "../SmartDocument/ErroneousDocumentDefinition.xml",
      WEBUI_CONFIGURATION_URI : "../SmartDocument/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager;
      this.constructCallbackWasCalled = false;
      this.documentContainerElement;
      this.documentDefinition;
      this.documentElementWithLink;
      this.documentElementWithoutId;
      this.documentElementWithPlugin;
      this.documentElementWithSource;
      this.desktopInternationalization;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.componentStateManager = new ComponentStateManager();
      this.webUIController = new WebUIController({ contextRootPrefix : "../../../", configurationUri : this.constants.WEBUI_CONFIGURATION_URI } );
      this.webUIConfiguration = this.webUIController.getWebUIConfiguration();
      this.webUILogger = this.webUIController.getLogger();
      this.desktopInternationalization = new XMLResourceBundle( this.webUIConfiguration );
      this.desktopInternationalization.load( new Locale({ language : "en" }) );
      
      this.documentDefinition = new XmlResource( this.constants.DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
      this.documentElementWithLink = new DocumentElement( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_WITH_LINK ), this.desktopInternationalization, { isEditable : true, onConstructed : this.onConstructed } );
      this.documentElementWithoutId = new DocumentElement( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_WITHOUT_ID ), this.desktopInternationalization, { isEditable : true, onConstructed : this.onConstructed } );
      this.documentElementWithPlugin = new DocumentElement( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_WITH_PLUGIN ), this.desktopInternationalization, { isEditable : true, onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.documentElementWithSource = new DocumentElement( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_WITH_SOURCE ), this.desktopInternationalization, { isEditable : true, onConstructed : this.onConstructed, onConstructionError : this.onConstructionError });
      this.documentContainerElement = $( this.constants.DOCUMENT_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      this.componentStateManager.reset();
      this.documentDefinition.release();
      this.desktopInternationalization.release();
      
      if( this.documentElementWithLink.getState() > DocumentElement.States.INITIALIZED ) this.documentElementWithLink.destroy();
      if( this.documentElementWithoutId.getState() > DocumentElement.States.INITIALIZED ) this.documentElementWithoutId.destroy();
      if( this.documentElementWithPlugin.getState() > DocumentElement.States.INITIALIZED ) this.documentElementWithPlugin.destroy();
      if( this.documentElementWithSource.getState() > DocumentElement.States.INITIALIZED ) this.documentElementWithSource.destroy();
      this.documentElementWithLink = null;
      this.documentContainerElement = null;
   },
   
   initialize_setsStateToInitialized : function() {
      assertThat( this.documentElementWithLink, not( nil() ));
      assertThat( this.documentElementWithLink.getDefinitionElement(), not( nil() ));
      assertThat( this.documentElementWithLink.getState(), equalTo( DocumentElement.States.INITIALIZED ));
   },
   
   unmarshall_setsStateToUnMarshalled : function() {
      this.documentElementWithLink.unmarshall();
      assertThat( this.documentElementWithLink.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
   },
   
   unmarshall_determinesElementProperties : function() {
      this.documentElementWithLink.unmarshall();
      assertThat( this.documentElementWithLink.getId(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK + "/@id" ) ));
      assertThat( this.documentElementWithLink.getTag().toUpperCase(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK + "/@tag" ).toUpperCase() ));
      assertThat( this.documentElementWithLink.getStyle(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK + "/@elementStyle" )));
      assertThat( this.documentElementWithLink.getText(), equalTo( this.desktopInternationalization.getText( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK ))));
      assertThat( this.documentElementWithLink.getReference(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK + "/@href" )));
   },
   
   unmarshall_whenElementIsImage_determinesSource : function() {
      this.documentElementWithSource.unmarshall();
      assertThat( this.documentElementWithSource.getSource(), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_SOURCE + "/@source" )));
   },
   
   unmarshall_whenIdNotGiven_generatesOne : function() {
      this.documentElementWithoutId.unmarshall();
      assertThat( this.documentElementWithoutId.getId(), not( nil() ));
      assertThat( this.documentElementWithoutId.getId(), containsString( this.documentElementWithoutId.options.idPrefix ));
   },
   
   unmarshall_whenPluginIsSpecified_instantiatesAndUnmarshallsPluginObject : function() {
      this.documentElementWithPlugin.unmarshall();
      assertThat( this.documentElementWithPlugin.getPlugin(), not( nil() ));
      assertThat( this.documentElementWithPlugin.getPlugin().getState(), equalTo( DocumentPlugin.States.UNMARSHALLED ));
   },
   
   construct_setsStatusToConstructed : function() {
      this.testCaseChain.chain(
         function(){
            this.documentElementWithLink.unmarshall();
            this.documentElementWithLink.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentElementWithLink.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_createsNewHtmlElement : function() {
      this.testCaseChain.chain(
         function(){
            this.documentElementWithLink.unmarshall();
            this.documentElementWithLink.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentElementWithLink.getHtmlElement(), not( nil() ));
            assertThat( this.documentElementWithLink.getHtmlElement().tagName, equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK + "/@tag" ).toUpperCase() ));
            assertThat( this.documentElementWithLink.getHtmlElement().get( 'id' ), equalTo( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK + "/@id" ) ));
            assertThat( this.documentElementWithLink.getHtmlElement().get( 'text' ), equalTo( this.desktopInternationalization.getText( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK ))));
            assertThat( this.documentElementWithLink.getHtmlElement().hasClass( this.documentDefinition.selectNodeText( this.constants.ELEMENT_DEFINITION_WITH_LINK + "/@elementStyle" )), is( true ));
            assertThat( this.documentContainerElement.getChildren(), hasItem( this.documentElementWithLink.getHtmlElement() ));
            
            var nestedAnchorElement = this.documentElementWithLink.getHtmlElement().getElement( 'a' ); 
            assertThat( nestedAnchorElement, not( nil() ));
            assertThat( nestedAnchorElement.get( 'href' ), equalTo( this.documentElementWithLink.getReference() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   consturct_whenElementIsEditable_instantiatesAndassociatesEditor : function() {
      this.testCaseChain.chain(
         function(){
            this.documentElementWithLink.unmarshall();
            this.documentElementWithLink.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( instanceOf( this.documentElementWithLink.getEditor(), DocumentElementEditor ), is( true ));
            assertThat( this.documentElementWithLink.getEditor().getSubjectElement(), equalTo( this.documentElementWithLink.getHtmlElement() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenElementIsImage_addsSrcAttribute : function() {
      this.testCaseChain.chain(
         function(){
            this.documentElementWithSource.unmarshall();
            this.documentElementWithSource.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentElementWithSource.getHtmlElement().get( 'src' ), equalTo( this.documentElementWithSource.getSource() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenNotUnmarshalled_raisesException : function() {
      try{
         this.documentElementWithLink.construct( this.documentContainerElement, "bottom" );
         fail();
      }catch( e ){
         assertThat( instanceOf( e, UnconfiguredDocumentElementException ), is( true ));
      }
   },
   
   construct_whenPluginIsSpecified_CallsPluginConstruct : function() {
      this.testCaseChain.chain(
         function(){
            this.documentElementWithPlugin.unmarshall();
            pluginLoadResourcesMethod = spy( this.documentElementWithPlugin.getPlugin().loadResources ); 
            pluginConstructMethod = spy( this.documentElementWithPlugin.getPlugin().construct ); 
            this.documentElementWithPlugin.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentElementWithPlugin.getState(), equalTo( DocumentElement.States.CONSTRUCTED ));
            verify( pluginLoadResourcesMethod );
            verify( pluginConstructMethod );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_whenPluginResourceIsUnavailable_firesError : function() {
      this.testCaseChain.chain(
         function(){
            this.documentDefinition = new XmlResource( this.constants.ERRONEOUS_DOCUMENT_DEFINITION_URI, { nameSpaces : "xmlns:sd='http://www.processpuzzle.com/SmartDocument'" } );
            this.documentElementWithPlugin = new DocumentElement( this.documentDefinition.selectNode( this.constants.ELEMENT_DEFINITION_WITH_PLUGIN ), this.desktopInternationalization, { onConstructed : this.onConstructed, onConstructionError : this.onConstructionError } );              
            this.documentElementWithPlugin.unmarshall();
            this.documentElementWithPlugin.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentElementWithPlugin.isSuccess(), is( false ));
            assertThat( this.documentElementWithPlugin.getState(), equalTo( DocumentElement.States.UNMARSHALLED ));
            assertThat( this.documentContainerElement.getChildren().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenUnmarshalled_ResetsProperties : function() {
      this.testCaseChain.chain(
         function(){
            this.documentElementWithLink.unmarshall();
            this.documentElementWithLink.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            this.documentElementWithLink.destroy();
            
            //VERIFY:
            assertThat( this.documentElementWithLink.getId(), nil() );
            assertThat( this.documentElementWithLink.getTag(), nil() );
            assertThat( this.documentElementWithLink.getStyle(), nil() );
            assertThat( this.documentElementWithLink.getBind(), nil() );
            assertThat( this.documentElementWithLink.getText(), nil() );
            assertThat( this.documentElementWithLink.getReference(), nil() );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenConstructed_RemovesHtmlElement : function() {
      this.testCaseChain.chain(
         function(){
            this.documentElementWithLink.unmarshall();
            this.documentElementWithLink.construct( this.documentContainerElement, "bottom" );
         }.bind( this ),
         function(){
            assertThat( this.documentContainerElement.getChildren(), hasItem( this.documentElementWithLink.getHtmlElement() ));
            this.documentElementWithLink.destroy();
            assertThat.delay( 1000, this, this.documentContainerElement.getChildren().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_whenNotUnmarshalled_raisesException : function() {
      try{
         this.documentElementWithLink.destroy();
         fail();
      }catch( e ){
         assertThat( instanceOf( e, UnconfiguredDocumentElementException ), is( true ));
      }
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },

   onConstructionError : function(){
      this.testCaseChain.callChain();
   }

});