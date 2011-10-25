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

var DesktopPanelHeader = new Class({
   Implements: [Events, Options],
   Binds: ['construct', 'onPluginConstructed'],   
   
   options: {
      headerSelector : "panelHeader",
      pluginSelector : "plugin",
      toolboxContent : "../Desktop/EmptyToolboxContent.html",
      toolboxSelector : "toolBox",
      toolBoxUrlSelector : "@toolBoxUrl",
      type : "DesktopPanel"
   },
   
   //Constructor
   initialize: function( definitionElement, options ){
      this.setOptions( options );
      this.definitionElement = definitionElement;
      this.state = DesktopPanelHeader.States.INITIALIZED;
      this.toolBox = null;
      this.toolBoxOnLoad = null;
      this.toolBoxUrl = this.options.toolboxContent;
   },
   
   //Public mutators and accessor methods
   construct: function( contextElement, where ){
      if( this.plugin ) this.plugin.construct();
      else this.onPluginConstructed();
   },
   
   destroy: function(){
      
   },
   
   onPluginConstructed : function(){
      this.state = DesktopPanelHeader.States.CONSTRUCTED;      
      this.fireEvent( 'headerConstructed', this );
   },
   
   unmarshall: function(){
      this.toolBoxUrl = XmlResource.selectNodeText( this.options.toolBoxUrlSelector, this.definitionElement );
      if( !this.toolBoxUrl ) this.toolBoxUrl = this.options.toolboxContent;
      var pluginDefinition = XmlResource.selectNode( this.options.pluginSelector, this.definitionElement );
      if( pluginDefinition ){
         this.plugin = new DesktopPlugin( pluginDefinition, { onConstructed : this.onPluginConstructed });
         this.plugin.unmarshall();
      }
      this.state = DesktopPanelHeader.States.UNMARSHALLED;      
   },

   //Properties
   getDefinitionElement: function() { return this.definitionElement; },
   getHeaderToolBox: function() { return this.plugin != null; },
   getPlugin: function() { return this.plugin; },
   getState: function() { return this.state; },
   getToolBoxUrl: function() { return this.toolBoxUrl; }
});

DesktopPanelHeader.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };