/*
Name: DekstopPanelHeader

Description: Represents the header element of a desktop panel component of a SmartDocument.

Requires:

Provides:
    - DesktopPanelHeader

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

var DesktopPanelHeader = new Class({
   Extends: DesktopElement,
   Binds: ['addContentStyle', 'constructPlugin', 'destroyPlugin', 'onPluginConstructed', 'onPluginConstructionError'],   
   
   options: {
      componentName : "DesktopPanelHeader",
      contentStyleSelector : "@contentStyle",
      contextRootPrefix : "",
      headerSelector : "panelHeader",
      pluginSelector : "plugin",
      toolboxContent : "JavaScript/Source/Desktop/EmptyToolboxContent.html",
      toolboxSelector : "toolBox",
      toolBoxUrlSelector : "@toolBoxUrl",
      type : "DesktopPanel"
   },
   
   //Constructor
   initialize: function( definitionElement, internationalization, options ){
      this.parent( definitionElement, internationalization, options );
      
      this.contentStyle;
      this.plugin;
      this.toolBox = null;
      this.toolBoxOnLoad = null;
      this.toolBoxUrl = this.options.toolboxContent;
   },
   
   //Public mutators and accessor methods
   onPluginConstructed : function(){
      this.constructionChain.callChain();
   },
   
   onPluginConstructionError: function( error ){
      this.revertConstruction( error );
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallPlugin();
      this.parent();
   },

   //Properties
   getContentStyle: function() { return this.contentStyle; },
   getHeaderToolBox: function() { return this.plugin != null; },
   getPlugin: function() { return this.plugin; },
   getToolBoxUrl: function() { return this.toolBoxUrl; },
   
   //Protected, private helper methods
   addContentStyle: function(){
      if( this.contentStyle ){
         this.containerElement.getElementById( this.containerElement.get( 'id' ) + "Content" ).addClass( this.contentStyle );
      }
      this.constructionChain.callChain();
   }.protect(),
   
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructPlugin, this.addContentStyle, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyPlugin, this.resetProperties, this.destroyHtmlElement, this.finalizeDestruction );
   }.protect(),
   
   constructPlugin: function(){
      if( this.plugin ) this.plugin.construct( this.containerElement );
      else this.onPluginConstructed();
   }.protect(),
   
   destroyPlugin: function(){
      if( this.plugin ) this.plugin.destroy();
      this.destructionChain.callChain();
   }.protect(),
   
   unmarshallPlugin: function(){
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DocumentPlugin( pluginDefinition, this.internationalization, { onConstructed : this.onPluginConstructed, onConstructionError : this.onPluginConstructionError });
         this.plugin.unmarshall();
      }
   }.protect(),

   unmarshallProperties: function(){
      this.contentStyle = XmlResource.selectNodeText( this.options.contentStyleSelector, this.definitionElement );
      this.toolBoxUrl = XmlResource.selectNodeText( this.options.toolBoxUrlSelector, this.definitionElement );
      if( !this.toolBoxUrl ) this.toolBoxUrl = this.options.contextRootPrefix + this.options.toolboxContent;
   }.protect(),
});
