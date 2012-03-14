/*
Name: RssResource

Description: Represents and RSS 2.0 xml resource file as JavaScript object 

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

var RssResource = new Class({
   Extends: XmlResource,

   options: {
   },
   
   //Constructor
   initialize: function ( uri, options ) {
      // parameter assertions
      assertThat( uri, not( nil() ));
      
      this.parent( uri, options );

      this.channel = null;
   },
   
   //Public accessor and mutator methods
   release: function(){
      
   },
   
   unmarshall: function(){
      this.unmarshallChannel();
   },
   
   //Properties
   getChannel: function() { return this.channel; },
   getItems: function() { return this.channel.getItems(); },
   
   //Private helper methods
   unmarshallChannel: function(){
      this.channel = new RssChannel( this );
      this.channel.unmarshall();
   }.protect(),
   
});
