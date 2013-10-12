/*
Name: 
    - MediaPlayerController

Description: 
    - Provides controlling functionality, such as start/stop, previous/next for the media player. 

Requires:
   - 

Provides:
    - MediaPlayerController

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

var MediaPlayerController = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds : ['hide', 'onBackward', 'onBeginning', 'onEnd', 'onForward', 'onKeyDown', 'onKeyUp', 'onMouseMove', 'onStartStop', 'show'],
   options : {
      accessKeys : { 
         'first' : { 'key' : 'shift left', 'label' : 'Shift + Leftwards Arrow' },
         'prev' : { 'key' : 'left', 'label' : 'Leftwards Arrow' },
         'pause' : { 'key' : 'p', 'label' : 'P' },
         'next' : { 'key' : 'right', 'label' : 'Rightwards Arrow' },
         'last' : { 'key' : 'shift right', 'label' : 'Shift + Rightwards Arrow' }
      },
      componentName : 'MediaPlayerController',
      controllerClass : 'controller',
      eventDeliveryDelay : 5,
      hiddenClass : "hidden",
      link : 'cancel',
      morphProperties : { duration: 500, fps: 50, link : 'cancel', transition: Fx.Transitions.Sine.easeInOut, unit: false },
      slideShowClass : "slideshow",
      startPaused : false,
      visibleClass : "visible"
   },

   initialize : function( containerElement, screen, options ) {
      this.setOptions( options );
      this.assertThat( containerElement, not( nil()), this.options.componentName + ".containerElement" );
      this.assertThat( screen, not( nil()), this.options.componentName + ".screen" );
      
      this.containerElement = containerElement;
      this.controlButtonsWrapper;
      this.controllerWrapperElement;
      this.isRunning = false;
      this.mediaBackwardButton;
      this.mediaBeginningButton;
      this.mediaEndButton;
      this.mediaForwardButton;
      this.morph;
      this.mediaStartStopButton;
      this.screen = screen;
      this.shortCutKeys = new Array();
      
      this.setUp();
   },
   
   //Public accessors and mutator elements
   construct : function(){
      this.createControllerWrapperElements();
      this.createButtons();
      this.addEvents();
      this.finalizeConstruction();
   },
   
   destroy : function(){
      this.removeEvents();
      this.destroyButtons();
      this.destroyControllerWrapperElement();
   },

   hide : function() {
      if( this.controllerWrapperElement.get( 'aria-hidden' ) == 'false' ){
         this.controllerWrapperElement.set( 'aria-hidden', true );
         this.morph = new Fx.Morph( this.controllerWrapperElement, this.options.morphProperties );
         this.morph.start( "." + this.getHiddenClass() );
      }
   },

   onBackward : function(){
      this.fireEvent( 'mediaBackward', this, this.options.eventDeliveryDelay );
   },

   onBeginning : function(){
      this.fireEvent( 'mediaBeginning', this, this.options.eventDeliveryDelay );
   },

   onEnd : function(){
      this.fireEvent( 'mediaEnd', this, this.options.eventDeliveryDelay );
   },

   onForward : function(){
      this.fireEvent( 'mediaForward', this.options.eventDeliveryDelay );
   },

   onKeyDown : function( keyboardEvent ) {
      var action = this.keyboardEventsAction( keyboardEvent );
      if( action ){
         this.show();
         //this.el.retrieve( action ).fireEvent( 'mouseenter' );      
      }
   },

   onKeyUp : function( keyboardEvent ) {
      var action = this.keyboardEventsAction( keyboardEvent );
      if( action ){
         this.hide();
         //this.el.retrieve( action ).fireEvent( 'mouseleave' );      
      }
   },

   onMouseMove : function( mouseEvent ) {
      if( this.screen.coordinateIsWithinScreen({ x : mouseEvent.page.x, y : mouseEvent.page.y })) this.show();
      else this.hide();
   },
   
   onStartStop : function(){
      if( this.isRunning ){
         this.fireEvent( 'mediaStop', this, this.options.eventDeliveryDelay );
         this.isRunning = false;
      }else{
         this.fireEvent( 'mediaStart', this, this.options.eventDeliveryDelay );
         this.isRunning = true;
      }
   },

   show : function() {
      if( this.controllerWrapperElement.get( 'aria-hidden' ) == 'true' ){
         this.controllerWrapperElement.set( 'aria-hidden', false );
         this.morph = new Fx.Morph( this.controllerWrapperElement, this.options.morphProperties );
         this.morph.start( "." + this.getVisibleClass() );
      }
   },
   
   //Properties
   getControllerClass : function(){ return this.options.slideShowClass + "-" + this.options.controllerClass; },
   getFirstButton : function(){ return this.mediaBeginningButton; },
   getHiddenClass : function(){ return this.getControllerClass() + "-" + this.options.hiddenClass; },
   getLastButton : function(){ return this.mediaEndButton; },
   getNextButton : function(){ return this.mediaForwardButton; },
   getPauseButton : function(){ return this.mediaStartStopButton; },
   getPreviousButton : function(){ return this.mediaBackwardButton; },
   getShortCutKeys : function(){ return this.shortCutKeys; },
   getVisibleClass : function(){ return this.getControllerClass() + "-" + this.options.visibleClass; },
   getWrapperElement : function(){ return this.controllerWrapperElement; },
   isVisible : function(){ return this.controllerWrapperElement ? !parseBoolean( this.controllerWrapperElement.get( 'aria-hidden' )) : false; },
   
   //Protected, private helper methods
   addEvents : function(){
      this.controllerWrapperElement.addEvents({
         'hide' : this.hide,
         'show' : this.show
      });
      
      document.addEvents({
         'mousemove' : this.onMouseMove,
         'keydown' : this.onKeyDown,
         'keyup' : this.onKeyUp
      });
   }.protect(),
   
   createButtons : function(){
      this.mediaBackwardButton = new MediaBackwardButton( this.controlButtonsWrapper, { onSelected: this.onBackward }); this.mediaBackwardButton.construct();
      this.mediaBeginningButton = new MediaBeginningButton( this.controlButtonsWrapper, { onSelected: this.onBeginning }); this.mediaBeginningButton.construct();
      this.mediaEndButton = new MediaEndButton( this.controlButtonsWrapper, { onSelected: this.onEnd }); this.mediaEndButton.construct();
      this.mediaForwardButton = new MediaForwardButton( this.controlButtonsWrapper, { onSelected: this.onForward }); this.mediaForwardButton.construct();
      this.mediaStartStopButton = new MediaStartStopButton( this.controlButtonsWrapper, { onSelected: this.onStartStop, startPaused: this.options.startPaused }); this.mediaStartStopButton.construct();
   }.protect(),
   
   createControllerWrapperElements : function(){
      this.controllerWrapperElement = new Element( 'div', { 'class' : this.getControllerClass() });
      this.controllerWrapperElement.set({ 'aria-hidden' : false, 'role' : 'menubar' });
      this.controlButtonsWrapper = new Element( 'ul', { 'role' : 'menu' });
      this.controlButtonsWrapper.inject( this.controllerWrapperElement );
      this.controllerWrapperElement.inject( this.containerElement );
   }.protect(),
   
   destroyButtons : function(){
      if( this.mediaBeginningButton ) this.mediaBeginningButton.destroy();
      if( this.mediaEndButton ) this.mediaEndButton.destroy();
      if( this.mediaForwardButton ) this.mediaForwardButton.destroy();
      if( this.mediaStartStopButton ) this.mediaStartStopButton.destroy();
      if( this.mediaBackwardButton ) this.mediaBackwardButton.destroy();
   }.protect(),
   
   destroyControllerWrapperElement : function(){
      if( this.controllerWrapperElement && this.controllerWrapperElement.destroy ) this.controllerWrapperElement.destroy();
   }.protect(),

   finalizeConstruction : function(){
      this.fireEvent( 'constructed', this, this.options.eventDeliveryDelay );      
   }.protect(),
   
   instantiateShortCutKeys : function(){
      for( action in this.options.accessKeys ){
         var keyDefinition = this.options.accessKeys[action];
         var shortCutKey = new ShortCutKey( keyDefinition.key, new WidgetAction( action ), { 'label' : keyDefinition.label } );
         this.shortCutKeys.push( shortCutKey );
      }
   }.protect(),
   
   keyboardEventsAction : function( keyboardEvent ){
      var action = null;
      this.shortCutKeys.each( function( shortCutKey, index ) {
         if( shortCutKey.equalsWithKeyboardEvent( keyboardEvent ) ) {
            action = shortCutKey.getAction();
         }
      }, this );

      return action;
   },
   
   removeEvents : function(){
      if( this.controllerWrapperElement && this.controllerWrapperElement.removeEvents ) this.controllerWrapperElement.removeEvents();
      document.removeEvent( 'mousemove', this.onMouseMove );
      document.removeEvent( 'keydown', this.onKeyDown );
      document.removeEvent( 'keyup', this.onKeyUp );
   }.protect(),
   
   setUp : function(){
      this.instantiateShortCutKeys();
   }.protect()
   
});
