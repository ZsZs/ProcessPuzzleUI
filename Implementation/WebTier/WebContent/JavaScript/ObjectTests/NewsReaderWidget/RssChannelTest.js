window.RssChannelTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : [],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesChannelProperties', isAsynchron : false },
         { method : 'unmarshall_unmarshalsItems', isAsynchron : false },
         { method : 'unmarshall_passesItemOptions', isAsynchron : false },
         { method : 'construct_createsChannelWrapper', isAsynchron : false },
         { method : 'construct_displaysChannelTitle', isAsynchron : false },
         { method : 'construct_whenRequested_hidesChannelTitle', isAsynchron : false },
         { method : 'construct_whenLinkIsValid_createsAnchor', isAsynchron : false },
         { method : 'construct_createsItemsWrapper', isAsynchron : false },
         { method : 'construct_constructsItems', isAsynchron : false }]
   },

   constants : {
      CHANNEL_SELECTOR : "/pn:rss/pn:channel",
      CONFIGURATION_URI : "../NewsReaderWidget/WebUIConfiguration.xml",
      LANGUAGE : "en",
      LOCALIZED_RSS_URI : "../NewsReaderWidget/TestNews_en.xml",
      RSS_URI : "../NewsReaderWidget/TestNews.xml",
      WIDGET_CONTAINER_ID : "NewsReaderWidget",
      WIDGET_DEFINITION_URI : "../NewsReaderWidget/NewsReaderDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
            
      this.channel;
      this.elementFactory;
      this.locale = new ProcessPuzzleLocale({ language : this.constants.LANGUAGE });
      this.resourceBundle;
      this.rssResource;
      this.webUILogger;
      this.webUIConfiguration;
      this.widgetContainerElement;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.resourceBundle = new LocalizationResourceManager( this.webUIConfiguration );
      this.resourceBundle.load( this.locale );
      this.rssResource = new XmlResource( this.constants.LOCALIZED_RSS_URI, { nameSpaces : "xmlns:pn='http://www.processpuzzle.com/PartyNews'" });
      this.widgetContainerElement = $( this.constants.WIDGET_CONTAINER_ID );
      this.elementFactory = new WidgetElementFactory( this.widgetContainerElement, this.resourceBundle );
      
      this.channel = new RssChannel( this.rssResource, this.resourceBundle, this.elementFactory );
      
   },
   
   afterEachTest : function (){
      this.channel.destroy();
      this.channel = null;
      this.rssResource.release();
      this.rssResource = null;
      this.widgetContainerElement = null;
   },
   
   unmarshall_determinesChannelProperties : function(){
      this.channel.unmarshall();
      
      assertThat( this.channel.getTitle(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:title" )));
      assertThat( this.channel.getLink(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:link" )));
      assertThat( this.channel.getDescription(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:description" )));
      assertThat( this.channel.getLanguage(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:language" )));
      assertThat( this.channel.getPublicationDate(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:pubDate" )));
      assertThat( this.channel.getBuildDate(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:lastBuildDate" )));
      assertThat( this.channel.getDocuments(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:docs" )));
      assertThat( this.channel.getGenerator(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:generator" )));
      assertThat( this.channel.getManagingEditor(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:managingEditor" )));
      assertThat( this.channel.getWebMaster(), equalTo( this.rssResource.selectNodeText( this.constants.CHANNEL_SELECTOR + "/pn:webMaster" )));
   },
   
   unmarshall_unmarshalsItems : function(){
      this.channel.unmarshall();
   
      assertThat( this.channel.getItems().size(), equalTo( this.rssResource.selectNodes( this.constants.CHANNEL_SELECTOR + "/pn:item" ).length ));
   },
         
   unmarshall_passesItemOptions : function(){
      this.channel.options.itemOptions = { showDescription : false, showTitle : false };
      this.channel.unmarshall();
   
      assertThat( this.channel.getItems().size(), equalTo( this.rssResource.selectNodes( this.constants.CHANNEL_SELECTOR + "/pn:item" ).length ));
      this.channel.getItems().each( function( rssItem, index ){
         assertThat( rssItem.options.showDescription, is( false ));
         assertThat( rssItem.options.showTitle, is( false ));
      }.bind( this ));
   },
         
   construct_createsChannelWrapper : function() {
      this.channel.unmarshall();
      this.channel.construct( this.widgetContainerElement );
      
      assertThat( this.widgetContainerElement.getChildren( '#' + this.channel.options.wrapperElementId )[0], not( nil() )); 
   },
   
   construct_displaysChannelTitle : function() {
      this.channel.unmarshall();
      this.channel.link = null;  //eliminates creating anchor element
      this.channel.construct( this.widgetContainerElement );
      
      var channelTitleElement = this.channel.getWrapperElement().getChildren( 'div.' + this.channel.options.titleStyle )[0];
      assertThat( channelTitleElement.hasClass( this.channel.options.titleStyle ), is( true )); 
      assertThat( channelTitleElement.get( 'text' ), equalTo( this.channel.getTitle() )); 
   },
   
   construct_whenRequested_hidesChannelTitle : function() {
      this.channel.unmarshall();
      this.channel.options.showTitle = false;
      this.channel.construct( this.widgetContainerElement );
      
      var channelTitleElement = this.channel.getWrapperElement().getChildren( 'div.' + this.channel.options.titleStyle )[0];
      assertThat( channelTitleElement, is( nil() )); 
   },
   
   construct_whenLinkIsValid_createsAnchor : function() {
      this.channel.unmarshall();
      this.channel.construct( this.widgetContainerElement );
      
      var channelTitleElement = this.channel.getWrapperElement().getChildren( 'div' )[0];
      assertThat( channelTitleElement.getChildren( 'a' )[0], not( nil() )); 
      assertThat( channelTitleElement.getChildren( 'a' )[0].get( 'text' ), equalTo( this.channel.getTitle() )); 
   },
   
   construct_createsItemsWrapper : function() {
      this.channel.unmarshall();
      this.channel.construct( this.widgetContainerElement );
      
      var itemsWrapper = this.channel.getWrapperElement().getLast( 'div' ); 
      assertThat( itemsWrapper.hasClass( this.channel.options.itemsWrapperStyle ), is( true )); 
   },
   
   construct_constructsItems : function() {
      this.channel.unmarshall();
      this.channel.construct( this.widgetContainerElement );

      this.channel.getItems().each( function( channelItem, index ){
         assertThat( channelItem.getState(), equalTo( BrowserWidget.States.CONSTRUCTED ));
      }.bind( this ));
   }
   
});