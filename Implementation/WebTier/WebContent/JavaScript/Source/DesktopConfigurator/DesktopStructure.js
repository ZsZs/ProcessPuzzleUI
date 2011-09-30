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

var DesktopStructure = new Class({
	Implements : [Options], 
	options : {
		desktopColumnIdSelector : 'name',
		desktopColumnMaximumWidthSelector : 'maximumWidth',
		desktopColumnMinimumWidthSelector : 'minimumWidth',
		desktopColumnPlacementSelector : 'placement',
		desktopColumnWidthSelector : 'width',
		desktopColumnsSelector : '/pp:desktopConfiguration/columns/column',
		desktopElementId : 'desktop',
		desktopPanelColumnSelector : 'columnReference',
		desktopPanelContentUrlSelector : 'contentURL/text()',
		desktopPanelHeightSelector : 'height',
		desktopPanelIdSelector : 'name',
		desktopPanelRequireSelector : 'require/text()',
		desktopPanelsSelector : '/pp:desktopConfiguration/panels/panel',
		desktopPanelTitleSelector : 'title/text()',
		dockerAutoHideId : 'dockAutoHide',
		dockerClearId : 'dockClear',
		dockerClearClass : 'clear',
		dockerControlsId : 'dock',
		dockerPlacementId : 'dockPlacement',
		dockerSelector : '/pp:desktopConfiguration/windowDocker',
		dockerSortId : 'dockSort',
		dockerWrapperId : 'dockWrapper',
		documentContainerId : 'pageWrapper',
		elementsSelector : 'elements/element',
		footerBarSelector : '/pp:desktopConfiguration/footer/footerBar',
		footerBarElementId : 'desktopFooter',
		footerElementId : 'desktopFooterWrapper',
		footerSelector : '/pp:desktopConfiguration/footer',
		headerElementId : 'desktopHeader',
		headerSelector : '/pp:desktopConfiguration/header',
		navigationBarSelector : '/pp:desktopConfiguration/header/navigationBar',
		navigationBarElementId : 'desktopNavbar',
		idAttributeSelector : '@name',
		styleSheetElementsSelector : 'pp:desktopConfiguration/resources/styleSheets/styleSheet',
		tagAttributeSelector : '@tag',
		titleBarSelector : '/pp:desktopConfiguration/header/titleBar',
		titleBarWrapperId : 'desktopTitlebarWrapper'
	},
	
	//Constructor
	initialize : function( options, configurationXml ) {
		this.setOptions( options );

	//Private instance variables
		this.configurationXml = configurationXml;
		this.desktopColumns = new ArrayList();
		this.desktopElement = $( this.options.desktopElementId );
		this.desktopPanels = new ArrayList();
		this.desktopWindows = new ArrayList();
		this.documentContainerElement = null;
		this.footerBarElement = null;
		this.footerElement = null;
		this.headerElement = null;
		this.navigationBarElement = null;
		this.titleBarElement = null;
		this.titleBarWrapperElement = null;
	},
	
	//Public accessor and mutator methods
	addDesktopColumn : function( desktopColumn ) {
		this.desktopColumns.add( desktopColumn );
	},
	
	determineDesktopElementId : function() {
		return this.desktopElement != null ? this.desktopElement.get( 'id' ) : this.options.desktopElementId;
	},
	
	determineHeaderElementId : function() {
		return this.headerElement != null ? this.headerElement.get( 'id' ) : this.options.headerElementId;
	},
	
	determineFooterElementId : function() {
		return this.footerElement != null ? this.footerElement.get( 'id' ) : this.options.footerElementId;
	},
	
	determineNavigationBarElementId : function() {
		return this.navigationBarElement != null ? this.navigationBarElement.get( 'id' ) : this.options.navigationBarElementId;
	},
	
	determineDocumentContainerElementId : function() {
		return this.documentContainerElement != null ? this.documentContainerElement.get( 'id' ) : this.options.documentContainerElementId;
	},
	
	determineFooterBarElementId : function() {
		return this.footerBarElement != null ? this.footerBarElement.get( 'id' ) : this.options.footerBarElementId;
	},
	
	//Properties
	getDesktopColumnIdSelector : function() { return this.options.desktopColumnIdSelector; },
	getDesktopColumnMaximumWidthSelector : function() { return this.options.desktopColumnMaximumWidthSelector; },
	getDesktopColumnMinimumWidthSelector : function() { return this.options.desktopColumnMinimumWidthSelector; },
	getDesktopColumnPlacementSelector : function() { return this.options.desktopColumnPlacementSelector; },
	getDesktopColumnWidthSelector : function() { return this.options.desktopColumnWidthSelector; },
	getDesktopColumns : function() { return this.desktopColumns; },
	getDesktopColumnsSelector : function() { return this.options.desktopColumnsSelector; },
	getDesktopElement : function() { return this.desktopElement; },
	getDesktopPanelContentUrlSelector : function() { return this.options.desktopPanelContentUrlSelector; },
	getDesktopPanelColumnSelector : function() { return this.options.desktopPanelColumnSelector; },
	getDesktopPanelHeightSelector : function() { return this.options.desktopPanelHeightSelector; },
	getDesktopPanelIdSelector : function() { return this.options.desktopPanelIdSelector; },
	getDesktopPanelRequireSelector : function() { return this.options.desktopPanelRequireSelector; },
	getDesktopPanels : function() { return this.desktopPanels; },
	getDesktopPanelsSelector : function() { return this.options.desktopPanelsSelector; },
	getDesktopPanelTitleSelector : function() { return this.options.desktopPanelTitleSelector; },
	getDesktopWindows : function() { return this.desktopWindows; },
	getDocumentContainerElement : function() { return this.documentContainerElement; },
	getDocumentContainerId : function() { return this.options.documentContainerId; },
	getElementsSelector : function() { return this.options.elementsSelector; },
	getFooterBarElement : function() { return this.footerBarElement; },
	getFooterBarSelector : function() { return this.options.footerBarSelector; },
	getFooterElement : function() { return this.footerElement; },
	getFooterSelector : function() { return this.options.footerSelector; },
	getHeaderElement : function() { return this.headerElement; },
	getHeaderSelector : function() { return this.options.headerSelector; },
	getIdAttributeSelector : function() { return this.options.idAttributeSelector; },
	getNavigationBarElement : function() { return this.navigationBarElement; },
	getNavigationBarSelector : function() { return this.options.navigationBarSelector; },
	getStyleSheetByIndex : function( styleSheetIndex ) {
	   var styleSheetElement = this.getStyleSheetElementByIndex( styleSheetIndex );
	   return this.configurationXml.selectNode( "text()", styleSheetElement ).nodeValue; 
	},
   getStyleSheetElementByIndex : function( styleSheetIndex ) { return this.getStyleSheetElements()[styleSheetIndex]; },
	getStyleSheetElements : function() { return this.configurationXml.selectNodes( this.options.styleSheetElementsSelector ); },
	getTagAttributeSelector : function() { return this.options.tagAttributeSelector; },
	getTitleBarElement : function() { return this.titleBarElement; },
	getTitleBarSelector : function() { return this.options.titleBarSelector; },
	getTitleBarWrapperElement : function() { return this.titleBarWrapperElement; },
	getTitleBarWrapperId : function() { return this.options.titleBarWrapperId; },
	getWindowDockerAutoHideId : function() { return this.options.dockerAutoHideId; },
	getWindowDockerClearId : function() { return this.options.dockerClearId; },
	getWindowDockerClearClass : function() { return this.options.dockerClearClass; },
	getWindowDockerControlsId : function() { return this.options.dockerControlsId; },
	getWindowDockerId : function() { return this.options.dockerWrapperId; },
	getWindowDockerPlacementId : function() { return this.options.dockerPlacementId; },
	getWindowDockerSelector : function() { return this.options.dockerSelector; },
	getWindowDockerSortId : function() { return this.options.dockerSortId; },
	
	setDesktopElement : function( desktopElement ) { this.desktopElement = desktopElement; },
	setDocumentContainerElement : function( documentContainerElement ) { this.documentContainerElement = documentContainerElement; },
	setFooterBarElement : function( footerBarElement ) { this.footerBarElement = footerBarElement; },
	setFooterElement : function( footerElement ) { this.footerElement = footerElement; },
	setHeaderElement : function( headerElement ) { this.headerElement = headerElement; },
	setNavigationBarElement : function( navigationBarElement ) { this.navigationBarElement = navigationBarElement; },
	setTitleBarElement : function( titleBarElement ) { this.titleBarElement = titleBarElement; },
	setTitleBarWrapperElement : function( titleBarWrapperElement ) { this.titleBarWrapperElement = titleBarWrapperElement; }
	
	//Private methods
});