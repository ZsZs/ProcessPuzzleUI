/*
Name: 
    - PhotoGaleryImage

Description: 
    - Represents an image of a photo galery. 

Requires:

Provides:
    - PhotoGaleryImage

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


var PhotoGaleryImage = new Class({
   Implements : Options,
   
   options : {
      captionSelector : "caption",
      linkSelector : "link",
      thumbnailSelector : "thumbnailUri",
      uriSelector : "uri"
   },

   //Constructor
   initialize: function( definitionXml, internationalization, options ){
      this.setOptions( options );
      this.anchorElement;
      this.caption;
      this.data;
      this.dataAsText;
      this.definitionXml = definitionXml;
      this.internationalization = internationalization;
      this.link;
      this.thumbnailUri;
      this.uri;
      this.state = PhotoGaleryImage.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.compileDataFromProperties();
      this.state = PhotoGaleryImage.States.CONSTRUCTED;
   },
   
   destroy: function(){
      this.data = null;
      this.dataAsText = null;
      this.link = null;
      this.thumbnailUri = null;
      this.uri = null;
      this.state = PhotoGaleryImage.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = PhotoGaleryImage.States.UNMARSHALLED;
   },
   
   //Properties
   getCaption: function() { return this.caption; },
   getData: function() { return this.data; },
   getDataAsText: function() { return this.dataAsText; },
   getLink: function() { return this.link; },
   getState: function() { return this.state; },
   getThumbnailUri: function() { return this.thumbnailUri; },
   getUri: function() { return this.uri; },
   
   //Protected, private helper methods
   compileDataFromProperties: function(){
      var caption = this.caption ? "caption:'" + this.caption + "'" : null;
      var href = this.link ? "href:'" + this.link + "'" : null;
      var thumbnail = this.thumbnailUri ? "thumbnail:'" + this.thumbnailUri + "'" : null;
      
      var dataFragment = caption ? caption : "";

      if( dataFragment != "" && href ) dataFragment += ", ";
      dataFragment += href ? href : "";

      if( dataFragment != "" && thumbnail ) dataFragment += ", ";
      dataFragment += thumbnail ? thumbnail : "";
      
      this.dataAsText = "'" + this.uri + "': {" + dataFragment + "}";
      this.data = eval( "({" + this.dataAsText + "})" );
   }.protect(),
   
   unmarshallProperties: function(){
      this.caption = XmlResource.selectNodeText( this.options.captionSelector, this.definitionXml );
      this.caption = this.internationalization.getText( this.caption );
      this.link = XmlResource.selectNodeText( this.options.linkSelector, this.definitionXml );
      this.thumbnailUri = XmlResource.selectNodeText( this.options.thumbnailSelector, this.definitionXml );
      this.uri = XmlResource.selectNodeText( this.options.uriSelector, this.definitionXml );
   }.protect(),
});

PhotoGaleryImage.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
