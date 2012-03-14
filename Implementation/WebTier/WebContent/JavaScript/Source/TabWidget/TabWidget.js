/*
 * ProcessPuzzle User Interface Backend agnostic, desktop like configurable,
 * browser font-end based on MochaUI. Copyright (C) 2011 Joe Kueser, Zsolt
 * Zsuffa
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

//= require_directory ../FundamentalTypes
//= require ../BrowserWidget/BrowserWidget.js

var TabWidget = new Class( {
   Extends : BrowserWidget,
   Binds : ['onClose', 'onTabSelected'],

   options : {
      TAB_LIST_STYLE : "Tabs",
      TAB_WIDGET_STYLE : "TabWidgetWrapper",
      BUTTONCLASSNAME : "Buttons",
      backgroundImage : "Images/bg.gif",
      buttonPrefix : "button_",
      closeButtonCaptionKey : "TabWidget.Close",
      componentName : "TabWidget",
      idDefault : "TabWidget",
      idSelector : "/pp:tabWidgetDefinition/tabWidget/@tabWidgetId",
      printButtonCaptionKey : "TabWidget.Print",
      selectedTabClassDefault : "selectedTab",
      selectedTabClassSelector : "/pp:tabWidgetDefinition/tabWidget/@selectedTabClass",
      showCloseButtonDefault : false,
      showCloseButtonSelector : "/pp:tabWidgetDefinition/tabWidget/@showCloseButton",
      showPrintButtonDefault : false,
      showPrintButtonSelector : "/pp:tabWidgetDefinition/tabWidget/@showPrintButton",
      tabCaptionSelector : "@caption",
      tabDefinitionSelector : "/pp:tabWidgetDefinition/tabWidget/tab",
      tabIdSelector : "@tabId",
      tabIsDefaultSelector : "@isDefault",
      tabLeftImage : "Images/DocumentTab-Left.gif",
      tabRightImage : "Images/DocumentTab-Right.gif",
      tabLeftOnImage : "Images/DocumentTab-Left-Selected.gif",
      tabRightOnImage : "Images/DocumentTab-Right-Selected.gif",
      tabsSelector : "tab",
      widgetContainerId : "TabWidget",
      widgetDefinitionSelector : "/pp:tabWidgetDefinition/tabWidget",
      widgetDefinitionURI : "TabsDefinition.xml"},

   // Constructor
   initialize : function( options, resourceBundle ) {
      this.setOptions( options );
      this.parent( options, resourceBundle );

      // Private instance variables
      this.activeTab = null;
      this.buttonsListElement;
      this.id;
      this.isVisible = false;
      this.selectedTabClass;
      this.showCloseButton;
      this.showPrintButton;
      this.tabListElement;
      this.tabs = new LinkedHashMap();
      this.tabsWrapperElement;
   },

   // Public accessor and mutator methods
   activateTab : function( tabName ) {
      if( this.activeTab != null ) this.activeTab.deActivate();
      
      var tabToActivate = this.tabs.get( tabName ); 
      tabToActivate.activate();
      this.activeTab = tabToActivate;
      this.storeComponentState();
      this.notifySubscribers();
   },

   addTab : function( id, caption, doNotActivate ) {
      if( this.state <= BrowserWidget.States.INITIALIZED ) throw new UnconfiguredWidgetException();
      if( this.tabs.get( id ) != null ) throw new DuplicatedTabException({ tabName : id });

      var newTab = new Tab( null, this.i18Resource, { id : id, caption : caption, onTabSelected : this.onTabSelected });
      this.tabs.put( newTab.getId(), newTab );
      if( this.state == BrowserWidget.States.CONSTRUCTED ) newTab.construct( this.tabListElement );

      if( doNotActivate == null || (doNotActivate != null && doNotActivate == false) )
         this.activateTab( id );
   },

   changeCaptions : function( controller ) {
      tabs.moveFirst();
      var aTab;
      while( aTab = tabs.getNext() ){
         if( aTab.changeCaption != null )
            aTab.changeCaption( controller );
      }
   },

   construct : function() {
      if( this.isVisible ) return;
      this.createHtmlElements();
      this.constructTabs();
      this.constructButtons();
      this.isVisible = true;
      this.parent();
      this.activateDefaultTab();
   },

   destroy : function() {
      if( this.tabListElement ){
         this.tabs.each( function( entry, index ) {
            entry.getValue().destroy();
         }, this );
         if( this.tabListElement.destroy ){
            this.tabListElement.removeEvents();
            this.tabListElement.destroy();
         }else this.tabListElement.removeNode();
      }
      
      if( this.tabsWrapperElement && this.tabsWrapperElement.destroy ) this.tabsWrapperElement.destroy();

      if( this.buttonsListElement ){
         if( this.buttonsListElement.destroy ){
            this.buttonsListElement.removeEvents();
            this.buttonsListElement.destroy();
         }else this.buttonsListElement.removeNode();
      }

      this.parent();
   },

   moveFirstToLast : function() {
      var tabList = null;
      if( htmlDivElement != null ){
         var tabLists = htmlDivElement.getElementsByTagName( "ul" );
         for( var i = 0; i < tabLists.length; i++ )
            if( tabLists[i].className == TAB_LIST_STYLE )
               tabList = tabLists[i];
      }
      if( tabList == null )
         return;
      var firstChild = tabList.firstChild;
      if( firstChild != null )
         tabList.appendChild( firstChild );
   },

   moveLastToFirst : function() {
      var tabList = null;
      if( htmlDivElement != null ){
         var tabLists = htmlDivElement.getElementsByTagName( "ul" );
         for( var i = 0; i < tabLists.length; i++ )
            if( tabLists[i].className == TAB_LIST_STYLE )
               tabList = tabLists[i];
      }
      if( tabList == null )
         return;
      var firstChild = tabList.firstChild;
      if( firstChild != null ){
         var lastChild = tabList.lastChild;
         if( firstChild != lastChild )
            tabList.insertBefore( lastChild, firstChild );
      }
   },

   onClose : function() {
      if( this.activeTab ){
         this.removeTab( this.activeTab.getId() );
      }
   },

   onPrint : function() {
   },

   onTabSelected : function( selectedTab ) {
      if( !selectedTab.getId().equals( this.activeTab.getId() ) ){
         this.activateTab( selectedTab.getId() );
      }
   },

   removeAllTabs : function() {
      this.tabs.each( function( entry, index ) {
         var tab = entry.getValue();
         tab.destroy();
      }, this );

      this.tabs.clear();
      this.activeTab = null;
   },

   removeTab : function( tabId ) {
      if( this.state <= BrowserWidget.States.INITIALIZED ) throw new UnconfiguredWidgetException();
      
      var nextTab = this.tabs.next( this.activeTab.getId() );
      var previousTab = this.tabs.previous( this.activeTab.getId() );

      if( nextTab != null && !nextTab.getId().equals( tabId )) this.activateTab( nextTab.getId() );
      else if( previousTab != null && !previousTab.getId().equals( tabId )) this.activateTab( previousTab.getId() );

      this.tabs.get( tabId ).destroy();
      this.tabs.remove( tabId );
      if( this.tabs.size() == 0 ) this.activeTab = null;
   },

   unmarshall: function(){
      this.unmarshallProperties();
      this.unmarshallTabs();
      this.parent();
   },

   // Properties
   activeTabId : function() { return(tabs.getCountOfObjects() > 0 ? activeTab.getId() : "undefined"); },
   getActiveTab : function() { return this.activeTab; },
   getCloseButtonId : function() { return this.options.buttonPrefix + this.options.closeButtonCaptionKey; },
   getId : function() { return this.id; },
   getPrintButtonId : function() { return this.options.buttonPrefix + this.options.printButtonCaptionKey; },
   getSelectedTabClass : function() { return this.selectedTabClass; },
   getShowCloseButton : function() { return this.showCloseButton; },
   getShowPrintButton : function() { return this.showPrintButton; },
   getTabById : function( tabId ) { return this.tabs.get( tabId ); },
   getTabCount : function() { return this.tabs.size(); },
   getTabExist : function( tabId ) { return tabs.exists( tabId ); },
   getTabs : function() { return this.tabs; },
   isCloseButtonVisible : function() { return this.showCloseButton; },
   isPrintButtonVisible : function() { return this.showPrintButton; },
   setCloseButtonVisibility : function( value ) { this.options.showCloseButton = value; },
   setPrintButtonVisibility : function( value ) { this.options.showPrintButton = value; },
   setBackgroundImage : function( image ) { backgroundImage = (image == null ? backgroundImage : image); },
   setTabLefImage : function( image ) { tabLeftImage = (image == null ? tabLeftImage : image); },
   setTabRightImage : function( image ) { tabRightImage = (image == null ? tabRightImage : image); },
   setTabLeftOnImage : function( image ) { tabLeftOnImage = (image == null ? tabLeftOnImage : image); },
   setTabRightOnImage : function( image ) { tabRightOnImage = (image == null ? tabRightOnImage : image); },

   // Private methods
   activateDefaultTab : function(){
      if( this.activeTab ) this.activateTab( this.activeTab.getId() );
      else this.activateTab( this.tabs.get( this.tabs.firstKey() ).getId() );
   }.protect(),

   compileStateSpecification : function(){
      this.stateSpecification = { currentTabId : this.activeTab.getId() };
   }.protect(),
   
   constructButtons : function() {
      if( this.showCloseButton || this.showPrintButton ){
         this.buttonsListElement = this.elementFactory.create( 'ul', null, null, null, { 'class' : this.options.BUTTONCLASSNAME } );
         if( this.showCloseButton ) this.createButton( this.options.closeButtonCaptionKey, this.onClose );
         if( this.showPrintButton ) this.createButton( this.options.printButtonCaptionKey, this.onPrint );
      }
   }.protect(),

   constructTabs : function() {
      this.tabs.each( function( tabEntry, index ) {
         var tab = tabEntry.getValue();
         tab.construct( this.tabListElement );
      }, this );
   }.protect(),

   createButton : function( caption, onClickHandler ) {
      var listItem = this.elementFactory.create( 'li', null, this.buttonsListElement, WidgetElementFactory.Positions.LastChild );
      var anchorProperties = { href : "#", id : this.options.buttonPrefix + caption };
      this.elementFactory.createAnchor( caption.replace( / /g, String.fromCharCode( 160 ) ), null, onClickHandler, listItem, WidgetElementFactory.Positions.LastChild, anchorProperties );
   }.protect(),

   createHtmlElements : function() {
      this.tabsWrapperElement = this.elementFactory.create( 'div', null, null, null, { 'class' : this.options.TAB_WIDGET_STYLE } );
      this.tabListElement = this.elementFactory.create( 'ul', null, this.tabsWrapperElement, null, { 'class' : this.options.TAB_LIST_STYLE } );
   }.protect(),

   hideButtons : function() {
      if( htmlDivElement != null ){
         var tabLists = htmlDivElement.getElementsByTagName( "ul" );
         for( var i = 0; i < tabLists.length; i++ ){
            if( tabLists[i].className == BUTTONCLASSNAME ){
               var tabList = tabLists[i];
               htmlDivElement.removeChild( tabList ); // removes the list to
                                                      // 'tab' division
            }
         }
      }else
         throw new UserException( "Division not defined", "TabWidget._RemoveUnorderedListTag()" );
   }.protect(),
   
   notifySubscribers : function(){
      var argumentText = this.activeTab.getMessageProperties();
      var arguments = argumentText != null ? eval( "(" + argumentText + ")" ) : {};
      arguments['originator'] = this.options.componentName;
      arguments['tabId'] = this.activeTab.getId();
      
      var tabSelectedMessage = new TabSelectedMessage( arguments );
      this.messageBus.notifySubscribers( tabSelectedMessage );
      
   }.protect(),

   parseStateSpecification: function(){
      if( this.stateSpecification ){
         this.currentItemId = this.stateSpecification['currentTabId'];
      }
   }.protect(),
   
   removeUnorderedListTag : function() {
      if( htmlDivElement != null ){
         var tabLists = htmlDivElement.getElementsByTagName( "ul" );
         for( var i = 0; i < tabLists.length; i++ ){
            if( tabLists[i].className == this.options.TAB_LIST_STYLE ){
               var tabList = tabLists[i];
               htmlDivElement.removeChild( tabList ); // removes the list to
                                                      // 'tab' division
            }
         }
      }else
         throw new UserException( "Division not defined", "TabWidget._RemoveUnorderedListTag()" );
   }.protect(),
   
   saveComponentState : function( delimiter ) {
      var save = "";
      if( this.activeTab != null )
         save = save + delimiter + this.activeTab.caption;
      else
         save = save + delimiter + "null";
      for( var i = 1; i <= this.tabs.getCountOfObjects(); i++ ){
         var atab = this.tabs.getItemByIndex( i - 1 );
         save = save + delimiter + atab.caption + delimiter + atab.state + delimiter + atab.id;
      }
      return save;
   }.protect(),
   
   unmarshallProperties: function(){
      this.id = this.definitionXml.selectNodeText( this.options.idSelector, null, this.options.idDefault );
      this.selectedTabClass = this.definitionXml.selectNodeText( this.options.selectedTabClassSelector, null, this.options.selectedTabClassDefault );
      this.showCloseButton = parseBoolean( this.definitionXml.selectNodeText( this.options.showCloseButtonSelector, null, this.options.showCloseButtonDefault ));
      this.showPrintButton = parseBoolean( this.definitionXml.selectNodeText( this.options.showCloseButtonSelector, null, this.options.showCloseButtonDefault ));
   }.protect(),

   unmarshallTabs : function() {
      var tabDefinitions = this.definitionXml.selectNodes( this.options.tabDefinitionSelector );
      tabDefinitions.each( function( tabDefinition, index ){
         var newTab = new Tab( tabDefinition, this.i18Resource, { onTabSelected : this.onTabSelected });
         newTab.unmarshall();
         this.tabs.put( newTab.getId(), newTab );
         if( newTab.isDefault() ) this.activeTab = newTab;
      }, this );
   }.protect(),

});