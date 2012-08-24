window.TabTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess', 'onTabSelected'],

   options : {
      testMethods : [
          { method : 'initialize_setsDefaultValues', isAsynchron : false },
          { method : 'initialize_whenDefinitionArgumentIsMissing_throwsException', isAsynchron : false },
          { method : 'unmarshall_determinesProperties', isAsynchron : false },
          { method : 'construct_createsLiAndAnchorElements', isAsynchron : false },
          { method : 'activate_setsLIElementId', isAsynchron : false },
          { method : 'deActivate_removesLIElementId', isAsynchron : false }, 
          { method : 'equals_whenTabsAreSame_returnsTrue', isAsynchron : false}, 
          { method : 'equals_whenDifferentClass_returnsFalse', isAsynchron : false }, 
          { method : 'onSelection_activatesTabAndFiresEvent', isAsynchron : false }, 
          { method : 'click_callsOnSelection', isAsynchron : false }, 
          { method : 'destroy_destroysHtmlElement', isAsynchron : false }]
   },

   constants : {
      LANGUAGE : "hu",
      TAB_DEFINITION_SELECTOR : "/td:tabsDefinition/td:tabs/td:tab[@tabId='tabTwo']",
      TAB_NAME : "aTab",
      TAB_WIDGET_ID : "TabWidget",
      WEBUI_CONFIGURATION_URI : "../TabWidget/WebUIConfiguration.xml",
      WIDGET_DEFINITION_URI : "../TabWidget/TabsDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.tab;
      this.componentStateManager;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.messageBus;
      this.onTabSelectedWasCalled;
      this.parentElement;
      this.resourceBundle;
      this.tabDefinition;
      this.targetObject;
      this.webUIConfiguration;
      this.webUILogger;
      this.tabsDefinition;
   },   

   beforeEachTest : function(){
      this.onTabSelectedWasCalled = false;
      this.messageBus = new WebUIMessageBus();
      this.componentStateManager = new ComponentStateManager();
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      
      this.tabsDefinition = new XmlResource( this.constants.WIDGET_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com' xmlns:td='http://www.processpuzzle.com/TabsDefinition'" });
      this.tabDefinition = this.tabsDefinition.selectNode( this.constants.TAB_DEFINITION_SELECTOR );
      
      this.tab = new Tab( this.tabDefinition, this.resourceBundle, { onTabSelected : this.onTabSelected } );
      parentElement = $$( 'ul.Tabs' );
   },
   
   afterEachTest : function (){
      this.messageBus.tearDown();
      if( this.tab.isVisible() ) this.tab.destroy();
      this.tab = null;
   },
   
   initialize_setsDefaultValues : function (){
      assertThat( this.tab.isVisible(), is( false ));
      assertThat( this.tab.isActive(), is( false ));
   },
   
   initialize_whenDefinitionArgumentIsMissing_throwsException : function(){
      try{ 
         new Tab();
         fail("No exception was thrown.");
      }catch(e) {
         assertThat( instanceOf( e, JsUnit.Failure ), is( true ));
      }
   },

   unmarshall_determinesProperties : function(){
      this.tab.unmarshall();
      
      assertThat( this.tab.getId(), equalTo( this.tab.options.idPrefix + XmlResource.selectNodeText( "@tabId", this.tabDefinition )));
      assertThat( this.tab.getCaption(), equalTo( this.resourceBundle.getText( XmlResource.selectNodeText( "@caption", this.tabDefinition ))));
      assertThat( this.tab.isDefault(), equalTo( parseBoolean( XmlResource.selectNodeText( "@isDefault", this.tabDefinition ))));
      assertThat( this.tab.getMessageProperties(), equalTo( "{ activityType : AbstractDocument.Activity.LOAD_DOCUMENT, documentURI : 'Content/HtmlDocument', documentType : AbstractDocument.Types.HTML }" ));
   },
         
   construct_createsLiAndAnchorElements : function() {         
      this.tab.unmarshall();
      this.tab.construct( parentElement );
      
      assertThat( parentElement.getChildren( 'li' ).length, equalTo( 1 ));
      assertThat( parentElement.getElements( 'a' ).length, equalTo( 1 ));
      //assertThat( parentElement.getElements( 'a' )[0].get( 'text' ).toString(), equalTo( this.resourceBundle.getText( XmlResource.selectNodeText( "@caption", this.tabDefinition ))));
      assertThat( this.tab.isVisible(), is( true ));
   },
   
   activate_setsLIElementId : function(){
      this.tab.unmarshall();
      this.tab.construct( parentElement );
      this.tab.activate();
      
      assertThat( parentElement.getChildren( 'li' )[0].get( 'id').toString(), equalTo( this.tab.options.currentTabId ));
      assertThat( this.tab.isActive(), is( true ));
   },
   
   deActivate_removesLIElementId : function(){
      this.tab.unmarshall();
      this.tab.construct( parentElement );
      this.tab.activate();
      this.tab.deActivate();
      
      assertThat( parentElement.getChildren( 'li' )[0].get( 'id').toString(), equalTo( "" ));
      assertThat( this.tab.isActive(), is( false ));
   },
   
   equals_whenTabsAreSame_returnsTrue : function() {
      var tabOne = new Tab( this.tabDefinition, this.resourceBundle );
      tabOne.unmarshall();
      var tabTwo = new Tab( this.tabDefinition, this.resourceBundle );
      tabTwo.unmarshall();
      
      assertTrue( tabOne.equals( tabTwo ));
      assertTrue( tabTwo.equals( tabOne ));
   },

   equals_whenDifferentClass_returnsFalse : function(){
      assertFalse( this.tab.equals( new Object() ));
   },
   
   onSelection_activatesTabAndFiresEvent : function() {
      this.tab.unmarshall();
      this.tab.construct( parentElement );
      this.tab.deActivate();
      
      this.tab.onSelection();
     
      assertThat( this.tab.isActive(), is( true ));
      assertThat( this.onTabSelectedWasCalled, is( true ));
   },
   
   click_callsOnSelection : function(){
      this.tab.unmarshall();
      this.tab.construct( parentElement );
      this.tab.deActivate();
      
      var anchorElement = $( this.tab.getId() );
      anchorElement.fireEvent( 'click' );
      
      assertThat( this.tab.isActive(), is( true ));
      assertThat( this.onTabSelectedWasCalled, is( true ));
   },
   
   destroy_destroysHtmlElement : function(){
      this.tab.unmarshall();
      this.tab.construct( parentElement );
      this.tab.destroy();
      
      assertThat( parentElement.getElements()[0].length, equalTo( 0 ));
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onTabSelected : function(){
      this.onTabSelectedWasCalled = true;
   }

});