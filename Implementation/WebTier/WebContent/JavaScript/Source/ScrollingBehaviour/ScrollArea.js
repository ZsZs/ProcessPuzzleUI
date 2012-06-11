/*
Name: 
    - ScrollArea

Description: 
    - Wraps scrollable element into a scroll window and adds scroll controls.

Requires:
    - 
Provides:
    - ScrollingArea

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

var ScrollArea = new Class({
   Implements : Options,
   Binds : ['onScrollContent', 'onScrollableElementClick', 'onScrollableElementKeyDown', 'onScrollableElementMouseWheel'],
   options : {
      componentName : "ScrollArea",
      contentHeight : null,
      contentViewElementClass : 'contentEl',
      contentWidth : null,
      handleOpacity : 1,
      handleActiveOpacity : 0.85,
      paddingElementClass : 'paddingEl',
   },

   initialize : function( scrollableElement, windowFxScroll, options ) {
      assertThat( scrollableElement, not( nil() ));
      this.setOptions( options );

      this.borderHeight;
      this.contentViewElement;
      this.contentWrapperElement;
      this.hasFocusTimeout;
      this.scrollableElement = scrollableElement;
      this.scrollableElementPadding = this.scrollableElement.getStyles( 'padding-top', 'padding-right', 'padding-bottom', 'padding-left' );
      this.scrollableElementSize = this.scrollableElement.getStyles( 'height', 'width' );
      this.scrollControls;
      this.sliderTimeout;
      this.step;
      this.overHang;
      this.paddingHeight;
      this.paddingWidth;
      this.windowFxScroll = windowFxScroll;
   },

   // Public accessors and mutators
   construct : function() {
      this.createContentViewElement();
      this.determineBorderHeight();
      this.determinePadding();
      this.createPaddingElement();
      this.setContentElementStyle();
      
      this.adjustContentWrapperWidth();
      this.determineOverHang();
      this.constructScrollControls();
      
      this.addScrollableElementEvents();
   },

   destroy : function() {
      this.removeScrollableElementEvents();
      
      this.restoreContentElement();
      
      this.destroyScrollControls();
      this.destroyPaddingElement();
      this.destroyContentViewElement();
   },

   onScrollContent : function( step ){
      this.contentViewElement.scrollTo( 0, step );
   },
   
   onScrollableElementClick : function( e ){
      this.hasFocus = true;
      this.hasFocusTimeout = (function() {
         clearInterval( this.hasFocusTimeout );
         this.hasFocus = true;
      }.bind( this )).delay( 50 );
   },
   
   onScrollableElementKeyDown : function( e ){
      if( e.key === 'up' ) {
         e = new Event( e ).stop();
         this.scrollControls.scrollUp();
      }else if (e.key === 'down' || e.key === 'space') {
         e = new Event( e ).stop();
         this.scrollControls.scrollDown();
      }
   },
   
   onScrollableElementMouseWheel : function( mouseWheelEvent ){
      //event = new Event( mouseWheelEvent )
      mouseWheelEvent.stop();
      if( mouseWheelEvent.wheel > 0) { this.scrollControls.scrollUp(); }
      else if( mouseWheelEvent.wheel < 0 ) { this.scrollControls.scrollDown(); }
   },
   
   refresh : function( size ) {
      this.setContentViewSize( size );
      this.adjustContentWrapperWidth();
      this.determineOverHang();
      this.scrollControls.refresh( this.overHang );
   },
   
   //Properties
   getContentViewElement : function() { return this.contentViewElement; },
   getContentViewSize : function() { 
      var contentWidth = this.contentViewElement.getSize().x;
      contentWidth -= parseInt( this.contentWrapperElement.getStyle( 'margin-left' )) + parseInt( this.contentWrapperElement.getStyle( 'margin-right' ));
      contentWidth -= parseInt( this.contentWrapperElement.getStyle( 'padding-left' )) + parseInt( this.contentWrapperElement.getStyle( 'padding-right' ));
      contentWidth += this.scrollControls.getEffectiveWidth();
      if( this.scrollControls.isVisible() ) contentWidth -= this.scrollControls.getWidth();
      return { x : contentWidth, y : this.contentViewElement.getSize().y }; },
   getContentWrapperElement : function(){ return this.contentWrapperElement; },

   // Protected, private helper methods
   adjustContentWrapperWidth : function(){
      this.determineOverHang();
      var rightMargin = this.overHang <= 0 ? '0px' : '15px';
      this.contentWrapperElement.setStyle( 'margin-right', rightMargin );
   }.protect(),

   addScrollableElementEvents : function(){
      this.scrollableElement.addEvents({
         'mousewheel' : this.onScrollableElementMouseWheel,
         'keydown' : this.onScrollableElementKeyDown,
         'click' : this.onScrollableElementClick
      });
   }.protect(),
   
   constructScrollControls : function(){
      this.scrollControls = new ScrollControls( this.contentViewElement, this.overHang, { onScrollContent : this.onScrollContent } );
      this.scrollControls.construct();
   }.protect(),
   
   createContentViewElement : function(){
      this.contentViewElement = new Element( 'div', { 'class' : this.options.contentViewElementClass });
      this.contentViewElement.wraps( this.scrollableElement );
      this.contentViewElement.setStyles({  overflow : 'hidden', padding : 0, });
      this.determinePadding();
      this.setContentViewSize();
   }.protect(),
   
   createPaddingElement : function(){
      this.contentWrapperElement = new Element( 'div', { 'class' : this.options.paddingElementClass });
      this.contentWrapperElement.adopt( this.contentViewElement.getChildren() );
      this.contentWrapperElement.inject( this.contentViewElement, 'top' );
      this.contentWrapperElement.setStyles( this.scrollableElementPadding );
      this.contentWrapperElement.setStyles({ display: 'inline', 'float': 'left' });
   }.protect(),
   
   destroyContentViewElement : function(){
      if( this.contentViewElement && this.contentViewElement.destroy ){
         this.contentViewElement.destroy();
         this.contentViewElement = null;
      }
   }.protect(),
   
   destroyPaddingElement : function(){
      if( this.contentWrapperElement && this.contentWrapperElement.destroy ){ 
         this.contentWrapperElement.destroy();
         this.contentWrapperElement = null;
      }
   }.protect(),
   
   destroyScrollControls : function(){
      if( this.scrollControls ){
         this.scrollControls.removeEvent( 'scrollContent', this.onScrollContent );
         this.scrollControls.destroy();      
      }
   }.protect(),
   
   determineBorderHeight : function(){
      this.borderHeight = parseFloat( this.scrollableElement.getStyle( 'border-top-width' )) + parseFloat( this.scrollableElement.getStyle( 'border-bottom-width' ));
   }.protect(),
   
   determineOverHang : function(){
      this.overHang = this.scrollableElement.getSize().y + parseInt( this.contentWrapperElement.getStyle( 'padding-top' )) - this.contentViewElement.getSize().y;
   }.protect(),
   
   determinePadding : function(){
      this.paddingHeight = parseFloat( this.scrollableElement.getStyle( 'padding-top' )) + parseFloat( this.scrollableElement.getStyle( 'padding-bottom' ) );
      this.paddingWidth = parseFloat( this.scrollableElement.getStyle( 'padding-left' )) + parseFloat( this.scrollableElement.getStyle( 'padding-right' ) );
   }.protect(),
   
   removeScrollableElementEvents : function(){
      if( this.scrollableElement && this.scrollableElement.removeEvent ){
         this.scrollableElement.removeEvent( 'mousewheel', this.onScrollableElementMouseWheel );
         this.scrollableElement.removeEvent( 'keydown', this.onScrollableElementKeyDown );
         this.scrollableElement.removeEvent( 'click', this.onScrollableElementClick );
      }
   }.protect(),
   
   restoreContentElement : function(){
      if( this.contentViewElement ){
         this.scrollableElement.dispose();
         this.scrollableElement.inject( this.contentViewElement, 'before' );
      }
      
      this.scrollableElement.setStyles( this.scrollableElementSize );
   }.protect(),
   
   setContentElementStyle : function(){
      this.scrollableElement.setStyles({ height : '100%', margin : '0px', padding : '0px', width : '100%' });
   }.protect(),
   
   setContentViewSize : function( size ){      
      if( size && size.x && size.y ){
         this.options.contentHeight = size.y;
         this.options.contentWidth = size.x;
      }else if( !this.options.contentHeight && !this.options.contentWidth ){
         this.options.contentHeight = parseInt( this.scrollableElement.getStyle( 'height' ));
         this.options.contentWidth = parseInt( this.scrollableElement.getStyle( 'width' ));
      }

      this.contentViewElement.setStyles({ width : this.options.contentWidth + 'px', height : this.options.contentHeight + 'px' });
   }.protect()
 
});
