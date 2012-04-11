/*
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
//= require_directory ../FundamentalTypes
//= require ../Singleton/Singleton.js
//= require ../ComponentStateManager/DefaultStateTransformer.js

var ComponentStateManager = new Class({
   Implements: [Events, Options, Class.Singleton],
   Binds: ['onComponentStateParse'],
   
   options: {
      componentName : "ComponentStateManager",
      stateUriTransformer: DefaultStateTransformer
   },
   
   //Constructors
   initialize: function( options ) { return this.check() || this.setUp( options ); },
   
   setUp : function( options ) {
      this.setOptions( options );
      this.stateMachine = new LinkedHashMap();
      this.stateTransformer = new this.options.stateUriTransformer( this.stateMachine, { onComponentStateParse : this.onComponentStateParse } );
   }.protect(),

   //Public accessor and mutator methods
   onComponentStateParse : function( componentState ){
      this.storeComponentState( componentState[0].trim(), componentState[1] );
   },
   
   parse : function( stateString ){
      this.stateTransformer.parse( stateString );
   },
   
   persist : function(){
      $.jStorage.set( this.options.componentName, this.toString() );
   },
   
   reset : function() {
      this.stateMachine.clear();
   },
   
   restore : function(){
      var stateString = $.jStorage.get( this.options.componentName );
      this.parse( stateString );
   },
   
   retrieveComponentState : function( componentName ){
      return this.stateMachine.get( componentName );
   },
   
   storeComponentState : function( componentName, currentState ){
      if( componentName && currentState ) this.stateMachine.put( componentName, currentState );
   },
   
   toString: function(){
      return this.stateTransformer.toString();
   },
   
   //Properties
   getStateUriTransformer: function() { return this.stateTransformer; },
   
   //Protected, private helper methods
});