/*
Name: 
   - Desktop

Description: 
   - Constructs complete desktop from predefined UI elements, like windows, columns and panels. It's wrapper of MockaUI desktop.
    
Requires:

Provides:
    - Desktop

Part of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. 
http://www.processpuzzle.com

Authors: 
    - Zsolt Zsuffa

Copyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the 
GNU General Public License as published by the Free Software Foundation, either version 3 of the License, 
or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var Desktop = new Class({
   Implements : [Events, Options, TimeOutBehaviour], 
   Binds : ['checkTimeOut',
            'constructColumns', 
            'constructContentArea', 
            'constructFooter', 
            'constructHeader', 
            'constructPanels', 
            'constructWindowDocker', 
            'constructWindows',
            'destroyColumns',
            'destroyContentArea',
            'destroyFooter',
            'destroyHeader',
            'destroyHiddenElements',
            'destroyPanels',
            'destroyWindowDocker',
            'destroyWindows',
            'finalizeConstruction',
            'finalizeDestruction',
            'hideDesktop',
            'initializeMUI', 
            'loadResources',
            'onColumnConstructed',
            'onColumnDestructed',
            'onContentAreaConstructed',
            'onError',
            'onFooterConstructed',
            'onHeaderConstructed',
            'onPanelConstructed',
            'onPanelDestructed',
            'onResourceError',
            'onResourcesLoaded',
            'onWindowConstructed',
            'onWindowDestructed',
            'onWindowDockerConstructed',
            'releaseResources',
            'removeDesktopEvents',
            'showDesktop',
            'showNotification',
            'subscribeToWebUIMessages',
            'webUIMessageHandler'],
   options : {
      callChainDelay : 2000,
      componentName : "Desktop",
      columnSelector : "/desktopConfiguration/columns/column",
      configurationXmlNameSpace : "xmlns:dc='http://www.processpuzzle.com/DesktopConfiguration'",
      configurationURI : "DesktopConfiguration.xml",
      containerIdSelector : "/desktopConfiguration/containerId",
      contentAreaSelector : "/desktopConfiguration/contentArea",
      defaultContainerId : "desktop",
      descriptionSelector : "/desktopConfiguration/description",
      errorDocumentUri : "Content/System/ErrorDocument.xml",
      eventFireDelay : 5,
      footerSelector : "/desktopConfiguration/footer",
      headerSelector : "/desktopConfiguration/header",
      nameSelector : "/desktopConfiguration/name",
      panelSelector : "/desktopConfiguration/panels/panel",
      pluginOnloadDelay : 1000,
      resourceLoadTimeout : 5000,
      resourcesSelector : "/desktopConfiguration/resources", 
      skin : "ProcessPuzzle",
      versionSelector : "/desktopConfiguration/version",
      windowDockerSelector : "/desktopConfiguration/windowDocker",
      windowSelector : "/desktopConfiguration/windows/window",
   },
	
	//Constructor
   initialize : function( webUIConfiguration, resourceBundle, options ) {
      this.presetOptionsBasedOnWebUIConfiguration( webUIConfiguration );
      this.setOptions( options );

	//Private instance variables
      this.componentStateManager = Class.getInstanceOf( ComponentStateManager );
      this.columns = new LinkedHashMap();
      this.configurationXml = new XmlResource( this.options.configurationURI, { nameSpaces : this.options.configurationXmlNameSpace } );
      this.constructionChain = new Chain();
      this.containerElement;
      this.containerId;
      this.contentArea;
      this.currentLocale = null;
      this.description;
      this.destructionChain = new Chain();
      this.dock = null;
      this.error;
      this.footer;
      this.header;
      this.lastHandledMessage;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.MUIDesktop = null;
      this.name;
      this.numberOfConstructedColumns = 0;
      this.numberOfConstructedPanels = 0;
      this.numberOfConstructedWindows = 0;
      this.panels = new LinkedHashMap();
      this.resourceBundle = resourceBundle;
      this.resources = null;
      this.state = DesktopElement.States.UNINITIALIZED;
      this.version;
      this.webUIConfiguration = webUIConfiguration;
      this.windowDocker;
      this.windows = new HashMap();
		
      this.determineCurrentLocale();
      this.loadI18Resources();
      this.configureLogger();
      this.state = DesktopElement.States.UNINITIALIZED;
   },
		
   //Public accessor and mutator methods
   construct : function() {
      this.startTimeOutTimer( 'construct' );
      this.constructionChain.chain(
         this.hideDesktop,
         this.loadResources,
         this.constructHeader,
         this.constructWindowDocker,
         this.constructContentArea,
         this.constructFooter,
         this.initializeMUI,
         this.constructColumns,
         this.constructPanels,
         this.constructWindows,
         this.subscribeToWebUIMessages,
         this.showDesktop,
         this.finalizeConstruction
      ).callChain();
   },
	
   destroy : function() {
      if( this.state > DesktopElement.States.UNMARSHALLED ){
         this.destructionChain.chain(
            this.hideDesktop,
            this.releaseResources,
            this.removeDesktopEvents,
            this.destroyWindows,
            this.destroyPanels,
            this.destroyColumns,
            this.destroyHeader,
            this.destroyContentArea,
            this.destroyFooter,
            this.destroyWindowDocker,
            this.destroyHiddenElements,
            this.finalizeDestruction
         ).callChain();
      }
   },
   
   onColumnConstructed: function( column ){
      this.numberOfConstructedColumns++;
      this.fireEvent( "desktopComponentConstructed", column.name );
      if( this.numberOfConstructedColumns == this.columns.size() ){
         this.logger.debug( this.options.componentName + ", loading desktop column is finished." );
         this.callNextConfigurationStep();
      } 
   },
   
   onColumnDestructed: function( panel ){
      this.numberOfConstructedColumns--;
      if( this.numberOfConstructedColumns == 0 ){
         this.logger.debug( this.options.componentName + ", destroy of desktop columns is finished." );
         this.columns.clear();
         this.destructionChain.callChain();
      } 
   },
   
   onContentAreaConstructed: function(){
      this.logger.debug( this.options.componentName + ", constructing desktop content area is finished." );
      this.fireEvent( "desktopComponentConstructed", "DesktopContentArea" );
      this.callNextConfigurationStep();
   },
   
   onError: function( error ){
      this.error = error;
   },
   
   onFooterConstructed: function(){
      this.logger.debug( this.options.componentName + ", loading desktop footer is finished." );
      this.fireEvent( "desktopComponentConstructed", "DesktopFooter" );
      this.callNextConfigurationStep();
   },
   
   onHeaderConstructed: function(){
      this.logger.debug( this.options.componentName + ", loading desktop header is finished." );
      this.fireEvent( "desktopComponentConstructed", "DesktopHeader" );
      this.callNextConfigurationStep();
   },
   
   onPanelConstructed: function( panel ){
      this.numberOfConstructedPanels++;
      this.fireEvent( "desktopComponentConstructed", panel.name );
      if( this.numberOfConstructedPanels == this.panels.size() ){
         this.logger.debug( this.options.componentName + ", loading desktop panels is finished." );
         this.callNextConfigurationStep();
      } 
   },
   
   onPanelDestructed: function( panel ){
      this.numberOfConstructedPanels--;
      if( this.numberOfConstructedPanels == 0 ){
         this.logger.debug( this.options.componentName + ", destroy of desktop panels is finished." );
         this.panels.clear();
         this.destructionChain.callChain();
      } 
   },
   
   onResourceError: function( error ){
      this.error = error;
   },
   
   onResourcesLoaded: function(){
      this.logger.debug( this.options.componentName + ", loading desktop resources is finished." );
      this.callNextConfigurationStep();      
   },
   
   onWindowConstructed: function( window ){
      this.logger.debug( this.options.componentName + ", constructing desktop window " + window.getName() + " is finished." );
      this.fireEvent( "desktopComponentConstructed", window.name );
      if( window.getOnReadyCallback() && typeOf( window.getOnReadyCallback() ) == 'function' ) window.getOnReadyCallback()();
   },
   
   onWindowDestructed: function( panel ){
      this.numberOfConstructedWindows--;
      if( this.numberOfConstructedWindows == 0 ){
         this.windows.clear();
         this.destructionChain.callChain();
      } 
   },
   
   onWindowDockerConstructed: function(){
      this.logger.debug( this.options.componentName + ", constructing desktop window docker is finished." );
      this.callNextConfigurationStep();
   },
   
   showNotification: function( notificationText ){
      if( this.state == DesktopElement.States.CONSTRUCTED ){
         MUI.notification( this.resourceBundle.getText( "DesktopNotification." + notificationText ));
      }
   },
   
   showWindow: function( windowName, onReadyCallBack ){
      var desktopWindow = this.windows.get( windowName );
      if( desktopWindow ) {
         if( desktopWindow.getState() == DesktopElement.States.INITIALIZED ) desktopWindow.unmarshall();
         desktopWindow.construct( onReadyCallBack );
      }
      return desktopWindow;
   },
   
   unmarshall: function(){
      this.unmarshallDesktopProperties();
      this.unmarshallResources();
      this.unmarshallHeader();
      this.unmarshallDesktopContentArea();
      this.unmarshallFooter();
      this.unmarshallWindowDocker();
      this.unmarshallColumns();
      this.unmarshallPanels();
      this.unmarshallWindows();
      this.componentStateManager.restoreStateFromUri();
      this.state = DesktopElement.States.UNMARSHALLED;
   },
	   
   webUIMessageHandler: function( webUIMessage ){
      if( this.state != DesktopElement.States.CONSTRUCTED ) return;
      
      if( instanceOf( webUIMessage, MenuSelectedMessage )) {
         switch( webUIMessage.getActivityType() ){
         case DesktopWindow.Activity.SHOW_NOTIFICATION:
            this.showNotification( webUIMessage.getNotification() ); break;
         case DesktopWindow.Activity.SHOW_WINDOW:
            this.showWindow( webUIMessage.getWindowName() ); break;
         }
      }
      this.lastHandledMessage = webUIMessage;
   },

   //Properties
   getColumns : function() { return this.columns; },
   getConfigurationXml : function() { return this.configurationXml; },
   getContainerId : function() { return this.containerId; },
   getCurrentLocale : function() { return this.currentLocale; },
   getDescription : function() { return this.description; },
   getMUIDesktop : function() { return this.MUIDesktop; },
   getFooter: function() { return this.footer; },
   getHeader: function() { return this.header; },
   getName: function() { return this.name; },
   getPanels : function() { return this.panels; },
   getResources : function() { return this.resources; },
   getState : function() { return this.state; },
   getVersion : function() { return this.version; },
   getWindowDocker : function() { return this.windowDocker; },
   getWindows : function() { return this.windows; },
   isSuccess: function() { return this.error == null; },
	
   //Private methods
   callNextConfigurationStep: function(){
      if( this.isSuccess() ) this.constructionChain.callChain();
      else{ this.revertConstruction(); }
   }.protect(),
   
   configureLogger : function() {
      if( !this.logger.isConfigured() ) this.logger.configure( this.webUIConfiguration );
   }.protect(),
	
   constructColumns : function() {
      this.logger.debug( this.options.componentName + ".constructColumns() started." );
      if( this.columns.size() > 0 ){
         this.columns.each( function( columnEntry, index ){
            var column = columnEntry.getValue();
            try{ column.construct();
            }catch( e ){ this.onError( e ); }
         }, this );
      }else this.callNextConfigurationStep();
   }.protect(),
   
   constructContentArea : function(){
      this.logger.debug( this.options.componentName + ".constructContentArea() started." );
      if( this.contentArea ) this.contentArea.construct();
      else this.callNextConfigurationStep();      
   }.protect(),
    
   constructHeader : function(){
      this.logger.debug( this.options.componentName + ".constructHeader() started." );
      if( this.header ) this.header.construct();
      else this.callNextConfigurationStep();      
   }.protect(),
	
   constructFooter : function(){
      this.logger.debug( this.options.componentName + ".constructFooter() started." );
      if( this.footer ) this.footer.construct();
      else this.callNextConfigurationStep();      
   }.protect(),
    
   constructPanels : function() {
      this.logger.debug( this.options.componentName + ".constructPanels() started." );
      if( this.panels.size() > 0 ){
         this.panels.each( function( panelEntry, index ){
            var panel = panelEntry.getValue();
            try{ panel.construct();
            }catch( e ){ this.onError( e ); }
         }, this );
      } else this.callNextConfigurationStep();
   }.protect(),
	
   constructWindowDocker : function(){
      this.logger.debug( this.options.componentName + ".constructWindowDocker() started." );
      if( this.windowDocker ) this.windowDocker.construct();
      else this.callNextConfigurationStep();      
   }.protect(),
    
   constructWindows : function() {
      this.logger.debug( this.options.componentName + ".constructWindows() started." );      
      this.callNextConfigurationStep();
   }.protect(),
	
   destroyColumns: function() {
      this.logger.debug( this.options.componentName + ".destroyColumns() started." );
      this.columns.each( function( columnEntry, index ) {
         var column = columnEntry.getValue();
         column.destroy();
      }, this );
   }.protect(),
   
   destroyContentArea: function(){
      if( this.contentArea ) this.contentArea.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   destroyElementById: function( elementId ){
      if( $( elementId )) $( elementId ).destroy(); 
   }.protect(),
   
   destroyFooter: function(){
      if( this.footer ) this.footer.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   destroyHeader: function(){
      if( this.header ) this.header.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   destroyHiddenElements: function(){
      this.destroyElementById( 'windowUnderlay' );
      this.destroyElementById( 'lbOverlay' );
      this.destroyElementById( 'lbCenter' );
      this.destroyElementById( 'lbBottomContainer' );
      this.destructionChain.callChain();
   }.protect(),
	
   destroyPanels: function() {
      this.logger.debug( this.options.componentName + ".destroyPanels() started." );
      this.panels.each( function( panelEntry, index ) {
         var panel = panelEntry.getValue();
         panel.destroy();
      }, this );
   }.protect(),
   
   destroyWindowDocker: function(){
      if( this.windowDocker ) this.windowDocker.destroy();
      this.destructionChain.callChain();
   }.protect(),
	
   destroyWindows: function() {
      this.logger.debug( this.options.componentName + ".destroyWindows() started." );
      this.numberOfConstructedWindows = this.windows.size();
      if( this.numberOfConstructedWindows > 0 ){
         this.windows.each( function( windowEntry, index ) {
            var window = windowEntry.getValue();
            window.destroy();
         }, this );
      }else this.destructionChain.callChain(); 
   }.protect(),
	
   determineCurrentLocale : function() {
      if( this.resourceBundle.isLoaded ) this.currentLocale = this.resourceBundle.getLocale();
      else {
         this.currentLocale = new ProcessPuzzleLocale();
         this.currentLocale.parse( this.webUIConfiguration.getI18DefaultLocale() );
      }
   }.protect(),
   
   finalizeConstruction: function(){
      this.state = DesktopElement.States.CONSTRUCTED;
      this.stopTimeOutTimer( 'construct' );
      this.constructionChain.clearChain();
      this.fireEvent( 'constructed', this, this.options.eventFireDelay ); 
   }.protect(),
   
   finalizeDestruction: function(){
      this.state = DesktopElement.States.INITIALIZED;
      this.destructionChain.clearChain();
      this.fireEvent( 'destructed', this, this.options.eventFireDelay ); 
   }.protect(),
   
   hideDesktop: function(){
      this.containerElement.setStyle( "visibility", "hidden" );
      if( this.destructionChain.$chain.length > 0 ) this.destructionChain.callChain();
      this.callNextConfigurationStep();
   }.protect(),
	
   initializeMUI : function() {
      this.logger.debug( this.options.componentName + ".initializeMUI() started." );
      MUI.myChain = new Chain();
      MUI.myChain.chain(
         function(){
            MUI.Desktop.initialize({
               desktop : this.containerId,
               desktopHeader : this.header.getId(),
               desktopFooter : this.footer.getFooterId(),
               desktopFooterWrapper : this.footer.getId(),
               desktopNavBar : this.header.getNavigationBarId(),
               pageWrapper : this.contentArea.getId()
            }); 
         }.bind( this ),
         function(){ MUI.Dock.initialize(); }
      );
      
      MUI.myChain.callChain();
      this.MUIDesktop = MUI.Desktop;
      this.dock = MUI.Dock;
      this.callNextConfigurationStep();
   }.protect(),
   
   loadResources: function(){
      this.logger.debug( this.options.componentName + ".loadResources() started." );
      if( this.resources ) {
         this.resources.load();
      }else this.onResourcesLoaded();
   }.protect(),
   
   loadI18Resources : function() {
      if( !this.resourceBundle.isLoaded )
         this.resourceBundle.load( this.currentLocale );
   }.protect(),
	
   presetOptionsBasedOnWebUIConfiguration : function( webUIConfiguration ){
      if( webUIConfiguration != 'undefined' && webUIConfiguration != null ){
         this.options.skin = webUIConfiguration.getDefaultSkin();
         this.options.configurationURI = webUIConfiguration.getSkinConfiguration( this.options.skin );
      }
   }.protect(),
   
   proceedWithConfigurationChainWhenResourcesLoaded: function() {
      if( this.pendingResourcesCounter > 0 ) return false;
      else this.callNextConfigurationStep();
   }.protect(),
   
   releaseResources : function(){
      if( this.resources ) this.resources.release();
      this.destructionChain.callChain();
   }.protect(),

   removeDesktopEvents : function(){
      this.containerElement.removeEvents();
      window.removeEvents();
      document.removeEvents();
      
      this.destructionChain.callChain();
   }.protect(),
   
   revertConstruction: function(){
      if( this.resources ) this.resources.release();
      if( this.header ) this.header.destroy();
      if( this.contentArea ) this.contentArea.destroy();
      if( this.footer ) this.footer.destroy();
      if( this.windowDocker ) this.windowDocker.destroy();
      this.destroyWindows();
      this.destroyPanels();
      this.destroyColumns();
      this.removeDesktopEvents();
      this.state = DesktopElement.States.INITIALIZED;      
      this.fireEvent( 'error', this.error );
   }.protect(),
   
   showDesktop: function(){
      this.containerElement.setStyle( "visibility", "visible" );
      this.callNextConfigurationStep();
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
      this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      this.callNextConfigurationStep();
   }.protect(),
   
   timeOut : function( exception ){
      this.error = exception;
      this.revertConstruction();
   }.protect(),
   
   unmarshallColumns: function(){
      var columnDefinitionElements = this.configurationXml.selectNodes( this.options.columnSelector );
      columnDefinitionElements.each( function( columnDefinition, index ){
         var desktopColumn = new DesktopColumn( columnDefinition, { componentContainerId : this.containerId, onConstructed: this.onColumnConstructed, onDestructed: this.onColumnDestructed, onError : this.onError  } );
         desktopColumn.unmarshall();
         this.columns.put( desktopColumn.getName(), desktopColumn );
      }, this );
   }.protect(),
   
   unmarshallDesktopContentArea: function(){
      var areaDefinitionElement = this.configurationXml.selectNode( this.options.contentAreaSelector );
      if( areaDefinitionElement ){
         this.contentArea = new DesktopContentArea( areaDefinitionElement, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onContentAreaConstructed, onConstructionError : this.onError } );
         this.contentArea.unmarshall();
      }
   }.protect(),

   unmarshallDesktopProperties: function(){
      this.name = this.configurationXml.selectNodeText( this.options.nameSelector );
      this.description = this.configurationXml.selectNodeText( this.options.descriptionSelector );
      this.version = this.configurationXml.selectNodeText( this.options.versionSelector );
      this.containerId = this.configurationXml.selectNodeText( this.options.containerIdSelector );
      if( !this.containerId ) this.containerId = this.options.defaultContainerId;
      this.containerElement = $( this.containerId );
      if( !this.containerElement ) throw new NoneExistingDesktopContainerElementException( this.containerId );
   }.protect(),
   
   unmarshallFooter: function(){
      var footerDefinitionElement = this.configurationXml.selectNode( this.options.footerSelector );
      if( footerDefinitionElement ){
         this.footer = new DesktopFooter( footerDefinitionElement, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onFooterConstructed, onError : this.onError } );
         this.footer.unmarshall();
      }
   }.protect(),

   unmarshallHeader: function(){
      var headerDefinitionElement = this.configurationXml.selectNode( this.options.headerSelector );
      if( headerDefinitionElement ){
         this.header = new DesktopHeader( headerDefinitionElement, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onHeaderConstructed, onError : this.onError } );
         this.header.unmarshall();
      }
   }.protect(),

   unmarshallPanels: function(){
      var panelDefinitionElements = this.configurationXml.selectNodes( this.options.panelSelector );
      panelDefinitionElements.each( function( panelDefinition, index ){
         var desktopPanel = new DesktopPanel( panelDefinition, this.resourceBundle, { 
            componentContainerId: this.containerId,
            errorDocumentUri : this.options.errorDocumentUri,
            onConstructed: this.onPanelConstructed, 
            onDestructed: this.onPanelDestructed, 
            onError : this.onError });
         desktopPanel.unmarshall();
         this.panels.put( desktopPanel.getName(), desktopPanel );
      }, this );
   }.protect(),
   
   unmarshallResources: function(){
      var resourcesElement = this.configurationXml.selectNode( this.options.resourcesSelector );
      if( resourcesElement ) {
         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded, onResourceError : this.onResourceError } );
         this.resources.unmarshall();
      }
   }.protect(),
   
   unmarshallWindowDocker: function(){
      var windowDockerDefinitionElement = this.configurationXml.selectNode( this.options.windowDockerSelector );
      if( windowDockerDefinitionElement ){
         this.windowDocker = new WindowDocker( windowDockerDefinitionElement, this.resourceBundle, { componentContainerId : this.containerId, onConstructed : this.onWindowDockerConstructed, onError : this.onError } );
         this.windowDocker.unmarshall();         
      }
   }.protect(),
   
   unmarshallWindows: function(){
      var windowDefinitionElements = this.configurationXml.selectNodes( this.options.windowSelector );
      windowDefinitionElements.each( function( windowDefinition, index ){
         var desktopWindow = new DesktopWindow( windowDefinition, this.resourceBundle, { 
            componentContainerId: this.containerId, 
            errorDocumentUri : this.options.errorDocumentUri,
            onConstructed: this.onWindowConstructed, 
            onDestructed: this.onWindowDestructed, 
            onError : this.onError });
         desktopWindow.unmarshall();
         this.windows.put( desktopWindow.getName(), desktopWindow );
      }, this );
   }.protect(),
});
