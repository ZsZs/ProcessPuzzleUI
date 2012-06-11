/*
Name: 
    - ScrollControls

Description: 
    - User interface for the scrolling behaviour.

Requires:
    - 
Provides:
    - ScrollConstrols

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

var ScrollControls = new Class({
   Implements : [Events, Options],
   Binds : ['onDocumentClick', 'onDocumentKeyDown', 'onDocumentMouseUp', 'scrollDown', 'scrollUp'],
   options : {
      componentName : "ScrollControls",
      disabledOpacity : 0,
      downBtnClass : 'downBtn',
      increment : 15,
      scrollBarClass : 'scrollBar',
      scrollControlsYClass : 'scrollControlsY',
      scrollHandleClass : 'scrollHandle',
      scrollHandleBGClass : 'scrollHandleBG',
      scrollHandleTopClass : 'scrollHandleTop',
      scrollHandleMiddleClass : 'scrollHandleMiddle',
      scrollHandleBottomClass : 'scrollHandleBottom',
      scrollSlotClass : 'scrollSlot',
      upBtnClass : 'upBtn'
   },

   initialize : function( contentViewElement, overHang, options ) {
      assertThat( contentViewElement, not( nil() ));
      assertThat( overHang, not( nil() ));
      this.setOptions( options );

      this.contentViewElement = contentViewElement;
      this.downButton;
      this.downInterval;
      this.overHang = overHang;
      this.scrollSlot;
      this.scrollHandle;
      this.scrollHandleBG;
      this.slider;
      this.state = BrowserWidget.States.INITIALIZED;
      this.upButton;
      this.upInterval;
   },

   // Public accessors and mutators
   construct : function() {
      this.createControlElements();
      this.setHeights();
      this.createSlider();
      this.illuminateScrollControls();      
      
      this.addScrollHandleEvents();
      this.addUpButtonEvents();
      this.addDownButtonEvents();
      this.addContentViewEvents();
      this.addDocumentEvents();
      
      this.state = BrowserWidget.States.CONSTRUCTED;
   },

   destroy : function() {
      clearInterval( this.sliderTimeout );
      this.removeScrollHandleEvents();
      this.removeDownButtonEvents();
      this.removeUpButtonEvents();
      this.removeContentViewEvents();
      this.removeDocumentEvents();
      
      this.destroySlider();
      this.destroyControlElements();
      
      this.state = BrowserWidget.States.INITIALIZED;
   },
   
   onDocumentClick : function( e ){
      this.hasFocus = false;
   },
   
   onDocumentKeyDown : function( e ){
      if(( this.hasFocus || this.options.fullWindowMode ) && ( e.key === 'down' || e.key === 'space' || e.key === 'up' )) {
         this.scrollableElement.fireEvent( 'keydown', e );
      }
   },
   
   onDocumentMouseUp : function( e ){
      this.scrollHandle.removeClass( this.options.scrollHandleClass + '-Active' ).setStyle( 'opacity', this.options.handleOpacity );
      this.stopScrollUp();
      this.stopScrollDown();
   },
   
   refresh : function( overHang ){
      this.overHang = overHang;
      this.updateSlider();
      this.illuminateScrollControls();      
      this.setHeights();
   },
   
   scrollDown : function() {
      var target = this.contentViewElement.getScroll().y + this.options.increment;
      this.slider.set( target );
   },

   scrollUp : function() {
      var target = this.contentViewElement.getScroll().y - this.options.increment;
      if( target < 0 ) target = 0;
      this.slider.set( target );
   },

   //Properties
   getEffectiveWidth : function() { return ( this.isVisible() ? this.getWidth() : 0 ); },
   getSlider : function() { return this.slider; },
   getWidth : function() { return this.scrollControlsYWrapper ? this.scrollControlsYWrapper.getSize().x : 0; },
   isVisible : function() { return this.overHang > 0 ? true : false; },


   // Protected, private helper methods
   addContentViewEvents : function(){
      this.contentViewElement.addEvents({
         'scroll' : function(e) {
            this.slider.set( this.contentViewElement.getScroll().y );
         }.bind( this )
      });
   }.protect(),
   
   addDocumentEvents : function(){
      document.addEvents({
         'mouseup' : this.onDocumentMouseUp,
         'keydown' : this.onDocumentKeyDown,
         'click' : this.onDocumentClick
      });
   }.protect(),
   
   addDownButtonEvents : function(){
      this.downButton.addEvents({
         'mousedown' : function( e ) {
            clearInterval( this.upInterval );
            clearInterval( this.downInterval );
            this.downInterval = this.scrollDown.periodical( 10, this );
            this.downButton.addClass( this.options.downBtnClass + '-Active' );
         }.bind( this ),

         'mouseup' : function( e ) { this.stopScrollDown(); }.bind( this ),
         'mouseout' : function( e ) { this.stopScrollDown(); }.bind( this )
      });
   }.protect(),
   
   addScrollHandleEvents : function(){
      this.scrollHandle.addEvents({
         'mousedown' : function(e) {
            this.scrollHandle.addClass( this.options.scrollHandleClass + '-Active' ).setStyle( 'opacity', this.options.handleActiveOpacity );
         }.bind( this )
      });
   }.protect(),
   
   addUpButtonEvents : function(){
      this.upButton.addEvents({
         'mousedown' : function( e ) {
            clearInterval( this.upInterval );
            clearInterval( this.downInterval );
            this.upInterval = this.scrollUp.periodical( 10, this );
            this.upButton.addClass( this.options.upBtnClass + '-Active' );
         }.bind( this ),

         'mouseup' : function( e ) { this.stopScrollUp(); }.bind( this ),
         'mouseout' : function( e ) { this.stopScrollUp(); }.bind( this )
      } );
   }.protect(),
      
   createControlElements : function() {
      this.scrollControlsYWrapper = new Element( 'div', { 'class' : this.options.scrollControlsYClass }).inject( this.contentViewElement, 'bottom' );
      this.upButton = new Element( 'div', { 'class' : this.options.upBtnClass }).inject( this.scrollControlsYWrapper, 'bottom' );
      this.downButton = new Element( 'div', { 'class' : this.options.downBtnClass }).inject( this.scrollControlsYWrapper, 'bottom' );
      this.scrollSlot = new Element( 'div', { 'class' : this.options.scrollSlotClass }).inject( this.scrollControlsYWrapper, 'bottom' );
      this.scrollHandle = new Element( 'div', { 'class' : this.options.scrollHandleClass }).inject( this.scrollSlot, 'inside' );
      this.scrollHandleTop = new Element( 'div', { 'class' : this.options.scrollHandleTopClass }).inject( this.scrollHandle, 'inside' );
      this.scrollHandleBG = new Element( 'div', { 'class' : this.options.scrollHandleBGClass }).inject( this.scrollHandle, 'inside' );
      this.scrollHandleMiddle = new Element( 'div', { 'class' : this.options.scrollHandleMiddleClass }).inject( this.scrollHandle, 'inside' );
      this.scrollHandleBottom = new Element( 'div', { 'class' : this.options.scrollHandleBottomClass }).inject( this.scrollHandle, 'inside' );
   }.protect(),
   
   createSlider : function() {
      var upperBound = this.overHang >= 0 ? Math.round( this.overHang ) : 0;
      this.slider = new Slider( this.scrollSlot, this.scrollHandle, {
         range : [ 0, upperBound ],
         mode : 'vertical',
         snap : true,
         onChange : function( step, e ) {
            if( this.state == BrowserWidget.States.CONSTRUCTED ) this.fireEvent( 'scrollContent', step );
         }.bind( this )
      });
      
      this.slider.set( 0 );
   }.protect(),
   
   destroyControlElements : function(){
      if( this.upButton ){ this.upButton.destroy(); this.upButton = null; }
      if( this.downButton ){ this.downButton.destroy(); this.downButton = null; }
      if( this.scrollHandleTop ){ this.scrollHandleTop.destroy(); this.scrollHandleTop = null; }
      if( this.scrollHandleBG ){ this.scrollHandleBG.destroy(); this.scrollHandleBG = null; }
      if( this.scrollHandleMiddle ){ this.scrollHandleMiddle.destroy(); this.scrollHandleMiddle = null; }
      if( this.scrollHandleBottom ){ this.scrollHandleBottom.destroy(); this.scrollHandleBottom = null; }
      if( this.scrollHandle ){ this.scrollHandle.destroy(); this.scrollHandle = null; }
      if( this.scrollSlot ){ this.scrollSlot.destroy(); this.scrollSlot = null; }
      if( this.scrollControlsYWrapper ){ this.scrollControlsYWrapper.destroy(); this.scrollControlsYWrapper = null; }
   }.protect(),
   
   destroySlider: function(){
      if( this.slider ){
         this.slider.removeEvents();
         this.slider = null;
      }
   }.protect(),
   
   greyOut : function() {
      this.scrollHandle.setStyles({ opacity : this.options.disabledOpacity });
      this.scrollHandleTop.setStyles({ opacity : this.options.disabledOpacity });
      this.scrollHandleBG.setStyles({ opacity : this.options.disabledOpacity });
      this.scrollHandleMiddle.setStyles({ opacity : this.options.disabledOpacity });
      this.scrollHandleBottom.setStyles({ opacity : this.options.disabledOpacity });
      this.upButton.setStyles({ opacity : this.options.disabledOpacity });
      this.scrollControlsYWrapper.setStyles({ opacity : this.options.disabledOpacity });
      this.downButton.setStyles({ opacity : this.options.disabledOpacity });
      this.scrollSlot.setStyles({ opacity : this.options.disabledOpacity });
   }.protect(),
   
   illuminateScrollControls : function(){
      if( this.overHang <= 0 ){ this.greyOut();
      }else{ this.unGrey(); }
   }.protect(),

   removeContentViewEvents : function(){
      if( this.contentViewElement && this.contentViewElement.removeEvents ) this.contentViewElement.removeEvents();
   }.protect(),
   
   removeDocumentEvents : function(){
      document.removeEvent( 'mouseup', this.onDocumentMouseUp );
      document.removeEvent( 'keydown', this.onDocumentKeyDown );
      document.removeEvent( 'click', this.onDocumentClick );
   }.protect(),
   
   removeDownButtonEvents : function(){
      if( this.downButton && this.downButton.removeEvents ) this.downButton.removeEvents();
      this.stopScrollDown();
   }.protect(),
   
   removeScrollHandleEvents : function(){
      if( this.scrollHandle && this.scrollHandle.removeEvents ) this.scrollHandle.removeEvents();
   }.protect(),
   
   removeUpButtonEvents : function(){
      if( this.upButton && this.upButton.removeEvents ) this.upButton.removeEvents();
      this.stopScrollUp();
      
   }.protect(),
   
   setHandleHeight : function() {
      var handleHeightRatio = this.overHang > 0 ? 1 / ( 1 + this.overHang / this.contentViewElement.getSize().y ) : 1;
      var slotHeight = this.scrollSlot.getSize().y;
      var handleHeight = Math.round( handleHeightRatio * slotHeight );
      
      var minimumHandleHeight = this.scrollHandleBottom.getSize().y + this.scrollHandleTop.getSize().y;
      if( handleHeight < minimumHandleHeight ) {
         handleHeight = minimumHandleHeight;
      }
      
      this.scrollHandle.setStyles({ height : handleHeight + 'px' });
      
      var handleMiddleHeight = handleHeight - ( this.scrollHandleTop.getSize().y + this.scrollHandleBottom.getSize().y );
      handleMiddleHeight = handleMiddleHeight > 0 ? handleMiddleHeight : 0;
      this.scrollHandleBG.setStyles({ height : handleMiddleHeight + 'px' });
   }.protect(),
   
   setHeights : function(){
      this.setScrollSlotHeight();
      this.setHandleHeight();
   }.protect(),
   
   setScrollSlotHeight : function(){
      var slotHeight = this.contentViewElement.getSize().y - ( this.downButton.getSize().y + this.upButton.getSize().y + parseInt( this.scrollSlot.getStyle( 'top' )) + parseInt( this.scrollSlot.getStyle( 'margin-bottom' )));
      slotHeight = slotHeight > 0 ? slotHeight : 0;
      this.scrollSlot.setStyles({ height : slotHeight + 'px' });
   }.protect(),

   stopScroll : function(){
      this.stopScrollDown();
      this.stopScrollUp();
   }.protect(),
   
   stopScrollDown : function(){
      clearInterval( this.downInterval );
      if( this.downButton && this.downButton.removeClass ) this.downButton.removeClass( this.options.downBtnClass + '-Active' );
   },
   
   stopScrollUp : function(){
      clearInterval( this.downInterval );
      if( this.upButton && this.upButton.removeClass ) this.upButton.removeClass( this.options.upBtnClass + '-Active' );
   },
   
   unGrey : function() {
      this.scrollHandle.setStyles({ display : 'block', opacity : 1 });
      this.scrollHandleTop.setStyles({ opacity : 1 });
      this.scrollHandleBG.setStyles({ opacity : 1 });
      this.scrollHandleMiddle.setStyles({ opacity : 1 });
      this.scrollHandleBottom.setStyles({ opacity : 1 });
      this.scrollControlsYWrapper.setStyles({ opacity : 1 });
      this.upButton.setStyles({ opacity : 1 });
      this.downButton.setStyles({ opacity : 1 });
      this.scrollSlot.setStyles({ opacity : 1 });
   }.protect(),
   
   updateSlider : function(){
      if( this.overHang > 0 ) this.slider.setRange([ 0, this.overHang ]);
      this.slider.set( 0 );
   }

});
