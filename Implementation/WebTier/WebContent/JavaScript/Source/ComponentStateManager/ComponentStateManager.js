/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//ComponentStateManager.js

var ComponentStateManager = new Class({
   Implements: [Options, Class.Singleton],
   
   options: {
      stateUriTransformer: DefaultStateUriTransformer
   },
   
   //Constructors
   initialize: function( options ) { return this.check() || this.setUp( options ); },
   
   setUp : function( options ) {
      this.setOptions( options );
      this.stateMachine = new HashMap();
      this.stateUriTransformer = new this.options.stateUriTransformer( this );
   }.protect(),

   //Public accessor and mutator methods
   parse : function( sourceString ){
      var tokenizer = new StringTokenizer( sourceString, { delimiters : ';' } );
      while( tokenizer.hasMoreTokens() ){
         var token = tokenizer.nextToken();
         var componentName = token.substring( 0, token.indexOf( ":" ));
         var componentStateString = token.substring( token.indexOf( ":" ) +1 );
         var componentState = eval( "(" + componentStateString.trim() + ")" );
         
         this.storeCurrentState( componentName.trim(), componentState );
      };
   },
   
   reset : function() {
      this.stateMachine.clear();
   },
   
   resetStateFromUri: function( uri ){
      this.reset();
      this.stateUriTransformer.transformUriToState( uri );
   },
   
   retrieveCurrentState : function( componentName ){
      return this.stateMachine.get( componentName );
   },
   
   storeCurrentState : function( componentName, currentState ){
      this.stateMachine.put( componentName, currentState );
   },
   
   toString: function(){
      var stateString = "";
      this.stateMachine.each( function( componentStateEntry, index ){
         if( stateString != "" ) stateString += "; ";
         
         stateString += componentStateEntry.getKey() + ": ";
         
         var valueString = "";
         var value = componentStateEntry.getValue();
         if( typeOf( value ) == "string" ) valueString = "'" + value + "'";
         else if( typeOf( value ) == "object" ){
            valueString = "{";
            for ( var property in value ) {
               if( valueString != "{" ) valueString += ", ";
               valueString += property + ": '" + value[property] + "'";
            }
            valueString += "}";
         }
         else valueString = "'" + value.toString() + "'";
    
         stateString += valueString;
      }, this );
      
      return stateString;
   },
   
   transformStateToUri: function(){
      return this.stateUriTransformer.transformStateToUri();
   },
   
   //Properties
   getStateUriTransformer: function() { return this.stateUriTransformer; }
});