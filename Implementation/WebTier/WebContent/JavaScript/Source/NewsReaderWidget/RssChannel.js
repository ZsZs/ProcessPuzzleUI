/********************************* RssChannel ******************************
Name: RssChannel

Description: Represents and RSS 2.0 channel as JavaScript object 

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
**/

//= require_directory ../FundamentalTypes

var RssChannel = new Class({
   Implements: Options,

   options: {
      buildDateSelector : "//rss/channel/lastBuildDate",
      descriptionSelector : "//rss/channel/description",
      descriptionStyle : "rssChannelDescription",
      documentsSelector : "//rss/channel/docs",
      generatorSelector : "//rss/channel/generator",
      itemOptions : {},
      itemsSelector : "//rss/channel/item",
      itemsWrapperStyle : "rssItemsWrapper",
      languageSelector : "//rss/channel/language",
      linkSelector : "//rss/channel/link",
      managingEditorSelector : "//rss/channel/managingEditor",
      publicationDateSelector : "//rss/channel/pubDate",
      showDescription: true, 
      showTitle: true, 
      titleSelector : "//rss/channel/title",
      titleStyle : "rssChannelTitle",
      webMasterSelector : "//rss/channel/webMaster",
      wrapperElementId : "rssChannelWrapper",
      wrapperElementTag : "div"
   },
   
   //Constructor
   initialize: function ( rssResource, internationalization, elementFactory, options ) {
      // parameter assertions
      assertThat( rssResource, not( nil() ));
      this.setOptions( options );
      
      this.buildDate;
      this.containerElement;
      this.description;
      this.documents;
      this.elementFactory = elementFactory;
      this.generator;
      this.internationalization;
      this.items = new ArrayList();
      this.language;
      this.link;
      this.managingEditor;
      this.publicationDate;
      this.rssResource = rssResource;
      this.state = BrowserWidget.States.INITIALIZED;
      this.title;
      this.webMaster;
      this.wrapperElement;
   },
   
   //Public accessor and mutator methods
   construct : function( containerElement ){
      if( this.state == BrowserWidget.States.UNMARSHALLED ){
         this.containerElement = containerElement;
         this.createWrapperElement();
         this.createTitleElement();
         this.createItemsWrapper();
         this.constructItems();
         
         this.state = BrowserWidget.States.CONSTRUCTED;
      }
   },
   
   destroy: function(){
      if( this.state == BrowserWidget.States.CONSTRUCTED ){
         this.destroyItems();
         this.destroyPropertyElements();
      }
      
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.unmarshallChannelProperties();
      this.unmarshallItems();
      this.state = BrowserWidget.States.UNMARSHALLED;
   },
   
   //Properties
   getBuildDate: function() { return this.buildDate; },
   getDescription: function() { return this.description; },
   getDocuments: function() { return this.documents; },
   getElementFactory : function() { return this.elementFactory; },
   getGenerator: function() { return this.generator; },
   getItems: function() { return this.items; },
   getLanguage: function() { return this.language; },
   getLink: function() { return this.link; },
   getManagingEditor: function() { return this.managingEditor; },
   getPublicationDate: function() { return this.publicationDate; },
   getState: function() { return this.state; },
   getTitle: function() { return this.title; },
   getWebMaster: function() { return this.webMaster; },
   getWrapperElement: function() { return this.wrapperElement; },
   
   //Private helper methods
   constructItems : function() {
      this.items.each( function( channelItem, index ){
         channelItem.construct( this.itemsWrapperElement );
      }.bind( this ));
   }.protect(),
   
   createItemsWrapper : function(){
      this.itemsWrapperElement = this.elementFactory.create( 
         this.options.wrapperElementTag, 
         null, 
         this.wrapperElement, 
         WidgetElementFactory.Positions.LastChild, 
         { 'class' : this.options.itemsWrapperStyle }
      );
   }.protect(),
   
   createTitleElement : function(){
      if( this.options.showTitle ){
         var elementOptions = { 'class' : this.options.titleStyle };
         var elementText = this.link ? null : this.title;
         this.titleElement = this.elementFactory.create( 'div', elementText, this.wrapperElement, WidgetElementFactory.Positions.LastChild, elementOptions );
         
         if( this.link ){
            this.elementFactory.createAnchor( this.title, this.link, null, this.titleElement );
         }
      }
   }.protect(),
   
   createWrapperElement : function(){
      this.wrapperElement = this.elementFactory.create( 
         this.options.wrapperElementTag, 
         null, 
         this.containerElement, 
         WidgetElementFactory.Positions.LastChild, 
         { id : this.options.wrapperElementId }
      );
   }.protect(),
   
   destroyItems: function(){
      this.items.each( function( channelItem, index ){
         channelItem.destroy();
      }.bind( this ));
   }.protect(),
   
   destroyPropertyElements: function(){
      if( this.wrapperElement.removeEvents ) this.wrapperElement.removeEvents();
      if( this.wrapperElement.destroy ) this.wrapperElement.destroy();
      
      if( this.titleElement && this.titleElement.removeEvents ) this.titleElement.removeEvents();
      if( this.titleElement && this.titleElement.destroy ) this.titleElement.destroy();
   }.protect(),
   
   unmarshallChannelProperties: function(){
      this.buildDate = this.rssResource.selectNodeText( this.options.buildDateSelector );
      this.description = this.rssResource.selectNodeText( this.options.descriptionSelector );
      this.documents = this.rssResource.selectNodeText( this.options.documentsSelector );
      this.generator = this.rssResource.selectNodeText( this.options.generatorSelector );
      this.language = this.rssResource.selectNodeText( this.options.languageSelector );
      this.link = this.rssResource.selectNodeText( this.options.linkSelector );
      this.managingEditor = this.rssResource.selectNodeText( this.options.managingEditorSelector );
      this.publicationDate = this.rssResource.selectNodeText( this.options.publicationDateSelector );
      this.title = this.rssResource.selectNodeText( this.options.titleSelector );
      this.webMaster = this.rssResource.selectNodeText( this.options.webMasterSelector );
   }.protect(),
   
   unmarshallItem: function( itemResource ){
      var rssItem = new RssItem( itemResource, this.elementFactory, this.options.itemOptions );
      rssItem.unmarshall();
      this.items.add( rssItem );
   }.protect(),
   
   unmarshallItems: function( ){
      var rssItemResources = this.rssResource.selectNodes( this.options.itemsSelector );
      rssItemResources.each( function( itemResource, index ){
         this.unmarshallItem( itemResource );
      }, this );
   }.protect()
});
