/*
Name: 
    - DocumentEditor

Description: 
    - Abstract class of all specialized SmartDocument editors. Standardize the interface for SmartDocuments and provides fundamental services. 

Requires:
    - 
    
Provides:
    - DocumentEditor

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

var DocumentEditor = new Class({
   Implements: [Events, Options],
   Binds: ['determineStyleSheets', 'finalizeAttach', 'instantiateTools', 'subscribeToWebUIMessages', 'webUIMessageHandler'],
   options : {
      componentName : "DocumentEditor",
      subscribeToWebUIMessages : [],
   },

   //Constructor
   initialize: function( internationalization, options ){
      this.setOptions( options );
      this.internationalization = internationalization;
      
      //Private attributes
      this.attachChain = new Chain();
      this.lastWebUIMessage;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageBus = Class.getInstanceOf( WebUIMessageBus );
      this.styleSheets = new ArrayList();
      this.subjectElement;
   },
   
   //Public accessor and mutator methods
   attach: function( subjectElement ){
      this.subjectElement = subjectElement;
      this.attachChain.chain( this.determineStyleSheets, this.instantiateTools, this.subscribeToWebUIMessages, this.finalizeAttach );
      this.attachChain.callChain();
   },
   
   detach: function(){
      this.destroyTools();
      this.writeOffFromWebUIMessages();
      this.finalizeDetach();
   },
   
   showNotification: function( notificationText ){
      var message = new MenuSelectedMessage({ originator : this.name, activityType : DesktopWindow.Activity.SHOW_NOTIFICATION, notification : this.options.componentName + "." + notificationText });
      this.messageBus.notifySubscribers( message );
   }, 
   
   showWindow: function( windowName ){
      var message = new MenuSelectedMessage({ originator : this.name, activityType : DesktopWindow.Activity.SHOW_WINDOW, windowName : windowName });
      this.messageBus.notifySubscribers( message );
   },
   
   webUIMessageHandler : function( webUIMessage ){
      var messageHandlerName = "this.on" + webUIMessage.getName();
      try{
         var messageHandler = eval( messageHandlerName );
         messageHandler( webUIMessage );
      }catch( e ){
         this.logger.debug( "'" + messageHandleName + "' should be implemented." );
      }
      this.lastWebUIMessage = webUIMessage;
   },
      
   //Properties
   getSubjectElement: function() { return this.subjectElement; },
   
   //Protected and private helper methods
   destroyTools: function(){
      //Abstract method, should be overwritten.
   }.protect(),
   
   determineStyleSheets: function(){
      var linkElements = this.subjectElement.getDocument().getElements("link"); 
      linkElements.each( function( linkElement, index ){
         this.styleSheets.add( linkElement.get( 'href' ));
      }, this );
      this.attachChain.callChain();
   }.protect(),
   
   finalizeAttach: function(){
      this.attachChain.clearChain();
      this.fireEvent( 'editorAttached', this );
   }.protect(),
   
   finalizeDetach: function(){
      this.fireEvent( 'editorDetached', this );
   }.protect(),
   
   instantiateTools: function(){
      //Abstract method, should be overwritten in subclasses.
      this.attachChain.callChain();
   }.protect(),
   
   subscribeToWebUIMessages : function() {
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.subscribeToMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
      this.attachChain.callChain();
   }.protect(),

   writeOffFromWebUIMessages : function(){
      if( this.options.subscribeToWebUIMessages ){
         this.options.subscribeToWebUIMessages.each( function( messageClass, index ) {
            this.messageBus.writeOffFromMessage( messageClass, this.webUIMessageHandler );
         }, this );
      }
   }.protect(),
});