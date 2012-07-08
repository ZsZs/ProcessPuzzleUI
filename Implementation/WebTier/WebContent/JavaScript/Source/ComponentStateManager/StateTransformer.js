/*
Name: 
    - StateTransformer

Description: 
    - Abstract class of all state transformers.

Requires:
    - 
Provides:
    - StateTransformer

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

var StateTransformer = new Class({
   Implements: [Events, Options],
   options: {
      unknownValue : 'unknown'
   },

   //Constructor
   initialize: function( stateMachine, options ){
      assertThat( stateMachine, not( nil() ));
      this.setOptions( options );
      this.stateMachine = stateMachine;
   },
   
   //Public accessors and mutators
   parse : function(){
      //Needs to be overwritten
   },
   
   toString : function(){
      //Needs to be overwritten
   },
   
   //Protected, private helper methods
   setUnknowsValuesToNull : function( componentState ){
      if( componentState == this.options.unknownValue ) return null;
         
      for( var property in componentState ){
         if( componentState[property] == this.options.unknownValue ) componentState[property] = null;
      }
      
      return componentState;
   }.protect(),
   
   transformComponentStateToString : function( componentStateEntry ){
      var valueString = "";
      
      var value = componentStateEntry.getValue();
      if( value == null ) value = this.options.unknownValue;
      if( typeOf( value ) == "string" ) valueString = "'" + value + "'";
      else if( typeOf( value ) == "object" ){
         valueString = "{";
         for ( var property in value ) {
            if( valueString != "{" ) valueString += ",";
            if( value[property] == null ) valueString += property + ":'" + this.options.unknownValue + "'";
            else valueString += property + ":" + this.transformStateValueToString( value[property] );
         }
         valueString += "}";
      }else valueString = "'" + value.toString() + "'";
      
      return valueString;
   }.protect(),
   
   transformStateValueToString : function( stateValue ){
      valueString = "";
      
      if( typeOf( stateValue ) == "string" ) valueString = "'" + stateValue + "'";
      else if( typeOf( stateValue ) == "object" ){
         valueString = "{";
         for ( var property in stateValue ) {
            if( valueString != "{" ) valueString += ",";
            if( stateValue[property] == null ) valueString += property + ":'" + this.options.unknownValue + "'";
            else valueString += property + ":'" + stateValue[property] + "'";
         }
         valueString += "}";
      }else valueString = stateValue.toString();
      return valueString;
   }.protect()
   
});