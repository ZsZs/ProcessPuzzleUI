/*
Name: 
    - SlideshowControllerButton

Description: 
    - Represents a button of a slide show controller panel. 

Requires:

Provides:
    - SlideshowControllerButton

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

var SlideshowControllerButton = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds: ['gotFocus', 'lostFocus', 'onSelection'],
   
   options : {
      action : null,
      buttonClass : null,
      isActiveClass : 'active',
      key : null,
      label : null,
      tabIndex : null
   },

   //Constructor
   initialize: function( containerElement, options ){
      this.assertThat( containerElement, not( nil() ), "SlideshowControllerButton.containerElement" );
      this.setOptions( options );
      
      this.anchorElement;
      this.containerElement = containerElement;
      this.listItemElement;
   },
   
   //Public accessor and mutator methods
   construct: function(){
      this.createElements();
      this.addEvents();
   },
   
   destroy: function(){
      this.removeEvents();
      this.destroyElements();
   },
   
   lostFocus: function(){
      this.removeClass( this.options.isActiveClass );
   },
   
   onSelected: function(){
      this.fireEvent( 'selected', this );
   },
   
   pause: function(){
      this.paused = true;
   },
   
   gotFocus: function(){
      this.addClass( this.options.isActiveClass );
   },
   
   //Properties
   getAnchorElement : function(){ return this.anchorElement; },
   getElementClass : function(){ return this.options.buttonClass; },
   getListItemElement : function(){ return this.listItemElement; },
   
   //Protected, private helper methods
   addEvents : function(){
      this.anchorElement.addEvents({
         'click' : this.onSelection,
         'mouseenter' : this.gotFocus,
         'mouseleave' : this.lostFocus
      });
   }.protect(),
   
   createElements : function(){
      this.listItemElement = new Element( 'li', { 'class' : this.getElementClass() });
      this.anchorElement = new Element( 'a', { 'role' : 'menuitem', 'tabindex' : this.options.tabIndex, 'title' : this.options.label });
      this.anchorElement.inject( this.listItemElement );
      this.listItemElement.inject( this.containerElement );
   }.protect(),
   
   destroyElements : function(){
      if( this.anchorElement ) this.anchorElement.destroy();
      if( this.listItemElement ) this.listItemElement.destroy();
   }.protect(),
   
   removeEvents : function(){
      if( this.anchorElement ) this.anchorElement.removeEvents();
   }.protect()
});
