window.PartyEventTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onLocalizationFailure', 'onLocalizationLoaded'],

   options : {
      isBeforeEachTestAsynchron : true,
      testMethods : [
         { method : 'unmarshall_determinesEventProperties', isAsynchron : false },
         { method : 'unmarshall_determinesScheduleProperties', isAsynchron : false },
         { method : 'unmarshall_determinesLocationProperties', isAsynchron : false },
         { method : 'construct_displaysTitle', isAsynchron : false },
         { method : 'construct_whenLinkIsValid_createsAnchor', isAsynchron : false },
         { method : 'construct_whenEnabled_displaysDescription', isAsynchron : false },
         { method : 'construct_whenRequested_truncatesDescription', isAsynchron : false },
         { method : 'construct_whenEnabled_displaysSchedule', isAsynchron : false },
         { method : 'construct_whenEnabled_displaysLocation', isAsynchron : false }]
   },

   constants : {
      EVENT_SELECTOR : "/pe:eventList/pe:events/pe:event[1]",
      CONFIGURATION_URI : "../PartyEventWidget/WebUIConfiguration.xml",
      LANGUAGE : "en",
      LOCALIZED_RSS_URI : "../PartyEventWidget/TestEvents_en.xml",
      RSS_URI : "../PartyEventWidget/TestNews.xml",
      WIDGET_CONTAINER_ID : "EventWidget",
      WIDGET_DEFINITION_URI : "../PartyEventWidget/PartyEventDefinition.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.elementFactory;
      this.event;
      this.eventDefinition;
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
            this.rssResource = new XmlResource( this.constants.LOCALIZED_RSS_URI, { nameSpaces : "xmlns:pp='http://www.processpuzzle.com' xmlns:pe='http://www.processpuzzle.com/PartyEvent'" });
            this.eventDefinition = this.rssResource.selectNode( this.constants.EVENT_SELECTOR );
            this.widgetContainerElement = $( this.constants.WIDGET_CONTAINER_ID );
            this.elementFactory = new WidgetElementFactory( this.widgetContainerElement, this.resourceBundle );
            this.event = new PartyEvent( this.eventDefinition, this.elementFactory );
            this.beforeEachTestReady();
         }.bind( this )
      ).callChain();
   },
   
   afterEachTest : function (){
      this.event.destroy();
      this.event = null;
      this.rssResource.release();
      this.rssResource = null;
      this.widgetContainerElement = null;
   },
   
   unmarshall_determinesEventProperties : function(){
      this.event.unmarshall();
      
      assertThat( this.event.getTitle(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:title" )));
      assertThat( this.event.getLink(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:link" )));
      assertThat( this.event.getDescription(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:description" )));
      assertThat( this.event.getProgramDescription(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:program/pe:description" )));
      assertThat( this.event.getProgramLink(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:program/pe:link" )));
      assertThat( this.event.getPublicationDate(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:publicationDate" )));
   },
   
   unmarshall_determinesScheduleProperties : function(){
      this.event.unmarshall();
      
      assertThat( this.event.isFullDay, equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/@isFullDay" )));
      assertThat( this.event.getStartDate(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:schedule/pe:startDate" )));
      assertThat( this.event.getEndDate(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:schedule/pe:endDate" )));
   },
   
   unmarshall_determinesLocationProperties : function(){
      this.event.unmarshall();
      
      assertThat( this.event.getLocationAddress(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:location/pe:address" )));
      assertThat( this.event.getLocationLink(), equalTo( this.rssResource.selectNodeText( this.constants.EVENT_SELECTOR + "/pe:location/pe:link" )));
   },
   
   construct_displaysTitle : function() {
      this.event.unmarshall();
      this.event.link = null;  //eliminates creating anchor element
      this.event.construct( this.widgetContainerElement );
      
      var titleElement = this.widgetContainerElement.getChildren( 'div' )[0];
      assertThat( titleElement.hasClass( this.event.options.titleStyle ), is( true )); 
      assertThat( titleElement.get( 'text' ), equalTo( this.event.getTitle() )); 
   },
   
   construct_whenLinkIsValid_createsAnchor : function() {
      this.event.unmarshall();
      this.event.construct( this.widgetContainerElement );
      
      var titleElement = this.widgetContainerElement.getChildren( 'div' )[0];
      assertThat( titleElement.getChildren( 'a' )[0], not( nil() )); 
      assertThat( titleElement.getChildren( 'a' )[0].get( 'text' ), equalTo( this.event.getTitle() )); 
   },
   
   construct_whenEnabled_displaysDescription : function() {
      this.event.unmarshall();
      this.event.construct( this.widgetContainerElement );
      
      var descriptionElement = this.widgetContainerElement.getChildren( 'div.' + this.event.options.descriptionStyle )[0];
      assertThat( descriptionElement.hasClass( this.event.options.descriptionStyle ), is( true )); 
      assertThat( descriptionElement.get( 'text' ), equalTo( this.event.getDescription() )); 
   },
   
   construct_whenRequested_truncatesDescription : function() {
      this.event.unmarshall();
      this.event.options.truncateDescription = true;
      this.event.construct( this.widgetContainerElement );
      
      var descriptionElement = this.widgetContainerElement.getChildren( 'div.' + this.event.options.descriptionStyle )[0];
      var expectedText = this.event.getDescription().substr( 0, this.event.options.truncatedDescriptionLength ) + this.event.options.trancatedDescriptionEnding;
      assertThat( descriptionElement.get( 'text' ), equalTo( expectedText )); 
   },
   
   construct_whenEnabled_displaysSchedule : function() {
      this.event.unmarshall();
      this.event.construct( this.widgetContainerElement );
      
      var scheduleElement = this.widgetContainerElement.getChildren( 'div.' + this.event.options.scheduleStyle )[0];
      var expectedText = this.event.getStartDate() + " - " + this.event.getEndDate();
      assertThat( scheduleElement.get( 'text' ), equalTo( expectedText )); 
   },
   
   construct_whenEnabled_displaysLocation : function() {
      this.event.unmarshall();
      this.event.construct( this.widgetContainerElement );
      
      var locationElement = this.widgetContainerElement.getChildren( 'div.' + this.event.options.locationStyle )[0];
      assertThat( locationElement.get( 'text' ), equalTo( this.event.getLocationAddress() )); 
   },
   
   //Protected, private helper methods
   onLocalizationFailure : function( error ){
      fail( "Failed to load localization resources" );
   },
   
   onLocalizationLoaded : function(){
      this.beforeEachTestChain.callChain();
   }
});