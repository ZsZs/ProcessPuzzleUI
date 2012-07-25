// BrowserWidget.js

/**
 * ProcessPuzzle User Interface Backend agnostic, desktop like configurable,
 * browser font-end based on MochaUI. Copyright (C) 2011 Zsolt Zsuffa
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes
//= require ../WebUIMessageBus/WebUIMessage.js

var BrowserWidget = new Class( {
   Implements : [AssertionBehavior, Events, Options, TimeOutBehaviour],
   Binds : ['broadcastConstructedMessage', 'checkTimeOut', 'destroyChildHtmlElements', 'finalizeConstruction', 'finalizeDestruction', 'webUIMessageHandler'],

   options : {
      componentName : "BrowserWidget",
      dataXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      definitionXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com', xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      descriptionSelector : "/sd:widgetDefinition/sd:description",
      domDocument : this.document,
      eventDeliveryDelay : 5,
      nameSelector : "/sd:widgetDefinition/sd:name",
      optionsSelector : "/sd:widgetDefinition/sd:options",
      subscribeToWebUIMessages : false,
      useLocalizedData : false,
      widgetContainerId : "widgetContainer",
      widgetDataURI : null,
      widgetDefinitionURI : null,
      widgetVersionSelector : "/sd:widgetDefinition/sd:version"
   },

   // constructor
   initialize : function( options, resourceBundle, elementFactoryOptions ) {
      this.setOptions( options );

      // private instance variables
      this.componentStateManager;
      this.constructionChain = new Chain();
      this.containerElement;
      this.dataXml;
      this.definitionXml;
      this.description;
      this.destructionChain = new Chain();
      this.elementFactory = null;
      this.error;
      this.givenOptions = options;
      this.i18Resource = null;
      this.lastHandledMessage = null;
      this.locale;
      this.logger;
      this.messageBus;
      this.name;
      this.state;
      this.stateSpecification;
      this.widgetVersion;
      this.webUIController = null;

      // initialize object
      this.deduceInitializationArguments( options, resourceBundle );
      this.containerElement = document.id( $( this.options.widgetContainerId ));
      this.configureComponentStateManager();
      this.configureLogger();
      this.configureMessageBus();
      this.loadWidgetDefinition();
      this.loadWidgetData();

      assertThat( this.i18Resource, not( nil() ) );
      if( this.containerElement == null )
         throw new IllegalArgumentException( "Parameter 'widgetContainerId' in invalid." );
      if( !this.i18Resource.isLoaded )
         throw new IllegalArgumentException( "ResourceBundle should be already loaded." );
      
      this.elementFactory = new WidgetElementFactory( this.containerElement, this.i18Resource, elementFactoryOptions );
      this.restoreComponentState();
      this.state = BrowserWidget.States.INITIALIZED;
   },

   // public accessor and mutator methods
   construct : function() {
      if( this.state < BrowserWidget.States.CONSTRUCTED ) {
         this.startTimeOutTimer( 'construct' );
         this.compileConstructionChain();
         this.constructionChain.callChain();
      }
      return this;
   },

   destroy : function() {
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.compileDestructionChain();
         this.destructionChain.callChain();
      }
   },

   getText : function( key ) {
      var text = null;
      try{
         text = this.i18Resource.getText( key );
      }catch (e){
         text = key;
      }
      return text;
   },
   
   removeChild : function( childElement, parentElement ) {
      var contextElement = parentElement == undefined ? this.containerElement : parentElement;

      if( contextElement != null && childElement != null ){
         contextElement.removeChild( childElement );
      }
   },
   
   restoreComponentState : function() {
      this.stateSpecification = this.componentStateManager.retrieveComponentState( this.options.componentName ); 
      this.parseStateSpecification();
   },
   
   storeComponentState : function() {
      this.compileStateSpecification();
      this.componentStateManager.storeComponentState( this.options.componentName, this.stateSpecification );
   }.protect(),
   
   unmarshall : function(){
      this.unmarshallProperties();
      this.unmarshallOptions();
      this.unmarshallComponents();
      this.state = BrowserWidget.States.UNMARSHALLED;
      return this;
   },

   updateText : function( theContainerElement, parentElementId, newTextValue ) {
      var parentElement = theContainerElement.findElementById( theContainerElement, parentElementId );
      parentElement.set( 'text', this.getText( newTextValue ) );
   },

   webUIMessageHandler : function( webUIMessage ) {
      if( webUIMessage.getOriginator() == this.options.componentName ) return;
      if( this.state != BrowserWidget.States.CONSTRUCTED ) throw new UnconfiguredWidgetException( { source : 'BrowserWidget.webUIMessageHandler()'} );
      
      this.lastHandledMessage = webUIMessage;
   },

   // Properties
   getContainerElement : function() { return this.containerElement; },
   getDataXml : function() { return this.dataXml; },
   getDefinitionXml : function() { return this.definitionXml; },
   getDescription: function() { return this.description; },
   getElementFactory : function() { return this.elementFactory; },
   getError : function() { return this.error; },
   getHtmlDOMDocument : function() { return this.options.domDocument; },
   getLastMessage : function() { return this.lastHandledMessage; },
   getLocale : function() { return this.locale; },
   getLogger : function() { return this.logger; },
   getMessageBus : function() { return this.messageBus; },
   getName: function() { return this.name; },
   getResourceBundle : function() { return this.i18Resource; },
   getState : function() { return this.state; },

   // Private helper methods
   broadcastConstructedMessage: function(){
      var constructedMessage = new WidgetConstuctedMessage({ originator : this.options.componentName });
      this.messageBus.notifySubscribers( constructedMessage );
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
   
   compileStateSpecification: function(){
      //Abstract method, should be overwrite!
   }.protect(),
   
   configureComponentStateManager : function() {
      if( this.webUIController == null ) this.componentStateManager = Class.getInstanceOf( ComponentStateManager );
      else this.componentStateManager = this.webUIController.getStateManager();
   }.protect(),

   configureLogger : function() {
      if( this.webUIController == null ){
         this.logger = Class.getInstanceOf( WebUILogger );
         if( this.logger == null )
            this.logger = new WebUILogger();
      }else
         this.logger = this.webUIController.getLogger();
   }.protect(),

   configureMessageBus : function() {
      if( this.webUIController == null ) this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      else this.messageBus = this.webUIController.getMessageBus();

      this.subscribeToWebUIMessages();
   }.protect(),

   deduceInitializationArguments : function( options, resourceBundle ) {
      if( resourceBundle ){
         this.i18Resource = resourceBundle;
         this.locale = resourceBundle.getLocale();
      }else{
         this.webUIController = Class.getInstanceOf( WebUIController );
         if( !this.webUIController ) throw new IllegalArgumentException( "localizationResource' and 'webUIController", "undefined" );
         this.i18Resource = this.webUIController.getResourceBundle();
         this.locale = this.webUIController.getCurrentLocale();
      }
   }.protect(),
   
   destroyChildHtmlElements : function(){
      this.containerElement = document.id( this.containerElement );
      this.containerElement.getElements( '*' ).each( function( childElement, index ) {
         if( childElement.removeEvents )
            childElement.removeEvents();
         if( childElement.destroy )
            childElement.destroy();
      });
      
      this.destructionChain.callChain();
   }.protect(),

   finalizeConstruction : function(){
      this.logger.trace( this.options.componentName + ".onConstructed() of '" + this.name + "'." );
      this.storeComponentState();
      this.state = BrowserWidget.States.CONSTRUCTED;
      this.stopTimeOutTimer();
      this.constructionChain.clearChain();
      this.broadcastConstructedMessage();
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );
   }.protect(),
   
   finalizeDestruction : function(){
      this.logger.trace( this.options.componentName + ".onDestroyed() of '" + this.name + "'." );
      this.state = BrowserWidget.States.INITIALIZED;
      this.destructionChain.clearChain();
      this.fireEvent( 'destroyed', this, this.options.eventDeliveryDelay );
   }.protect(),

   loadWebUIConfiguration : function() {
      try{
         this.webUIConfiguration = new WebUIConfiguration( this.options.configurationUri );
      }catch (e){
         alert( "Couldn't load Browser Front-End configuration: " + this.options.configurationUri );
      }
   }.protect(),

   loadWidgetData : function() {
      if( this.options.widgetDataURI ){
         try{
            var dataUri = this.options.useLocalizedData ? new ResourceUri( this.options.widgetDataURI, this.locale ).determineLocalizedUri() : this.options.widgetDataURI;
            this.dataXml = new XmlResource( dataUri, { nameSpaces : this.options.dataXmlNameSpace});
         }catch (e){
            this.logger.debug( "Widget data: '" + this.options.widgetDataURI + "' not found." );
         }
      }
   }.protect(),

   loadWidgetDefinition : function() {
      if( this.options.widgetDefinitionURI ){
         try{
            this.definitionXml = new XmlResource( this.options.widgetDefinitionURI, {
               nameSpaces : this.options.definitionXmlNameSpace} );
         }catch (e){
            this.logger.debug( "Widget definition: '" + this.options.widgetDefinitionURI + "' not found." );
         }
      }
   }.protect(),
   
   parseStateSpecification: function(){
      //Abstract method, should be overwrite!
   }.protect(),
   
   revertConstruction : function(){
      this.stopTimeOutTimer();
      this.state = BrowserWidget.States.INITIALIZED;
      this.fireEvent( 'constructionError', this.error );
   }.protect(),

   subscribeToWebUIMessages : function() {
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.subscribeToMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
   }.protect(),
   
   timeOut : function( exception ){
      this.revertConstruction( exception );
   }.protect(),
   
   unmarshallComponents: function(){
      //Abstract method, should be overwrite!
   }.protect(),
   
   unmarshallOptions: function(){
      if( this.definitionXml ){
         var widgetOptionsElement = this.definitionXml.selectNode( this.options.optionsSelector );
         if( widgetOptionsElement ){
            var widgetOptionsResource = new OptionsResource( widgetOptionsElement );
            widgetOptionsResource.unmarshall();
            this.setOptions( widgetOptionsResource.getOptions() );
         }
         
         this.setOptions( this.givenOptions );
      }
   }.protect(),

   unmarshallProperties: function(){
      if( this.definitionXml ){
         this.description = this.definitionXml.selectNodeText( this.options.descriptionSelector );
         this.name = this.definitionXml.selectNodeText( this.options.nameSelector );
      }
   }.protect(),
   
   writeOffFromWebUIMessages : function(){
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.writeOffFromMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
   }
});

BrowserWidget.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
