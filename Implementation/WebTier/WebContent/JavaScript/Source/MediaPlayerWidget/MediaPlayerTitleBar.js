/*
Name: 
    - MediaPlayerTitleBar

Description: 
    - Displays media title. 

Requires:
   - 

Provides:
   - MediaPlayerTitleBar

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

// = require_directory ../FundamentalTypes

var MediaPlayerTitleBar = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds : ['signAreaUpdateFinished', 'update'],
   
   options : {
      captionClass : "captions",
      componentName : "MediaPlayerTitleBar",
      eventDeliveryDelay : 5,
      hiddenClass : "hidden",
      idPrefix : "Slideshow-",
      slideShowClass : "slideshow",
      morphProperties : { duration: 'normal', link: 'cancel', transition: Fx.Transitions.Sine.easeOut },
      visibleClass : "visible"
   },

   initialize : function( containerElement, options ) {
      this.setOptions( options );
      this.assertThat( containerElement, not( nil()), "SlideCaption.containerElement" );
      
      this.captionElement;
      this.containerElement = containerElement;
      this.id = this.options.idPrefix + Date.now();
      this.morph;
      this.text;
   },
   
   //Public accessor and mutator methods
   construct : function(){
      this.createCaptionElement();
      this.finalizeConstruction();
   },
   
   destroy : function(){
      this.removeEvents();
      this.destroyCaptionElement();
      this.fireEvent( 'destroyed', this );      
   },
   
   update : function( text, fast ){
      this.text = text;
      this.fast = fast;
      
      if( this.morph ) this.morph.cancel();
      
      if( this.text ){
         if( fast ) this.flashCaption();
         else this.morphCaption();
      }else this.hideCaption();
   },
   
   //Properties
   getCaptionClass : function(){ return this.options.slideShowClass + "-" + this.options.captionClass; },
   getCaptionElement : function(){ return this.captionElement; },
   getHiddenClass : function(){ return this.getCaptionClass() + "-" + this.options.hiddenClass; },
   getId : function(){ return this.id; },
   getVisibleClass : function(){ return this.getCaptionClass() + "-" + this.options.visibleClass; },
   
   //Protected, private helper methods
   createCaptionElement : function(){
      this.captionElement = new Element( 'div', { 'class' : this.getCaptionClass(), 'id' : this.id });
      this.captionElement.set({ 'aria-busy' : false, 'aria-hidden' : false, 'role' : 'description' });
      this.captionElement.inject( this.containerElement );
   }.protect(),
   
   destroyCaptionElement : function(){
      if( this.captionElement && this.captionElement.destroy ) this.captionElement.destroy();
   }.protect(),
   
   flashCaption : function(){
      this.captionElement.set({ 'aria-hidden': false, 'text': this.text });
      this.captionElement.removeClass( this.getHiddenClass() );
      this.captionElement.addClass( this.getVisibleClass() );
   }.protect(),
   
   finalizeConstruction : function(){
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   hideCaption : function(){
      this.captionElement.set({ 'aria-hidden': true, 'text': "" });
      this.captionElement.removeClass( this.getVisibleClass() );
      this.captionElement.addClass( this.getHiddenClass() );
   }.protect(),
   
   morphCaption : function(){
      this.captionElement.set({ 'aria-hidden': false, 'text': this.text });
      this.morph = new Fx.Morph( this.captionElement, this.options.morphProperties );
      this.morph.start( "." + this.getVisibleClass() );
   }.protect(),
   
   signAreaUpdateFinished : function(){
      this.captionElement.set( 'aria-busy', false );
   }.protect(),
   
   removeEvents : function(){
      if( this.captionElement && this.captionElement.removeEvents ) this.captionElement.removeEvents();
   }
});