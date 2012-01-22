/********************************* RemoteResource ******************************
Name: RemoteResource

Description: Retrieves any resource. Overrides isSuccess() of Request to handle local files.

Requires:
   - Request

Provides:
   - RemoteResource

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

var RemoteResource = new Class({
   Extends: Request,
   
   options: {
      async : true,
      method : 'get',
      nameSpaces: "xmlns:pp='http://www.processpuzzle.com'"
   },
   
   // Constructor
   initialize: function ( uri, options ) {
      // parameter assertions
      assertThat( uri, not( nil() ));
      
      this.parent( options );
      this.options.url = uri;
   },
   
   //Public accessors and mutators
   isSuccess: function() { // Determines if an XMLHttpRequest was successful or not
      try {
          // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
          return ( location.protocol === "file:" && !this.status && this.status === 0 && ( this.response.text || this.response.xml )) ||
              // Opera returns 0 when status is 304
              ( this.status >= 200 && this.status < 300 ) ||
              ( this.status === 304 ) || 
              ( this.status === 1223 );
      } catch(e) {}

      return false;
  },
  
  retrieve: function(){
     try{
        this.send( this.options.url );
     }catch( e ){
        if( e.name == "NS_ERROR_FILE_NOT_FOUND" ) this.failure();
        else if( e.name == "Error" ) this.failure();
        else throw new e ;
     }
  },
  
  // Properties
  getUri: function() { return this.options.url; },
  isAsync: function() { return this.options.async; }
  
  //Private helper methods
});
   
