/*
Name: DocumentElementEditor

Description: An inline editor, associciated with SmartDocument's elements (DocumentElement).

Requires:

Provides:
    - DocumentElementEditor

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

var DocumentElementEditor = new Class({
   Implements: [Events, Options],
   Binds: ['onBlur', 'onClick'],
   options: {
      inputStyle : { background: 'transparent', border : 'none', width: '20em' },
      styleProperties : ['color', 'display', 'font-size', 'font-weight', 'margin', 'padding', 'text-align'],
   },
   
   initialize: function( subjectHtmlElement, options ){
      this.setOptions( options );
      assertThat( subjectHtmlElement, not( nil() ));
      
      //private fields
      this.inputElement;
      this.previousValue;
      this.subjectHtmlElement = subjectHtmlElement;
      this.text;
   },
   
   //Public accessors and mutators
   attach: function(){
      this.subjectHtmlElement.addEvent( 'blur', this.onBlur );
      this.subjectHtmlElement.addEvent( 'click', this.onClick );
   },
   
   detach: function(){
      if( this.inputElement ) this.removeInputElement();
   },
   
   onBlur: function(){
      this.removeInputElement();
      this.fireEvent( 'editEnd', this );
   },
   
   onClick: function(){
      this.saveCurrentValue();
      this.injectInputElement();
      this.fireEvent( 'editStart', this );
   },
   
   //Properties
   getInputElement: function() { return this.inputElement; },
   getPreviousValue: function() { return this.previousValue; },
   getSubjectElement: function(){ return this.subjectHtmlElement; },
   getText: function() { return this.text; },
   isChanged: function() { return !(this.text && this.text.equals( this.previousValue )); },
   
   //Protected, private helper methods
   injectInputElement: function(){
      var subjectHtmlElementStyle = this.subjectHtmlElement.getStyles( this.options.styleProperties );
      this.subjectHtmlElement.setStyle( 'display', 'none' );
      this.inputElement = new Element( 'input', { name : this.subjectHtmlElement.get( 'id'), type: 'text', value : this.text, styles : this.options.inputStyle });
      this.inputElement.setStyles( subjectHtmlElementStyle );
      this.inputElement.inject( this.subjectHtmlElement, 'after' );
   }.protect(),
   
   removeInputElement: function(){
      this.text = this.inputElement.get( 'value' );
      this.inputElement.destroy();
      this.subjectHtmlElement.set( 'text', this.text );
      this.subjectHtmlElement.setStyle( 'display', 'inline' );
   }.protect(),
   
   saveCurrentValue: function(){
      this.text = this.subjectHtmlElement.get( 'text' );
      this.previousValue = this.text;
   }
});
