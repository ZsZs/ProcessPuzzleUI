/*
Name: 
    - DesktopPanel

Description: 
    - Represents a panel of the desktop. It's wrapper of MochaUI panel, which gets it's properties from an XML descriptor. 

Requires:

Provides:
    - DesktopPanel

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

var DesktopPanel = new Class({
   Implements: [Events, Options],
   Binds: ['constructDocument', 
           'constructPlugin', 
           'constructHeader', 
           'determinePanelElement',
           'finalizeConstruction',
           'instantiateMUIPanel',
           'loadHtmlDocument',
           'loadSmartDocument',
           'onDocumentError', 
           'onDocumentReady', 
           'onHeaderConstructed', 
           'onHeaderConstructionError',
           'onMUIPanelLoaded', 
           'onPluginConstructed',
           'onPluginError',
           'subscribeToWebUIMessages',
           'webUIMessageHandler'],   
   
   options : {
      columnReferenceSelector : "columnReference",
      componentName : "DesktopPanel",
      contentUrlSelector : "contentURL",
      documentContentUriSelector : "document/documentContentUri",
      documentDefinitionUriSelector : "document/documentDefinitionUri",
      documentNameSeparator : "_",
      documentWrapperId : "_documentWrapper_" + (new Date().getTime()),
      documentWrapperIdSelector : "document/@id",
      documentWrapperStyle : "panelDocumentWrapper",
      documentWrapperStyleSelector : "document/@elementStyle",
      documentWrapperTag : "div",
      documentWrapperTagSelector : "document/@tag",
      handleMenuSelectedEvents : false,
      handleMenuSelectedEventsSelector : "handleMenuSelectedEvents",
      handleTabSelectedEvents : false,
      handleTabSelectedEventsSelector : "handleTabSelectedEvents",
      headerSelector : "panelHeader",
      heightDefault : 125,
      heightSelector : "height",
      nameSelector : "name",
      nameSpaces : "xmlns:pp='http://www.processpuzzle.com'",
      panelContentElementSuffix : "_pad",
      panelIdPostfix : "_wrapper",
      pluginSelector : "plugin",
      showHeaderSelector : "showHeader",
      storeStateSelector : "storeState",
      titleSelector : "title",
      widthSelector : "width"
   },

   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.setOptions( options );
      this.columnReference;
      this.componentStateManager = Class.getInstanceOf( ComponentStateManager );
      this.constructionChain = new Chain();
      this.contentUrl;
      this.definitionElement = definitionElement;
      this.document;
      this.documentContentUri;
      this.documentContentType = AbstractDocument.Types.HTML;
      this.documentDefinitionUri;
      this.documentWrapper;
      this.documentWrapperId;
      this.documentWrapperStyle;
      this.documentWrapperTag;
      this.error;
      this.handleMenuSelectedEvents;
      this.handleTabSelectedEvents;
      this.header;
      this.height;
      this.lastHandledMessage;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.MUIPanel;
      this.MUIPanelLoaded = false;
      this.name;
      this.panelContentElement;
      this.panelElement;
      this.plugin;
      this.resourceBundle = bundle;
      this.showHeader;
      this.storeState = false;
      this.title;
      
      this.state = DesktopPanel.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "' started." );
      this.constructionChain.chain( 
         this.instantiateMUIPanel,
         this.determinePanelElement,
         this.constructHeader,
         this.constructPlugin,
         this.constructDocument,
         this.subscribeToWebUIMessages,
         this.finalizeConstruction
      );
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      this.logger.trace( this.options.componentName + ".destroy() of '" + this.name + "' started." );
      if( this.state == DesktopPanel.States.CONSTRUCTED ) this.destroyComponents();
      this.resetProperties();
      this.state = DesktopPanel.States.INITIALIZED;
   },
   
   onDocumentError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'panelError', error );
      this.fireEvent('panelConstructed', this ); 
   },
   
   onDocumentReady: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "'s artifact finished." );
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "' finished." );
      this.storeComponentState();
      this.fireEvent( 'documentLoaded', this.documentContentUri );
      this.constructionChain.callChain();
   },
   
   onHeaderConstructed: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "'s header finished." );
      this.constructionChain.callChain();
   },
   
   onHeaderConstructionError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'panelError', this.error );
      this.fireEvent('panelConstructed', this ); 
   },
   
   onMUIPanelLoaded: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "'s MUIPanel finished." );
      this.MUIPanelLoaded = true;
      this.constructionChain.callChain();
   },
   
   onPluginConstructed: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "'s plugin finished." );
      this.constructionChain.callChain();
   },
   
   onPluginError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'panelError', this.error );
      this.fireEvent('panelConstructed', this ); 
   },
   
   unmarshall: function(){
      this.unmarshallPanelProperties();
      this.unmarshallPanelHeader();
      this.unmarshallPlugin();
      this.unmarshallDocument();
      
      this.state = DesktopPanel.States.UNMARSHALLED;
   },
   
   webUIMessageHandler: function( webUIMessage ){
      if( this.state != DesktopPanel.States.CONSTRUCTED ) return;
      
      if(( instanceOf( webUIMessage, MenuSelectedMessage ) || instanceOf( webUIMessage, TabSelectedMessage )) && webUIMessage.getActivityType() == AbstractDocument.Activity.LOAD_DOCUMENT ) {
         this.destroyDocument();
         this.destroyDocumentWrapper();
         this.cleanUpPanelContent();
         this.loadDocument( webUIMessage );
      }
      this.lastHandledMessage = webUIMessage;
   },

   //Properties
   getColumnReference: function() { return this.columnReference; },
   getComponentStateManager: function() { return this.componentStateManager; },
   getContentUrl: function() { return this.contentUrl; },
   getDocument: function() { return this.document; },
   getDocumentContentUri: function() { return this.documentContentUri; },
   getDocumentDefinitionUri: function() { return this.documentDefinitionUri; },
   getDocumentWrapperId: function() { return this.documentWrapperId; },
   getDocumentWrapperStyle: function() { return this.documentWrapperStyle; },
   getDocumentWrapperTag: function() { return this.documentWrapperTag; },
   getHeader: function() { return this.header; },
   getHeight: function() { return this.height; },
   getLogger: function() { return this.logger; },
   getMessageBus: function() { return this.messageBus; },
   getMUIPanel: function() { return this.MUIPanel; },
   getName: function() { return this.name; },
   getPlugin: function() { return this.plugin; },
   getShowHeader: function() { return this.showHeader; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   getToolBox: function() { return this.header; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   cleanUpPanelContent: function(){
      var contentElement = $( this.name + this.options.panelContentElementSuffix );
      if( contentElement ){
         contentElement.getChildren( '*' ).each( function( childElement, index ){
            childElement.destroy();
         }, this );
      }
   }.protect(),
   
   constructDocument: function(){
      if( this.document ) {
         this.createDocumentWrapper();
         this.document.construct();
      }else this.constructionChain.callChain();
   }.protect(),
   
   constructPlugin: function(){
      if( this.plugin ) this.plugin.construct();
      else this.constructionChain.callChain();
   }.protect(),
   
   constructHeader: function(){
      if( this.header ) this.header.construct();
      else this.constructionChain.callChain();
   }.protect(),
   
   createDocumentWrapper: function(){
      this.documentWrapper = new Element( this.documentWrapperTag, { id : this.documentWrapperId, 'class' : this.documentWrapperStyle } );
      this.panelContentElement.grab( this.documentWrapper );
   }.protect(),
   
   destroyComponents: function(){
      this.destroyDocument();
      this.destroyDocumentWrapper();
      this.cleanUpPanelContent();
      if( this.header ) this.header.destroy();
      if( this.plugin ) this.plugin.destroy();
      if( this.panelElement ) {
         if( this.panelElement.destroy ) this.panelElement.destroy();
         else this.panelElement.removeNode();
      }
   }.protect(),
   
   destroyDocument: function(){
      if( this.document )  this.document.destroy();
      this.document = null;
   }.protect(),
   
   destroyDocumentWrapper: function(){
      if( this.documentWrapper ) this.documentWrapper.destroy();
      this.documentWrapper = null;
   }.protect(),
   
   determinePanelElement: function(){
      this.panelElement = $( this.name + this.options.panelIdPostfix );
      this.panelElement = $( this.panelElement );     //required by Internet Explorer
      this.panelContentElement = $( this.name );
      this.constructionChain.callChain();
   }.protect(),
   
   finalizeConstruction: function(){
      this.state = DesktopPanel.States.CONSTRUCTED;
      this.constructionChain.clearChain();
      this.fireEvent('panelConstructed', this ); 
   }.protect(),
   
   instantiateDocument: function( webUIMessage, documentOptions ){
      var newDocument = null;
      switch( webUIMessage.getDocumentType() ){
      case AbstractDocument.Types.HTML: newDocument = new HtmlDocument( this.resourceBundle, documentOptions ); break;
      case AbstractDocument.Types.SMART: newDocument = new SmartDocument( this.resourceBundle, documentOptions ); break;
      }
      return newDocument;
   }.protect(),
   
   instantiateMUIPanel: function(){
      var panelTitle = this.header && this.header.getPlugin() ? "" : this.title;
      try{
         this.MUIPanel = new MUI.Panel({ 
            column: this.columnReference,
            content: "",
            onContentLoaded: this.header ? null : this.onMUIPanelLoaded,
            contentURL: this.contentUrl,
            id: this.name,
            header: this.showHeader,
            headerToolbox: this.header ? true : false,
            headerToolboxOnload: this.header ? this.onMUIPanelLoaded : null,
            headerToolboxURL: this.header ? this.header.getToolBoxUrl() : null,
            height: this.height, 
            title: panelTitle 
         });
      }catch( exception ){
         this.error = exception;
         this.revertConstruction();
         this.fireEvent( 'panelError', this.error );
         this.fireEvent('panelConstructed', this ); 
      }
   }.protect(),
   
   loadHtmlDocument: function( webUIMessage ){
      this.documentContentUri = webUIMessage.getDocumentURI();
      this.documentContentType = webUIMessage.getDocumentType(); 
      var documentFullURI = this.documentContentUri + this.options.documentNameSeparator + this.resourceBundle.getLocale().getLanguage() + ".html";
      
      MUI.updateContent({
         element: $( this.name ),
         onContentLoaded : this.onDocumentReady,
         padding: { top: 0, right: 5, bottom: 0, left: 5 },
         title: this.title,
         url: documentFullURI
      });
   }.protect(),
   
   loadDocument: function( webUIMessage ){
      this.documentDefinitionUri = webUIMessage.getDocumentURI();
      this.documentContentUri = webUIMessage.getDocumentContentURI();
      this.documentContentType = webUIMessage.getDocumentType();
      this.document = this.instantiateDocument( webUIMessage, { 
         documentContainerId : this.documentWrapperId, 
         documentDefinitionUri : webUIMessage.getDocumentURI(), 
         documentContentUri : this.documentContentUri,
         onDocumentReady : this.onDocumentReady,
         onDocumentError : this.onDocumentError
      });
      this.document.unmarshall();
      this.constructDocument();
   }.protect(),
   
   resetProperties: function(){
      this.columnReference = null;
      this.contentUrl = null;
      this.documentContentUri = null;
      this.documentDefinitionUri = null;
      this.documentWrapperId = null;
      this.documentWrapperStyle = null;
      this.documentWrapperTag = null;
      this.height = null;
      this.name = null;
      this.showHeader = null;
      this.title = null;
   }.protect(),
   
   revertConstruction: function(){
      this.destroyComponents();
      this.resetProperties();
      this.state = DesktopPanel.States.INITIALIZED;
   }.protect(),
   
   storeComponentState : function() {
      if( this.storeState ){
         var componentState;
         if( this.documentContentType == AbstractDocument.Types.HTML ) componentState = { uri : this.documentContentUri, type : this.documentContentType };
         else componentState = { uri : this.documentDefinitionUri, type : this.documentContentType };
         this.componentStateManager.storeCurrentState( this.options.componentName, componentState );
      }
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      if( this.handleMenuSelectedEvents ){
         this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
         this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      }
      
      if( this.handleTabSelectedEvents ){
         this.logger.debug( this.options.componentName + ".subscribedToWebUIMessages() started." );
         this.messageBus.subscribeToMessage( TabSelectedMessage, this.webUIMessageHandler );
      }
      this.constructionChain.callChain();
   }.protect(),
   
   unmarshallDocument: function(){
      this.documentContentUri = XmlResource.selectNodeText( this.options.documentContentUriSelector, this.definitionElement );
      this.documentDefinitionUri = XmlResource.selectNodeText( this.options.documentDefinitionUriSelector, this.definitionElement );
      this.documentWrapperId = XmlResource.selectNodeText( this.options.documentWrapperIdSelector, this.definitionElement, this.options.nameSpaces, this.name + this.options.documentWrapperId );
      this.documentWrapperStyle = XmlResource.selectNodeText( this.options.documentWrapperStyleSelector, this.definitionElement, this.options.nameSpaces, this.options.documentWrapperStyle );
      this.documentWrapperTag = XmlResource.selectNodeText( this.options.documentWrapperTagSelector, this.definitionElement, this.options.nameSpaces, this.options.documentWrapperTag );
      if( this.documentDefinitionUri ){
         this.document = new SmartDocument( this.resourceBundle, { 
            documentContainerId : this.documentWrapperId, 
            documentDefinitionUri : this.documentDefinitionUri, 
            documentContentUri : this.documentContentUri,
            onDocumentReady : this.onDocumentReady,
            onDocumentError : this.onDocumentError
         });
         this.document.unmarshall();
      }
   }.protect(),
   
   unmarshallHeaderToolbox: function() {
      var headerDefinition = XmlResource.selectNode( this.options.headerSelector, this.definitionElement );
      if( headerDefinition ){
         this.header = new DesktopPanelHeader( headerDefinition, this.resourceBundle, { onHeaderConstructed : this.onHeaderConstructed } );
         this.header.unmarshall();
      }
   }.protect(),
   
   unmarshallPanelHeader: function(){
      var headerConfigurationElement = XmlResource.selectNode( this.options.headerSelector, this.definitionElement );
      if( headerConfigurationElement ){
          this.header = new DesktopPanelHeader( headerConfigurationElement, this.resourceBundle, { onHeaderConstructed : this.onHeaderConstructed, onHeaderConstructionError : this.onHeaderConstructionError });
          this.header.unmarshall();
      }
   }.protect(),
   
   unmarshallPanelProperties: function(){
      this.columnReference = XmlResource.determineAttributeValue( this.definitionElement, this.options.columnReferenceSelector );
      this.contentUrl = XmlResource.selectNodeText( this.options.contentUrlSelector, this.definitionElement );
      this.height = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.heightSelector, this.options.heightDefault ));
      this.name = XmlResource.determineAttributeValue( this.definitionElement, this.options.nameSelector );
      this.showHeader = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.showHeaderSelector ));
      this.handleMenuSelectedEvents = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.handleMenuSelectedEventsSelector, this.options.handleMenuSelectedEvents ));
      this.handleTabSelectedEvents = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.handleTabSelectedEventsSelector, this.options.handleTabSelectedEvents ));
      this.storeState = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.storeStateSelector, false ));
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.definitionElement );
      if( this.resourceBundle ) this.title = this.resourceBundle.getText( this.title );
      this.options.componentName = this.name;
   }.protect(),
  
   unmarshallPlugin: function(){
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DocumentPlugin( pluginDefinition, this.resourceBundle, { onConstructed : this.onPluginConstructed, onConstructionError : this.onPluginError } );
         this.plugin.unmarshall();
      }
   }.protect()
});

DesktopPanel.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };