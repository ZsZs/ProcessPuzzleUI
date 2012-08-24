window.CompositeMenuTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onLocalizationFailure', 'onLocalizationLoaded', 'onSuccess'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'unmarshall_instantiatesSubItems', isAsynchron : false },
         { method : 'construct_constructsListElement', isAsynchron : false },
         { method : 'construct_whenEnabled_constructsSubItems', isAsynchron : false },
         { method : 'onClick_whenAccordionBehaviourEnabled_constructsSubItems', isAsynchron : false },
         { method : 'onClick_whenAccordionBehaviourEnabledAndItemIsExpanded_destroysSubItems', isAsynchron : false },
         { method : 'destroy_destroysAllElements', isAsynchron : false }]
   },

   constants : {
      CONFIGURATION_URI : "../HierarchicalMenuWidget/WebUIConfiguration.xml",
      LANGUAGE : "hu",
      MENU_DEFINITION_URI : "../HierarchicalMenuWidget/MenuDefinition.xml",
      MENU_SELECTOR : "/md:menuDefinition/md:menuItem[1]",
      MENU_WIDGET_ID : "HierarchicalMenuWidget"
   },
   
   initialize : function( options ) {
      this.setOptions( options );

      this.compositeMenu;
      this.compositeMenuDefinition;
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
            this.compositeMenuDefinition = this.menuDefinition.selectNode( this.constants.MENU_SELECTOR );
            this.compositeMenu = new RootMenu( this.compositeMenuDefinition, this.elementFactory, {} );
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
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
      
      assertThat( this.compositeMenu.getSubItems().size(), equalTo( XmlResource.selectNodes( "md:menuItem", this.compositeMenuDefinition ).length ));
   },
   
   construct_constructsListElement : function(){
      this.compositeMenu.unmarshall();
      this.compositeMenu.construct( this.widgetContainerElement );
      
      assertThat( this.widgetContainerElement.getChildren( 'UL' )[0], not( nil() ));
      assertThat( this.widgetContainerElement.getChildren( 'UL' )[0].hasClass( this.compositeMenu.getMenuStyle() ), is( true ));
   },
   
   construct_whenEnabled_constructsSubItems : function(){
      this.compositeMenu.options.showSubItems = true;
      this.compositeMenu.unmarshall();
      this.compositeMenu.construct( this.widgetContainerElement );
      
      assertThat( $( "MenuWidget" ).getElements( 'li' ).length, equalTo( XmlResource.selectNodes( "//md:menuItem", this.compositeMenuDefinition ).length -1 ));
   },

   onClick_whenAccordionBehaviourEnabled_constructsSubItems : function(){
      this.compositeMenu.options.accordionBehaviour = true;
      this.compositeMenu.unmarshall();
      this.compositeMenu.construct( this.widgetContainerElement );
      assumeThat( $( "MenuWidget" ).getChildren( 'li' ).length, equalTo( this.compositeMenu.getSubItems().size() ));
      
      this.compositeMenu.getSubItems().get( 0 ).onClick();
      
      assertThat( $( "MenuWidget" ).getElements( 'li' ).length, equalTo( this.compositeMenu.getSubItems().size() + this.compositeMenu.getSubItems().get( 0 ).getSubItems().size() ));
   },

   onClick_whenAccordionBehaviourEnabledAndItemIsExpanded_destroysSubItems : function(){
      this.compositeMenu.options.accordionBehaviour = true;
      this.compositeMenu.unmarshall();
      this.compositeMenu.construct( this.widgetContainerElement );
      this.compositeMenu.getSubItems().get( 0 ).onClick();
      this.compositeMenu.getSubItems().get( 0 ).onClick();
      
      assumeThat( $( "MenuWidget" ).getElements( 'li' ).length, equalTo( this.compositeMenu.getSubItems().size() ));
   },

   destroy_destroysAllElements : function(){
      this.compositeMenu.options.showSubItems = true;
      this.compositeMenu.unmarshall();
      this.compositeMenu.construct( this.widgetContainerElement );
      this.compositeMenu.destroy();
      
      assertThat( this.compositeMenu.getState(), equalTo( BrowserWidget.States.INITIALIZED ));
      assertThat( this.widgetContainerElement.getChildren( '*' ).length, equalTo( 0 ));
   },
   
   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
      this.beforeEachTestChain.callChain();
   }
   
});