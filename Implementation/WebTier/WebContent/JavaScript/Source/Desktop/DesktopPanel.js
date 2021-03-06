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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes
//= require ../Desktop/DesktopElement.js

var DesktopPanel = new Class({
   Extends: DesktopElement,
   Implements: [ComplexContentBehaviour],
   Binds: ['addScrollBars',
           'constructDocument', 
           'constructPlugin', 
           'constructHeader', 
           'createContentAreaElement',
           'destroyComponents',
           'destroyMUIPanel',
           'determineComponentElements',
           'finalizeConstruction',
           'finalizeDestruction',
           'instantiateMUIPanel',
           'loadHtmlDocument',
           'loadSmartDocument',
           'onContainerResize', 
           'onDocumentError', 
           'onDocumentReady', 
           'onHeaderConstructed', 
           'onHeaderConstructionError',
           'onMUIPanelLoaded',
           'onPluginConstructed',
           'onPluginError',
           'restoreComponentState',
           'subscribeToWebUIMessages',
           'webUIMessageHandler'],   
   
   options : {
      columnReferenceSelector : "columnReference",
      componentContentIdPostfix : "",
      componentName : "DesktopPanel",
      componentRootElementIdPostfix : "_wrapper",
      panelContentElementSuffix : "_pad"
   },

   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.parent( definitionElement, bundle, options );
      this.columnReference;
      this.MUIPanel;
      this.MUIPanelLoaded = false;
   },
   
   //Public accessor and mutator methods
   onMUIPanelLoaded: function(){
      this.logger.trace( this.options.componentName + ".construct() of '" + this.name + "'s MUIPanel finished." );
      this.MUIPanelLoaded = true;
      this.constructionChain.callChain();
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallPanelProperties();
      this.unmarshallHeader();
      this.unmarshallPlugin();
      this.unmarshallDocument();
      this.parent();
   },
   
   //Properties
   getColumnReference: function() { return this.columnReference; },
   getContentUrl: function() { return this.contentUrl; },
   getDocument: function() { return this.document; },
   getDocumentContentUri: function() { return this.documentContentUri; },
   getDocumentDefinitionUri: function() { return this.documentDefinitionUri; },
   getDocumentWrapperId: function() { return this.documentWrapperId; },
   getDocumentWrapperStyle: function() { return this.documentWrapperStyle; },
   getDocumentWrapperTag: function() { return this.documentWrapperTag; },
   getHeader: function() { return this.header; },
   getMUIPanel: function() { return this.MUIPanel; },
   getName: function() { return this.name; },
   getPlugin: function() { return this.plugin; },
   getShowHeader: function() { return this.showHeader; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   getToolBox: function() { return this.header; },
   isSuccess: function() { return this.error == null; },
   
   //Protected, private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain(
         this.restoreComponentState,
         this.instantiateMUIPanel,
         this.determineComponentElements,
         this.constructHeader,
         this.createContentAreaElement,
         this.constructPlugin,
         this.constructDocument,
         this.addScrollBars,
         this.subscribeToWebUIMessages,
         this.finalizeConstruction
      );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyComponents, this.resetProperties, this.destroyHtmlElement, this.destroyMUIPanel, this.finalizeDestruction );
   }.protect(),
   
   destroyMUIPanel: function(){
      this.columnReference = null;
      
      if( this.MUIPanel ){
         this.MUIPanel.removeEvents();
         this.MUIPanel.destroy();
         this.MUIPanel = null;
      }
      
      this.destructionChain.callChain();
   }.protect(),
   
   determinePanelElement: function(){
      this.componentRootElement = $( this.name + this.options.panelIdPostfix );
      this.componentRootElement = $( this.componentRootElement );     //required by Internet Explorer
      this.panelContentElement = $( this.name );
      this.constructionChain.callChain();
   }.protect(),
   
   instantiateMUIPanel: function(){
      var panelTitle = this.header && this.header.getPlugin() ? "" : this.title;
      try{
         this.MUIPanel = new MUI.Panel({
            column : this.columnReference,
            content : "",
            onContentLoaded : this.header ? null : this.onMUIPanelLoaded,
            contentURL : this.contentUrl,
            id : this.name,
            header : this.showHeader,
            headerToolbox : this.header ? true : false,
            headerToolboxOnload : this.header ? this.onMUIPanelLoaded : null,
            headerToolboxURL : this.header ? this.header.getToolBoxUrl() : null,
            height : this.height,
            onResize : this.onContainerResize,
            scrollbars : true,
            title : panelTitle 
         });
      }catch( exception ){
         this.revertConstruction( new DesktopElementConfigurationException( this.name, { cause : exception }));
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
   
   revertConstruction: function( exception ){
      this.revertComplexContentBehaviour();
      this.parent( exception );
   }.protect(),
      
   unmarshallPanelProperties: function(){
      this.columnReference = XmlResource.determineAttributeValue( this.definitionElement, this.options.columnReferenceSelector );
   }.protect(),  
});