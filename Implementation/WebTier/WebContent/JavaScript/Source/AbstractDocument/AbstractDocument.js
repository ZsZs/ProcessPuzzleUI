/*
Name: 
    - AbstractDocument

Description: 
    - Represents any kind of content can be displayed in a panel content area. Defines, implements the common properties of PlainHtmlDocument, SmartDocument.

Requires:
    - 
Provides:
    - AbstractDocument

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
//= require ../WebUILogger/WebUILogger.js
//= require ../WebUIMessageBus/WebUIMessageBus.js

var AbstractDocument = new Class({
   Implements: [Events, Options],
   Binds: ['attachEditor',
           'detachEditor',
           'determineContainerElement',
           'finalizeConstruction', 
           'finalizeDestruction',
           'instantiateEditor',
           'loadDocumentContent',
           'loadResources', 
           'onConstructionError', 
           'onContainerResize',
           'onDocumentError', 
           'onDocumentReady', 
           'onEditorAttached',
           'onResourceError', 
           'onResourcesLoaded', 
           'releaseResources',
           'resetProperties',
           'subscribeToWebUIMessages', 
           'webUIMessageHandler'],
   
   options: {
      componentName : "AbstractDocument",
      contentUriSelector : "sd:contentUri",
      descriptionSelector : "sd:description",
      documentContainerId : "DocumentContainer",
      documentContentExtension : ".xml",
      documentContentLocaleSpecificVersionsExists : true,
      documentContentLocaleSpecificVersionsExistsSelector : "sd:contentUri/@localeSpecificVersionsExists",
      documentContentUri : null,
      documentContentNameSpace : "xmlns:pp='http://www.processpuzzle.com/'",
      documentDefinitionNameSpace: "xmlns:sd='http://www.processpuzzle.com/SmartDocument'",
      documentDefinitionUri : null,
      documentDefinitionUriSelector: "@documentDefinition",
      documentEditorClass : "DocumentEditor",
      documentVariables : null,
      eventFireDelay : 5,
      handleMenuSelectedEventsDefault : false,
      handleMenuSelectedEventsSelector : "sd:handleMenuSelectedEvents",
      nameSelector : "sd:name",
      resourcesSelector : "sd:resources",
      rootElementName : "/sd:smartDocumentDefinition",
      versionSelector : "sd:version"
   },
   
   //Constructor
   initialize: function( i18Resource, options ){
      this.setOptions( options );
      this.constructionChain = new Chain();
      this.containerElement;
      this.contentUri;
      this.description;
      this.destructionChain = new Chain();
      this.documentContent;
      this.documentDefinition;
      this.documentDefinitionUri;
      this.editor;
      this.error;
      this.handleMenuSelectedEvents;
      this.htmlElementFactory;
      this.i18Resource = i18Resource;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.name;
      this.resources;
      this.state = AbstractDocument.States.UNINITIALIZED;
      this.version;
      
      this.loadDocumentDefinition();
      this.loadDocumentContent();
      this.state = AbstractDocument.States.INITIALIZED;
   },
   
   //Public mutators and accessor methods
   construct: function(){
      this.compileConstructionChain();
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      this.compileDestructionChain();
      this.destructionChain.callChain();
   },
   
   onConstructionError: function( error ){
      if( error ) this.error = error;
      this.revertConstruction();
      this.fireEvent( 'documentError', this.error );
   },
   
   onContainerResize: function( newSize ){
      //Abstract method, should be overwritten by subclasses
   },
   
   onDocumentError: function( error ){
      this.error = error;
      this.revertConstruction();
      this.fireEvent( 'documentError', error );
   },
   
   onDocumentReady: function(){
      this.constructionChain.callChain();
   },
   
   onEditorAttached: function(){
      this.constructionChain.callChain();
   },
   
   onResourceError: function( error ){
      this.error = error;
   },
   
   onResourcesLoaded: function(){
      if( this.resources.isSuccess() ) this.constructionChain.callChain();
      else this.onConstructionError();
   },
   
   showNotification: function( notificationText ){
      if( this.state == AbstractDocument.States.CONSTRUCTED ){
         var message = new MenuSelectedMessage({ originator : this.name, activityType : DesktopWindow.Activity.SHOW_NOTIFICATION, notification : notificationText });
         this.messageBus.notifySubscribers( message );
      }
   }, 
   
   showWindow: function( windowName ){
      if( this.state == AbstractDocument.States.CONSTRUCTED ){
         var message = new MenuSelectedMessage({ originator : this.name, activityType : DesktopWindow.Activity.SHOW_WINDOW, windowName : windowName });
         this.messageBus.notifySubscribers( message );
      }
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallResources();
      this.state = AbstractDocument.States.UNMARSHALLED;
   },

   webUIMessageHandler: function( webUIMessage ){
      if( this.state != AbstractDocument.States.CONSTRUCTED ) return;
      
      if( instanceOf( webUIMessage, MenuSelectedMessage ) && webUIMessage.getActivityType() == AbstractDocument.Activity.MODIFY_DOCUMENT ) {
         switch( webUIMessage.getActionType() ){
            case AbstractDocument.Action.ADD_IMAGE: this.editor.textAddImage(); break;
            case AbstractDocument.Action.ADD_LINK: this.editor.textAddLink(); break;
            case AbstractDocument.Action.ALIGN_CENTER: this.editor.textAlignCenter(); break;
            case AbstractDocument.Action.ALIGN_LEFT: this.editor.textAlignLeft(); break;
            case AbstractDocument.Action.ALIGN_JUSTIFY: this.editor.textAlignJustify(); break;
            case AbstractDocument.Action.ALIGN_RIGHT: this.editor.textAlignRight(); break;
            case AbstractDocument.Action.BOLD: this.editor.textBold(); break;
            case AbstractDocument.Action.INDENT: this.editor.textIndent(); break;
            case AbstractDocument.Action.ITALIC: this.editor.textItalic(); break;
            case AbstractDocument.Action.ORDERED_LIST: this.editor.textOrderedList(); break;
            case AbstractDocument.Action.OUTDENT: this.editor.textOutdent(); break;
            case AbstractDocument.Action.REDO: this.editor.textRedo(); break;
            case AbstractDocument.Action.REMOVE_LINK: this.editor.textRemoveLink(); break;
            case AbstractDocument.Action.STRIKETHROUGH: this.editor.textStrikethrough(); break;
            case AbstractDocument.Action.TOGGLE_VIEW: this.editor.textToggleView(); break;
            case AbstractDocument.Action.UNDERLINE: this.editor.textUnderline(); break;
            case AbstractDocument.Action.UNDO: this.editor.textUndo(); break;
            case AbstractDocument.Action.UNORDERED_LIST: this.editor.textUnorderedList(); break;
         }
      }
      this.lastHandledMessage = webUIMessage;
   },

   //Properties
   getContainerElement: function() { return this.containerElement; },
   getDescription: function() { return this.description; },
   getDocumentContent: function() { return this.documentContent; },
   getDocumentContentLocaleSpecificVersionsExists: function() { return this.options.documentContentLocaleSpecificVersionsExists; },
   getDocumentContentUri: function() { return this.contentUri; },
   getDocumentDefinition: function() { return this.documentDefinition; },
   getDocumentDefinitionUri: function() { return this.options.documentDefinitionUri; },
   getEditor: function() { return this.editor; },
   getError: function() { return this.error; },
   getHandleMenuSelectedEvents: function() { return this.handleMenuSelectedEvents; },
   getHtmlElementFactory: function() { return this.htmlElementFactory; },
   getLogger: function() { return this.logger; },
   getMessageBus: function() { return this.messageBus; },
   getName: function() { return this.name; },
   getResources: function() { return this.resources; },
   getState: function() { return this.state; },
   getVersion: function() { return this.version; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   attachEditor: function(){
      this.editor.attach( this.containerElement );
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( this.determineContainerElement, this.instantiateEditor, this.attachEditor, this.subscribeToWebUIMessages, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain(  this.releseResource, this.detachEditor, this.resetProperties, this.finalizeDestruction );
   }.protect(),
   
   detachEditor: function(){
      if( this.editor ) this.editor.detach();
      this.destructionChain.callChain();
   }.protect(),
   
   determineContainerElement: function(){
      this.containerElement = $( this.options.documentContainerId );
      this.htmlElementFactory = new WidgetElementFactory( this.containerElement, this.i18Resource );
      this.constructionChain.callChain();
   }.protect(),
   
   finalizeConstruction: function(){
      this.state = AbstractDocument.States.CONSTRUCTED;
      this.fireEvent('documentReady', this, this.options.eventFireDelay );
   }.protect(),
   
   finalizeDestruction: function(){
      this.constructionChain.clearChain();
      this.destructionChain.clearChain();
      this.state = AbstractDocument.States.INITIALIZED;
      this.fireEvent('documentDestroyed', this );
   }.protect(),
   
   instantiateEditor: function(){
      var editorClass = eval( this.options.documentEditorClass );
      this.editor = new editorClass( this.i18Resource, { onEditorAttached : this.onEditorAttached } );
      this.constructionChain.callChain();
   }.protect(),
   
   loadDocumentContent: function() {
      if( this.options.documentContentUri ){
         try{
        	   var uriOptions = { contentType: this.options.documentContentExtension.substring( 1 ), localeSpecificVersionsExists : this.options.documentContentLocaleSpecificVersionsExists};
            var resourceUri = new ResourceUri( this.options.documentContentUri, this.i18Resource.getLocale(), uriOptions );
            this.documentContent = new XmlResource( resourceUri.determineLocalizedUri(), { nameSpaces : this.options.documentContentNameSpace });
         }catch( e ){
            try{
               this.documentContent = new XmlResource( this.options.documentContentUri, { nameSpaces : this.options.documentContentNameSpace } );
            }catch( e ){
               throw new IllegalArgumentException( 'SmartDocument.options.documentContentUri', this.options.documentContentUri );
            }
         }
      }else {
         var uriOptions = { contentType: this.options.documentContentExtension.substring( 1 ), localeSpecificVersionsExists : this.options.documentContentLocaleSpecificVersionsExists};
         var resourceUri = new ResourceUri( this.options.documentDefinitionUri.substring( 0, this.options.documentDefinitionUri.lastIndexOf( ".xml" )), this.i18Resource.getLocale(), uriOptions );
         this.options.documentContentUri = resourceUri.determineLocalizedUri();
         try{
            this.documentContent = new XmlResource( this.options.documentContentUri, { nameSpaces : this.options.documentContentNameSpace });
         }catch( e ){
            this.logger.trace( "Content of " + this.name + " document couldn't be loaded." );
         }
      }
   }.protect(),
   
   loadDocumentDefinition: function() {
      if( this.options.documentDefinitionUri ) this.documentDefinition = new XmlResource( this.options.documentDefinitionUri, { nameSpaces : this.options.documentDefinitionNameSpace });
      else throw new IllegalArgumentException( 'SmartDocument.options.documentDefinitionUri', this.options.documentDefinitionUri );
   }.protect(),
   
   loadResources: function(){
      if( this.resources ) this.resources.load();
      else this.constructionChain.callChain();
   }.protect(),
   
   releaseResources : function(){
      if( this.resources ) this.resources.release();
      this.destructionChain.callChain();
   }.protect(),
   
   resetProperties: function(){
      this.description = null;
      this.options.documentContentUri = null;
      this.options.documentDefinitionUri = null;
      this.editor = null;
      this.name = null;
      this.version = null;
      this.destructionChain.callChain();
   }.protect(),
   
   revertConstruction: function(){
      if( this.editor ) this.editor.destroy();
      this.resetProperties();
      this.state = AbstractDocument.States.INITIALIZED;
   }.protect(),
   
   subscribeToWebUIMessages: function() {
      if( this.handleMenuSelectedEvents ){
         this.logger.debug( this.options.componentName + ".subscribeToWebUIMessages() started." );
         this.messageBus.subscribeToMessage( MenuSelectedMessage, this.webUIMessageHandler );
      }
      
      this.constructionChain.callChain();
   }.protect(),
      
   unmarshallProperties: function(){
      this.description = this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.descriptionSelector );
      this.handleMenuSelectedEvents = parseBoolean( this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.handleMenuSelectedEventsSelector, null, this.options.handleMenuSelectedEventsDefault ));
      this.name = this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.nameSelector );
      this.version = this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.versionSelector );
      this.contentUri = this.documentDefinition.selectNodeText( this.options.rootElementName + "/" + this.options.contentUriSelector );
      if( !this.options.documentContentUri && this.contentUri ) this.options.documentContentUri = this.contentUri;
      this.options.documentContentLocaleSpecificVersionsExists = parseBoolean( this.documentDefinition.selectNodeText( this.options.documentContentLocaleSpecificVersionsExistsSelector, null, this.options.documentContentLocaleSpecificVersionsExists ));
   }.protect(),
      
   unmarshallResources: function(){
      var resourcesElement = this.documentDefinition.selectNode( this.options.rootElementName + "/" + this.options.resourcesSelector );
      if( resourcesElement ){
         this.resources = new ResourceManager( resourcesElement, { onResourcesLoaded : this.onResourcesLoaded, onResourceError : this.onResourceError } );
         this.resources.unmarshall();
      }
   }.protect()
});

AbstractDocument.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
AbstractDocument.Types = { HTML : 'StaticHtml', SMART : 'SmartDocument', REMOTE_RESOURCE : 'RemoteResource' };
AbstractDocument.Activity = { LOAD_DOCUMENT : 'loadDocument', MODIFY_DOCUMENT : 'modifyDocument' };
AbstractDocument.Action = { 
      BOLD : 'bold', 
      ITALIC : 'italic', 
      UNDERLINE : 'underline', 
      STRIKETHROUGH : 'strikethrough', 
      UNORDERED_LIST : 'unorderedList', 
      ORDERED_LIST : 'orderedList', 
      INDENT : 'indent', 
      OUTDENT : 'outdent', 
      ALIGN_LEFT : 'alignLeft', 
      ALIGN_CENTER : 'alighCenter',
      ALIGN_RIGHT : 'alignRight',
      ALIGN_JUSTIFY : 'alignJustify',
      UNDO : 'undo',
      REDO : 'redo',
      ADD_LINK : 'addLink',
      REMOVE_LINK : 'removeLink',
      ADD_IMAGE : 'addImage',
      TOGGLE_VIEW : 'toggleView' };
