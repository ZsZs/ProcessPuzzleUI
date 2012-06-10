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
//= require_directory ../FundamentalTypes

var ComplexContentBehaviour = new Class({
   Implements: [Events, Options],
   
   options : {
      contentAreaElementStyle : "complexContentArea",
      contentUrlSelector : "contentURL",
      disableScrollBars : false,
      disableScrollBarsSelector: "disableScrollBars",
      documentContentUriSelector : "document/documentContentUri",
      documentDefinitionUriSelector : "document/documentDefinitionUri",
      documentNameSeparator : "_",
      documentTypeDefault : AbstractDocument.Types.SMART,
      documentTypeSelector : "document/@type",
      documentWrapperId : "_documentWrapper_" + (new Date().getTime()),
      documentWrapperIdSelector : "document/@id",
      documentWrapperStyle : "documentWrapper",
      documentWrapperStyleSelector : "document/@elementStyle",
      documentWrapperTag : "div",
      documentWrapperTagSelector : "document/@tag",
      eventSourcesSelector : "eventOriginators",
      handleMenuSelectedEvents : false,
      handleMenuSelectedEventsSelector : "handleMenuSelectedEvents",
      handleTabSelectedEvents : false,
      handleTabSelectedEventsSelector : "handleTabSelectedEvents",
      headerSelector : "panelHeader",
      heightDefault : 125,
      heightSelector : "height",
      nameSelector : "name",
      nameSpaces : "xmlns:pp='http://www.processpuzzle.com'",
      pluginSelector : "plugin",
      scrollBarStyle : "scroll",
      showHeaderSelector : "showHeader",
      storeStateInUriSelector : "storeStateInUri",
      storeStateSelector : "storeState",
      titleSelector : "title",
      widthDefault : 300,
      widthSelector : "width"
   },

   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.setOptions( options );
      this.componentRootElement;
      this.contentAreaElement;
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
      this.eventSources = null;
      this.handleMenuSelectedEvents;
      this.handleTabSelectedEvents;
      this.header;
      this.height;
      this.lastHandledMessage;
      this.name;
      this.plugin;
      this.showHeader;
      this.stateSpecification;
      this.storedDocumentNeedsToBeRestored = false;
      this.storeState = false;
      this.storeStateInUri = false;
      this.title;
      this.verticalScrollBar;
      this.width;
   },
   
   //Public accessor and mutator methods
   onContainerResize: function(){
      var containerEffectiveSize = this.contentContainerElement.getSize();
      
      if( this.verticalScrollBar ){
        this.verticalScrollBar.refresh( this.contentContainerElement.getSize() );
        containerEffectiveSize = this.verticalScrollBar.getContentViewSize();
      } 
      
      if( this.document && this.document.getState() == AbstractDocument.States.CONSTRUCTED ) {
         this.adjustDocumentWrapperSize( containerEffectiveSize );
         this.document.onContainerResize( this.documentWrapper.getSize() );
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
      this.onContainerResize();
      this.storeComponentState();
      this.fireEvent( 'documentLoaded', this.documentDefinitionUri );
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
      if( this.verticalScrollBar ) this.verticalScrollBar.refresh();
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
      
      if(( instanceOf( webUIMessage, MenuSelectedMessage ) || instanceOf( webUIMessage, TabSelectedMessage )) 
           && ( webUIMessage.getActivityType() == AbstractDocument.Activity.LOAD_DOCUMENT )
           && ( this.eventSources == null || this.eventSources.contains( webUIMessage.getOriginator() ))) {
         
         if( this.storedContentHasPrecedence( webUIMessage )){
            this.storedDocumentNeedsToBeRestored = false;
            return;
         }
         
         this.destroyDocument();
         this.destroyDocumentWrapper();
         this.processMessageProperties( webUIMessage );
         this.loadDocument( webUIMessage.getDocumentType() );
      }
      this.lastHandledMessage = webUIMessage;
   },

   //Properties
   getColumnReference: function() { return this.columnReference; },
   getComponentStateManager: function() { return this.componentStateManager; },
   getContentAreaElement: function(){ return this.contentAreaElement; },
   getContentContainerId: function() { return this.name + this.options.componentContentIdPostfix; },
   getContentUrl: function() { return this.contentUrl; },
   getDocument: function() { return this.document; },
   getDocumentContentUri: function() { return this.documentContentUri; },
   getDocumentDefinitionUri: function() { return this.documentDefinitionUri; },
   getDocumentWrapperId: function() { return this.documentWrapperId; },
   getDocumentWrapperStyle: function() { return this.documentWrapperStyle; },
   getDocumentWrapperTag: function() { return this.documentWrapperTag; },
   getEventSources: function() { return this.eventSources; },
   getHeader: function() { return this.header; },
   getHeight: function() { return this.height; },
   getLogger: function() { return this.logger; },
   getMessageBus: function() { return this.messageBus; },
   getName: function() { return this.name; },
   getPlugin: function() { return this.plugin; },
   getShowHeader: function() { return this.showHeader; },
   getState: function() { return this.state; },
   getStoreState: function() { return this.storeState; },
   getStoreStateInUri: function() { return this.storeStateInUri; },
   getTitle: function() { return this.title; },
   getToolBox: function() { return this.header; },
   getVerticalScrollBar: function() { return this.verticalScrollBar; },
   getWidth: function() { return this.width; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   addScrollBars: function(){
      if( !this.options.disableScrollBars ){
         this.verticalScrollBar = new ScrollingBehaviour( this.contentAreaElement, {
            contentHeight: this.contentContainerElement.getSize().y,
            contentWidth: this.contentContainerElement.getSize().x
         });
         this.verticalScrollBar.construct();
      }
      this.constructionChain.callChain();
   }.protect(),
   
   adjustDocumentWrapperSize: function( containerEffectiveSize ){
      var framingWidth = parseInt( this.documentWrapper.getStyle( 'margin-left' )) + parseInt( this.documentWrapper.getStyle( 'margin-right' ));  
      framingWidth += 2 * parseInt( this.documentWrapper.getStyle( 'border' ));  
      framingWidth += parseInt( this.documentWrapper.getStyle( 'padding-left' )) + parseInt( this.documentWrapper.getStyle( 'padding-right' ));  
      this.documentWrapper.setStyles({ width : ( containerEffectiveSize.x - framingWidth ) + 'px' });
   }.protect(),
   
   cleanUpContentElement: function(){
      if( this.contentContainerElement ){
         var childElements = this.contentContainerElement.getElements ? this.contentContainerElement.getElements( '*' ) : Array.from( this.contentContainerElement.getElementsByTagName( '*' ));  
         childElements.each( function( childElement, index ){
            if( childElement.destroy ) childElement.destroy();
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
      if( this.plugin ){
         try{
            this.plugin.construct();
         }catch( e ){
            this.logger.error( "Constructing plugin of panel: '" + this.name + "' caused error." );
            throw new DesktopElementConfigurationException( this.name );
         }
      } else this.constructionChain.callChain();
   }.protect(),
   
   constructHeader: function(){
      if( this.header ) this.header.construct( $( this.name + "_header" ));
      else this.constructionChain.callChain();
   }.protect(),
   
   createContentAreaElement: function(){
      var paddingElementForStaticContent = this.contentContainerElement.getChildren( '#' + this.name + '_pad' )[0]; 
      if( paddingElementForStaticContent ){
         this.contentAreaElement = paddingElementForStaticContent;
      }else{
         this.contentAreaElement = new Element( 'div' );
         this.contentContainerElement.grab( this.contentAreaElement );
      }
      this.contentAreaElement.addClass( this.options.contentAreaElementStyle );
      
      if( !this.options.disableScrollBars ) this.contentContainerElement.setStyle( 'overflow', 'hidden' );
      this.constructionChain.callChain();      
   }.protect(),
   
   createDocumentWrapper: function(){
      this.documentWrapper = new Element( this.documentWrapperTag, { id : this.documentWrapperId, 'class' : this.documentWrapperStyle } );
      this.contentAreaElement.grab( this.documentWrapper );
      this.documentWrapper.setStyle( 'width', this.contentContainerElement.getSize().x + 'px' );
   }.protect(),
   
   destroyComponentRootElement: function(){
      if( this.componentRootElement ) {
         if( this.componentRootElement.destroy ) this.componentRootElement.destroy();
         else this.componentRootElement.removeNode();
      }
   }.protect(),
      
   destroyComponents: function(){
      this.destroyDocument();
      this.destroyDocumentWrapper();
      this.destroyScrollBars();
      this.cleanUpContentElement();
      this.destroyHeader();
      this.destroyPlugin();
      
      this.destructionChain.callChain();
   }.protect(),
   
   destroyDocument: function(){
      if( this.document ){
         this.document.removeEvents();
         this.document.destroy();
      }  
      this.document = null;
   }.protect(),
   
   destroyDocumentWrapper: function(){
      if( this.documentWrapper && this.documentWrapper.destroy ) this.documentWrapper.destroy();
      this.documentWrapper = null;
   }.protect(),
   
   destroyHeader: function(){
      if( this.header ){
         this.header.removeEvents();
         this.header.destroy();
      }
   }.protect(),
   
   destroyPlugin: function(){
      if( this.plugin ) {
         this.plugin.removeEvents();
         this.plugin.destroy();
      }
   }.protect(),
   
   destroyScrollBars: function(){
      if( this.verticalScrollBar ){ this.verticalScrollBar.destroy(); this.verticalScrollBar = null; }
   }.protect(),
   
   determineComponentElements: function(){
      this.componentRootElement = $( this.name + this.options.componentRootElementIdPostfix );
      this.componentRootElement = $( this.componentRootElement );     //required by Internet Explorer
      this.contentContainerElement = $( this.getContentContainerId() );
      this.contentContainerElement = document.id( this.contentContainerElement ); //Applies Element's methods, required by Internet Explorer
      this.constructionChain.callChain();
   }.protect(),
   
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
   
   parseStateSpecification: function(){
      this.documentDefinitionUri = this.stateSpecification['documentDefinitionURI'] != 'null' ? this.stateSpecification['documentDefinitionURI'] : null;
      this.documentContentUri = this.stateSpecification['documentContentURI'] != 'null' ? this.stateSpecification['documentContentURI'] : null;
      this.documentContentType = this.stateSpecification['documentType'] != 'null' ? this.stateSpecification['documentType'] : this.options.documentTypeDefault;
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
      
      this.destructionChain.callChain();
   }.protect(),
   
   restoreComponentState : function() {
      if( this.storeState ){
         this.stateSpecification = this.componentStateManager.retrieveComponentState( this.options.componentName ); 
         if( this.stateSpecification ) {
            this.parseStateSpecification();
            
            if( this.documentDefinitionUri ){
               this.storedDocumentNeedsToBeRestored = true;
               
               this.document = this.instantiateDocument( this.documentContentType, { 
                  documentContainerId : this.documentWrapperId, 
                  documentDefinitionUri : this.documentDefinitionUri, 
                  documentContentUri : this.documentContentUri,
                  onDocumentReady : this.onDocumentReady,
                  onDocumentError : this.onDocumentError
               });
               this.document.unmarshall();
            }
         }
      }
      this.constructionChain.callChain();
   }.protect(),
   
   revertConstruction: function(){
      this.destroyComponents();
      this.resetProperties();
   }.protect(),
      
   storeComponentState : function() {
      if( this.storeState ){
         this.stateSpecification = { documentDefinitionURI : this.documentDefinitionUri, documentContentURI : this.documentContentUri, documentType : this.documentContentType };
         this.componentStateManager.storeComponentState( this.options.componentName, this.stateSpecification );
      }
   }.protect(),
   
   storedContentHasPrecedence : function(  webUIMessage ){
      return this.storedDocumentNeedsToBeRestored == true && webUIMessage.isDefault();
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
      this.documentContentType = XmlResource.selectNodeText( this.options.documentTypeSelector, this.definitionElement, this.options.nameSpaces, this.options.documentTypeDefault );
      this.documentWrapperId = XmlResource.selectNodeText( this.options.documentWrapperIdSelector, this.definitionElement, this.options.nameSpaces, this.name + this.options.documentWrapperId );
      this.documentWrapperStyle = XmlResource.selectNodeText( this.options.documentWrapperStyleSelector, this.definitionElement, this.options.nameSpaces, this.options.documentWrapperStyle );
      this.documentWrapperTag = XmlResource.selectNodeText( this.options.documentWrapperTagSelector, this.definitionElement, this.options.nameSpaces, this.options.documentWrapperTag );
      if( this.documentDefinitionUri ){
         this.document = this.instantiateDocument( this.documentContentType, { 
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
      var headerConfigurationElement = XmlResource.selectNode( this.options.headerSelector, this.definitionElement );
      if( headerConfigurationElement ){
          this.header = new DesktopPanelHeader( headerConfigurationElement, this.internationalization, { onHeaderConstructed : this.onHeaderConstructed, onHeaderConstructionError : this.onHeaderConstructionError });
          this.header.unmarshall();
      }
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
      this.options.disableScrollBars = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.disableScrollBarsSelector, this.options.disableScrollBars ));
      this.height = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.heightSelector, this.options.heightDefault ));
      this.eventSources = eval( XmlResource.determineAttributeValue( this.definitionElement, this.options.eventSourcesSelector, null, this.eventSources ));
      this.name = XmlResource.determineAttributeValue( this.definitionElement, this.options.nameSelector );
      this.showHeader = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.showHeaderSelector ));
      this.handleMenuSelectedEvents = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.handleMenuSelectedEventsSelector, this.options.handleMenuSelectedEvents ));
      this.handleTabSelectedEvents = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.handleTabSelectedEventsSelector, this.options.handleTabSelectedEvents ));
      this.storeState = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.storeStateSelector, false ));
      this.storeStateInUri = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.storeStateInUriSelector, false ));
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.definitionElement );
      if( this.internationalization ) this.title = this.internationalization.getText( this.title );
      this.width = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.widthSelector, this.options.widthDefault ));
      this.options.componentName = this.name;
      
      if( this.storeStateInUri ) this.componentStateManager.includeComponentNameToUri( this.name );
   }.protect()
});
