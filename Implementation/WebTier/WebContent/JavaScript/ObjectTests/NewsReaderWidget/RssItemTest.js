window.RssItemTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onLocalizationFailure', 'onLocalizationLoaded'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
         { method : 'unmarshall_determinesItemProperties', isAsynchron : false },
         { method : 'construct_displaysTitle', isAsynchron : false },
         { method : 'construct_whenLinkIsValid_createsAnchor', isAsynchron : false },
         { method : 'construct_whenEnabled_displaysDescription', isAsynchron : false },
         { method : 'construct_whenRequested_truncatesDescription', isAsynchron : false }]
   },

   constants : {
      ITEM_SELECTOR : "/pn:rss/pn:channel/pn:item[1]",
      CONFIGURATION_URI : "../NewsReaderWidget/WebUIConfiguration.xml",
      LANGUAGE : "en",
      LOCALIZED_RSS_URI : "../NewsReaderWidget/TestNews_en.xml",
      RSS_URI : "../NewsReaderWidget/TestNews.xml",
      WIDGET_CONTAINER_ID : "NewsReaderWidget",
      WIDGET_DEFINITION_URI : "../NewsReaderWidget/NewsReaderDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.elementFactory;
      this.item;
      this.itemDefinition;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.resourceBundle;
      this.rssResource;
      this.webUILogger;
      this.webUIConfiguration;
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
            this.rssResource = new XmlResource( this.constants.LOCALIZED_RSS_URI, { nameSpaces : "xmlns:pn='http://www.processpuzzle.com/PartyNews'" });
            this.itemDefinition = this.rssResource.selectNode( this.constants.ITEM_SELECTOR );
            this.widgetContainerElement = $( this.constants.WIDGET_CONTAINER_ID );
            this.elementFactory = new WidgetElementFactory( this.widgetContainerElement, this.resourceBundle );
            this.item = new RssItem( this.itemDefinition, this.elementFactory );
            
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.item.destroy();
      this.item = null;
      this.rssResource.release();
      this.rssResource = null;
      this.widgetContainerElement = null;
   },
   
   unmarshall_determinesItemProperties : function(){
      this.item.unmarshall();
      
      assertThat( this.item.getTitle(), equalTo( this.rssResource.selectNodeText( this.constants.ITEM_SELECTOR + "/pn:title" )));
      assertThat( this.item.getLink(), equalTo( this.rssResource.selectNodeText( this.constants.ITEM_SELECTOR + "/pn:link" )));
      assertThat( this.item.getDescription(), equalTo( this.rssResource.selectNodeText( this.constants.ITEM_SELECTOR + "/pn:description" )));
      assertThat( this.item.getPublicationDate(), equalTo( this.rssResource.selectNodeText( this.constants.ITEM_SELECTOR + "/pn:pubDate" )));
      assertThat( this.item.getGlobalUniqueId(), equalTo( this.rssResource.selectNodeText( this.constants.ITEM_SELECTOR + "/pn:guid" )));
   },
   
   construct_displaysTitle : function() {
      this.item.unmarshall();
      this.item.link = null;  //eliminates creating anchor element
      this.item.construct( this.widgetContainerElement );
      
      var titleElement = this.widgetContainerElement.getChildren( 'div' )[0];
      assertThat( titleElement.hasClass( this.item.options.titleStyle ), is( true )); 
      assertThat( titleElement.get( 'text' ), equalTo( this.item.getTitle() )); 
   },
   
   construct_whenLinkIsValid_createsAnchor : function() {
      this.item.unmarshall();
      this.item.construct( this.widgetContainerElement );
      
      var titleElement = this.widgetContainerElement.getChildren( 'div' )[0];
      assertThat( titleElement.getChildren( 'a' )[0], not( nil() )); 
      assertThat( titleElement.getChildren( 'a' )[0].get( 'text' ), equalTo( this.item.getTitle() )); 
   },
   
   construct_whenEnabled_displaysDescription : function() {
      this.item.unmarshall();
      this.item.construct( this.widgetContainerElement );
      
      var descriptionElement = this.widgetContainerElement.getChildren( 'div.' + this.item.options.descriptionStyle )[0];
      assertThat( descriptionElement.hasClass( this.item.options.descriptionStyle ), is( true )); 
      assertThat( descriptionElement.get( 'text' ), equalTo( this.item.getDescription() )); 
   },
   
   construct_whenRequested_truncatesDescription : function() {
      this.item.unmarshall();
      this.item.options.truncateDescription = true;
      this.item.construct( this.widgetContainerElement );
      
      var descriptionElement = this.widgetContainerElement.getChildren( 'div.' + this.item.options.descriptionStyle )[0];
      var expectedText = this.item.getDescription().substr( 0, this.item.options.truncatedDescriptionLength ) + this.item.options.trancatedDescriptionEnding;
      assertThat( descriptionElement.get( 'text' ), equalTo( expectedText )); 
   },

   //Protected, private helper methods
   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
      this.beforeEachTestChain.callChain();
   }
});