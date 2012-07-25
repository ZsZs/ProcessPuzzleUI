/*
Name: AssertionBehaviour

Description:
   - Add 'assertThat' and 'assumeThat' behavior to a Class.

Requires:
   - JsHamcrest

Provides:
   - AssertionBehaviour

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

var AssertionBehavior = new Class({
   //Constructors
   
   //Public accessor and mutator methods
   
   //Properties
   assertThat : function( actual, matcher, message ) {
      return JsHamcrest.Operators.assert( actual, matcher, {
         message: message,
        
         fail: function( message ) {
            throw new AssertionException( message );
         },
        
         pass: function( message ) { }
      });
   }.protect(),

   assumeThat : function( actual, matcher, message ) {
      return JsHamcrest.Operators.assert( actual, matcher, {
         message: message,
        
         fail: function( message ) {
            throw new AssertionException( message );
         },
        
         pass: function( message ) { }
      });
   }.protect()
});

