window.ToolBarWidgetTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onButtonSelected', 'onConstructed', 'onConstructionError', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'initialize_setsState', isAsynchron : false },
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'unmarshall_unmarshallsButtonsAndDividers', isAsynchron : false },
         { method : 'construct_instantiatesWrapperDIVWithId', isAsynchron : true },
         { method : 'construct_instantiatesWrapperDIVWithId', isAsynchron : true },
         { method : 'construct_instantiatesWrapperULVWithStyle', isAsynchron : true },
         { method : 'onButtonSelection_instantiatesAndSendsMenuSelectedMessage', isAsynchron : true },
         { method : 'destroy_destroysAllCreatedElements', isAsynchron : true }]
   },

   constants : {
      LANGUAGE : "hu",
      TOOLBAR_CONTAINER_ID : "ToolBarContainer",
      TOOLBAR_DEFINITION_URI : "../ToolBarWidget/ToolBarDefinition.xml",
      TOOLBAR_WIDGET_URI : "../ToolBarWidget/ToolBarWidgetDefinition.xml",
      WEBUI_CONFIGURATION_URI : "../ToolBarWidget/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.receivedMessage;
      this.toolBar;
      this.toolBarContainerEelement;
      this.toolBarDefinition;
      this.testCaseChain = new Chain();
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
      this.webUIMessageBus;
   },   

   beforeEachTest : function(){
      this.componentStateManger = new ComponentStateManager();
      this.webUIMessageBus = new WebUIMessageBus();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.toolBarInternationalization = new LocalizationResourceManager( this.webUIConfiguration );
      this.toolBarInternationalization.load( this.locale );
      this.toolBarDefinition = new XmlResource( this.constants.TOOLBAR_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com', xmlns:tb='http://www.processpuzzle.com/ToolBar" });
      
      this.toolBar = new ToolBarWidget({ 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         onDestroyed : this.onDestroyed,
         widgetContainerId : this.constants.TOOLBAR_CONTAINER_ID, 
         widgetDataURI : this.constants.TOOLBAR_DEFINITION_URI, 
         widgetDefinitionURI : this.constants.TOOLBAR_WIDGET_URI 
      }, this.toolBarInternationalization );
      
      this.toolBarContainerEelement = $( this.constants.TOOLBAR_CONTAINER_ID );
   },
   
   afterEachTest : function (){
      this.webUIMessageBus.tearDown();
      this.toolBarDefinition.release();
      this.toolBar.destroy();
      receivedMessage = null;
   },
   
   initialize_setsState : function(){
      assertThat( this.toolBar.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
   },
   
   unmarshall_determinesProperties : function(){
      this.toolBar.unmarshall();
      assertThat( this.toolBar.getName(), equalTo( this.toolBarDefinition.selectNodeText( "/tb:toolBarDefinition/tb:name" )));
      assertThat( this.toolBar.getDescription(), equalTo( this.toolBarDefinition.selectNodeText( "/tb:toolBarDefinition/tb:description" )));
      assertThat( this.toolBar.getListStyle(), equalTo( this.toolBarDefinition.selectNodeText( "/tb:toolBarDefinition/tb:buttons/@elementStyle" )));
   },

   unmarshall_unmarshallsButtonsAndDividers : function(){
      this.toolBar.unmarshall();
      
      var numberOfButtons = this.toolBarDefinition.selectNodes( "/tb:toolBarDefinition/tb:buttons/tb:button" ).length;
      var numberOfDividers = this.toolBarDefinition.selectNodes( "/tb:toolBarDefinition/tb:buttons/tb:divider" ).length;
      
      assertThat( this.toolBar.getButtons().size(), equalTo( numberOfButtons + numberOfDividers ));
      this.toolBar.getButtons().each( function( buttonEntry, index ){
         var toolBarButton = buttonEntry.getValue();
         assertThat( toolBarButton.getState(), equalTo( ToolBarButton.States.UNMARSHALLED ));
      }, this );
   },
   
   construct_instantiatesWrapperDIVWithId : function(){
      this.testCaseChain.chain(
         function(){ this.toolBar.unmarshall(); this.toolBar.construct(); }.bind( this ),
         function(){
            assertThat( this.toolBarContainerEelement.getElementById( this.toolBar.getName() ).get( 'tag' ), equalTo( 'div' ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },

   construct_instantiatesWrapperDIVWithId : function(){
      this.testCaseChain.chain(
         function(){ this.toolBar.unmarshall(); this.toolBar.construct(); }.bind( this ),
         function(){
            assertThat( this.toolBarContainerEelement.getElementById( this.toolBar.getName() ).get( 'tag' ), equalTo( 'div' ));
            assertThat( this.toolBarContainerEelement.getElementById( this.toolBar.getName() ).getElement( 'ul' ), not( nil() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },

   construct_instantiatesWrapperULVWithStyle : function(){
      this.testCaseChain.chain(
         function(){ this.toolBar.unmarshall(); this.toolBar.construct(); }.bind( this ),
         function(){
            assertThat( this.toolBarContainerEelement.getElementById( this.toolBar.getName() ).getElement( 'ul' ), not( nil() ));
            assertThat( this.toolBarContainerEelement.getElementById( this.toolBar.getName() ).getElement( 'ul' ).hasClass( this.toolBar.getListStyle() ), is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onButtonSelection_instantiatesAndSendsMenuSelectedMessage : function(){
      this.testCaseChain.chain(
         function(){ this.toolBar.unmarshall(); this.toolBar.construct(); }.bind( this ),
         function(){
            this.webUIMessageBus.subscribeToMessage( MenuSelectedMessage, this.onButtonSelected );
            this.toolBar.onButtonSelection( this.toolBar.getButtons().get( this.toolBarDefinition.selectNodeText( "/tb:toolBarDefinition/tb:buttons/tb:button[@name='alignLeft']/@name" )));
            
            assertThat( instanceOf( receivedMessage, MenuSelectedMessage ), is( true ));
            assertThat( receivedMessage.getOriginator(), equalTo( this.toolBar.getName() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysAllCreatedElements : function(){
      this.testCaseChain.chain(
         function(){ this.toolBar.unmarshall(); this.toolBar.construct(); }.bind( this ),
         function(){
            this.toolBar.destroy();
         }.bind( this ),
         function(){
            assertThat( this.toolBarContainerEelement.getElements().length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onButtonSelected : function( message ){
      receivedMessage = message;
   },

   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function( error ){
      this.error = error;
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function( error ){
      this.testCaseChain.callChain();
   }

});