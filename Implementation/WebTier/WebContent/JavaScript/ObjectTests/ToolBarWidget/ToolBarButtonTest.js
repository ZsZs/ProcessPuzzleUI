window.ToolBarButtonTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialization_setsState', isAsynchron : false },
         { method : 'unmarshall_determinesProperties', isAsynchron : false }, 
         { method : 'construct_instantiatesLiAndSpanElements', isAsynchron : false },
         { method : 'destroy_destroysAllCreatedElements', isAsynchron : false }]
   },

   constants : {
      LANGUAGE : "hu",
      TOOLBAR_BUTTON_SELECTOR : "/tb:toolBarDefinition/tb:buttons/tb:button[@name='alignLeft']",
      TOOLBAR_CONTAINER_ID : "TestToolbar",
      TOOLBAR_DEFINITION_URI : "../ToolBarWidget/ToolBarDefinition.xml",
      TOOLBAR_WIDGET_URI : "../ToolBarWidget/ToolBarWidgetDefinition.xml",
      WEBUI_CONFIGURATION_URI : "../ToolBarWidget/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager;
      this.elementFactory;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.toolBarButton;
      this.toolBarContainerEelement;
      this.toolBarButtonDefinition;
      this.toolBarDefinition;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
      this.webUIMessageBus;
   },   

   beforeEachTest : function(){
      this.componentStateManger = new ComponentStateManager();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.webUIMessageBus = new WebUIMessageBus();
      this.toolBarInternationalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.toolBarInternationalization.load( this.locale );
      this.toolBarDefinition = new XmlResource( this.constants.TOOLBAR_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com', xmlns:tb='http://www.processpuzzle.com/ToolBar" });
      this.toolBarButtonDefinition = this.toolBarDefinition.selectNode( this.constants.TOOLBAR_BUTTON_SELECTOR );

      this.toolBarContainerElement = $( this.constants.TOOLBAR_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.toolBarContainerElement, this.toolBarInternationalization );
      
      this.toolBarButton = new ToolBarButton( this.toolBarButtonDefinition, this.elementFactory );
   },
   
   afterEachTest : function (){
      this.toolBarDefinition.release();
      this.toolBarButton.destroy();
   },
   
   initialization_setsState : function(){
      assertThat( this.toolBarButton.getState(), equalTo( ToolBarButton.States.INITIALIZED ));
   },
   
   unmarshall_determinesProperties : function(){
      this.toolBarButton.unmarshall();
      assertThat( this.toolBarButton.getCaption(), equalTo( this.toolBarDefinition.selectNodeText( this.constants.TOOLBAR_BUTTON_SELECTOR + "/tb:caption" )));
      assertThat( this.toolBarButton.getIconImage(), equalTo( this.toolBarDefinition.selectNodeText( this.constants.TOOLBAR_BUTTON_SELECTOR + "/tb:iconImage" )));
      assertThat( this.toolBarButton.getMessageProperties(), equalTo( this.toolBarDefinition.selectNodeText( this.constants.TOOLBAR_BUTTON_SELECTOR + "/pp:messageProperties" )));
      assertThat( this.toolBarButton.getName(), equalTo( this.toolBarDefinition.selectNodeText( this.constants.TOOLBAR_BUTTON_SELECTOR + "/@name" )));
   },
   
   construct_instantiatesLiAndSpanElements : function(){
      this.toolBarButton.unmarshall();
      this.toolBarButton.construct( this.toolBarContainerElement );
      assertThat( this.toolBarContainerElement.getElementById( this.toolBarButton.getName() ).get( 'tag' ), equalTo( 'li' ));
   },
   
   destroy_destroysAllCreatedElements : function(){
      this.toolBarButton.unmarshall();
      this.toolBarButton.construct( this.toolBarContainerElement );

      this.toolBarButton.destroy();
      
      assertThat( this.toolBarContainerElement.getElements( '*' ).length, equalTo( 0 ));
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});