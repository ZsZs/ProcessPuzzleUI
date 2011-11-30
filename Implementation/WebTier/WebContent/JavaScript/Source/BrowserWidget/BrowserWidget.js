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

// Abstract root class of all widgets. Provides standardized way for different
// HTML element creation.
var BrowserWidget = new Class( {
   Implements : [Events, Options],
   Binds : ['onConstructed', 'onDestroyed', 'webUIMessageHandler'],

   options : {
      dataXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      definitionXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
      domDocument : this.document,
      subscribeToWebUIMessages : false,
      widgetContainerId : "widgetContainer",
      widgetDataURI : null,
      widgetDefinitionURI : null
   },

   // constructor
   initialize : function( options, resourceBundle, elementFactoryOptions ) {
      this.setOptions( options );

      // private instance variables
      this.componentStateManager;
      this.containerElement;
      this.dataXml;
      this.definitionXml;
      this.description;
      this.elementFactory = null;
      this.i18Resource = null;
      this.lastHandledMessage = null;
      this.locale;
      this.logger;
      this.messageBus;
      this.name;
      this.state;
      this.stateSpecification;
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
      ;
      
      this.elementFactory = new WidgetElementFactory( this.containerElement, this.i18Resource, elementFactoryOptions );
      this.restoreComponentState();
      this.state = BrowserWidget.States.INITIALIZED;
   },

   // public accessor and mutator methods
   construct : function() {
      if( this.state < BrowserWidget.States.CONSTRUCTED ) this.onConstructed();
      return this;
   },

   destroy : function() {
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.containerElement = document.id( this.containerElement );
         this.containerElement.getElements( '*' ).each( function( childElement, index ) {
            if( childElement.removeEvents )
               childElement.removeEvents();
            if( childElement.destroy )
               childElement.destroy();
         } );
         this.state = BrowserWidget.States.INITIALIZED;
         this.onDestroyed();
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
   
   onConstructed : function(){
      this.logger.trace( this.options.componentName + ".onConstructed() of '" + this.name + "'." );
      this.storeComponentState();
      this.state = BrowserWidget.States.CONSTRUCTED;
      this.fireEvent( 'constructed', this );
   },
   
   onDestroyed : function(){
      this.logger.trace( this.options.componentName + ".onDestroyed() of '" + this.name + "'." );
      this.fireEvent( 'destroyed', this );
   },

   removeChild : function( childElement, parentElement ) {
      var contextElement = parentElement == undefined ? this.containerElement : parentElement;

      if( contextElement != null && childElement != null ){
         contextElement.removeChild( childElement );
      }
   },
   
   restoreComponentState : function() {
      this.stateSpecification = this.componentStateManager.retrieveCurrentState( this.options.componentName ); 
      this.parseStateSpecification();
   },
   
   storeComponentState : function() {
      this.compileStateSpecification();
      this.componentStateManager.storeCurrentState( this.options.componentName, this.stateSpecification );
   }.protect(),
   
   unmarshall : function(){
      this.state = BrowserWidget.States.UNMARSHALLED;
      return this;
   },

   updateText : function( theContainerElement, parentElementId, newTextValue ) {
      var parentElement = theContainerElement.findElementById( theContainerElement, parentElementId );
      parentElement.set( 'text', this.getText( newTextValue ) );
   },

   webUIMessageHandler : function( webUIMessage ) {
      if( this.state != BrowserWidget.States.CONSTRUCTED ) throw new UnconfiguredWidgetException( { source : 'BrowserWidget.webUIMessageHandler()'} );
      this.lastHandledMessage = webUIMessage;
   },

   // Properties
   getContainerElement : function() { return this.containerElement; },
   getDataXml : function() { return this.dataXml; },
   getDefinitionXml : function() { return this.definitionXml; },
   getDescription: function() { return this.description; },
   getElementFactory : function() { return this.elementFactory; },
   getHtmlDOMDocument : function() { return this.options.domDocument; },
   getLastMessage : function() { return this.lastHandledMessage; },
   getLocale : function() { return this.locale; },
   getLogger : function() { return this.logger; },
   getMessageBus : function() { return this.messageBus; },
   getName: function() { return this.name; },
   getResourceBundle : function() { return this.i18Resource; },
   getState : function() { return this.state; },

   // Private helper methods
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
         this.i18Resource = this.webUIController.getResourceBundle();
         this.locale = this.webUIController.getCurrentLocale();
      }
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
            this.dataXml = new XmlResource( this.options.widgetDataURI, {
               nameSpaces : this.options.dataXmlNameSpace} );
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

   subscribeToWebUIMessages : function() {
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.subscribeToMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
   }.protect(),

   unmarshallProperties: function(){
      this.description = this.definitionXml.selectNodeText( this.options.descriptionSelector );
      this.name = this.definitionXml.selectNodeText( this.options.nameSelector );
   }
});

BrowserWidget.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
