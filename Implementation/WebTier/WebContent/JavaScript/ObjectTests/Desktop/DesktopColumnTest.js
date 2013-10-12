window.DesktopColumnTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onError'],

   options : {
      testMethods : [
         { method : 'initialize_setsState', isAsynchron : false },
         { method : 'unmarshall_SetsState', isAsynchron : false },
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'construct_instantiatesMUIColumn', isAsynchron : true },
         { method : 'destroy_destroysMUIColumn', isAsynchron : true }]
   },

   constants : {
      DESKTOP_CONFIGURATION_NAMESPACE : "xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration' xmlns:pp='http://www.processpuzzle.com' xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      DESKTOP_CONFIGURATION_URI : "../Desktop/Skins/ProcessPuzzle/DesktopConfiguration.xml",
      DESKTOP_CONTAINER_ID : "desktop",
      COLUMN_DEFINITION : "/dc:desktopConfiguration/dc:columns/dc:column[@name='leftColumn']",
      PAGE_WRAPPER_ID : "pageWrapper",
      WEBUI_CONFIGURATION_URI : "../Desktop/WebUIConfiguration.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.column;
      this.desktopContainerElement;
      this.desktopDefinition;
      this.elementDefinition;
      this.pageWrapperElement;
      this.webUIConfiguration;
      this.webUIController;
      this.webUILogger;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      
      this.desktopDefinition = new XmlResource( this.constants.DESKTOP_CONFIGURATION_URI, { nameSpaces : this.constants.DESKTOP_CONFIGURATION_NAMESPACE } );
      this.elementDefinition = this.desktopDefinition.selectNode( this.constants.COLUMN_DEFINITION );
      this.column = new DesktopColumn( this.elementDefinition, { componentContainerId : this.constants.DESKTOP_CONTAINER_ID, onConstructed : this.onConstructed, onError : this.onError } );
      this.desktopContainerElement = $( this.constants.DESKTOP_CONTAINER_ID );
      this.pageWrapperElement = $( this.constants.PAGE_WRAPPER_ID );
   },
   
   afterEachTest : function (){
      this.desktopDefinition.release();
      this.column.destroy();
      this.desktopContainerElement = null;
   },
   
   initialize_setsState : function() {
      assertThat( this.column.getState(), equalTo( DesktopElement.States.INITIALIZED ));
   },
   
   unmarshall_SetsState : function() {
      this.column.unmarshall();
      
      assertThat( this.column.getState(), equalTo( DesktopElement.States.UNMARSHALLED ));
   },
   
   unmarshall_determinesProperties : function() {
      this.column.unmarshall();
      
      //VERIFY:
      assertThat( this.column.getName(), equalTo( this.desktopDefinition.selectNode( this.constants.COLUMN_DEFINITION + "/@name" ).value ));
      assertThat( this.column.getPlacement(), equalTo( this.desktopDefinition.selectNode( this.constants.COLUMN_DEFINITION + "/@placement" ).value ));
      assertThat( this.column.getWidth(), equalTo( this.desktopDefinition.selectNode( this.constants.COLUMN_DEFINITION + "/@width" ).value ));
      assertThat( this.column.getMinimumWidth(), equalTo( this.desktopDefinition.selectNode( this.constants.COLUMN_DEFINITION + "/@minimumWidth" ).value ));
      assertThat( this.column.getMaximumWidth(), equalTo( this.desktopDefinition.selectNode( this.constants.COLUMN_DEFINITION + "/@maximumWidth" ).value ));
   },
   
   construct_instantiatesMUIColumn : function() {
      this.testCaseChain.chain(
         function(){
            this.column.unmarshall();
            MUI.myChain = new Chain();
            MUI.myChain.chain( function(){ MUI.Desktop.initialize({ desktop : this.constants.DESKTOP_CONTAINER_ID, pageWrapper : this.constants.PAGE_WRAPPER_ID });}.bind( this ) );
            MUI.myChain.callChain();
            this.column.construct();
         }.bind( this ),
         function(){
            assertThat( this.column.getMUIColumn(), not( nil() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysMUIColumn : function() {
      this.testCaseChain.chain(
         function(){
            this.column.unmarshall();
            MUI.myChain = new Chain();
            MUI.myChain.chain( function(){ MUI.Desktop.initialize({ desktop : this.constants.DESKTOP_CONTAINER_ID, pageWrapper : this.constants.PAGE_WRAPPER_ID });}.bind( this ) );
            MUI.myChain.callChain();
            this.column.construct();
         }.bind( this ),
         function(){
            this.column.destroy();
            
            assertThat( this.pageWrapperElement.getChildren( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onError : function( error ){
      this.testCaseChain.callChain();
   }

});