/*!
Distributed under the MIT License:

 * Copyright (c) 2010 IT Codex Llc.
 * MIT (MIT-LICENSE.txt)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

/*
name: 
   - Desktop
script: 
   - Desktop.js
description: 
   - Constructs complete desktop from predefined UI elements, like windows, columns and panels. It's wrapper of MockaUI desktop.
    
copyright: 
   - (c) 2011 IT Codex Llc., <http://itkodex.hu/>.
license: 
   - MIT-style license.

todo:
  - 

requires:
  - MochaUI/MUI.Core
  - MochaUI/MUI.Column
  - MochaUI/MUI.Panel
  - MochaUI/MUI.Windows

provides: [ProcessPuzzle.Desktop]

...
*/

var Desktop = new Class({
   Implements : [Events, Options], 
   Binds : ['constructColumns', 
            'constructContentArea', 
            'constructFooter', 
            'constructHeader', 
            'constructPanels', 
            'constructWindowDocker', 
            'constructWindows', 
            'initializeMUI', 
            'loadResources',
            'onFooterConstructed',
            'onHeaderConstructed',
            'onPanelConstructed',
            'onResourcesLoaded'],
   options : {
      callChainDelay : 2000,
      componentName : "Desktop",
      columnSelector : "pp:desktopConfiguration/columns/column",
      configurationXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      configurationURI : "DesktopConfiguration.xml",
      containerIdSelector : "pp:desktopConfiguration/containerId",
      contentAreaSelector : "pp:desktopConfiguration/contentArea",
      defaultContainerId : "desktop",
      descriptionSelector : "pp:desktopConfiguration/description",
      footerSelector : "pp:desktopConfiguration/footer",
      headerSelector : "pp:desktopConfiguration/header",
      nameSelector : "pp:desktopConfiguration/name",
      panelSelector : "pp:desktopConfiguration/panels/panel",
      pluginOnloadDelay : 1000,
      resourceLoadTimeout : 5000,
      resourcesSelector : "pp:desktopConfiguration/resources", 
      skin : "ProcessPuzzle",
      versionSelector : "pp:desktopConfiguration/version",
      windowDockerSelector : "pp:desktopConfiguration/windowDocker"
   },
	
	//Constructor
   initialize : function( webUIConfiguration, resourceBundle, options ) {
      this.presetOptionsBasedOnWebUIConfiguration( webUIConfiguration );
      this.setOptions( options );

	//Private instance variables
      this.columns = new LinkedHashMap();
      this.configurationXml = new XmlResource( this.options.configurationURI, { nameSpaces : this.options.configurationXmlNameSpace } );
      this.configurationChain = new Chain();
      this.containerElement;
      this.containerId;
      this.contentArea;
      this.currentLocale = null;
      this.description;
      this.dock = null;
      this.header;
      this.footer;
      this.isConfigured = false;
      this.logger = new WebUILogger( webUIConfiguration );
      this.MUIDesktop = null;
      this.name;
      this.numberOfConstructedPanels = 0;
      this.panels = new LinkedHashMap();
      this.resourceBundle = resourceBundle;
      this.resources = null;
      this.state = Desktop.States.UNINITIALIZED;
      this.version;
      this.webUIConfiguration = webUIConfiguration;
      this.windowDocker;
      this.windows = new HashMap();
		
      this.determineCurrentLocale();
      this.loadI18Resources();
      this.configureLogger();
      this.state = Desktop.States.UNINITIALIZED;
   },
		
   //Public accessor and mutator methods
   construct : function() {
      this.logger.group( this.options.componentName + ".configure", false );
      this.configurationChain.chain( 
         this.loadResources,
         this.constructHeader,
         this.constructWindowDocker,
         this.constructContentArea,
         this.constructFooter,
         this.initializeMUI,
         this.constructColumns,
         this.constructPanels,
         this.constructWindows
      ).callChain();
   },
	
	destroy : function() {
       this.logger.group( this.options.componentName + ".destroy", false );
	   if( this.isConfigured ){
	      if( this.resources ) this.resources.release();
	      if( this.header ) this.header.destroy();
	      if( this.contentArea ) this.contentArea.destroy();
	      if( this.footer ) this.footer.destroy();
	      if( this.windowDocker ) this.windowDocker.destroy();
	      this.destroyWindows();
	      this.destroyPanels();
	      this.destroyColumns();
	      this.removeDesktopEvents();
	      this.state = Desktop.States.INITIALIZED;
	   }
       this.logger.groupEnd();
   },
   
   onFooterConstructed: function(){
      this.configurationChain.callChain();
   },
   
   onHeaderConstructed: function(){
      this.configurationChain.callChain();
   },
   
   onPanelConstructed: function(){
      this.numberOfConstructedPanels++;
      if( this.numberOfConstructedPanels == this.panels.size() ) this.configurationChain.callChain();
   },
   
   onResourcesLoaded: function(){
      this.configurationChain.callChain();      
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
      this.state = Desktop.States.UNMARSHALLED;
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
	
   //Private methods
   configureLogger : function() {
      if( !this.logger.isConfigured() ) this.logger.configure( this.webUIConfiguration );
   }.protect(),
	
   constructColumns : function() {
      this.logger.debug( this.options.componentName + ".constructColumns() started." );
      this.columns.each( function( columnEntry, index ){
         var column = columnEntry.getValue();
         column.construct();
      }, this );
      this.configurationChain.callChain();
   }.protect(),
   
   constructContentArea : function(){
      if( this.contentArea ) this.contentArea.construct( this.containerElement, 'bottom' );
      this.configurationChain.callChain();      
   }.protect(),
    
   constructHeader : function(){
      if( this.header ) this.header.construct( this.containerElement, 'bottom' );
      else this.configurationChain.callChain();      
   }.protect(),
	
   constructFooter : function(){
      if( this.footer ) this.footer.construct( this.containerElement, 'bottom');
      else this.configurationChain.callChain();      
   }.protect(),
    
   constructPanels : function() {
      this.logger.debug( this.options.componentName + ".constructPanels() started." );
      if( this.panels.size() > 0 ){
         this.panels.each( function( panelEntry, index ){
            var panel = panelEntry.getValue();
            panel.construct();
         }, this );
      } else this.configurationChain.callChain();
   }.protect(),
	
   constructWindowDocker : function(){
      if( this.windowDocker ) this.windowDocker.construct( this.containerElement, 'bottom' );
      this.configurationChain.callChain();      
   }.protect(),
    
   constructWindows : function() {
      this.logger.debug( this.options.componentName + ".constructWindows() started." );      
      this.configurationChain.callChain();
      this.state = Desktop.States.CONSTRUCTED;
      this.fireEvent('constructed', this ); 
   }.protect(),
	
   destroyColumns: function() {
      this.getDesktopColumns().clear();
   }.protect(),
	
   destroyPanels: function() {
      this.panels().each( function( desktopPanel, index ) {
         desktopPanel.destroy();
      }, this );
      this.panels().clear();
      this.numberOfConstructedPanels = 0;
	}.protect(),
	
   destroyWindows: function() {
      this.getDesktopWindows().clear();
   }.protect(),
	
   determineCurrentLocale : function() {
	   if( this.resourceBundle.isLoaded ) this.currentLocale = this.resourceBundle.getLocale();
	   else {
	      this.currentLocale = new Locale();
	      this.currentLocale.parse( this.webUIConfiguration.getI18DefaultLocale() );
	   }
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
      this.configurationChain.callChain();
   }.protect(),
   
   loadResources: function(){
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
      else this.configurationChain.callChain();
   }.protect(),

   removeDesktopEvents : function(){
      this.getDesktopElement().removeEvents();
	   window.removeEvents();
	   document.removeEvents();
   }.protect(),
   
   unmarshallColumns: function(){
      var columnDefinitionElements = this.configurationXml.selectNodes( this.options.columnSelector );
      columnDefinitionElements.each( function( columnDefinition, index ){
         var desktopColumn = new DesktopColumn( columnDefinition );
         desktopColumn.unmarshall();
         this.columns.put( desktopColumn.getName(), desktopColumn );
      }, this );
   }.protect(),
   
   unmarshallDesktopContentArea: function(){
      var areaDefinitionElement = this.configurationXml.selectNode( this.options.contentAreaSelector );
      if( areaDefinitionElement ){
         this.contentArea = new DesktopContentArea( areaDefinitionElement, this.resourceBundle );
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
         this.footer = new DesktopFooter( footerDefinitionElement, this.resourceBundle, { onConstructed : this.onFooterConstructed } );
         this.footer.unmarshall();
      }
   }.protect(),

   unmarshallHeader: function(){
      var headerDefinitionElement = this.configurationXml.selectNode( this.options.headerSelector );
      if( headerDefinitionElement ){
         this.header = new DesktopHeader( headerDefinitionElement, this.resourceBundle, { onConstructed : this.onHeaderConstructed } );
         this.header.unmarshall();
      }
   }.protect(),

   unmarshallPanels: function(){
      var panelDefinitionElements = this.configurationXml.selectNodes( this.options.panelSelector );
      panelDefinitionElements.each( function( panelDefinition, index ){
         var desktopPanel = new DesktopPanel( panelDefinition, this.resourceBundle, { onPanelConstructed : this.onPanelConstructed } );
         desktopPanel.unmarshall();
         this.panels.put( desktopPanel.getName(), desktopPanel );
      }, this );
   }.protect(),
   
   unmarshallResources: function(){
      var resourcesElement = this.configurationXml.selectNode( this.options.resourcesSelector );
      if( resourcesElement ) {
         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded } );
         this.resources.unmarshall();
      }
   }.protect(),
   
   unmarshallWindowDocker: function(){
      var windowDockerDefinitionElement = this.configurationXml.selectNode( this.options.windowDockerSelector );
      if( windowDockerDefinitionElement ){
         this.windowDocker = new WindowDocker( windowDockerDefinitionElement, this.resourceBundle );
         this.windowDocker.unmarshall();         
      }
   }.protect()

});

Desktop.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };