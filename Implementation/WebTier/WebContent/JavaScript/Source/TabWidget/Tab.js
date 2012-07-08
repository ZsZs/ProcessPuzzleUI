/*
 * ProcessPuzzle User Interface Backend agnostic, desktop like configurable,
 * browser font-end based on MochaUI. Copyright (C) 2012 Zsolt Zsuffa
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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var Tab = new Class( {
   Implements : [Events, Options],
   Binds : ['onSelection'],

   options : {
      caption : null,
      captionSelector : "@caption",
      componentName : "Tab",
      currentTabId : "current",
      id : null,
      idPrefix : "tab_",
      idSelector : "@tabId",
      isDefaultSelector : "@isDefault",
      messagePropertiesSelector : "messageProperties",
      tabsStyle : "Tabs"},

   // Constructor
   initialize : function( definition, internationalization, options ) {
      // check parameter assertions
      assertThat( internationalization, not( nil() ));

      this.setOptions( options );

      // private instance variables
      this.active = false;
      this.anchorElement;
      this.caption = this.options.caption ? internationalization.getText( this.options.caption ) : null;
      this.defaultTab;
      this.definitionElement = definition;
      this.id = this.options.id;
      this.internationalization = internationalization;
      this.listItemElement;
      this.logger = Class.getInstanceOf( WebUILogger );
      this.messageProperties;
      this.visible = false;
   },

   // public mutators methods
   activate : function() {
      if( this.isVisible() ){
         this.active = true;
         this.setListItemId( this.options.currentTabId );
      }
   },

   changeCaption : function( controller ) {
      this.caption = controller.getText( this.id );
      if( this.anchorElement != null && this.anchorText != null ){
         this.anchorElement.removeChild( this.anchorText );
         var nb_caption = caption.replace( / /g, String.fromCharCode( 160 ) );
         this.anchorText = document.createTextNode( nb_caption );
         this.anchorElement.appendChild( this.anchorText );
      }
   },

   construct : function( parentElement ) {
      assertThat( parentElement, not( nil() ));
      this.createHtmlElements( parentElement );
      this.visible = true;
   },

   deActivate : function() {
      if( this.isVisible() ){
         this.active = false;
         this.setListItemId( "" );
      }
   },

   destroy : function() {
      if( this.isVisible() ) this.removeLIElement();
      this.visible = false;
      this.active = false;
   },

   equals : function( otherTab ) {
      if( !instanceOf( otherTab, Tab ) ) return false;
      return this.id.equals( otherTab.id );
   },

   onSelection : function() {
      this.activate();
      this.fireEvent( 'tabSelected', this );
   },

   unmarshall : function() {
      this.unmarshallProperties();
   },

   // Properties
   getCaption : function() { return this.caption; },
   getId : function() { return this.id; },
   getMessageProperties: function() { return this.messageProperties; },
   isActive : function() { return this.active; },
   isDefault : function() { return this.defaultTab; },
   isVisible : function() { return this.visible; },

   // private helper methods
   createHtmlElements : function( parentElement ) {
      var nb_caption = this.caption.replace( / /g, String.fromCharCode( 160 ) );
      this.anchorElement = new Element( 'a', { 'id' : this.id, 'href' : '#', events : { click : this.onSelection }});
      this.anchorElement.appendText( nb_caption );

      this.listItemElement = new Element( 'li' );
      this.listItemElement.appendChild( this.anchorElement );

      parentElement.grab( this.listItemElement, 'bottom' );
      this.logger.trace( this.options.componentName + ".createHtmlElements added a 'LI' element to represent tab: " + this.id );
   }.protect(),

   removeLIElement : function() {
      if( this.listItemElement != null ){
         if( this.anchorElement.destroy ){
            this.anchorElement.removeEvents();
            this.anchorElement.destroy();
         }else this.anchorElement.removeNode();
         
         this.anchorElement = null;

         if( this.listItemElement.destroy ) this.listItemElement.destroy();
         else this.listItemElement.removeNode();
         this.listItemElement = null;
      }else throw new UnconfiguredWidgetException({ message : "Can't remove tab's parent LI element.", source : "Tab.removeLIElement" });
   }.protect(),

   setListItemId : function( listItemId ) {
      if( this.listItemElement != null ){
         this.listItemElement.set( 'id',  listItemId );
      }else
         throw new UnconfiguredWidgetException( { message : "Can't set undefined LI element's id.", source : "Tab.setListItemId" });
   }.protect(),

   unmarshallProperties : function() {
      this.id = this.options.idPrefix + XmlResource.selectNodeText( this.options.idSelector, this.definitionElement );
      this.caption = this.internationalization.getText( XmlResource.selectNodeText( this.options.captionSelector, this.definitionElement ));
      this.defaultTab = parseBoolean( XmlResource.selectNodeText( this.options.isDefaultSelector, this.definitionElement, null, false ) );
      this.messageProperties = XmlResource.selectNodeText( this.options.messagePropertiesSelector, this.definitionElement );
   }.protect()} );