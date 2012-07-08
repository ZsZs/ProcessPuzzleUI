/*
Name: 
    - DefaultStateTransformer

Description: 
    - Transforms component's state by using component / state names and specific delimiters.

Requires:
    - 
Provides:
    - DefaultStateTransformer

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
//= require ../ComponentStateManager/StateTransformer.js

var DefaultStateTransformer = new Class({
   Extends: StateTransformer,
   options: {
      
   },

   //Constructor
   initialize: function( stateMachine, options ){
      this.parent( stateMachine, options );
   },
   
   //Public accessors and mutators
   parse: function( stateString ) {
      var tokenizer = new StringTokenizer( stateString, { delimiters : ';' } );
      while( tokenizer.hasMoreTokens() ){
         var token = tokenizer.nextToken();
         var componentName = token.substring( 0, token.indexOf( ":" ));
         var componentStateString = token.substring( token.indexOf( ":" ) +1 );
         var componentState = eval( "(" + componentStateString.trim() + ")" );
         componentState = this.setUnknowsValuesToNull( componentState );
         this.fireEvent( 'componentStateParse',  [[componentName, componentState]] );
      };
   },
   
   toString: function(){
      var stateString = "";
      this.stateMachine.each( function( componentStateEntry, index ){
         if( stateString != "" ) stateString += ";";
         stateString += componentStateEntry.getKey() + ":";
         stateString += this.transformComponentStateToString( componentStateEntry );
      }, this );
      
      return stateString;
   }
   
   //Protected, private helper methods
   
});