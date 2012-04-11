/*
Name: 
    - FixedComponentOrderedTransformer

Description: 
    - Relies on the predefined order of components when parsing state string.

Requires:
    - 
Provides:
    - FixedComponentOrderedTransformer

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
//= require ../ComponentStateManager/StateTransformer.js


var FixedComponentOrderedTransformer = new Class({
   Extends: StateTransformer,
   options: {
      
   },

   //Constructor
   initialize: function( stateMachine, componentList, options ){
      assertThat( componentList, not( nil() ));
      this.parent( stateMachine, options );
      
      this.componentList = componentList;
   },
   
   //Public accessors and mutators
   parse: function( stateString ) {
      var tokenizer = new StringTokenizer( stateString, { delimiters : ';' } );
      var componentIndex = 0;
      
      while( tokenizer.hasMoreTokens() ){
         var componentName = this.componentList[componentIndex++];
         var componentStateString = tokenizer.nextToken();
         var componentState = eval( "(" + componentStateString.trim() + ")" );
         
         this.fireEvent( 'componentStateParse',  [[componentName, componentState]] );
      };
   },
   
   toString: function(){
      var stateString = "";
      this.stateMachine.each( function( componentStateEntry, index ){
         if( this.componentList.contains( componentStateEntry.getKey() )){
            if( stateString != "" ) stateString += ";";
            stateString += this.transformComponentStateToString( componentStateEntry );
         }
      }, this );
      
      return stateString;
   },
   
   //Protected, private helper methods
   transformComponentStateToString : function( componentStateEntry ){
      var valueString = "";
      
      var value = componentStateEntry.getValue();
      if( typeOf( value ) == "string" ) valueString = "'" + value + "'";
      else if( typeOf( value ) == "object" ){
         valueString = "{";
         for ( var property in value ) {
            if( valueString != "{" ) valueString += ",";
            valueString += property + ":'" + value[property] + "'";
         }
         valueString += "}";
      }
      else valueString = "'" + value.toString() + "'";
      
      return valueString;
   }.protect()
   
});