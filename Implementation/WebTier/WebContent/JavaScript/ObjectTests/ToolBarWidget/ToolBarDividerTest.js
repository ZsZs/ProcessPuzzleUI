window.ToolBarDividerTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_setsState', isAsynchron : false },
         { method : 'unmarshall_determinesProperties', isAsynchron : false }, 
         { method : 'construct_instantiatesLiAndSpanElements', isAsynchron : false },
         { method : 'destroy_destroysAllCreatedElements', isAsynchron : false }]
   },

   constants : {
      LANGUAGE : "hu",
      TOOLBAR_BUTTON_SELECTOR : "/tb:toolBarDefinition/tb:buttons/tb:divider[1]",
      TOOLBAR_CONTAINER_ID : "TestToolbar",
      TOOLBAR_DEFINITION_URI : "../ToolBarWidget/ToolBarDefinition.xml",
      WEBUI_CONFIGURATION_URI : "../ToolBarWidget/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager;
      this.elementFactory;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.toolBarDivider;
      this.toolBarContainerEelement;
      this.toolBarDividerDefinition;
      this.toolBarDefinition;
      this.testCaseChain = new Chain();
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
      this.toolBarDefinition = new XmlResource( this.constants.TOOLBAR_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com' xmlns:tb='http://www.processpuzzle.com/ToolBar'" });
      this.toolBarDividerDefinition = this.toolBarDefinition.selectNode( this.constants.TOOLBAR_BUTTON_SELECTOR );
      
      this.toolBarContainerElement = $( this.constants.TOOLBAR_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.toolBarContainerElement, this.toolBarInternationalization );
      
      this.toolBarDivider = new ToolBarDivider( this.toolBarDividerDefinition, this.elementFactory );
   },
   
   afterEachTest : function (){
      this.toolBarDefinition.release();
      this.toolBarDivider.destroy();
   },
   
   initialize_setsState : function(){
      assertThat( this.toolBarDivider.getState(), equalTo( ToolBarButton.States.INITIALIZED ));
   },
   
   unmarshall_determinesProperties : function(){
      this.toolBarDivider.unmarshall();
      assertThat( this.toolBarDivider.getIconImage(), equalTo( this.toolBarDefinition.selectNodeText( this.constants.TOOLBAR_BUTTON_SELECTOR + "/tb:iconImage" )));
   },
   
   construct_instantiatesLiAndSpanElements : function(){
      this.toolBarDivider.unmarshall();
      this.toolBarDivider.construct( this.toolBarContainerElement );
      assertThat( this.toolBarContainerElement.getChildren( 'li' ).length, equalTo( 1 ));
      assertThat( this.toolBarContainerElement.getChildren( 'li span' ).length, equalTo( 1 ));
      assertThat( this.toolBarContainerElement.getChildren( 'li span img' ).length, equalTo( 1 ));
   },
   
   destroy_destroysAllCreatedElements : function(){
      this.toolBarDivider.unmarshall();
      this.toolBarDivider.construct( this.toolBarContainerElement );
      
      this.toolBarDivider.destroy();
      
      assertThat( this.toolBarContainerElement.getElements( '*' ).length, equalTo( 0 ));
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});