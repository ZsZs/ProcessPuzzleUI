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
   Binds: ['constructDocument', 'constructPlugin', 'constructHeader', 'determinePanelElement', 'instantiateMUIPanel', 'onDocumentReady', 'onHeaderConstructed', 'onMUIPanelLoaded', 'onPluginLoaded'],   
   
   options : {
      columnReferenceSelector : "columnReference",
      contentUrlSelector : "contentURL",
      documentContentUriSelector : "document/documentContentUri",
      documentDefinitionUriSelector : "document/documentDefinitionUri",
      documentWrapperIdSelector : "document/@id",
      documentWrapperStyleSelector : "document/@elementStyle",
      documentWrapperTagSelector : "document/@tag",
      headerSelector : "panelHeader",
      heightSelector : "height",
      nameSelector : "name",
      panelIdPostfix : "_wrapper",
      pluginSelector : "plugin",
      showHeaderSelector : "showHeader",
      titleSelector : "title",
      widthSelector : "width"
   },

   //Constructor
   initialize: function( definitionElement, bundle, options ){
      this.setOptions( options );
      this.columnReference;
      this.constructionChain = new Chain();
      this.contentUrl;
      this.definitionElement = definitionElement;
      this.document;
      this.documentContentUri;
      this.documentDefinitionUri;
      this.documentWrapper;
      this.documentWrapperId;
      this.documentWrapperStyle;
      this.documentWrapperTag;
      this.header;
      this.height;
      this.MUIPanel;
      this.MUIPanelLoaded = false;
      this.name;
      this.panelContentElement;
      this.panelElement;
      this.resourceBundle = bundle;
      this.showHeader;
      this.title;
      
      this.state = DesktopPanel.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.constructionChain.chain( 
         this.instantiateMUIPanel,
         this.determinePanelElement,
         this.constructHeader,
         this.constructPlugin,
         this.constructDocument
      );
      this.constructionChain.callChain();
   },
   
   destroy: function(){
      if( this.document ) {
         this.document.destroy();
         this.destroyDocumentWrapper();
      }
      if( this.header ) this.header.destroy();
      if( this.plugin ) this.plugin.destory();
      if( this.panelElement ) this.panelElement.destroy();
   },
   
   onDocumentReady: function(){
      this.constructionChain.callChain();
      this.fireEvent('panelConstructed', this ); 
   },
   
   onHeaderConstructed: function(){
      this.constructionChain.callChain();
   },
   
   onMUIPanelLoaded: function(){
      this.MUIPanelLoaded = true;
      this.constructionChain.callChain();
   },
   
   onPluginLoaded: function(){
     this.constructionChain.callChain();
   },
   
   unmarshall: function(){
      this.unmarshallPanelProperties();
      this.unmarshallPanelHeader();
      this.unmarshallPlugin();
      this.unmarshallDocument();
      
      this.state = DesktopPanel.States.UNMARSHALLED;
   },

   //Properties
   getColumnReference: function() { return this.columnReference; },
   getContentUrl: function() { return this.contentUrl; },
   getDocument: function() { return this.document; },
   getDocumentContentUri: function() { return this.documentContentUri; },
   getDocumentDefintionUri: function() { return this.documentDefinitionUri; },
   getDocumentWrapperId: function() { return this.documentWrapperId; },
   getDocumentWrapperStyle: function() { return this.documentWrapperStyle; },
   getDocumentWrapperTag: function() { return this.documentWrapperTag; },
   getHeader: function() { return this.header; },
   getHeight: function() { return this.height; },
   getMUIPanel: function() { return this.MUIPanel; },
   getName: function() { return this.name; },
   getPlugin: function() { return this.plugin; },
   getShowHeader: function() { return this.showHeader; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   getToolBox: function() { return this.header; },
   
   //Protected, private helper methods
   constructDocument: function(){
      if( this.document ) {
         this.createDocumentWrapper();
         this.document.construct();
      }
      else this.onDocumentReady();
   }.protect(),
   
   constructPlugin: function(){
      if( this.plugin ) {
         this.plugin.construct();
      }else this.onPluginLoaded();
   }.protect(),
   
   constructHeader: function(){
      if( this.header ) this.header.construct();
      else this.constructionChain.callChain();
   }.protect(),
   
   createDocumentWrapper: function(){
      this.documentWrapper = new Element( this.documentWrapperTag, { id : this.documentWrapperId, class : this.documentWrapperStyle } );
      this.panelContentElement.grab( this.documentWrapper );
   }.protect(),
   
   destroyDocumentWrapper: function(){
      this.documentWrapper.destroy();
   }.protect(),
   
   determinePanelElement: function(){
      this.panelElement = $( this.name + this.options.panelIdPostfix );
      this.panelContentElement = $( this.name );
      this.constructionChain.callChain();
   }.protect(),
   
   instantiateMUIPanel: function(){
      var require = { css: [], images: [], js: [], onload: this.onMUIPanelLoaded };
      
      this.MUIPanel = new MUI.Panel({ 
         column: this.columnReference,
         contentURL: this.contentUrl,
         id: this.name,
         header: this.showHeader,
         headerToolbox: this.header ? true : false,
         headerToolboxOnload: null,
         headerToolboxURL: this.header ? this.header.getToolBoxUrl() : null,
         height: this.height, 
         require: require,
         title: this.title });
   }.protect(),
   
   unmarshallDocument: function(){
      this.documentContentUri = XmlResource.selectNodeText( this.options.documentContentUriSelector, this.definitionElement );
      this.documentDefinitionUri = XmlResource.selectNodeText( this.options.documentDefinitionUriSelector, this.definitionElement );
      this.documentWrapperId = XmlResource.selectNodeText( this.options.documentWrapperIdSelector, this.definitionElement );
      this.documentWrapperStyle = XmlResource.selectNodeText( this.options.documentWrapperStyleSelector, this.definitionElement );
      this.documentWrapperTag = XmlResource.selectNodeText( this.options.documentWrapperTagSelector, this.definitionElement );
      if( this.documentDefinitionUri ){
         this.document = new SmartDocument( this.resourceBundle, { 
            widgetContainerId : this.documentWrapperId, 
            documentDefinitionUri : this.documentDefinitionUri, 
            documentContentUri : this.documentContentUri,
            onDocumentReady : this.onDocumentReady 
         });
         this.document.unmarshall();
      }
   }.protect(),
   
   unmarshallHeaderToolbox: function() {
      var headerDefinition = XmlResource.selectNode( this.options.headerSelector, this.definitionElement );
      if( headerDefinition ){
         this.header = new DesktopPanelHeader( headerDefinition, { onHeaderConstructed : this.onHeaderConstructed } );
         this.header.unmarshall();
      }
   }.protect(),
   
   unmarshallPanelHeader: function(){
      var headerConfigurationElement = XmlResource.selectNode( this.options.headerSelector, this.definitionElement );
      if( headerConfigurationElement ){
          this.header = new DesktopPanelHeader( headerConfigurationElement, { onHeaderConstructed : this.onHeaderConstructed });
          this.header.unmarshall();
      }
   }.protect(),
   
   unmarshallPanelProperties: function(){
      this.columnReference = XmlResource.determineAttributeValue( this.definitionElement, this.options.columnReferenceSelector );
      this.contentUrl = XmlResource.selectNodeText( this.options.contentUrlSelector, this.definitionElement );
      this.height = parseInt( XmlResource.determineAttributeValue( this.definitionElement, this.options.heightSelector ));
      this.name = XmlResource.determineAttributeValue( this.definitionElement, this.options.nameSelector );
      this.showHeader = parseBoolean( XmlResource.determineAttributeValue( this.definitionElement, this.options.showHeaderSelector ));
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.definitionElement );
      if( this.resourceBundle ) this.title = this.resourceBundle.getText( this.title );
   }.protect(),
  
   unmarshallPlugin: function(){
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DesktopPlugin( pluginDefinition, { onLoaded : this.onPluginLoaded } );
         this.plugin.unmarshall();
      }
   }.protect()
});

DesktopPanel.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };