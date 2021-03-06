/*
Name: WebUIException

Description: 

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

//= require_directory ../MochaUI

var WebUIException = new Class({
   Implements: Options,
   options: {
      cause: null,
      description: "Please overwrite this option.",
      message : "",
      name: "WebUIException",
      source: null
   },
   
   //Constructors
   initialize: function( options ){
     this.setOptions( options );
     if( options && options.cause ) this.options.cause = options.cause;
     
     //Private instance variables
     this.parameters;
   },
   
   //Public accessor and mutator methods
   stackTrace: function() {
      var stackTrace = "";
      if( this.options.cause ){
         if( this.options.cause.getMessage )
            stackTrace += this.options.cause.getMessage() + "\r\n" + this.options.cause.stackTrace();
         else{
            stackTrace += this.options.cause.message;
            stackTrace += "\r\n" + printStackTrace();
         }
      }else{
         stackTrace += printStackTrace();
      }
      
      return stackTrace;
   },
   
   //Properties
   getCause: function() { return this.options.cause; },
   getDescription : function() { return this.options.description; },
   getMessage: function() { return this.options.source + ": " + this.options.description.substitute( this.parameters ) + " " + this.options.message; }, 
   getName: function() { return this.options.name; },
   getSource : function() { return this.options.source; }
});