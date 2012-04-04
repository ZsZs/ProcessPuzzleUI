window.CompositeMenuTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'unmarshall_instantiatesSubItems', isAsynchron : false },
         { method : 'construct_constructsListElement', isAsynchron : false },
         { method : 'construct_whenEnabled_constructsSubItems', isAsynchron : false },
         { method : 'destroy_destroysAllElements', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_URI : "../HierarchicalMenuWidget/WebUIConfiguration.xml",
      LANGUAGE : "hu",
      MENU_DEFINITION_URI : "../HierarchicalMenuWidget/MenuDefinition.xml",
      MENU_SELECTOR : "//pp:menuWidgetDefinition/menuItem[1]",
      MENU_WIDGET_ID : "HierarchicalMenuWidget"
   },
   
   initialize : function( options ) {
      this.setOptions( options );

      this.compositeMenu;
      this.compositeMenuDefinition;
      this.elementFactory;
      this.locale = new Locale({ language : this.constants.LANGUAGE });
      this.menuDefinition;
      this.messageBus;
      this.resourceBundle;
      this.webUIConfiguration;
      this.webUILogger;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.widgetContainerElement = $( this.constants.MENU_WIDGET_ID );
      this.elementFactory = new WidgetElementFactory( this.widgetContainerElement, this.resourceBundle );
      
      this.menuDefinition = new XmlResource( this.constants.MENU_DEFINITION_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com'" });
      this.compositeMenuDefinition = this.menuDefinition.selectNode( this.constants.MENU_SELECTOR );
      this.compositeMenu = new RootMenu( this.compositeMenuDefinition, this.elementFactory, {} );
   },
   
   afterEachTest : function (){
      this.compositeMenu.destroy();
      this.menuDefinition.release();
      this.resourceBundle.release();
   },
   
   unmarshall_determinesProperties : function() {
      this.compositeMenu.unmarshall();
      
      assertThat( this.compositeMenu.options.showSubItems, is( false ));
   },
   
   unmarshall_instantiatesSubItems : function(){
      this.compositeMenu.options.showSubItems = true;
      this.compositeMenu.unmarshall();
      
      assertThat( this.compositeMenu.getSubItems().size(), equalTo( XmlResource.selectNodes( "menuItem", this.compositeMenuDefinition ).length ));
   },
   
   construct_constructsListElement : function(){
      this.compositeMenu.unmarshall();
      this.compositeMenu.construct( this.widgetContainerElement );
      
      assertThat( this.widgetContainerElement.getChildren( 'UL' )[0], not( nil() ));
   },
   
   construct_whenEnabled_constructsSubItems : function(){
      this.compositeMenu.options.showSubItems = true;
      this.compositeMenu.unmarshall();
      this.compositeMenu.construct( this.widgetContainerElement );
      
      assertThat( $( "MenuWidget" ).getChildren( 'li' ).length, equalTo( this.compositeMenu.getSubItems().size() ));
   },

   destroy_destroysAllElements : function(){
      this.compositeMenu.options.showSubItems = true;
      this.compositeMenu.unmarshall();
      this.compositeMenu.construct( this.widgetContainerElement );
      this.compositeMenu.destroy();
      
      assertThat( this.compositeMenu.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
      assertThat( this.widgetContainerElement.getChildren( '*' ).length, equalTo( 0 ));
   }
   
});