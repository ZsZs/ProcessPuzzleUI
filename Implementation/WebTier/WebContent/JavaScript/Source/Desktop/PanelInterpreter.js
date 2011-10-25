/**
 * PanelDefinition.js
 */

 /**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var PanelInterpreter = new Class({
	Implements : [Options], 
	options : {
		headerSelector : "panelHeader",
		pluginSelector : "plugin",
		toolboxContent : "../Desktop/EmptyToolboxContent.html"
	},
	
	//Constructor
	initialize: function( panelConfiguration, options ){
		this.setOptions( options );
		this.headerToolBox = false;
		this.headerToolBoxOnLoad = null;
		this.headerToolBoxURL = this.options.toolboxContent;
		this.panelConfiguration = panelConfiguration;
		this.headerPlugin = null;
	},

	//Public accessor and mutator methods
	interpret: function(){
		this.interpretPanelHeader();
	},

	//Properties
	getHeaderPlugin : function() { return this.headerPlugin; },
	getHeaderToolBox : function() { return this.headerToolBox; },
	getHeaderToolBoxOnLoad : function() { return this.headerToolBoxOnLoad; },
	getHeaderToolBoxURL : function() { return this.headerToolBoxURL; },
	
	//Protected, private helper methods
	interpretPanelHeader: function(){
		var headerConfigurationElement = XmlResource.selectNode( this.options.headerSelector, this.panelConfiguration );
		if( headerConfigurationElement ){
			this.headerToolBox = true;
			
			this.interpretPlugin( headerConfigurationElement );
			this.headerToolBoxOnLoad = this.headerPlugin['onload'];
		}
	}.protect(),
	
	interpretPlugin: function( parentConfigurationElement ) {
		this.headerPlugin = { css: [], images: [], js: [], onload: null };
		var pluginText =	XmlResource.selectNodeText( this.options.pluginSelector, parentConfigurationElement );
		this.headerPlugin = pluginText != null ? eval( "(" + pluginText + ")" ) : this.headerPlugin;
	}
});