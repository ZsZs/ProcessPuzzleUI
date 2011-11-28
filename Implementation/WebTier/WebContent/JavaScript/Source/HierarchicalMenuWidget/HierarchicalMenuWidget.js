//HierarchicalMenuWidget.js
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

var HierarchicalMenuWidget = new Class({
   Extends : BrowserWidget,
   
   options : {
      componentName : "HierarchicalMenuWidget",
      contextItemId : "MenuWidget",
      href : "#",
      listIdSelector : "@menuItemId",
      locale : null,
      menuItemArgumentsSelector : "//menuItem[@menuItemId='{menuItemId}']/messageProperties/text()",
      menuItemCaptionSelector : "@caption",
      menuItemIdSelector : "@menuItemId",
      menuItemIsDefaultSelector : "menuItem[@menuItemId='{menuItemId}']/@isDefault",
      menuItemsSelector : "menuItem",
      parentItemSelector : "//menuItem[@menuItemId='{menuItemId}']",
      showSubItems : false,
      selectedElementClassSelector : "/pp:menuWidgetDefinition/menuWidget/@selectedItemClass",
      resourceBundle : null,
      target : "_self",
      widgetContainerId : "HierarchicalMenuWidget",
      widgetDefinitionURI : "MenuDefinition.xml"
   },
   
   //Constructor
   initialize : function( options, resourceBundle ){
      this.setOptions( options );
      this.parent( options, resourceBundle );
      this.determineInitializationArguments( options, resourceBundle );
      
      this.componentStateManager = new ComponentStateManager();
      this.currentItemId = null;
      this.selectedElementClass = null;
      this.self = this;
      this.ulElement = null;
      
      this.restoreState();
   },
   
   //Public accessor and mutator methods
   changeLanguage : function( locale ){
      this.locale = locale;
      this.destroy();
      this.construct();
   },
   
   construct : function( configurationOptions ) {
      this.updateOptions( configurationOptions );
      this.i18Resource.load( this.locale );
      var parentDefinitionElement = this.determineParentDefinitionElement();
      this.selectedElementClass = this.determineSelectedElementClass();
      this.createMenuElements( parentDefinitionElement, this.containerElement );
      this.currentItemId = this.defaultItemId;
      this.storeComponentState( parentDefinitionElement );
      this.parent();
      this.fireDefaultSelection();
   },
   
   destroy : function() {
      this.parent();
      this.currentItemId = null;
      this.defaultItemId = null;
   },
   
   onSelection : function( anchorElement ) {
      this.currentItemId = anchorElement.getParent().get( 'id' );
      var argumentText = this.determineMenuItemArguments( this.currentItemId );
      var arguments = argumentText != null ? eval( "(" + argumentText + ")" ) : null;
      arguments['originator'] = this.options.widgetContainerId;
      
      this.containerElement.getElements( "LI" ).removeClass( this.selectedElementClass );
      anchorElement.getParent().addClass( this.selectedElementClass );
      
      this.storeComponentState();
      this.messageBus.notifySubscribers( new MenuSelectedMessage( arguments ));
   },
   
   restoreState : function() {
      var stateSpecification = this.componentStateManager.retrieveCurrentState( this.options.componentName ); 
      if( stateSpecification ){
         this.currentItemId = stateSpecification['currentItemId'];
         this.options.contextItemId = stateSpecification['contextItemId'];
      }
   },
   
   webUIMessageHandler: function( webUIMessage ){
      this.parent( webUIMessage );
      if( instanceOf( webUIMessage, MenuSelectedMessage )){
         if( webUIMessage.getActionType() == 'loadMenu' ){
            this.destroy();
            this.construct( { contextItemId : webUIMessage.getContextItemId() } );
         }
      }
   },
   
   //Properties
   getSelectedElementClass : function() { return this.selectedElementClass; },
   
   //Private helper methods
   configureSelectedItem : function( listItemElements, defaultItemId ) {
      if( this.currentItemId && listItemElements.get( this.currentItemId ) ){
         listItemElements.get( this.currentItemId ).addClass( this.selectedElementClass );
      }else {
         listItemElements.get( defaultItemId ).addClass( this.selectedElementClass );
      }
   }.protect(),
   
   createLIElement : function(  parentDefinitionElement, elementId, parentElement ) {
      return this.elementFactory.create( "li", null, parentElement, WidgetElementFactory.Positions.LastChild, { id : elementId } );
   }.protect(),
   
   createLIElements : function( parentDefinitionElement, parentElement ) {
      var listItemElements = new HashMap();
      var defaultItemId = null;
      
      for( var i = 0; i < this.determineMenuItemDefinitions( parentDefinitionElement ).length; i++ ) {
         var menuItemDefinition = this.determineMenuItemDefinition( parentDefinitionElement, i );
         var itemId = this.determineMenuItemId( parentDefinitionElement, i );
         var listItemElement = this.createLIElement(  parentDefinitionElement, itemId, parentElement );
         var caption = this.determineMenuItemCaption( parentDefinitionElement, i );
         var menuWidget = this;
         this.elementFactory.createAnchor( caption, null, function() { menuWidget.onSelection( this ); }, listItemElement, WidgetElementFactory.Positions.LastChild, { href : this.options.href, target : this.options.target } );
         
         listItemElements.put( itemId, listItemElement );
         if( this.determineMenuItemIsDefault(  parentDefinitionElement, itemId )) { 
         	defaultItemId = itemId; 
         }
         
         if( this.options.showSubItems ){
            var subMenuItemDefinition = this.determineMenuItemDefinition( menuItemDefinition, 0 );
        	   if( subMenuItemDefinition != null ){
        	   	this.createMenuElements( menuItemDefinition, listItemElement );
        	   }
         }
      }
      
      this.configureSelectedItem( listItemElements, defaultItemId );
      this.defaultItemId = defaultItemId;
   }.protect(),
   
   createMenuElements : function( parentDefinitionElement, parentElement ){      
      var ULElement = this.createULElement( parentDefinitionElement, parentElement );
      this.createLIElements( parentDefinitionElement, ULElement );
   }.protect(),
   
   createULElement : function( parentDefinitionElement, parentElement ) {
      return this.elementFactory.create( 'ul', null, parentElement, WidgetElementFactory.Positions.LastChild, { id : this.determineListId(  parentDefinitionElement ) } );
   }.protect(),
   
   determineInitializationArguments : function( options ){
      if( !options || !options.widgetDefinitionURI ){
         var webUIController = Class.getInstanceOf( WebUIController );
         this.options.widgetDefinitionURI = webUIController.getWebUIConfiguration().getMenuDefinitionURI();
      }
   }.protect(),
   
   determineListId : function(  parentDefinitionElement ) { return this.definitionXml.selectNode( this.options.listIdSelector,  parentDefinitionElement ).nodeValue; }.protect(),
   determineMenuItemArguments : function( itemId ) { return this.determineMenuItemProperty( this.options.menuItemArgumentsSelector, itemId ); }.protect(),
   determineMenuItemDefinition : function( parentDefinitionElement, index ) { return this.definitionXml.selectNodes( this.options.menuItemsSelector, parentDefinitionElement )[index]; }.protect(),
   determineMenuItemDefinitions : function( parentDefinitionElement ) { return this.definitionXml.selectNodes( this.options.menuItemsSelector, parentDefinitionElement ); }.protect(),
   determineMenuItemCaption : function( parentDefinitionElement, menuItemIndex ){
      var menuItemDefinitions = this.determineMenuItemDefinitions( parentDefinitionElement );
      return this.definitionXml.selectNode( this.options.menuItemCaptionSelector, menuItemDefinitions[menuItemIndex] ).value;
   }.protect(),
   
   determineMenuItemId : function( parentDefinitionElement, menuItemIndex ){
      var menuItemDefinitions = this.determineMenuItemDefinitions( parentDefinitionElement );
      return this.definitionXml.selectNode( this.options.menuItemIdSelector, menuItemDefinitions[menuItemIndex] ).value;
   }.protect(),
   
   determineMenuItemIsDefault : function(  parentDefinitionElement, itemId ) {
      var isDefaultValue = this.determineMenuItemProperty( this.options.menuItemIsDefaultSelector, itemId, parentDefinitionElement );
      if( isDefaultValue ) return parseBoolean( isDefaultValue );
      return false;
   }.protect(),
   
   determineMenuItemProperty : function( selectorTemplate, itemId, parentDefinitionElement ){
      var selectorExpression = selectorTemplate.substitute({ menuItemId : itemId });
      var selectedNode = this.definitionXml.selectNode( selectorExpression, parentDefinitionElement );
      if( selectedNode ) return selectedNode.nodeValue;
      else return null;
   },
   
   determineSelectedElementClass : function() { return this.definitionXml.selectNode( this.options.selectedElementClassSelector ).nodeValue; }.protect(),
   
   determineMenuElementValue : function( selectorExp ) {
      var selectedElement = this.definitionXml.selectNode( selectorExp ); 
      if( selectedElement ) return selectedElement.value;
      else return null;
   }.protect(),
   
   determineParentDefinitionElement: function(){
      var selectorExpression = this.options.parentItemSelector.substitute({ menuItemId : this.options.contextItemId });
      return this.definitionXml.selectNode( selectorExpression );
   }.protect(),
   
   fireDefaultSelection: function(){
      var currentAnchorElement = $( this.currentItemId ).getChildren( 'a' )[0];
      this.onSelection( currentAnchorElement );
   }.protect(),
   
   storeComponentState : function() {
      var stateSpecification = { currentItemId : this.currentItemId, contextItemId : this.options.contextItemId }; 
      this.componentStateManager.storeCurrentState( this.options.componentName, stateSpecification );
   }.protect(),
   
   updateOptions: function( configurationOptions ) {
      if( configurationOptions && configurationOptions['contextItemId'] ) 
         this.options.contextItemId = configurationOptions['contextItemId'];
      else this.restoreState();
   }.protect()
});
