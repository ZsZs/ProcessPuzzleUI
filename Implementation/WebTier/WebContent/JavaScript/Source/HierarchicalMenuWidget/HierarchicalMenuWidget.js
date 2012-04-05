/*
Name: 
    - HierarchicalMenuWidget

Description: 
    - Represents a tree of items in selectable menus. Depending on the associated CSS it can be a drop-down menu, two or more synchronized menus.

Requires:
    - BrowserWidget
    
Provides:
    - HierarchicalMenuWidget

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

//= require_directory ../FundamentalTypes
//= require ../BrowserWidget/BrowserWidget.js

var HierarchicalMenuWidget = new Class({
   Extends : BrowserWidget,
   Binds : ['constructMenuItems', 'destroyMenuItems', 'determineCurrentItemId', 'fireCurrentSelection', 'onDefaultItem', 'onSelection'],
   
   options : {
      componentName : "HierarchicalMenuWidget",
      contextItemId : "",
      idPathSeparator : "/",
      fireDefaultItem : true,
      menuItemOptions : {},
      menuStyle : "menuWidget",
      rootMenuSelector : "//pp:menuWidgetDefinition/menuItem[1]",
      selectedItemStyle : 'selectedMenuItem',
      showSubItems : false,
      widgetContainerId : "HierarchicalMenuWidget"
   },
   
   //Constructor
   initialize : function( options, resourceBundle ){
      this.parent( options, resourceBundle );

      this.currentItemId;
      this.defaultItem;
      this.rootMenu;
      this.selectedItem;
      this.ulElement;      
      
      this.instantiateMenuItemFactory();
   },
   
   //Public accessor and mutator methods
   construct : function() {
      this.parent();
   },
   
   destroy : function() {      
      this.parent();
   },
   
   findItemById: function( itemFullId ){
      if(( itemFullId == null ) || ( this.state != BrowserWidget.States.UNMARSHALLED && this.state != BrowserWidget.States.CONSTRUCTED )) return null;
      return this.rootMenu.findItemById( itemFullId );
   },
   
   onDefaultItem: function( menuItem ){
      if( this.isDirectChildOfContextItem( menuItem ) || this.isDirectChildOfPreviousDefault( this.defaultItem, menuItem )) 
         this.defaultItem = menuItem;
   },
   
   onSelection: function( menuItem ){
      if( this.selectedItem != menuItem ){
         this.deselectCurrentItem();
         this.selectedItem = menuItem;
      }
      
      this.storeComponentState();
      this.messageBus.notifySubscribers( this.createMessage( menuItem ));      
   },
   
   unmarshall: function(){
      this.parent();
      this.unmarshallMenu();
   },
   
   webUIMessageHandler: function( webUIMessage ){
      this.parent( webUIMessage );
      if( instanceOf( webUIMessage, MenuSelectedMessage )){
         if( webUIMessage.getActionType() == 'loadMenu' ){
            this.destroy();
            this.givenOptions.contextItemId = webUIMessage.getContextItemId();
            this.unmarshall();
            this.construct();
         }
      }
   },
   
   //Properties
   getContextItemId : function() { return this.options.contextItemId; },
   getCurrentItemId : function() { return this.currentItemId; },
   getRootMenu : function() { return this.rootMenu; },
   getSelectedItemClass : function() { return this.options.selectedItemStyle; },
   
   //Private helper methods
   compileConstructionChain: function(){
      this.constructionChain.chain( this.constructMenuItems, this.fireCurrentSelection, this.finalizeConstruction );
   }.protect(),
   
   compileDestructionChain: function(){
      this.destructionChain.chain( this.destroyMenuItems, this.destroyChildHtmlElements, this.finalizeDestruction );
   }.protect(),
   
   compileStateSpecification : function(){
      this.stateSpecification = { currentItemId : this.selectedItem.getFullId(), contextItemId : this.options.contextItemId };
   }.protect(),
   
   constructMenuItems: function(){
      this.rootMenu.construct( this.containerElement );
      this.constructionChain.callChain();
   }.protect(),
   
   createMessage : function( menuItem ){
      var messageProperties = menuItem.getMessageProperties();
      messageProperties['originator'] = this.options.componentName;
      return new MenuSelectedMessage( messageProperties );
   }.protect(),
   
   deselectCurrentItem : function(){
      if( this.selectedItem ){
         this.selectedItem.removeClassFromListItem();
      }
   }.protect(),
   
   destroyMenuItems : function(){
      this.rootMenu.destroy();
      this.rootMenu = null;
      this.currentItemId = null;
      this.defaultItemId = null;
      this.destructionChain.callChain();
   }.protect(),
   
   determineCurrentItemId : function(){
      if( !this.currentItemId ) this.currentItemId = this.defaultItemId;
      this.constructionChain.callChain();
   }.protect(),
   
   determineParentDefinitionElement: function(){
      var selectorExpression = this.options.parentItemSelector.substitute({ menuItemId : this.options.contextItemId });
      return this.definitionXml.selectNode( selectorExpression );
   }.protect(),
   
   fireCurrentSelection: function(){
      var currentItem = this.findItemById( this.currentItemId );
      if( currentItem == null || ( currentItem != null && currentItem.getState() != BrowserWidget.States.CONSTRUCTED )){
         this.currentItemId = this.defaultItem.getFullId();
      }
      
      var itemToSelect = this.findItemById( this.currentItemId );
      itemToSelect.addClassToListItem();
      if( this.options.fireDefaultItem ) this.onSelection( itemToSelect );
      else this.selectedItem = itemToSelect;

      this.constructionChain.callChain();
   }.protect(),
   
   instantiateMenuItemFactory : function(){
      MenuItemFactory.singleInstance = new  MenuItemFactory({});
   }.protect(),
   
   isDirectChildOfContextItem: function( subjectItem ){
      return this.options.contextItemId != "" && ( this.options.contextItemId + this.options.idPathSeparator + subjectItem.getId() ) == subjectItem.getFullId();
   }.protect(),
   
   isDirectChildOfPreviousDefault: function( givenItem, subjectItem ){
      return givenItem == null || ( givenItem.getFullId() + this.options.idPathSeparator + subjectItem.getId() ) == subjectItem.getFullId();
   }.protect(),
   
   parseStateSpecification: function(){
      if( this.stateSpecification ){
         this.currentItemId = this.stateSpecification['currentItemId'];
         this.options.contextItemId = this.stateSpecification['contextItemId'];
      }
   }.protect(),
   
   standardizeContextItemId: function(){
      if( this.options.contextItemId != "" && this.options.contextItemId.charAt( 0 ) != this.options.idPathSeparator ){
         this.options.contextItemId = this.options.idPathSeparator + this.options.contextItemId; 
      }
   }.protect(),
   
   unmarshallMenu: function(){
      var rootMenuElement = this.dataXml.selectNode( this.options.rootMenuSelector );
      this.standardizeContextItemId();
      if( rootMenuElement ){
         this.rootMenu = new RootMenu( rootMenuElement, this.elementFactory, {
            contextItemId : this.options.contextItemId,
            idPathSeparator : this.options.idPathSeparator,
            menuStyle : this.options.menuStyle,
            onDefaultItem : this.onDefaultItem,
            onSelection : this.onSelection,
            selectedItemStyle : this.options.selectedItemStyle, 
            showSubItems : this.options.showSubItems 
         });
         this.rootMenu.unmarshall();
      }      
   }.protect(),
   
   unmarshallProperties: function(){
      this.parent();
   }.protect()
});
