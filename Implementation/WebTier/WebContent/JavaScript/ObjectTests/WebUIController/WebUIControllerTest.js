window.WebUIControllerTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConfigured', 'onFailure'],

   options : {
      testMethods : [
          { method : 'initialize_instantiatesComponents', isAsynchron : false },
          { method : 'configure_configuresLoggerAndDesktop', isAsynchron : true }]
/*          
          { method : 'changeLanguage_reConstructsTheDesktopWithNewLocale', isAsynchron : true }, 
          { method : 'changeSkin_reConstructsTheDesktopWithNewSkin', isAsynchron : true }, 
          { method : 'destroy_destroysAllHtmlElementsAndEvents', isAsynchron : true }, 
          { method : 'loadDocument_publishesMenuSelectedMessage', isAsynchron : true }, 
          { method : 'restoreStateFromUrl_restoresComponentsStateAndBroadcastsMessage', isAsynchron : true }, 
          { method : 'storeStateInUrl_storesComponentsStateInUrl', isAsynchron : true }, 
          { method : 'webUIMessageHandler_whenLanguageChangedMessageBroadcasted_reconstructsDesktop', isAsynchron : true }, 
          { method : 'webUIMessageHandler_whenLoadDocumentAction_loadsDocument', isAsynchron : true }, 
          { method : 'webUIMessageHandler_whenSkinChangedMessageBroadcasted_reconstructsDesktop', isAsynchron : true }]
*/
   },

   constants : {
      CONFIGURATION_URI : "../WebUIController/SampleConfiguration.xml",
      DESKTOP_CONTAINER_ELEMENT_ID : "desktopContainer",
      SAMPLE_DOCUMENT_ONE : "../WebUIController/Content/SampleContentOne.xml"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.componentStateManager = null;
      this.controller;
      this.docSelectorDiv = document.getElementById("DocumentSelector");
      this.docViewSelectorDiv = document.getElementById("DocumentViewSelector");
      this.infoPanelSelectorDiv = document.getElementById("InfoPanelSelector");
      this.messageBus = null;
      this.menuDiv = document.getElementById("RightMenu");
   },   

   beforeEachTest : function(){
      this.messageBus = new WebUIMessageBus();
      this.controller = new WebUIController({ contextRootPrefix : "../../", configurationUri : this.constants.CONFIGURATION_URI, onConfigured : this.onConfigured } );
      this.componentStateManager = Class.getInstanceOf( ComponentStateManager );
   },
   
   afterEachTest : function (){
      this.controller.destroy();
      this.componentStateManager.reset();
      this.messageBus.tearDown();
      
      //window.location.hash = "";
   },
   
   initialize_instantiatesComponents : function() {
      assertTrue( "WebUIController...", true );
      assertNotNull( "... instantiates WebUIMessageBus.", this.controller.getMessageBus() );
      assertNotNull( "... instantiates ComponentStateManager.", this.controller.getStateManager() );
      assertFalse( "... initialization doesn't configure the browser front-end.", this.controller.getIsConfigured() );
   },
   
   configure_configuresLoggerAndDesktop : function() {
      this.testCaseChain.chain(
         function(){ 
            this.controller.configure(); 
         }.bind( this ),
         function(){
            assertTrue( "When WebUIController is configured...", true );
            assertNotNull( "... loads configuration.", this.controller.getWebUIConfiguration() );
            assertNotNull( "... initializes a logger.", this.controller.getLogger() );
            assertEquals( "... initializes with default locale.", "hu", this.controller.getCurrentLocale().getLanguage() );
            assertNotNull( "... loads resource bundles.", this.controller.getResourceBundle() );
         
            assertTrue( "... the whole browser front-end is configured.", this.controller.isConfigured );
            assertThat( this.controller.getDesktop().getState(), equalTo( DesktopElement.States.CONSTRUCTED ) ); 
            assertEquals( "... registers itself to 'SkinChangedMessage'.", this.controller.webUIMessageHandler, messageBus.getSubscribersToMessage( SkinChangedMessage ).get(0) );
            assertEquals( "... registers itself to 'LanguageChangedMessage'.", this.controller.webUIMessageHandler, messageBus.getSubscribersToMessage( LanguageChangedMessage ).get(0) );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
/*   
   changeLanguage_reConstructsTheDesktopWithNewLocale : function() {
      this.testCaseChain.chain(
         function(){ 
            this.controller.configure(); 
         }.bind( this ),
         function(){
            assertThat( this.controller.getCurrentLocale().getLanguage(), equalTo( 'hu' ));

            var noneDefaultLanguage = new Locale({ language : 'en' });
            this.controller.changeLanguage( noneDefaultLanguage );
         }.bind( this ),
         function(){
            assertThat( this.controller.getCurrentLocale().getLanguage(), equalTo( 'en' ));
            assertThat( this.controller.isConfigured, is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   changeSkin_reConstructsTheDesktopWithNewSkin : function() {
      this.testCaseChain.chain(
         function(){ this.controller.configure(); }.bind( this ),
         function(){
            assertThat( this.controller.getCurrentSkin(), equalTo( 'ProcessPuzzle' ));

            this.controller.changeSkin( 'MochaUI' );
         }.bind( this ),
         function(){
            assertThat( this.controller.getCurrentSkin(), equalTo( 'MochaUI' ));
            assertThat( this.controller.isConfigured, is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_destroysAllHtmlElementsAndEvents : function() {
      this.testCaseChain.chain(
         function(){ this.controller.configure(); }.bind( this ),
         function(){
            this.controller.destroy();
            
            assertTrue( "After WebUIController.destoy()...", true );
            assertFalse( "... not regarded to be configured.", this.controller.isConfigured );
            assertThat( this.controller.getDesktop().getState(), equalTo( Desktop.States.INITIALIZED ));
            assertFalse( "... WebUIConfiguration is not loaded.", this.controller.getWebUIConfiguration().isLoaded );
            assertFalse( "... XMLResourcebundle is not loaded.", this.controller.getResourceBundle().isLoaded );
            assertEquals( "tears down message bus.", 0, this.controller.getMessageBus().getMessageListSize() );
            assertThat( $( this.constants.DESKTOP_CONTAINER_ELEMENT_ID ).getChildren( '*' ).length, equalTo( 0 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   loadDocument_publishesMenuSelectedMessage : function() {
      this.testCaseChain.chain(
         function(){ this.controller.configure(); }.bind( this ),
         function(){
            this.controller.getMessageBus().subscribeToMessage( MenuSelectedMessage, function( webUIMessage ){
               assertThat( webUIMessage.getDocumentURI(), equalTo( SAMPLE_DOCUMENT_ONE ));
            });
            
            this.controller.loadDocument( this.constants.SAMPLE_DOCUMENT_ONE, AbstractDocument.Types.HTML );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   restoreStateFromUrl_restoresComponentsStateAndBroadcastsMessage : function() {
      this.testCaseChain.chain(
         function(){ this.controller.configure(); }.bind( this ),
         function(){
            this.testWindow.location.hash = "!" + "WebUIController: {locale: 'hu'}; HierarchicalMenuWidget: {currentItemId: 'mainItemThree', contextItemId: 'MenuWidget'}";
            this.controller.restoreStateFromUrl();
      
            assertEquals( "mainItemThree", componentStateManager.retrieveCurrentState( "HierarchicalMenuWidget" )['currentItemId'] );
            assertTrue( instanceOf( messageBus.getLastMessage(), WebUIStateRestoredMessage ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   storeStateInUrl_storesComponentsStateInUrl : function() {
      this.testCaseChain.chain(
         function(){ this.controller.configure(); }.bind( this ),
         function(){
            this.controller.storeStateInUrl();
            
            assertTrue( "storeStateInUrl()...", true );
            assertEquals( "...stores current document (relative) uri in location hash.", testWindow.location.hash.substring(2), this.controller.getStateManager().toString() );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenLanguageChangedMessageBroadcasted_reconstructsDesktop : function() {
      this.testCaseChain.chain(
         function(){ this.controller.configure(); }.bind( this ),
         function(){
            this.controller.loadDocument({ documentURI : 'Content/SampleContentOne' });
            
            //EXCERCISE:
            var previousLocale = this.controller.getCurrentLocale();
            var newLocale = new Locale({ language : 'en' });
            var message = new LanguageChangedMessage({newLocale : newLocale, previousLocale : previousLocale, originator : 'WebUIControllerTest' });
            this.messageBus.notifySubscribers( message );
      
            //VERIFY:
            assertEquals( "Given locale becomes the current.", 'en', this.controller.getCurrentLocale().getLanguage() );
            assertEquals( "... current document remains", 'Content/SampleContentOne', this.controller.currentDocumentProperties['documentURI'] );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenLoadDocumentAction_loadsDocument : function() {
      this.testCaseChain.chain(
         function(){ this.controller.configure(); }.bind( this ),
         function(){
            var message = new MenuSelectedMessage({actionType : 'loadDocument', documentURI : SAMPLE_DOCUMENT_ONE });
            this.messageBus.notifySubscribers( message );
      
            //VERIFY:
            var documentsPanel = $('documents-panel');
            assertTrue( "After WebUIController.loadDocument()...", true );
            assertEquals( "... stores current document URI", SAMPLE_DOCUMENT_ONE, this.controller.currentDocumentProperties['documentURI'] );
            assertEquals( "... adds page content.", "Minta tartalom - 1", Sarissa.getText( documentsPanel.getElements( "H1" )[0] ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   webUIMessageHandler_whenSkinChangedMessageBroadcasted_reconstructsDesktop : function() {
      this.testCaseChain.chain(
         function(){ this.controller.configure(); }.bind( this ),
         function(){
            this.controller.loadDocument({ documentURI : 'Content/SampleContentOne' });
            
            //EXCERCISE:
            var previousSkin = this.controller.getCurrentSkin();
            var message = new SkinChangedMessage({newSkin : 'MochaUI', previousSkin : previousSkin, originator : 'WebUIControllerTest' });
            this.messageBus.notifySubscribers( message );
      
            //VERIFY:
            assertEquals( "Given skin becomes the current.", 'MochaUI', this.controller.getCurrentSkin() );
            assertEquals( "... current document remains", 'Content/SampleContentOne', this.controller.currentDocumentProperties['documentURI'] );
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
*/   
   onConfigured : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});