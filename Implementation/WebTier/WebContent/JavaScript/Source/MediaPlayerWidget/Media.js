/*
Name: 
    - Media

Description: 
    - Represents an abstract displayable media.

Requires:
   - 

Provides:
    - Media

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

var Media = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds: [],
   
   options : {
      componentName : 'Media',
      eventDeliveryDelay : 5
   },

   //Constructor
   initialize: function( internationalization, mediaDefinitionXml, options ){
      this.assertThat( internationalization, not( nil() ), this.options.componentName + ".internationalization" );
      this.assertThat( mediaDefinitionXml, not( nil() ), this.options.componentName + ".mediaDefinitionXml" );
      this.setOptions( options );
      
      this.internationalization = internationalization;
      this.mediaDefinitionXml = mediaDefinitionXml;
      this.thumbnailsUri = new Array();
   },
   
   //Public accessor and mutator methods
   relase: function(){
      //Abstract method, should be overwritten.
   },
   
   unmarshall: function(){
	  //Abstract method, should be overwritten.
   },
   
   //Properties
   getThumbnailsUri: function(){ return this.thumbnailsUri; }
   
   //Protected, private helper methods
});
