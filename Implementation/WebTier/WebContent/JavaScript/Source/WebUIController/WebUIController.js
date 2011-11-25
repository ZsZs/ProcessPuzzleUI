// WebUiController.js
/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

ROOT_LOGGER_NAME = "WebUI";
FRONT_CONTROLLER = "CommandControllerServlet";

// Main control class, responsible for managing and syncronizing the widgets.
var WebUIController = new Class({
   Implements: [Class.Singleton, Events, Options],
   Binds : ['changeLanguage', 
            'constructDesktop',
            'configureDocumentManager',
            'configureLogger',
            'determineCurrentUserLocale',
            'loadDocument', 
            'loadInternationalizations',
            'loadWebUIConfiguration',
            'onDesktopConstructed', 
            'restoreStateFromUrl',
            'storeComponentState',
            'subscribeToWebUIMessages',
            'webUIMessageHandler'],
   
   options: {
      artifactTypesXslt : "Commons/JavaScript/WebUIController/TransformBusinessDefinitionToArtifactTypes.xsl",
      componentName : "WebUIController",
      configurationUri : "Configuration.xml",
      contextRootPrefix : "../../",
      errorPageUri : "Commons/FrontController/WebUiError.jsp",
      languageSelectorElementId : "LanguageSelectorWidget",
      loggerGroupName : "WebUIController",
      urlRefreshPeriod : 3000,
      window : window
   },
   
   //Constructors
   initialize: function( options, usedWindow ) { return this.check() || this.setUp( options, usedWindow ); },
   setUp: function( options, usedWindow ){
      this.setOptions( options );
      if( usedWindow != null && usedWindow != 'undefined' ){
          this.options.window = usedWindow;
      } 

      //private instance variables
      this.applicationConfiguration = null;
      this.artifactTypeLoader = null;
      this.configurationChain = new Chain();
      this.desktop = null;
      this.documentManager = null;
      this.error;
      this.infoPanelManager = null;
      this.isConfigured = false;
      this.languageSelector = null;
      this.leftTreesTabWidget = null;
      this.leftTreeWidget = null;
      this.locale = null;
      this.logger = null;
      this.messageBus = new WebUIMessageBus();
      this.resourceBundle = null;
      this.prefferedLanguage = null;
      this.recentHash = this.determineCurrentHash();
      this.rightMenu = null;
      this.skin = null;
      this.self = this;
      this.stateManager = new ComponentStateManager();
      this.userName = null;
      this.userLocation = null;
      this.warningContainer;
      this.webUIConfiguration = null;
      this.webUIException = null;
      this.workproductTypeXslt = this.options.contextRootPrefix + this.options.artifactTypesXslt;
      this.loadWebUIConfiguration();
      this.configureLogger();

      this.logger.group( this.options.componentName + ".setUp", false );
      this.determineCurrentUserLocale();
      this.determineDefaultSkin();
      this.loadInternationalizations();
      this.storeStateInUrl.periodical( this.options.urlRefreshPeriod, this );

      this.logger.debug( "Browser Interface is initialized with context root prefix: "  + this.options.contextRootPrefix );
      this.logger.groupEnd();
   }.protect(),

   //public accessor and mutator methods
   changeCaptions : function() {
      if(rightMenu != null && rightMenu.changeCaptions != null)
         rightMenu.changeCaptions(self);
      if(documentManager != null && documentManager.changeCaptions != null)
         documentManager.changeCaptions(self);
      if(infoPanelManager != null && infoPanelManager.changeCaptions != null)
         infoPanelManager.changeCaptions(self);
      if(leftTreesTabWidget != null && leftTreesTabWidget.changeCaptions != null)
         leftTreesTabWidget.changeCaptions(self);
      if(leftTreeWidget != null && leftTreeWidget.changeCaptions != null)
         leftTreeWidget.changeCaptions(self);
   },
   
   changeLanguage : function( locale ){
      this.logger.debug( this.options.componentName + ".changeLanguage()." );
      this.destroy();
      this.locale = locale;
      this.configure();
      this.documentManager.changeLanguage( locale );
      if( this.currentDocumentProperties ) this.loadDocument( this.currentDocumentProperties );
   },
   
   changeSkin : function( newSkinName ){
      this.logger.debug( this.options.componentName + ".changeSkin()." );
      this.destroy();
      this.skin = newSkinName;
      this.configure();
   },
   
   configure : function() {
      this.logger.group( this.options.componentName + ".configure()", false );
      this.configurationChain.chain( 
         this.loadWebUIConfiguration,
         this.configureLogger,
         this.restoreStateFromUrl,
         this.determineCurrentUserLocale,
         this.loadInternationalizations,
         this.constructDesktop,
         this.configureDocumentManager,
         this.subscribeToWebUIMessages,
         this.storeComponentState
      ).callChain();
      
      this.logger.groupEnd( this.options.componentName + ".configure()" );
   },
   
   destroy : function() {
      if( this.isConfigured ){
         this.logger.group( this.options.componentName + ".destroy()", false );
         this.locale = null;
         this.documentManager.destroy();
         this.messageBus.tearDown();
         if( this.languageSelector ) this.languageSelector.destroy();
         this.desktop.destroy();
         this.webUIConfiguration.release();
         this.resourceBundle.release();
         this.options.window.location.hash = "";
         this.isConfigured = false;
         this.logger.groupEnd( this.options.componentName + ".destroy()" );
      }
   },
   
   loadDocument : function( documentProperties ){
      this.logger.debug( this.options.componentName + ".loadDocument()." );
      this.documentManager.loadDocument( documentProperties );
      this.currentDocumentProperties = documentProperties;
   },
   
   loadDocumentById : function ( documentType, name, id, viewNameToActivate ) {
      this.logger.debug( "Document load by id was requested. id:" + id + ", type:" + documentType + ", view:" + viewNameToActivate );
      return documentManager.loadDocumentById( documentType, name, id, viewNameToActivate ); 
   },
	
   loadDocumentByName : function ( documentType, name, viewNameToActivate ) {
      this.logger.debug( "Document load by name was requested. name:" + name + ", type:" + documentType + ", view:" + viewNameToActivate );
      return documentManager.loadDocumentByName( documentType, name, viewNameToActivate ); 
   },
	
   loadDocumentByUri : function ( documentType, name, uri, viewNameToActivate ) {
      this.logger.debug( "Document load by uri was requested. uri:" + uri + ", type:" + documentType + ", view:" + viewNameToActivate );
      return documentManager.loadDocumentUri( documentType, name, uri, viewNameToActivate ); 
   },
	
   onDesktopConstructed : function(){
      this.logger.debug( this.options.componentName + ", constructing desktop is finished." );
      this.configurationChain.callChain();
   },
   
   onError: function( error ){
      this.error = error;
      this.showWebUIExceptionPage( this.error );
   },
	
   reloadActiveDocument : function () {
      var documentType = self.getActiveDocument().getDocumentType();
      var documentName = self.getActiveDocument().getDocumentName();
      self.loadDocument(documentType, documentName );
   },
	
   restoreStateFromUrl : function(){
      this.logger.debug( this.options.componentName + ".restoreStateFromUrl() started." );
      if( this.options.window.location.hash.substring(2)) {
         var currentState = this.stateManager.toString();
         try {
            this.stateManager.resetStateFromUri( this.options.window.location.hash.substring(2) );
            this.messageBus.notifySubscribers( new WebUIStateRestoredMessage() );
         }catch( e ){
            this.stateManager.parse( currentState );
            this.logger.debug( "restoreStateFromUrl() exception: " + e );
         }
      }
      this.configurationChain.callChain();
   },
   
   storeStateInUrl : function() {
	   var stateAsString = this.stateManager.toString(); 
	   if( this.recentHash != stateAsString ){
	      this.recentHash = stateAsString;
	      this.options.window.location.hash = "!" + stateAsString;
	   }
   },
   
   webUIMessageHandler: function( webUIMessage ){
      if( !this.isConfigured ) throw new UnconfiguredWebUIControllerException({ source : 'WebUIController.webUIMessageHandler()' });
      
      if( instanceOf( webUIMessage, MenuSelectedMessage ) && webUIMessage.getActionType() == 'loadDocument' ){
         this.loadDocument( { documentURI : webUIMessage.getDocumentURI() } );
      }else if( instanceOf( webUIMessage, LanguageChangedMessage ) && webUIMessage.getNewLocale() != this.getCurrentLocale() ){
         this.changeLanguage( webUIMessage.getNewLocale() );
      }else if( instanceOf( webUIMessage, SkinChangedMessage ) && webUIMessage.getNewSkin() != this.getCurrentSkin() ){
         this.changeSkin( webUIMessage.getNewSkin() );
      }
      
      this.lastHandledMessage = webUIMessage;
   },

	//Properties
   getActiveDocument : function() { return this.documentManager.getActiveDocument(); },
   getApplicationConfiguration : function() { return this.applicationConfiguration; },
   getArtifactTypes : function() {return this.artifactTypeLoader.getTypesAsMap(); },
   getContextRootPrefix : function() { return this.contextRootPrefix; },
   getCurrentLocale : function () { return this.locale; },
   getCurrentSkin : function () { return this.skin; },
   getDesktop : function() { return this.desktop; },
   getDocumentManager : function() { return this.documentManager; },
   getInfoPanelManager : function() { return this.infoPanelManager; },
   getIsConfigured : function() { return this.isConfigured; },
   getLanguageSelector : function() { return this.languageSelector; },
   getLocale : function() { return this.locale; },
   getLogger : function() { return this.logger; },
   getMessageBus : function() { return this.messageBus; },
   getPrefferedLanguage : function() { return this.prefferedLanguage; },
   getResourceBundle : function() { return this.resourceBundle; },
   getRightMenu : function() { return this.rightMenu; },
   getStateManager : function() { return this.stateManager; },
   getText : function( key, defaultValue ) { return this.getTextInternal( key, defaultValue  ); },
   getUserLocation : function() { return this.userLocation; },
   getUserName : function() { return this.userName; },
   getWebUIConfiguration : function() { return this.webUIConfiguration; },
   getWebUIException : function() { return this.webUiException; },
   setLeftTreesTabWidget : function( theWidget ) { this.leftTreesTabWidget = theWidget;},
   setLeftTreeWidget : function( theWidget ) { this.leftTreeWidget = theWidget;},
   setUserLocation : function( newLocation ) { this.userLocation = newLocation;},
   setUserName : function( newUserName ) { this.userName = newUserName;},
   setLanguage : function ( newLanguage ) { this.setLanguageInternal( newLanguage ); },
   setApplicationConfiguration : function( newConfiguration ) { this.applicationConfiguration = newConfiguration; },
	
   //private methods
   configureLogger : function() {		
      this.logger =  new WebUILogger( this.webUIConfiguration );
      this.logger.debug( this.options.componentName + ".configureLogger() started." );
      this.configurationChain.callChain();
   }.protect(),
	
   constructDesktop : function() {
      this.logger.debug( this.options.componentName + ".constructDesktop() started." );
      var desktopConfigurationUri = this.webUIConfiguration.getSkinConfiguration( this.skin );
      this.desktop = new Desktop( this.webUIConfiguration, this.resourceBundle, { configurationURI : desktopConfigurationUri, onConstructed : this.onDesktopConstructed, onError : this.onError } );
      this.desktop.unmarshall();
      try{
         this.desktop.construct();
      }catch( e ){
         this.onError( e );
      }
   }.protect(),
	
   configureDocumentManager : function() {
      this.logger.debug( this.options.componentName + ".configureDocumentManager() started." );
      this.documentManager = new DocumentManager();
      this.documentManager.configure( this.locale );
      this.configurationChain.callChain();
   }.protect(),
	
   determineCurrentHash: function() {
      if( this.options.window.location.hash.indexOf( "#" ) != -1 )
         return this.options.window.location.hash.substring(1);
      else return "";
   }.protect(),
	
   determineCurrentUserLocale : function() {
      this.logger.debug( this.options.componentName + ".determineCurrentUserLocale() started." );
      if( this.locale == null ){
         var storedState = this.stateManager.retrieveCurrentState( this.options.componentName ); 
         if( storedState ) {
            var localeString = storedState['locale'];
            this.locale = new Locale();
            this.locale.parse( localeString );
         }else {
            this.locale = new Locale();
            this.locale.parse( this.webUIConfiguration.getI18DefaultLocale() );
         }
      }
      this.configurationChain.callChain();
   }.protect(),
	
   determineDefaultSkin : function(){
      this.skin = this.webUIConfiguration.getDefaultSkin();
   }.protect(),

   getTextInternal : function ( key, defaultValue ) {
      if( this.resourceBundle == null)
         if( defaultValue != null ) return defaultValue;
         else return key;
      var returnValue;
      try {
         returnValue = this.resourceBundle.getText(key);
      } catch (e) {
         if( e instanceof IllegalArgumentException ) {
            if(defaultValue != null) return defaultValue;
            return key;
         } else {
            var exception = new UserException( "Unknown problem occured.", "WebUIController getText()" );
            throw exception;
         }
      }
      return returnValue;	
   }.protect(),
	
   loadArtifactTypeLoader : function ( theArtifactTypeLoader ) {
      artifactTypeLoader = theArtifactTypeLoader;
   }.protect(),
   
   loadArtifactTypes : function ( businessDefinitionFileName ) {
      AssertUtil.assertParamNotNull( businessDefinitionFileName, "businessDefinitionFileName" );

      var artifactTypesXml = TransformXML( contextRootPrefix + businessDefinitionFileName, this.workproductTypeXslt );
      artifactTypeLoader.loadTypesFromXml( artifactTypesXml );

      this.logger.debug( "Artifact types from file: " + contextRootPrefix + businessDefinitionFileName + " are loaded." );
   }.protect(),
   
   loadDocumentManager : function ( documentSelector, viewSelector, documentFrame, emptyPagesHref ) {
      documentManager = new DocumentManager( self, documentSelector, viewSelector, documentFrame, rightMenu, emptyPagesHref );
      documentManager.showDocumentSelector( true );
      this.logger.debug( "Document Manager loaded." );
   }.protect(),

   loadInfoManager : function ( infoPanelSelector, infoFrame, emptyPagesHref ) {
      var infoInvDiv = document.createElement("div");
      var infoVS = new InvertedTabWidget(infoInvDiv);
      infoVS.show();

      infoPanelManager = new DocumentManager(self, infoPanelSelector,infoVS, infoFrame, null, contextRootPrefix + emptyPagesHref );
      infoPanelManager.showDocumentSelector();
      this.logger.debug( "Info Pane Manager loaded." );
   }.protect(),
   
   loadInternationalizations : function () {
      this.logger.debug( this.options.componentName + ".loadInternationalizations() started." );
      try{
         this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
         this.resourceBundle.load( this.locale );
         this.logger.debug( "Resource bundles: " + this.options.contextRootPrefix + this.resourceBundle.getResourceBundleNames() + " was loaded." );
      }catch( e ) {
         this.onError( e );
      }
      this.configurationChain.callChain();
   }.protect(),
   
   loadWebUIConfiguration : function() {
      try{
         this.webUIConfiguration = new WebUIConfiguration( this.options.configurationUri );
         if( !this.webUIConfiguration.isLoaded ) this.webUIConfiguration.load();
      }catch( e ){
         this.onError( e );
      }
      this.configurationChain.callChain();
   }.protect(),

   setLanguage : function( newLanguage ) {
      this.logger.debug( this.options.componentName + ".setLanguage() started." );
      prefferedLanguage = newLanguage;
      if(newLanguage != null) {
         var locale = new Locale(newLanguage);
         if( applicationConfiguration != null) {
            applicationConfiguration.setLocale(locale);
            this.loadInternationalizations(applicationConfiguration.getBundlePath(),locale);
         }
      }
   }.protect(),
	
   showWebUIExceptionPage : function( exception ) {
      var bodyElement = $$( 'body' );
      this.warningContainer = new Element( 'div', { id: 'warning'} );
      bodyElement.grab( this.warningContainer, 'top' );
      
      var warningHeader = new Element( 'h1' );
      warningHeader.appendText( "Error Occured" );
      this.warningContainer.grab( warningHeader );
      
      var warningNameElement = new Element( 'h3' );
      warningNameElement.appendText( exception.name );
      this.warningContainer.grab( warningNameElement );
      
      var messageElement = new Element( 'p' );
      messageElement.appendText( exception.message );
      this.warningContainer.grab( messageElement );
   }.protect(),
	
   storeComponentState : function() {
      this.logger.debug( this.options.componentName + ".storeComponentState() started." );
      this.stateManager.storeCurrentState( this.options.componentName, {locale : this.locale.toString()} );
      this.isConfigured = true;
      this.fireEvent( 'configured', this );
      this.configurationChain.callChain();
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
      this.messageBus.subscribeToMessage( LanguageChangedMessage, this.webUIMessageHandler );
      this.messageBus.subscribeToMessage( SkinChangedMessage, this.webUIMessageHandler );
      this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      this.configurationChain.callChain();
   }.protect()
});
