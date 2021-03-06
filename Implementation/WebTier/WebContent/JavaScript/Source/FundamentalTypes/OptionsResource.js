/*
Name: OptionsResource

Description: Unmarshalls a set of options from an XML file and transforms to a JavaScript object.

Requires:
    - XmlResource

Provides:
    - OptionsResource

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

var OptionsResource = new Class({
   Implements: [AssertionBehavior, Options],
   
   options : {
      nameSelector : "@name",
      optionSelector : "sd:option",
      valueSelector : "@value"
   },

   //Constructor
   initialize : function( definitionElement, options ) {
      this.assertThat( definitionElement, not( nil() ));
      this.setOptions( options );
      
      this.definitionElement = definitionElement;
      this.optionsAsText = "";
      this.optionsObject;
   },
   
   //Public accessors and mutators
   unmarshall: function(){
      this.unmarshallOptions();
      this.evaluateOptions();
   },
   
   //Properties
   getOptions: function() { return this.optionsObject; },
   
   //Protected, private helper methods
   evaluateOptions: function(){
      this.optionsObject = eval( "({" + this.optionsAsText + "})" );
   }.protect(),
   
   unmarshallOptions: function(){
      var optionElements = XmlResource.selectNodes( this.options.optionSelector, this.definitionElement );
      optionElements.each( function( optionElement, index ){
         if( index > 0 ) this.optionsAsText += ", ";
         var name = XmlResource.selectNodeText( this.options.nameSelector, optionElement );
         var value = XmlResource.selectNodeText( this.options.valueSelector, optionElement );
//         var arrayExpression = new RegExp( "^[\[]" ); //^[\[]+.*+[]$
//         if( value.match( arrayExpression )) 
//            this.optionsAsText += name + " : " + eval( value );
         this.optionsAsText += name + " : " + value ;
      }, this );
   }.protect()
});
