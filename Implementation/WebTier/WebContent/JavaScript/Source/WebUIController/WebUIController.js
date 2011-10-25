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
   Implements: [Class.Singleton, Options],
   Binds : ['changeLanguage', 'loadDocument', 'webUIMessageHandler'],
   
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
      this.desktop = null;
      this.documentManager = null;
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
      this.webUIConfiguration = null;
      this.webUIException = null;
      this.workproductTypeXslt = this.options.contextRootPrefix + this.options.artifactTypesXslt;
      this.loadWebUIConfiguration();
      this.configureLogger();

      this.logger.group( this.options.componentName + ".setUp", false );
      this.determineCurrentUserLocale();
      this.determineDefaultSkin();
      this.loadResourceBundle();
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
      this.destroy();
      this.locale = locale;
      this.configure();
      this.documentManager.changeLanguage( locale );
      if( this.currentDocumentProperties ) this.loadDocument( this.currentDocumentProperties );
   },
   
   changeSkin : function( newSkinName ){
      this.destroy();
      this.skin = newSkinName;
      this.configure();
   },
   
   configure : function() {
      this.logger.group( this.options.componentName + ".configure", false );
      this.loadWebUIConfiguration();
      this.configureLogger();
      this.restoreStateFromUrl();
      this.determineCurrentUserLocale();
      this.loadResourceBundle();
      this.configureDesktop();
      this.configureDocumentManager();
      this.subscribeToWebUIMessages();
      this.storeComponentState();
      
      this.isConfigured = true;
      this.logger.groupEnd();
   },
   
   destroy : function() {
      if( this.isConfigured ){
         this.locale = null;
         this.documentManager.destroy();
         this.messageBus.tearDown();
         if( this.languageSelector ) this.languageSelector.destroy();
         this.desktop.destroy();
         this.webUIConfiguration.release();
         this.resourceBundle.release();
         this.options.window.location.hash = "";
         this.isConfigured = false;
      }
   },
   
   loadDocument : function( documentProperties ){
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
	
	loadInfoPanelDocumentById : function ( documentType, name, id, viewNameToActivate ) {
   },
   
	loadInfoPanelDocumentByName : function ( documentType, name ) {
      this.logger.debug( "Info Panel Document by name load was requested. name:" + name + ", type:" + documentType );
      return infoPanelManager.loadDocumentByName( documentType, name, null );
	},
	
	loadInfoPanelDocumentByUri : function ( documentType, name, uri ) {
      this.logger.debug( "Info Panel Document by uri load was requested. uri: " + uri + ", type:" + documentType );
      return infoPanelManager.loadDocumentByUri( documentType, name, uri, null );
	},
	
	reloadActiveDocument : function () {
      var documentType = self.getActiveDocument().getDocumentType();
      var documentName = self.getActiveDocument().getDocumentName();
      self.loadDocument(documentType, documentName );
	},
	
   restoreStateFromUrl : function(){
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
   },
   
   storeStateInUrl : function() {
	   var stateAsString = this.stateManager.toString(); 
	   if( this.recentHash != stateAsString ){
	      this.recentHash = stateAsString;
	      this.options.window.location.hash = "!" + stateAsString;
	   }
   },
   
	unloadInfoPanelDocument : function ( documentName ) {
      this.logger.debug( "Info Panel Document should be unloaded.", documentName );
      infoPanelManager.unLoadDocument( documentName );
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
   buildLanguageSelector : function() {
      this.languageSelector = new LanguageSelectorWidget( this.options.languageSelectorElementId, this.resourceBundle, this.webUIConfiguration, this.changeLanguage );
      this.languageSelector.build();
   }.protect(),
   
	configureLogger : function() {		
      this.logger =  new WebUILogger( this.webUIConfiguration );
	}.protect(),
	
	configureDesktop : function() {
	   var desktopConfigurationUri = this.webUIConfiguration.getSkinConfiguration( this.skin );
	   this.desktop = new Desktop( this.webUIConfiguration, this.resourceBundle, { configurationURI : desktopConfigurationUri } );
	   this.desktop.unmarshall();
	   this.desktop.construct();
	}.protect(),
	
	configureDocumentManager : function() {
	   this.documentManager = new DocumentManager();
	   this.documentManager.configure( this.locale );
	}.protect(),
	
	determineCurrentHash: function() {
	   if( this.options.window.location.hash.indexOf( "#" ) != -1 )
	      return this.options.window.location.hash.substring(1);
	   else return "";
	}.protect(),
	
	determineCurrentUserLocale : function() {
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
   
   loadMenuManager : function ( menuWidget ) {
      rightMenu = menuWidget;
      this.logger.debug( "Menu Manager loaded." );
   },
   
   loadResourceBundle : function () {
      try{
         this.resourceBundle = new XMLResourceBundle( this.webUIConfiguration );
         this.resourceBundle.load( this.locale );
         this.logger.debug( "Resource bundles: " + this.options.contextRootPrefix + this.resourceBundle.getResourceBundleNames() + " was loaded." );
      }catch( e ) {
         this.showWebUIExceptionPage( e );
      }
   }.protect(),
   
	loadWebUIConfiguration : function() {
      try{
         this.webUIConfiguration = new WebUIConfiguration( this.options.configurationUri );
      }catch( e ){
         alert( "Couldn't load Browser Front-End configuration: " + this.options.configurationUri );
      }
	}.protect(),

	setLanguage : function( newLanguage ) {
		prefferedLanguage=newLanguage;
		if(newLanguage != null) {
			var locale = new Locale(newLanguage);
			if(applicationConfiguration != null) {
				applicationConfiguration.setLocale(locale);
				this.loadResourceBundle(applicationConfiguration.getBundlePath(),locale);
			}
		}
	}.protect(),
	
	showWebUIExceptionPage : function( e ) {
		top.BrowserInterfaceException = e;
		//window.location.href = this.options.contextRootPrefix + this.options.errorPageUri;
	}.protect(),
	
   storeComponentState : function() {
      this.stateManager.storeCurrentState( this.options.componentName, {locale : this.locale.toString()} );
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      this.messageBus.subscribeToMessage( LanguageChangedMessage, this.webUIMessageHandler );
      this.messageBus.subscribeToMessage( SkinChangedMessage, this.webUIMessageHandler );
	   this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
   }.protect()
});
