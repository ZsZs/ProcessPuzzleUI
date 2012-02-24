/********************************* RssItem ******************************
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
**/

//= require_directory ../FundamentalTypes

var RssItem = new Class({
   Implements: Options,

   options: {
      descriptionSelector: "description",
      globalUniqueIdSelector: "guid",
      linkSelector: "link",
      publicationDateSelector: "pubDate",
      titleSelector: "title"
   },
   
   //Constructor
   initialize: function ( itemResource, options ) {
      // parameter assertions
      assertThat( itemResource, not( nil() ));      
      this.setOptions( options );
      
      this.description = null;
      this.globalUniqueId = null;
      this.itemResource = itemResource;
      this.link = null;
      this.publicationDate = null;
      this.title = null;
   },
   
   //Public accessor and mutator methods
   destroy: function(){
   },
   
   unmarshall: function(){
      this.description = XmlResource.selectNodeText( this.options.descriptionSelector, this.itemResource );
      this.globalUniqueId = XmlResource.selectNodeText( this.options.globalUniqueIdSelector, this.itemResource );
      this.link = XmlResource.selectNodeText( this.options.linkSelector, this.itemResource );
      this.publicationDate = XmlResource.selectNodeText( this.options.publicationDateSelector, this.itemResource );
      this.title = XmlResource.selectNodeText( this.options.titleSelector, this.itemResource );
   },
   
   //Properties
   getDescription: function() { return this.description; },
   getGlobalUniqueId: function() { return this.globalUniqueId; },
   getLink: function() { return this.link; },
   getPublicationDate: function() { return this.publicationDate; },
   getTitle: function() { return this.title; },
   
   //Private helper methods
});
