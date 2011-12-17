/*
Name: 
    - ComplexContentBehaviour

Description: 
    - Implements features of a DesktopElement which can contain header, toolbar, widget and smart document. 
Mainly used by DesktopPanel, and DesktopWidow. 

Requires:

Provides:
    - ComplexContentBehaviour

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

var ComplexContentBehaviour = new Class({
   Implements: [Events, Options],
   
   options : {
      contentUrlSelector : "contentURL",
      documentContentUriSelector : "document/documentContentUri",
      documentDefinitionUriSelector : "document/documentDefinitionUri",
      documentNameSeparator : "_",
      documentWrapperId : "_documentWrapper_" + (new Date().getTime()),
      documentWrapperIdSelector : "document/@id",
      documentWrapperStyle : "documentWrapper",
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
      titleSelector : "title",
      widthDefault : 300,
      widthSelector : "width"
   },

   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.setOptions( options );
      this.componentRootElement;
      this.contentContainerElement;
      this.contentUrl;
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
      this.name;
      this.plugin;
      this.showHeader;
      this.storeState = false;
      this.title;
      this.width;
   },
   
   //Public accessor and mutator methods
   onContainerResize: function(){
      if( this.document && this.document.getState() == AbstractDocument.States.CONSTRUCTED ) {
         this.document.onContainerResize( this.contentContainerElement.getSize() );
      }
   },
   
   onDocumentError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'panelError', error );
      this.fireEvent('panelConstructed', this ); 
   },
   
   onDocumentReady: function(){
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
   
   webUIMessageHandler: function( webUIMessage ){
      if( this.state != DesktopElement.States.CONSTRUCTED ) return;
      
      if(( instanceOf( webUIMessage, MenuSelectedMessage ) || instanceOf( webUIMessage, TabSelectedMessage )) && webUIMessage.getActivityType() == AbstractDocument.Activity.LOAD_DOCUMENT ) {
         this.destroyDocument();
         this.destroyDocumentWrapper();
         this.cleanUpContentElement();
         this.processMessageProperties( webUIMessage );
         this.loadDocument( webUIMessage.getDocumentType() );
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
   getName: function() { return this.name; },
   getPlugin: function() { return this.plugin; },
   getShowHeader: function() { return this.showHeader; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   getToolBox: function() { return this.header; },
   getWidth: function() { return this.width; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   cleanUpContentElement: function(){
      if( this.contentContainerElement ){
         this.contentContainerElement.getChildren( '*' ).each( function( childElement, index ){
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
      this.contentContainerElement.grab( this.documentWrapper );
   }.protect(),
      
   destroyComponents: function(){
      this.destroyDocument();
      this.destroyDocumentWrapper();
      this.cleanUpContentElement();
      if( this.header ) this.header.destroy();
      if( this.plugin ) this.plugin.destroy();
      if( this.componentRootElement ) {
         if( this.componentRootElement.destroy ) this.componentRootElement.destroy();
         else this.componentRootElement.removeNode();
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
   
   determineComponentElements: function(){
      this.componentRootElement = $( this.name + this.options.componentRootElementIdPostfix );
      this.componentRootElement = $( this.componentRootElement );     //required by Internet Explorer
      this.contentContainerElement = $( this.name + this.options.componentContentIdPostfix );
      this.constructionChain.callChain();
   },
   
   instantiateDocument: function( documentType, documentOptions ){
      var newDocument = null;
      switch( documentType ){
      case AbstractDocument.Types.HTML: newDocument = new HtmlDocument( this.internationalization, documentOptions ); break;
      case AbstractDocument.Types.SMART: newDocument = new SmartDocument( this.internationalization, documentOptions ); break;
      }
      return newDocument;
   }.protect(),
   
   internationalizeContentUri: function(){
      this.contentUrl = this.contentUrl.substring( 0, this.contentUrl.lastIndexOf( ".html" )) + "_" + this.internationalization.getLocale().getLanguage() + ".html";
   }.protect(),
   
   loadDocument: function( documentType ){
      this.document = this.instantiateDocument( documentType, { 
         documentContainerId : this.documentWrapperId, 
         documentDefinitionUri : this.documentDefinitionUri, 
         documentContentUri : this.documentContentUri,
         onDocumentReady : this.onDocumentReady,
         onDocumentError : this.onDocumentError
      });
      this.document.unmarshall();
      this.constructDocument();
   }.protect(),
   
   processMessageProperties: function( webUIMessage ){
      this.documentDefinitionUri = webUIMessage.getDocumentURI();
      this.documentContentUri = webUIMessage.getDocumentContentURI();
      this.documentContentType = webUIMessage.getDocumentType();
   }.protect(),
      
   resetProperties: function(){
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
      this.parent();
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
         this.document = new SmartDocument( this.internationalization, { 
            documentContainerId : this.documentWrapperId, 
            documentDefinitionUri : this.documentDefinitionUri, 
            documentContentUri : this.documentContentUri,
            onDocumentReady : this.onDocumentReady,
            onDocumentError : this.onDocumentError
         });
         this.document.unmarshall();
      }
   }.protect(),
   
   unmarshallHeader: function(){
      //Not implemented yet.
   }.protect(),
   
   unmarshallPlugin: function(){
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DocumentPlugin( pluginDefinition, this.internationalization, { onConstructed : this.onPluginConstructed, onConstructionError : this.onPluginError } );
         this.plugin.unmarshall();
      }
   }.protect(),
   
   unmarshallProperties: function(){
      this.contentUrl = XmlResource.selectNodeText( this.options.contentUrlSelector, this.definitionElement );
      this.height = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.heightSelector, this.options.heightDefault ));
      this.name = XmlResource.determineAttributeValue( this.definitionElement, this.options.nameSelector );
      this.showHeader = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.showHeaderSelector ));
      this.handleMenuSelectedEvents = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.handleMenuSelectedEventsSelector, this.options.handleMenuSelectedEvents ));
      this.handleTabSelectedEvents = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.handleTabSelectedEventsSelector, this.options.handleTabSelectedEvents ));
      this.storeState = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.storeStateSelector, false ));
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.definitionElement );
      if( this.internationalization ) this.title = this.internationalization.getText( this.title );
      this.width = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.widthSelector, this.options.widthDefault ));
      this.options.componentName = this.name;
   }.protect()
});
