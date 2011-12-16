/*
Name: 
   - DesktopWindow

Description: 
   - Represents a window within desktop. It's wrapper of MochaUI column, which gets it's properties from an XML descriptor. 

Requires:
   - DesktopElement, ComplexContentBehaviour

Provides:
   - DesktopWindow

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

var DesktopWindow = new Class({
   Extends: DesktopElement,
   Implements: [ComplexContentBehaviour],
   Binds: [
      'constructDocument',
      'constructHeader',
      'constructPlugin',
      'destroy',
      'determineComponentElements', 
      'instantiateMUIWindow', 
      'onContainerResize', 
      'onDocumentError', 
      'onDocumentReady', 
      'onHeaderConstructed', 
      'onHeaderConstructionError',
      'onMUIWindowLoaded',
      'onPluginConstructed',
      'onPluginError',
      'subscribeToWebUIMessages',
      'webUIMessageHandler'],
   options : {
      componentContainerId : "desktop",
      componentContentIdPostfix : "_content",
      componentName : "DesktopWindow",
      componentRootElementIdPostfix: "",
   },

   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.parent( definitionElement, internationalization, options );
      this.MUIWindow;
      this.onReadyCallBack;
   },
   
   //Public accessor and mutator methods
   construct: function( onReadyCallback ){
      this.onReadyCallBack = onReadyCallback;
      this.parent();
   },
   
   destroy: function(){
      this.parent();
   },
   
   onMUIWindowLoaded : function(){
      this.constructionChain.callChain();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallWindowProperties();
      this.unmarshallHeader();
      this.unmarshallPlugin();
      this.unmarshallDocument();
      this.parent();
   },
   
   //Properties
   getMUIWindow: function() { return this.MUIWindow; },
   getOnReadyCallback: function() { return this.onReadyCallBack; },
   getWindowContentElement: function() { return this.contentContainerElement; },
   getWindowElement: function() { return this.componentRootElement; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( 
         this.instantiateMUIWindow, 
         this.determineComponentElements, 
         this.constructHeader,
         this.constructPlugin,
         this.constructDocument,
         this.subscribeToWebUIMessages,
         this.finalizeConstruction
      );
   }.protect(),
   
   instantiateMUIWindow: function(){
      if( this.contentUrl ) this.internationalizeContentUri();
      
      this.MUIWindow = new MUI.Window({
         container : this.containerElement,
         contentURL : this.contentUrl ? this.contentUrl : null,
         height : this.height,
         id : this.name,
         onClose : this.destroy,
         onContentLoaded : this.contentUrl ? this.onMUIWindowLoaded : null,
         onResize : this.onContainerResize,
         title : this.internationalization.getText( this.title ),
         width : this.width
      });      
      if( !this.contentUrl ) this.constructionChain.callChain();
   }.protect(),
   
   unmarshallWindowProperties: function(){
   }.protect(),
});

DesktopWindow.Activity = { SHOW_WINDOW : 'showWindow', SHOW_NOTIFICATION : 'showNotification' };
