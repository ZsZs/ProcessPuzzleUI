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
name: DesktopConfigurator
script: DesktopConfigurator.js
description: puts together the desktop from predefined UI elements, like windows, columns and panels.
copyright: (c) 2010 IT Codex Llc., <http://itkodex.hu/>.
license: MIT-style license.

todo:
  - 

requires:
  - MochaUI/MUI.Core
  - MochaUI/MUI.Column
  - MochaUI/MUI.Panel
  - MochaUI/MUI.Windows

provides: [ProcessPuzzle.DesktopConfigurator]

...
*/

var DesktopConfigurator = new Class({
   Implements : [Options], 
   Binds : ['createColumns', 'createHtmlElements', 'createPanels', 'createWindows', 'determineConfigurationStatus', 'initializeMUI', 'loadDocumentResources', 'onResourcesLoadReady'],
   options : {
      callChainDelay : 2000,
      componentName : "DesktopConfigurator",
      configurationXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      configurationURI : "DesktopConfiguration.xml",
      pluginOnloadDelay : 1000,
      resourceLoadTimeout : 5000,
      resourcesSelector : "pp:desktopConfiguration/resources", 
      skin : "ProcessPuzzle",
      waitStep : 500
   },
	
	//Constructor
	initialize : function( webUIConfiguration, resourceBundle, options ) {
	    this.presetOptionsBasedOnWebUIConfiguration( webUIConfiguration );
		this.setOptions( options );

	//Private instance variables
		this.configurationXml = new XmlResource( this.options.configurationURI, { nameSpaces : this.options.configurationXmlNameSpace } );
		this.configurationChain = new Chain();
		this.desktop = null;
		this.desktopStructure = new DesktopStructure( options, this.configurationXml );
		this.dock = null;
		this.images = new ArrayList();
		this.isConfigured = false;
		this.currentLocale = null;
		this.logger = new WebUILogger( webUIConfiguration );
		this.pendingResourcesCounter = 0;
		this.resourceBundle = resourceBundle;
		this.resources = null;
		this.scripts = new ArrayList();
		this.styleSheets = new ArrayList();
		this.webUIConfiguration = webUIConfiguration;
		
		this.determineCurrentLocale();
		this.loadI18Resources();
      this.configureLogger();
      this.configurationChain.chain( 
         this.loadDocumentResources,
         this.createHtmlElements,
         this.initializeMUI,
         this.createColumns,
         this.createPanels,
         this.createWindows,
         this.determineConfigurationStatus
	  );
   },
		
	//Public accessor and mutator methods
	configure : function() {
	   //this.logger.group( this.options.componentName + ".configure", false );
       //this.logger.debug( "Configuration started." );
       this.configurationChain.callChain();
	},
	
	destroy : function() {
       this.logger.group( this.options.componentName + ".destroy", false );
	   if( this.isConfigured ){
	      this.destroyHtmlElements( this.getDesktopElement() );
	      this.destroyWindows();
	      this.destroyPanels();
	      this.destroyColumns();
	      this.destroyResources();
	      this.removeDesktopEvents();
	      this.isConfigured = false;
	   }
       this.logger.groupEnd();
   },
	
   onResourcesLoadReady: function(){
      //this.logger.groupEnd();
      this.configurationChain.callChain();      
   },
	   
   //Properties
   getConfigurationChain : function() { return this.configurationChain; },
   getConfigurationXml : function() { return this.configurationXml; },
   getCurrentLocale : function() { return this.currentLocale; },
   getDesktop : function() { return this.desktop; },
   getDesktopColumns : function() { return this.desktopStructure.getDesktopColumns(); },
   getDesktopElement : function() { return this.desktopStructure.getDesktopElement(); },
   getDesktopPanels : function() { return this.desktopStructure.getDesktopPanels(); },
   getDesktopWindows : function() { return this.desktopStructure.getDesktopWindows(); },
   getDock : function() { return this.dock; },
   getHeaderElement : function() { return this.desktopStructure.getHeaderElement(); },
   getImages : function() { return this.images; },
   getInitializationChain : function() { return MUI.myChain; },
   getResources : function() { return this.resources; },
   getScripts : function() { return this.scripts; },
   getStyles : function() { return this.resources.getStyleSheets(); },
	
   //Private methods
   addAdHocElementsToDesktop : function( targetDesktopElement, sourceConfigurationElement ) {
      var elementsSelector = this.desktopStructure.getElementsSelector();
      var configurationElements = sourceConfigurationElement.selectNodes( elementsSelector );
      Array.each( configurationElements, function( configurationElement, index ) {
         var className = this.configurationXml.determineAttributeValue( configurationElement, 'class' );
         var elementValue = this.configurationXml.determineNodeText( configurationElement );
         var href = this.configurationXml.determineAttributeValue( configurationElement, 'href' );
         var id = this.configurationXml.determineAttributeValue( configurationElement, 'id' );
         var tagName = this.configurationXml.determineAttributeValue( configurationElement, 'tag' );
         elementValue = this.resourceBundle.getText( elementValue );
         elementValue = elementValue != null ? elementValue : "";
			
         var newElement = this.appendNewHtmlElement( tagName, id, targetDesktopElement );
         newElement.addClass( className );
         if( href ){
            var innerAnchor = this.appendNewHtmlElement( 'a', null, newElement );
            innerAnchor.set( 'href', href );
            innerAnchor.set( 'target', '_blank' );
            innerAnchor.appendText( elementValue );
         }else {
            newElement.appendText( elementValue );
         }
			
         var pluginElement = this.configurationXml.selectNode( 'plugin', configurationElement );
         if( pluginElement ) this.addPluginDefinedByText( this.configurationXml.determineNodeText( pluginElement ), true );
      }, this );
	}.protect(),
	
   addPlugin : function( plugin, releaseOnload ){
	  this.logger.group( this.options.componentName + ".addPlugin", false );
      
	  if( plugin.css ) plugin.css.each( function( cssURI, index ){
         new RemoteStyleSheet( cssURI, {
            onReady: function() {
               this.styleSheets.add( cssURI );
               this.logger.debug( "Stylesheet: '" + cssURI + "' was added to the document." );
            }.bind( this ),
            
            onError: function() {
               throw new ResourceNotFoundException( styleSheetUri );
            }.bind( this ),
            
            onStart: function() {
               this.logger.debug( "Started to add: '" + cssURI + "' to the document." );
            }.bind( this )
         }).start();
      }, this );
      
      if( plugin.images ) plugin.images.each( function( imagesURI, index ){
         this.images.add( imagesURI );
         Asset.images( imagesURI ); 
      }, this );
      
      if( plugin.js ) plugin.js.each( function( javaScriptURI, index ){
         this.scripts.add( javaScriptURI );
         Asset.javascript( javaScriptURI ); 
      }, this );
      
      if( typeof plugin.onload == 'function' && releaseOnload ) 
         plugin.onload();
      
      this.logger.groupEnd();
   }.protect(),
	
   addPluginDefinedByText : function( pluginDefinition, releaseOnload ){
      var plugin = { css: [], images: [], js: [], onload: null };
      plugin = pluginDefinition != null ? eval( "(" + pluginDefinition + ")" ) : plugin;
      this.addPlugin( plugin, releaseOnload );
   }.protect(),
	
   appendNewHtmlElement : function( tagName, elementId, parentElement ) {
      var newElement  = new Element( tagName, { id : elementId } );
      parentElement.grab( newElement );
		
      return newElement;
   }.protect(),
	
   appendNewHtmlElementFromConfigurationItem : function( configurationElement, parentElement ) {
		var tagName = configurationElement.selectNodes( this.desktopStructure.getTagAttributeSelector() )[0].nodeValue;
		var headerElementId = configurationElement.selectNodes( this.desktopStructure.getIdAttributeSelector() )[0].nodeValue;
		return this.appendNewHtmlElement( tagName, headerElementId, parentElement );
	}.protect(),
	
	configureLogger : function() {
      if( !this.logger.isConfigured() ) this.logger.configure( this.webUIConfiguration );
	}.protect(),
	
   createColumns : function() {
      this.logger.group( this.options.componentName + ".createColumns", false );
      var columnConfigurations = this.configurationXml.selectNodes( this.desktopStructure.getDesktopColumnsSelector() );
      Array.each( columnConfigurations, function( columnConfiguration, index ){
         var columnId = this.configurationXml.determineAttributeValue( columnConfiguration, this.desktopStructure.getDesktopColumnIdSelector() );
         var columnPlacement = this.configurationXml.determineAttributeValue( columnConfiguration, this.desktopStructure.getDesktopColumnPlacementSelector() );
         var columnWidth = parseInt( this.configurationXml.determineAttributeValue( columnConfiguration, this.desktopStructure.getDesktopColumnWidthSelector() ));
         var minimumWidth = parseInt( this.configurationXml.determineAttributeValue( columnConfiguration, this.desktopStructure.getDesktopColumnMinimumWidthSelector() ));
         var maximumWidth = parseInt( this.configurationXml.determineAttributeValue( columnConfiguration, this.desktopStructure.getDesktopColumnMaximumWidthSelector() ));
			
         var desktopColumn = new MUI.Column({ id: columnId, placement: columnPlacement, width: columnWidth, resizeLimit: [minimumWidth, maximumWidth] });
			
         this.desktopStructure.getDesktopColumns().add( desktopColumn );
      }, this );

      this.logger.groupEnd();
      this.configurationChain.callChain();
   }.protect(),
	
   createConfigurationChain: function() {
      this.configurationChain.chain(
         this.loadResources,
         this.createHtmlElements,
         this.initializeMUI,
         this.createColumns,
         this.createPanels,
         this.createWindows,
         this.determineConfigurationStatus
      );
      this.logger.debug( "Configuration chain is: loadResouces -> createHtmlElements -> initializeMUI -> createColumns -> createPanels -> createWindows -> determineConfigurationStatus" );
   }.protect(),
	
	createDocumentContainer : function() {
		var documentContainer = this.appendNewHtmlElement( 'DIV', this.desktopStructure.getDocumentContainerId(), this.desktopStructure.getDesktopElement() );
		this.desktopStructure.setDocumentContainerElement( documentContainer );
	}.protect(),
	
	createFooter : function() {
		var footerConfiguration = this.configurationXml.selectNode( this.desktopStructure.getFooterSelector() );
		if( footerConfiguration ) {
			this.createFooterElement( footerConfiguration );
			this.createFooterBarElement();
		}
	}.protect(),
	
	createFooterBarElement : function() {
		var xpathSelector = this.desktopStructure.getFooterBarSelector();
		var configurationElement = this.configurationXml.selectNode( xpathSelector );
		var parentElement = this.desktopStructure.getFooterElement();
		var footerBarElement = this.appendNewHtmlElementFromConfigurationItem( configurationElement, parentElement );
		this.desktopStructure.setFooterBarElement( footerBarElement );
		this.addAdHocElementsToDesktop( footerBarElement, configurationElement );
	}.protect(),
	
	createFooterElement : function( footerConfiguration ) {
		var footerElement = this.appendNewHtmlElementFromConfigurationItem( footerConfiguration, this.desktopStructure.getDesktopElement() );
		this.desktopStructure.setFooterElement( footerElement );
	}.protect(),
	
	createHeader : function() {
		var headerConfiguration = this.configurationXml.selectNode( this.desktopStructure.getHeaderSelector() );
		if( headerConfiguration ) {
			this.createHeaderElement( headerConfiguration );
			this.createTitleBarWrapperElement();
			this.createTitleBarElement();
			this.createNavigationBarElement();
		}
	}.protect(),
	
	createHeaderElement : function( headerConfiguration ) {
		var headerElement = this.appendNewHtmlElementFromConfigurationItem( headerConfiguration, this.desktopStructure.getDesktopElement() );
		this.desktopStructure.setHeaderElement( headerElement );
	}.protect(),
	
   createHtmlElements : function() {
      this.logger.group( this.options.componentName + ".createHtmlElements", false );
      
      this.createHeader();
      this.createWindowDocker();
      this.createDocumentContainer();
      this.createFooter();

      this.logger.groupEnd();
      this.configurationChain.callChain();
   },
	
	createNavigationBarElement : function() {
		var xpathSelector = this.desktopStructure.getNavigationBarSelector();
		var configurationElement = this.configurationXml.selectNode( xpathSelector );
		var parentElement = this.desktopStructure.getHeaderElement();
		var navigationBarElement = this.appendNewHtmlElementFromConfigurationItem( configurationElement, parentElement );
		this.desktopStructure.setNavigationBarElement( navigationBarElement );
		this.desktopStructure.setTitleBarElement( navigationBarElement );
		this.addAdHocElementsToDesktop( navigationBarElement, configurationElement );
	}.protect(),
	
   createPanels : function() {
      this.logger.group( this.options.componentName + ".createPanels", false );
      var panelConfigurations = this.configurationXml.selectNodes( this.desktopStructure.getDesktopPanelsSelector() );
	  Array.each( panelConfigurations, function( panelConfiguration, index ){
         var panelInterpreter = new PanelInterpreter( panelConfiguration );
         panelInterpreter.interpret();
         
		 var panelId = this.configurationXml.determineAttributeValue( panelConfiguration, this.desktopStructure.getDesktopPanelIdSelector() );
	     var columnReference = this.configurationXml.determineAttributeValue( panelConfiguration, this.desktopStructure.getDesktopPanelColumnSelector() );
	     var panelTitle = this.configurationXml.selectNodeText( this.desktopStructure.getDesktopPanelTitleSelector(), panelConfiguration );
	     panelTitle = this.resourceBundle.getText( panelTitle );
	     var contentURL = this.configurationXml.selectNodeText( this.desktopStructure.getDesktopPanelContentUrlSelector(), panelConfiguration );
	     var panelHeight = parseInt( this.configurationXml.determineAttributeValue( panelConfiguration, this.desktopStructure.getDesktopPanelHeightSelector() ));
	     panelHeight = panelHeight ? panelHeight : null;
         
	     var require = { css: [], images: [], js: [], onload: null };
	     var requireText =	this.configurationXml.selectNodeText( this.desktopStructure.getDesktopPanelRequireSelector(), panelConfiguration );
	     require = requireText != null ? eval( "(" + requireText + ")" ) : require;
			
	     this.storeRequiredResources( require );
			
	     var desktopPanel = new MUI.Panel({ 
	        id: panelId, 
	        title: panelTitle, 
	        column: columnReference, 
	        contentURL: contentURL,
	        headerToolbox: panelInterpreter.getHeaderToolBox(),
	        headerToolboxOnload: null,
	        headerToolboxURL: panelInterpreter.getHeaderToolBoxURL(),
	        height: panelHeight,
	        require: require });
			
	     if( panelInterpreter.getHeaderPlugin() ) this.addPlugin( panelInterpreter.getHeaderPlugin(), true );
			
	     this.desktopStructure.getDesktopPanels().add( desktopPanel );
	  }, this );
	  
	  this.logger.groupEnd();
      this.configurationChain.callChain();
   }.protect(),
	
	createTitleBarElement : function() {
		var xpathSelector = this.desktopStructure.getTitleBarSelector();
		var configurationElement = this.configurationXml.selectNode( xpathSelector );
		var parentElement = this.desktopStructure.getTitleBarWrapperElement();
		var titleBarElement = this.appendNewHtmlElementFromConfigurationItem( configurationElement, parentElement );
		
		this.desktopStructure.setTitleBarElement( titleBarElement );
		this.addAdHocElementsToDesktop( titleBarElement, configurationElement );
	}.protect(),
	
	createTitleBarWrapperElement : function() {
		var elementId = this.desktopStructure.getTitleBarWrapperId();
		var parentElement = this.desktopStructure.getHeaderElement();
		var titleBarWrapperElement = this.appendNewHtmlElement( 'div', elementId, parentElement );
		this.desktopStructure.setTitleBarWrapperElement( titleBarWrapperElement );
	}.protect(),
	
	createWindowDocker : function() {
		var dockerConfiguration = this.configurationXml.selectNode( this.desktopStructure.getWindowDockerSelector() );
		if( dockerConfiguration ) {
			var dockerElement = this.appendNewHtmlElementFromConfigurationItem( dockerConfiguration, this.desktopStructure.getDesktopElement() );
			var dockerControlsElement = this.appendNewHtmlElement( 'div', this.desktopStructure.getWindowDockerControlsId(), dockerElement );
			this.appendNewHtmlElement( 'div', this.desktopStructure.getWindowDockerPlacementId(), dockerControlsElement );
			this.appendNewHtmlElement( 'div', this.desktopStructure.getWindowDockerAutoHideId(), dockerControlsElement );
			var dockerSortElement = this.appendNewHtmlElement( 'div', this.desktopStructure.getWindowDockerSortId(), dockerControlsElement );
			var dockerClearElement = this.appendNewHtmlElement( 'div', this.desktopStructure.getWindowDockerClearId(), dockerSortElement );
			dockerClearElement.addClass( this.desktopStructure.getWindowDockerClearClass() );
		}
	}.protect(),
	
   createWindows : function() {
      this.logger.group( this.options.componentName + ".createWindows", false );
      
      this.logger.groupEnd();
      this.configurationChain.callChain();
   }.protect(),
	
   destroyColumns: function() {
      this.getDesktopColumns().clear();
   }.protect(),
	
   destroyHtmlElements: function( elementToDestroy ) {
      elementToDestroy.getChildren('*').each( function( childElement, index ){
         this.destroyHtmlElements( childElement );
         
         if( childElement.removeEvents ) childElement.removeEvents();
         if( childElement.destroy ) childElement.destroy();
      }, this );
   }.protect(),
	
	destroyPanels: function() {
      this.getDesktopPanels().each( function( desktopPanel, index ) {
         if( desktopPanel.options.require && desktopPanel.options.require.onload ){
            //desktopPanel.options.require.onload = function(){};
            //desktopPanel.options.require = { css:[], images:[], js:[], onload:null };
            desktopPanel.options.require = null;
         }
      }, this );
      this.getDesktopPanels().clear();
	}.protect(),
	
   destroyResources : function() {
      this.resources.release();
      
      this.styleSheets.each( function( styleReference, index ){
         var linkElements = $$( "link[href='" + styleReference + "']" );
         linkElements.destroy();
      });
      this.styleSheets.clear();
      
      this.images.each( function( imageReference, index ){
         var imageElements = $$( "img[src='" + imageReference + "']" );
         imageElements.destroy();
      });      
      this.images.clear();
      
      this.scripts.each( function( scriptReference, index ){
         var scriptElements = $$( "script[src='" + scriptReference + "']" );
         scriptElements.destroy();
      });      
      this.scripts.clear();
   }.protect(),
   
   destroyWindows: function() {
      this.getDesktopWindows().clear();
   }.protect(),
	
   determineConfigurationStatus: function() {
      this.logger.group( this.options.componentName + "determineConfigurationStatus", false );
      
      this.isConfigured = true;

      this.logger.groupEnd( "determineConfigurationStatus" );
      this.configurationChain.callChain();
   }.protect(),
   
   determineCurrentLocale : function() {
	   if( this.resourceBundle.isLoaded ) this.currentLocale = this.resourceBundle.getLocale();
	   else {
	      this.currentLocale = new Locale();
	      this.currentLocale.parse( this.webUIConfiguration.getI18DefaultLocale() );
	   }
	}.protect(),
	
   initializeMUI : function() {
      this.logger.group( this.options.componentName + "initializeMUI", false );
      var desktopStructure = this.desktopStructure;
      MUI.myChain = new Chain();
      
      MUI.myChain.chain(
         function(){
            MUI.Desktop.initialize({
               desktop : desktopStructure.determineDesktopElementId(),
               desktopHeader : desktopStructure.determineHeaderElementId(),
               desktopFooter : desktopStructure.determineFooterBarElementId(),
               desktopFooterWrapper : desktopStructure.determineFooterElementId(),
               desktopNavBar : desktopStructure.determineNavigationBarElementId(),
               pageWrapper : desktopStructure.determineDocumentContainerElementId()
            }); 
         },
         function(){ MUI.Dock.initialize(); }
      );
      
      MUI.myChain.callChain();
      this.desktop = MUI.Desktop;
      this.dock = MUI.Dock;
      this.logger.groupEnd( "initializeMUI" );
      this.configurationChain.callChain();
   }.protect(),
   
   loadDocumentResources: function(){
      var resourcesElement = this.configurationXml.selectNode( this.options.resourcesSelector );
      if( resourcesElement ) {
         this.resources = new DocumentResources( resourcesElement );
         this.resources.unmarshall();
         this.resources.getResourceChain().chain( this.onResourcesLoadReady );
         this.resources.load();
      }
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

   storeRequiredResources: function( reguire ){
      if( reguire.css ) reguire.css.each( function( cssURI, index ){
         this.styleSheets.add( cssURI );
      }, this );
      
      if( reguire.images ) reguire.images.each( function( imagesURI, index ){
         this.images.add( imagesURI );
      }, this );
      
      if( reguire.js ) reguire.js.each( function( javaScriptURI, index ){
         this.scripts.add( javaScriptURI );
      }, this );
   }.protect(),
   
   waitForConfigurationReady: function( currentWait ) {
      if( this.isConfigured ) return true;
      if( currentWait > this.options.resourceLoadTimeout )
         throw new ConfigurationTimeoutException( this.options.configurationURI, this.options.resourceLoadTimeout );
      else {
         this.waitForConfigurationReady( currentWait + this.options.waitStep ).delay( this.options.waitStep, this );
      }
   }
});
