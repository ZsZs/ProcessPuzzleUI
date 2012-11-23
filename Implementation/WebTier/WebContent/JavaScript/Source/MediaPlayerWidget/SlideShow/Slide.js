/*
Name: 
    - Slide

Description: 
    - Represents a slide in the slide show. 

Requires:
   - 

Provides:
    - Slide

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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var Slide = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds: [],
   
   options : {
      captionSelector : "sh:caption",
      componentName : "Slide",
      linkSelector : "sh:link",
      index : 1,
      thumbnailSelector : "sh:thumbnailUri",
      uriSelector : "sh:uri"
   },

   //Constructor
   initialize: function( definitionXml, internationalization, options ){
      this.assertThat( definitionXml, not( nil() ), this.options.componentName + ".definitionXml" );
      this.assertThat( internationalization, not( nil() ), this.options.componentName + ".internationalization" );
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
      this.state = Slide.States.INITIALIZED;
   },
   
   //Public accessor and mutator methods
   equals: function( obj ){
      if( !(typeOf( this ) === typeOf( obj ))) return false;
      return this.uri == obj.uri;
   },
   
   release: function(){
      this.link = null;
      this.thumbnailUri = null;
      this.uri = null;
      this.state = Slide.States.INITIALIZED;
   },
   
   unmarshall: function(){
      this.unmarshallProperties();
      this.state = Slide.States.UNMARSHALLED;
   },
   
   //Properties
   getCaption: function() { return this.caption; },
   getElement : function(){ return this.anchorElement; },
   getIndex : function(){ return this.options.index; },
   getLink: function() { return this.link; },
   getState: function() { return this.state; },
   getThumbnailUri: function() { return this.thumbnailUri; },
   getUri: function() { return this.uri; },
   
   //Protected, private helper methods
   unmarshallProperties: function(){
      this.caption = XmlResource.selectNodeText( this.options.captionSelector, this.definitionXml );
      this.caption = this.internationalization.getText( this.caption );
      this.link = XmlResource.selectNodeText( this.options.linkSelector, this.definitionXml );
      this.thumbnailUri = XmlResource.selectNodeText( this.options.thumbnailSelector, this.definitionXml );
      this.uri = XmlResource.selectNodeText( this.options.uriSelector, this.definitionXml );
   }.protect(),
});

Slide.States = { UNINITIALIZED : 0, INITIALIZED : 1, UNMARSHALLED : 2, CONSTRUCTED : 3 };
