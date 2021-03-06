window.MenuItemTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onLocalizationFailure', 'onLocalizationLoaded', 'onSuccess'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'unmarshall_instantiatesMessages', isAsynchron : false },
         { method : 'construct_createsListItemAndAnchor', isAsynchron : false },
         { method : 'onClick_addsStyle', isAsynchron : false },
         { method : 'destroy_destroysAllElements', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_URI : "../HierarchicalMenuWidget/WebUIConfiguration.xml",
      LANGUAGE : "hu",
      MENU_DEFINITION_URI : "../HierarchicalMenuWidget/MenuDefinition.xml",
      MENU_SELECTOR : "/md:menuDefinition/md:menuItem[1]/md:menuItem[1]",
      MENU_WIDGET_ID : "HierarchicalMenuWidget"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.menuItem;
      this.menuItemDefinition;
      this.elementFactory;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.menuDefinition;
      this.messageBus;
      this.resourceBundle;
      this.webUIConfiguration;
      this.webUILogger;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.beforeEachTestChain.chain(
         function(){
            this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
            this.webUILogger = new WebUILogger( this.webUIConfiguration );
            this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration, { onFailure: this.onLocalizationFailure, onSuccess : this.onLocalizationLoaded });
            this.resourceBundle.load( this.locale );
         }.bind( this ),
         function(){
            this.widgetContainerElement = $( this.constants.MENU_WIDGET_ID );
            this.elementFactory = new WidgetElementFactory( this.widgetContainerElement, this.resourceBundle );
            
            this.menuDefinition = new XmlResource( this.constants.MENU_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com' xmlns:md='http://www.processpuzzle.com/MenuDefinition'" });
            this.menuItemDefinition = this.menuDefinition.selectNode( this.constants.MENU_SELECTOR );
            this.menuItem = new MenuItem( this.menuItemDefinition, this.elementFactory, {} );
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.menuItem.destroy();
      this.menuDefinition.release();
      this.resourceBundle.release();
   },
   
   unmarshall_determinesProperties : function() {
      this.menuItem.unmarshall();
      
      assertThat( this.menuItem.getState(), equalTo( BrowserWidget.States.UNMARSHALLED ));
      assertThat( this.menuItem.getCaption(), equalTo( XmlResource.selectNodeText( "@caption", this.menuItemDefinition )));
      assertThat( this.menuItem.getId(), equalTo( XmlResource.selectNodeText( "@menuItemId", this.menuItemDefinition )));
      assertThat( this.menuItem.isDefault, equalTo( parseBoolean( XmlResource.selectNodeText( "@isDefault", this.menuItemDefinition ))));
   },
   
   unmarshall_instantiatesMessages : function() {
      this.menuItem.unmarshall();
      
      assertThat( this.menuItem.getMessageProperties(), hasMember( 'actionType', equalTo( 'loadMenu' )));
   },
   
   construct_createsListItemAndAnchor : function() {
      this.menuItem.unmarshall();
      this.menuItem.construct( this.widgetContainerElement );
      
      assertThat( this.menuItem.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
      assertThat( this.widgetContainerElement.getChildren( 'li' )[0] ), not( nil() );
      assertThat( this.widgetContainerElement.getChildren( 'li a' )[0] ), not( nil() );
      assertThat( this.widgetContainerElement.getChildren( 'li a' )[0].get( 'text' )), equalTo( this.resourceBundle.getText( this.menuItem.getCaption() ));
   },
   
   onClick_addsStyle : function() {
      this.menuItem.unmarshall();
      this.menuItem.construct( this.widgetContainerElement );
      this.menuItem.onClick();
      
      assertThat( this.widgetContainerElement.getChildren( 'li' )[0].hasClass( this.menuItem.getSelectedItemClass() )), is( true );
   },
   
   destroy_destroysAllElements : function(){
      this.menuItem.unmarshall();
      this.menuItem.construct( this.widgetContainerElement );
      this.menuItem.destroy();
      
      assertThat( this.menuItem.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
      assertThat( this.widgetContainerElement.getChildren( '*' ).length, equalTo( 0 ));
   },
   
   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
      this.beforeEachTestChain.callChain();
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});