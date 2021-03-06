/*
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


//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes
//= require ../Singleton/Singleton.js

var WebUIController = new Class({
   Implements: [Class.Singleton, Events, Options],
   Binds : ['changeLanguage', 
            'constructDesktop',
            'configureLogger',
            'destroySplashForm',
            'determineCurrentUserLocale',
            'finalizeConfiguration',
            'loadDocument', 
            'loadInternationalizations',
            'loadWebUIConfiguration',
            'onDesktopComponentConstructed',
            'onDesktopConstructed',
            'onLocalizationResourcesLoaded',
            'onError', 
            'restoreComponentsState',
            'storeComponentsState',
            'storeWebUIState',
            'subscribeToWebUIMessages',
            'webUIMessageHandler'],
   
   options: {
      artifactTypesXslt : "Commons/JavaScript/WebUIController/TransformBusinessDefinitionToArtifactTypes.xsl",
      compatibleBrowserVersions : { ie : 8, firefox : 4, safari : 4, chrome : 10, opera : 10 },
      componentName : "WebUIController",
      configurationUri : "Configuration.xml",
      contextRootPrefix : "../../",
      eraseStateWhenSkinChange : false,
      errorPageUri : "Commons/FrontController/WebUiError.jsp",
      eventFireDelay : 5,
      languageSelectorElementId : "LanguageSelectorWidget",
      loggerGroupName : "WebUIController",
      messageOriginator : "webUIController",
      reConfigurationDelay: 500,
      showSplashForm : false,
      splashFormUri : "Desktops/Images/SplashForm.png",
      unsupportedBrowserMessage: "We appologize. This site utilizes more modern browsers, namely: Internet Explorer 8+, FireFox 4+, Chrome 10+, Safari 4+",
      urlRefreshPeriod : 1000
   },
   
   //Constructors
   initialize: function( options, usedWindow ) { return this.check() || this.setUp( options, usedWindow ); },
   setUp: function( options, usedWindow ){
      this.setOptions( options );
      if( usedWindow != null && usedWindow != 'undefined' ){
          this.options.window = usedWindow;
      } 

      //private instance variables
      this.configurationChain = new Chain();
      this.desktop;
      this.error;
      this.isConfigured = false;
      this.languageSelector;
      this.locale;
      this.logger;
      this.messageBus = new WebUIMessageBus();
      this.localizationResourceManager;
      this.prefferedLanguage;
      this.recentHash = this.determineCurrentHash();
      this.refreshUrlTimer;
      this.skin;
      this.splashForm;
      this.stateManager;
      this.userName;
      this.userLocation;
      this.warningContainer;
      this.webUIConfiguration;
      this.webUIException;

      if( this.browserIsSupported() ){
         if( this.options.showSplashForm ) this.showSplashForm();
         this.loadWebUIConfiguration();
         this.updateOptionsWithConfiguration();
         this.configureLogger();
         this.instantiateComponentStateManager();
         this.restoreComponentsState(),
         this.determineCurrentUserLocale();
         this.determineDefaultSkin();

         this.logger.debug( "Browser Interface is initialized with context root prefix: "  + this.options.contextRootPrefix );
      }else{
         this.showWebUIExceptionPage( new Error( this.options.unsupportedBrowserMessage ));
      }
   }.protect(),

   //public accessor and mutator methods
   changeLanguage : function( locale ){
      this.logger.debug( this.options.componentName + ".changeLanguage()." );
      this.destroy();
      if( this.options.showSplashForm ) this.showSplashForm();
      this.locale = locale;
      this.configure.delay( this.options.reConfigurationDelay, this );
   },
   
   changeSkin : function( newSkinName ){
      this.logger.debug( this.options.componentName + ".changeSkin()." );
      if( newSkinName != this.getCurrentSkin() ){
         if( this.options.eraseStateWhenSkinChange ) this.stateManager.reset();
         this.destroy();
         if( this.options.showSplashForm ) this.showSplashForm();
         this.skin = newSkinName;
         this.configure.delay( this.options.reConfigurationDelay, this );
      }
   },
   
   configure : function() {
      this.configurationChain.chain( 
         this.loadWebUIConfiguration,
         this.configureLogger,
         this.restoreComponentsState,
         this.determineCurrentUserLocale,
         this.loadInternationalizations,
         this.constructDesktop,
         this.subscribeToWebUIMessages,
         this.storeWebUIState,
         this.destroySplashForm,
         this.finalizeConfiguration
      ).callChain();
   },
   
   destroy : function() {
      if( this.isConfigured ){
         this.locale = null;
         this.messageBus.tearDown();
         if( this.languageSelector ) this.languageSelector.destroy();
         this.desktop.destroy();
         this.webUIConfiguration.release();
         this.localizationResourceManager.release();
         window.location.hash = "";
         clearInterval( this.refreshUrlTimer );
         this.isConfigured = false;
      }
   },
   
   loadDocument : function( documentUri, contentUri, documentVariables, documentType ){
      this.logger.debug( this.options.componentName + ".loadDocument( '" + documentUri + "' )" );
      var message = new MenuSelectedMessage({ 
         activityType : AbstractDocument.Activity.LOAD_DOCUMENT, 
         documentType : documentType, 
         documentURI : documentUri, 
         documentContentURI : contentUri, 
         documentVariables : documentVariables,
         originator : this.options.messageOriginator });
      this.messageBus.notifySubscribers( message );
   },
   
   loadHtmlDocument : function( documentUri ){
      this.loadDocument( documentUri, null, null, AbstractDocument.Types.HTML );
   },
   
   loadSmartDocument : function( documentUri, contentUri, documentVariables ){
      this.loadDocument( documentUri, contentUri, documentVariables, AbstractDocument.Types.SMART );
   },
   
   onDesktopComponentConstructed : function( componentName ){
      if( this.splashForm ) this.splashForm.updateStatus( componentName );
   },
   
   onDesktopConstructed : function(){
      this.logger.debug( this.options.componentName + ", constructing desktop is finished." );
      this.configurationChain.callChain();
   },
   
   onLocalizationResourcesLoaded : function(){
      this.configurationChain.callChain();
   },
   
   onError: function( error ){
      this.revertConstruction( error );
   },
	
   restoreComponentsState : function(){
      this.logger.debug( this.options.componentName + ".restoreComponentsState() started." );
      this.stateManager.restore();
      if( window.location.hash.substring(2)) {
         var currentState = this.stateManager.toString();
         try {
            this.stateManager.parseUri( window.location.hash.substring(2) );
            this.messageBus.notifySubscribers( new WebUIStateRestoredMessage() );
         }catch( e ){
            this.stateManager.parse( currentState );
            this.logger.debug( "restoreComponentsState() exception: " + e );
         }
      }
      this.configurationChain.callChain();
   },
   
   storeComponentsState : function() {
      this.stateManager.persist();
      
	   var stateAsString = this.stateManager.toUri(); 
	   if( this.recentHash != stateAsString ){
	      this.recentHash = stateAsString;
	      window.location.hash = "!" + stateAsString;
	   }
   },
   
   webUIMessageHandler: function( webUIMessage ){
      if( !this.isConfigured ) throw new UnconfiguredWebUIControllerException({ source : 'WebUIController.webUIMessageHandler()' });
      
      if( instanceOf( webUIMessage, LanguageChangedMessage ) && webUIMessage.getNewLocale() != this.getCurrentLocale() ){
         this.changeLanguage( webUIMessage.getNewLocale() );
      }else if( instanceOf( webUIMessage, SkinChangedMessage )){
         this.changeSkin( webUIMessage.getNewSkin() );
      }else if( instanceOf( webUIMessage, MenuSelectedMessage ) && webUIMessage.getActionType() == 'changeSkin' ){
         this.changeSkin( webUIMessage.getProperty( 'skinName' ));
      }
      
      this.lastHandledMessage = webUIMessage;
   },

	//Properties
   getContextRootPrefix : function() { return this.contextRootPrefix; },
   getCurrentLocale : function () { return this.locale; },
   getCurrentSkin : function () { return this.skin; },
   getDesktop : function() { return this.desktop; },
   getIsConfigured : function() { return this.isConfigured; },
   getLanguageSelector : function() { return this.languageSelector; },
   getLocale : function() { return this.locale; },
   getLogger : function() { return this.logger; },
   getMessageBus : function() { return this.messageBus; },
   getPrefferedLanguage : function() { return this.prefferedLanguage; },
   getResourceBundle : function() { return this.localizationResourceManager; },
   getStateManager : function() { return this.stateManager; },
   getText : function( key, defaultValue ) { return this.getTextInternal( key, defaultValue  ); },
   getUserLocation : function() { return this.userLocation; },
   getUserName : function() { return this.userName; },
   getWebUIConfiguration : function() { return this.webUIConfiguration; },
   getWebUIException : function() { return this.webUiException; },
   setUserLocation : function( newLocation ) { this.userLocation = newLocation;},
   setUserName : function( newUserName ) { this.userName = newUserName;},
   setLanguage : function ( newLanguage ) { this.setLanguageInternal( newLanguage ); },
	
   //private methods
   browserIsSupported : function(){
      if( Browser.version >= this.options.compatibleBrowserVersions[Browser.name] ) return true;
      else return false;
   }.protect(),
   
   configureLogger : function() {		
      this.logger =  new WebUILogger( this.webUIConfiguration );
      this.logger.debug( this.options.componentName + ".configureLogger() started." );
      this.configurationChain.callChain();
   }.protect(),
	
   constructDesktop : function() {
      this.logger.debug( this.options.componentName + ".constructDesktop() started." );
      var desktopConfigurationUri = this.webUIConfiguration.getSkinConfiguration( this.skin );
      this.desktop = new Desktop( this.webUIConfiguration, this.localizationResourceManager, { 
         configurationURI : desktopConfigurationUri,
         onDesktopComponentConstructed : this.onDesktopComponentConstructed,
         onConstructed : this.onDesktopConstructed, 
         onError : this.onError 
      });
      this.desktop.unmarshall();
      try{
         this.desktop.construct();
      }catch( e ){
         this.onError( e );
      }
   }.protect(),
   
   destroySplashForm : function(){
      if( this.splashForm ) this.splashForm.destroy();
      this.configurationChain.callChain();
   }.protect(),
	
   determineCurrentHash: function() {
      if( window.location.hash.indexOf( "#" ) != -1 )
         return window.location.hash.substring(1);
      else return "";
   }.protect(),
	
   determineCurrentUserLocale : function() {
      this.logger.debug( this.options.componentName + ".determineCurrentUserLocale() started." );
      var browserLanguage = new ProcessPuzzleLocale();
      browserLanguage.parse( navigator.language || navigator.userLanguage );
      browserLanguage.options.country = null;
      browserLanguage.options.variant = null;
      if( this.locale == null ){
         var storedState = this.stateManager.retrieveComponentState( this.options.componentName ); 
         if( storedState ) {
            var localeString = storedState['locale'];
            this.locale = new ProcessPuzzleLocale();
            this.locale.parse( localeString );
         }else if( this.webUIConfiguration.isSupportedLocale( browserLanguage )){
            this.locale = browserLanguage;
         }else {
            this.locale = new ProcessPuzzleLocale();
            this.locale.parse( this.webUIConfiguration.getI18DefaultLocale() );
         }
      }
      this.configurationChain.callChain();
   }.protect(),
	
   determineDefaultSkin : function(){
      this.skin = this.webUIConfiguration.getDefaultSkin();
   }.protect(),
   
   finalizeConfiguration: function(){
      this.refreshUrlTimer = this.storeComponentsState.periodical( this.options.urlRefreshPeriod, this );
      this.isConfigured = true;
      this.fireEvent( 'configured', this, this.options.eventFireDelay );
   }.protect(),

   getTextInternal : function ( key, defaultValue ) {
      if( this.localizationResourceManager == null)
         if( defaultValue != null ) return defaultValue;
         else return key;
      var returnValue;
      try {
         returnValue = this.localizationResourceManager.getText(key);
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
   
   instantiateComponentStateManager : function(){
      var applicationSpecificName = this.webUIConfiguration.getApplicationName();
      applicationSpecificName += "." + this.webUIConfiguration.getApplicationVersion();
      applicationSpecificName += ".ComponentStateManager";
      this.stateManager = new ComponentStateManager({ componentName : applicationSpecificName });
   }.protect(),
	
   loadInternationalizations : function () {
      this.logger.debug( this.options.componentName + ".loadInternationalizations() started." );
      try{
         this.localizationResourceManager = new LocalizationResourceManager( this.webUIConfiguration, { onFailure : this.onError, onSuccess : this.onLocalizationResourcesLoaded } );
         this.localizationResourceManager.load( this.locale );
      }catch( e ) {
         this.onError( e );
      }
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
   
   revertConstruction : function( error ){
      this.error = error;
      this.destroySplashForm();
      this.showWebUIExceptionPage( this.error );
   }.protect(),

   setLanguage : function( newLanguage ) {
      this.logger.debug( this.options.componentName + ".setLanguage() started." );
      prefferedLanguage = newLanguage;
      if(newLanguage != null) {
         var locale = new ProcessPuzzleLocale(newLanguage);
         if( applicationConfiguration != null) {
            applicationConfiguration.setLocale(locale);
            this.loadInternationalizations(applicationConfiguration.getBundlePath(),locale);
         }
      }
   }.protect(),
   
   showSplashForm : function(){
      this.splashForm = new SplashForm({ imageUri : this.options.splashFormUri });
      this.splashForm.construct();
   }.protect(),
	
   showWebUIExceptionPage : function( exception ) {
      var bodyElement = $$( 'body' );
      this.warningContainer = new Element( 'div', { id: 'warning'} );
      bodyElement.grab( this.warningContainer, 'top' );
      
      var warningHeader = new Element( 'h1' );
      warningHeader.appendText( "Error Occured" );
      this.warningContainer.grab( warningHeader );
      
      var warningNameElement = new Element( 'h3' );
      warningNameElement.appendText( exception.getName() );
      this.warningContainer.grab( warningNameElement );
      
      var messageElement = new Element( 'div' );
      messageElement.appendText( exception.getMessage() );
      this.warningContainer.grab( messageElement );
      
      var stackElement = new Element( 'div' );
      this.warningContainer.grab( stackElement );
      if( exception.stackTrace ) {
         var lines = exception.stackTrace().split(/\r\n|\r|\n/);
         lines.each( function( line, index ){
            var lineElement = new Element( 'div' );
            lineElement.appendText( line );
            this.warningContainer.grab( lineElement );
         }.bind( this ));
      }
   }.protect(),
	
   storeWebUIState : function() {
      this.logger.debug( this.options.componentName + ".storeWebUIState() started." );
      this.stateManager.storeComponentState( this.options.componentName, {locale : this.locale.toString()} );
      this.configurationChain.callChain();
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
      this.messageBus.subscribeToMessage( LanguageChangedMessage, this.webUIMessageHandler );
      this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      this.messageBus.subscribeToMessage( SkinChangedMessage, this.webUIMessageHandler );
      //this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      this.configurationChain.callChain();
   }.protect(),
   
   updateOptionsWithConfiguration: function(){
      this.options.eraseStateWhenSkinChange = this.webUIConfiguration.getEraseStateWhenSkinChange();
   }
});
