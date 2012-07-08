window.DesktopDocumentTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onError'],

   options : {
      testMethods : 
         [{ method : 'initialize_setsState', isAsynchron : false}, 
          { method : 'initialize_determinesContainerElement', isAsynchron : false}, 
          { method : 'unmarshall_determinesHeaderProperties'}, 
          { method : 'unmarshall_instantiatesAndUnmarshallsDocument' },
          { method : 'construct_constructsDocument', isAsynchron : true },
          { method : 'destroy_destroysDocument', isAsynchron : true }]
   },

   constants : {
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      DESKTOP_CONTAINER_ID : "Desktop",
      HEADER_DEFINITION_SELECTOR : "/desktopConfiguration/header",
      WEBUI_CONFIGURATION_URI : "../Desktop/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.componentStateManager;
      this.desktopDefinition;
      this.desktopDocument;
      this.desktopInternationalization;
      this.headerDefinition;
      this.webUIConfiguration;
      this.webUILogger;
      this.webUIMessageBus;
   },

   beforeEachTest : function(){
      this.inform( "beforeEachTest" );
      this.componentStateManager = new ComponentStateManager();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.webUIMessageBus = new WebUIMessageBus();
      this.desktopInternationalization = new XMLResourceBundle( this.webUIConfiguration );
      this.desktopInternationalization.load( new ProcessPuzzleLocale({ language : "en" }) );
        
      this.desktopDefinition = new XmlResource( this.constants.DESKTOP_CONFIGURATION_URI );
      this.headerDefinition = this.desktopDefinition.selectNode( this.constants.HEADER_DEFINITION_SELECTOR );
      this.desktopDocument = new DesktopDocument( 
         this.headerDefinition, 
         this.desktopInternationalization, 
         { componentContainerId : this.constants.DESKTOP_CONTAINER_ID, onConstructed : this.onConstructed, onError : this.onError } );
   },
   
   afterEachTest : function (){
      if( this.desktopDocument.getState() > DesktopElement.States.INITIALIZED ) this.desktopDocument.destroy();
      this.componentStateManager.reset();
      this.desktopDocument = null;
   },
   
   initialize_setsState : function() {
      assertThat( this.desktopDocument, not( nil() ));
      assertThat( this.desktopDocument.getDefinitionElement(), not( nil() ));
      assertThat( this.desktopDocument.getState(), equalTo( DesktopElement.States.INITIALIZED ));
   },
   
   initialize_determinesContainerElement : function(){
      assertThat( this.desktopDocument.getContainerElement(), equalTo( $( this.desktopDocument.getContainerElementId() )));
   },
     
   unmarshall_determinesHeaderProperties : function(){
      this.desktopDocument.unmarshall();
      
      //VERIFY:
      assertThat( this.desktopDocument.getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
      assertThat( this.desktopDocument.getDocumentDefinitionUri(), equalTo( this.desktopDefinition.selectNodeText( this.constants.HEADER_DEFINITION_SELECTOR + "/@documentDefinition" )));
   },
   
   unmarshall_instantiatesAndUnmarshallsDocument : function(){
      this.desktopDocument.unmarshall();
      
      //VERIFY:
      assertThat( instanceOf( this.desktopDocument.getDocument(), SmartDocument ), is( true ));
      assertThat( this.desktopDocument.getDocument().getState(), equalTo( AbstractDocument.States.UNMARSHALLED ));
   },
   
   construct_constructsDocument : function(){
      this.testCaseChain.chain(
         function(){
            this.desktopDocument.unmarshall();
            this.desktopDocument.construct();
         }.bind( this ),
         function(){
            assertThat( this.desktopDocument.getDocument().getState(), equalTo( AbstractDocument.States.CONSTRUCTED ));
            assertThat( $( this.constants.DESKTOP_CONTAINER_ID ).getChildren( '*' ).length, greaterThan( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysDocument : function(){
      this.testCaseChain.chain(
         function(){
            this.desktopDocument.unmarshall();
            this.desktopDocument.construct();
         }.bind( this ),
         function(){
            this.desktopDocument.destroy();
            
            //VERIFY:
            assertThat( this.desktopDocument.getState(), equalTo( DesktopElement.States.INITIALIZED ));
            assertThat( this.desktopDocument.getDocument(), nil() );
            assertThat( $( this.constants.DESKTOP_CONTAINER_ID ).getChildren( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },

   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onError : function( error ){
      this.testCaseChain.clearChain();
      this.testMethodReady( error );
   }

});