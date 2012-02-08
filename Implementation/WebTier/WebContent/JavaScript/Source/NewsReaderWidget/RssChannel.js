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
      buildDateSelector : "rss/channel/lastBuildDate/text()",
      descriptionSelector : "rss/channel/description/text()",
      documentsSelector : "rss/channel/docs/text()",
      generatorSelector : "rss/channel/generator/text()",
      itemsSelector : "rss/channel/item",
      languageSelector : "rss/channel/language/text()",
      linkSelector : "rss/channel/link/text()",
      managingDirectorSelector : "rss/channel/managingEditor/text()",
      publicationDateSelector : "rss/channel/pubDate/text()",
      titleSelector : "rss/channel/title/text()",
      webMasterSelector : "rss/channel/webMaster/text()"
   },
   
   //Constructor
   initialize: function ( rssResource, options ) {
      // parameter assertions
      assertThat( rssResource, not( nil() ));
      this.setOptions( options );
      
      this.buildDate = null;
      this.description = null;
      this.documents = null;
      this.generator = null;
      this.items = new ArrayList();
      this.language = null;
      this.link = null;
      this.managingDirector = null;
      this.publicationDate = null;
      this.rssResource = rssResource;
      this.title = null;
      this.webMaster = null;
   },
   
   //Public accessor and mutator methods
   release: function(){
      
   },
   
   unmarshall: function(){
      this.unmarshallChannelProperties();
      this.unmarshallItems();
   },
   
   //Properties
   getBuildDate: function() { return this.buildDate; },
   getDescription: function() { return this.description; },
   getDocuments: function() { return this.documents; },
   getGenerator: function() { return this.generator; },
   getItems: function() { return this.items; },
   getLanguage: function() { return this.language; },
   getLink: function() { return this.link; },
   getManagingDirector: function() { return this.managingDirector; },
   getPublicationDate: function() { return this.publicationDate; },
   getTitle: function() { return this.title; },
   getWebMaster: function() { return this.webMaster; },
   
   //Private helper methods
   unmarshallChannelProperties: function(){
      this.buildDate = this.rssResource.selectNodeText( this.options.buildDateSelector );
      this.description = this.rssResource.selectNodeText( this.options.descriptionSelector );
      this.documents = this.rssResource.selectNodeText( this.options.documentsSelector );
      this.generator = this.rssResource.selectNodeText( this.options.generatorSelector );
      this.language = this.rssResource.selectNodeText( this.options.languageSelector );
      this.link = this.rssResource.selectNodeText( this.options.linkSelector );
      this.managingDirector = this.rssResource.selectNodeText( this.options.managingDirectorSelector );
      this.publicationDate = this.rssResource.selectNodeText( this.options.publicationDateSelector );
      this.title = this.rssResource.selectNodeText( this.options.titleSelector );
      this.webMaster = this.rssResource.selectNodeText( this.options.webMasterSelector );
   }.protect(),
   
   unmarshallItem: function( itemResource ){
      var rssItem = new RssItem( itemResource );
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
