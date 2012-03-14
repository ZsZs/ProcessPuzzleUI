/*
Name: RssItem

Description: Represents and RSS 2.0 channel item as JavaScript object 

Requires:

Provides:

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

var RssItem = new Class({
   Implements: Options,

   options: {
      descriptionSelector: "description",
      descriptionStyle : "rssItemDescription",
      globalUniqueIdSelector: "guid",
      linkSelector: "link",
      publicationDateSelector: "pubDate",
      showDescription: true, 
      showTitle: true, 
      titleSelector: "title",
      titleStyle : "rssItemTitle",
      trancatedDescriptionEnding : "...",
      truncatedDescriptionLength : 120,
      truncateDescription : false
   },
   
   //Constructor
   initialize: function ( itemResource, elementFactory, options ) {
      // parameter assertions
      assertThat( itemResource, not( nil() ));      
      this.setOptions( options );
      
      this.containerElement;
      this.description;
      this.elementFactory = elementFactory;
      this.globalUniqueId;
      this.itemResource = itemResource;
      this.link;
      this.publicationDate;
      this.state = BrowserWidget.States.INITIALIZED;
      this.title;
   },
   
   //Public accessor and mutator methods
   construct: function( containerElement ){
      if( this.state == BrowserWidget.States.UNMARSHALLED ){
         this.containerElement = containerElement;
         this.createTitleElement();
         this.createDescriptionElement();
         this.state = BrowserWidget.States.CONSTRUCTED;
      }
   },
   
   destroy: function(){
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.destroyPropertyElements();
      }
      
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.description = XmlResource.selectNodeText( this.options.descriptionSelector, this.itemResource );
      this.globalUniqueId = XmlResource.selectNodeText( this.options.globalUniqueIdSelector, this.itemResource );
      this.link = XmlResource.selectNodeText( this.options.linkSelector, this.itemResource );
      this.publicationDate = XmlResource.selectNodeText( this.options.publicationDateSelector, this.itemResource );
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.itemResource );
      
      this.state = BrowserWidget.States.UNMARSHALLED;
   },
   
   //Properties
   getDescription: function() { return this.description; },
   getGlobalUniqueId: function() { return this.globalUniqueId; },
   getLink: function() { return this.link; },
   getPublicationDate: function() { return this.publicationDate; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   
   //Private helper methods
   createDescriptionElement : function(){
      if( this.options.showDescription ){
         var elementOptions = { 'class' : this.options.descriptionStyle };
         var descriptionText;
         if( this.options.truncateDescription ){
            descriptionText = this.description.substr( 0, this.options.truncatedDescriptionLength ) + this.options.trancatedDescriptionEnding;
         }else {
            descriptionText = this.description;
         }
         this.descriptionElement = this.elementFactory.create( 'div', descriptionText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      }
   }.protect(),
   
   createTitleElement : function(){
      var elementOptions = { 'class' : this.options.titleStyle };
      var elementText = this.link ? null : this.title;
      this.titleElement = this.elementFactory.create( 'div', elementText, this.containerElement, WidgetElementFactory.Positions.LastChild, elementOptions );
      
      if( this.link ){
         this.elementFactory.createAnchor( this.title, this.link, null, this.titleElement );
      }
   }.protect(),
   
   destroyPropertyElement: function( propertyElement ){
      if( propertyElement.removeEvents ) propertyElement.removeEvents();
      if( propertyElement.destroy ) propertyElement.destroy();
   }.protect(),
   
   destroyPropertyElements: function(){
      this.destroyPropertyElement( this.titleElement );
      this.destroyPropertyElement( this.descriptionElement );
   }
});
