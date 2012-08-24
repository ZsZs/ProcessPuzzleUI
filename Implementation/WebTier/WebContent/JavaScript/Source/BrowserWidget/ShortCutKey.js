/*
Name: 
    - ShortCutKey

Description: 
    - Represents short cut key for a widget action. 

Requires:
   - AssertionBehivour

Provides:
    - ShortCutKey

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

var ShortCutKey = new Class({
   Implements : [AssertionBehavior, Options],
   Binds: [],
   
   options : {
      label : null
   },

   //Constructor
   initialize: function( keySpecification, action, options ){
      this.setOptions( options );
      this.assertThat( keySpecification, not( nil() ), "ShortCutKey.keySpecification" );
      this.assertThat( action, not( nil() ), "ShortCutKey.action" );
      
      this.action = action;
      this.action.options.shortCutKey = this;
      this.alt;
      this.control;
      this.key;
      this.shift;
      
      this.determineKeyAndModifiers( keySpecification );
   },
   
   //Public accessor and mutator methods
   equalsWithKeyboardEvent : function( keyboardEvent ){
      return ( keyboardEvent.key == this.key && keyboardEvent.shift == this.options.shift && keyboardEvent.control == this.options.control && keyboardEvent.alt == this.options.alt );
   },
   
   //Properties
   getAction : function(){ return this.action; },
   getAlt : function(){ return this.alt; },
   getControl : function(){ return this.control; },
   getKey : function(){ return this.key; },
   getShift : function(){ return this.shift; },
   
   //Protected, private helper methods
   determineKeyAndModifiers : function( keySpecification ){
      ['shift', 'control', 'alt'].each( function( modifier ){
         var re = new RegExp( modifier, 'i' );
         this[modifier] = keySpecification.test( re );
         keySpecification = keySpecification.replace( re, '' );
      }.bind( this ));
      
      this.key = keySpecification.trim();
      
   }.protect()
});
