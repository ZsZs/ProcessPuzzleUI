/*
 * MooScroll beta [for mootools 1.2]
 * @author Jason J. Jaeger | greengeckodesign.com
 * @version 0.59
 * @license MIT-style License
 *       Permission is hereby granted, free of charge, to any person obtaining a copy
 *       of this software and associated documentation files (the "Software"), to deal
 *       in the Software without restriction, including without limitation the rights
 *       to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *       copies of the Software, and to permit persons to whom the Software is
 *       furnished to do so, subject to the following conditions:
 * 
 *       The above copyright notice and this permission notice shall be included in
 *       all copies or substantial portions of the Software.
 * 
 *       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *       IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *       FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *       AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *       LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *       OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *       THE SOFTWARE.
 */

//= require_directory ../FundamentalTypes

var ScrollArea = new Class({
   Implements : Options,
   Binds : ['onDocumentClick', 
            'onDocumentKeyDown', 
            'onDocumentMouseUp', 
            'onScrollableElementClick', 
            'onScrollableElementKeyDown', 
            'onScrollableElementMouseWheel',
            'onWindowResize'],
   options : {
      contentHeight : null,
      contentViewElementClass : 'contentEl',
      contentWidth : null,
      disabledOpacity : 0,
      downBtnClass : 'downBtn',
      handleOpacity : 1,
      handleActiveOpacity : 0.85,
      fullWindowMode : false,
      increment : 15,
      paddingElementClass : 'paddingEl',
      scrollBarClass : 'scrollBar',
      scrollHandleClass : 'scrollHandle',
      scrollHandleBGClass : 'scrollHandleBG',
      scrollHandleTopClass : 'scrollHandleTop',
      scrollHandleMiddleClass : 'scrollHandleMiddle',
      scrollHandleBottomClass : 'scrollHandleBottom',
      scrollControlsYClass : 'scrollControlsY',
      upBtnClass : 'upBtn'
   },

   initialize : function( scrollableElement, windowFxScroll, options ) {
      assertThat( scrollableElement, not( nil() ));
      this.setOptions( options );

      this.borderHeight;
      this.contentViewElement;
      this.contentWrapperElement;
      this.downInterval;
      this.hasFocusTimeout;
      this.scrollableElement = scrollableElement;
      this.scrollableElementPadding = this.scrollableElement.getStyles( 'padding-top', 'padding-right', 'padding-bottom', 'padding-left' );
      this.scrollableElementSize = this.scrollableElement.getStyles( 'height', 'width' );
      this.sliderTimeout;
      this.step;
      this.overHang;
      this.paddingHeight;
      this.paddingWidth;
      this.slider;
      this.upInterval;
      this.viewPort = { x : $( window ).getSize().x, y : $( window ).getSize().y };
      this.windowFxScroll = windowFxScroll;
   },

   // Public accessors and mutators
   construct : function() {
      this.createContentViewElement();
      this.determineBorderHeight();
      this.determinePadding();
      this.createPaddingElement();
      this.setContentElementStyle();
      
      if( this.options.fullWindowMode )  this.switchToFullWindowMode();
      this.createControlElements();
      this.fixIE6CSSbugs();
      this.determineOverHang();
      this.adjustContentWrapperWidth();
      this.setHandleHeight();

      this.initSlider();
      this.addScrollableElementEvents();
      this.addContentElementEvents();
      this.addScrollHandleEvents();
      this.addDocumentEvents();
      this.addWindowEvents();
      this.addUpButtonEvents();
      this.addDownButtonEvents();      
      
      this.refresh();
   },

   destroy : function() {
      this.removeContentElementEvents();
      this.removeDocumentEvents();
      this.removeDownButtonEvents();
      this.removeScrollableElementEvents();
      this.removeScrollHandleEvents();
      this.removeUpButtonEvents();
      this.removeWindowEvents();

      clearInterval( this.sliderTimeout );
      
      this.restoreContentElement();
      this.destroyControlElements();
      this.destroyPaddingElement();
      this.destroyContentElement();
   },

   loadContent : function(content) {
      this.slider.set( 0 );
      this.contentWrapperElement.empty().set( 'html', content );
      this.refresh();
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
         this.scrollUp( true );
      }else if (e.key === 'down' || e.key === 'space') {
         e = new Event( e ).stop();
         this.scrollDown( true );
      }
   },
   
   onScrollableElementMouseWheel : function( e ){
      e = new Event( e ).stop();
      if( e.wheel > 0) { this.scrollUp( true ); }
      else if( e.wheel < 0 ) { this.scrollDown( true ); }
   },
   
   onWindowResize : function( e ){
      clearInterval( this.refreshTimeout );
      if (this.options.fullWindowMode) {
         this.refreshTimeout = (function() {
            clearInterval( this.refreshTimeout );
            if (this.viewPort.x != $( window ).getSize().x || this.viewPort.y != $( window ).getSize().y) {
               this.refresh();
               this.viewPort.x = $( window ).getSize().x;
               this.viewPort.y = $( window ).getSize().y;
            }
         }.bind( this )).delay( 250 );
      }
   },

   refresh : function( size ) {
      this.setContentViewSize( size );
      
      this.determineOverHang();
      if( this.overHang <= 0 ){ this.greyOut();
      }else{ 
         this.unGrey();
         this.slider.setRange([ 0, this.overHang ]);
      }
      
      this.setHandleHeight();
      this.adjustContentWrapperWidth();
   },
   
   //Properties
   getContentViewElement : function() { return this.contentViewElement; },
   getContentWrapperElement : function(){ return this.contentWrapperElement; },

   // Protected, private helper methods
   addContentElementEvents : function(){
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
      this.downBtn.addEvents({
         'mousedown' : function( e ) {
            clearInterval( this.upInterval );
            clearInterval( this.downInterval );
            this.downInterval = this.scrollDown.periodical( 10, this );
            this.downBtn.addClass( this.options.downBtnClass + '-Active' );
         }.bind( this ),

         'mouseup' : function( e ) { this.stopScrollDown(); }.bind( this ),
         'mouseout' : function( e ) { this.stopScrollDown(); }.bind( this )
      });
   }.protect(),
   
   adjustContentWrapperWidth : function(){
      var rightMargin = this.overHang <= 0 ? '0px' : '15px';
      this.contentWrapperElement.setStyle( 'margin-right', rightMargin );
      this.determineOverHang();
   }.protect(),

   addScrollableElementEvents : function(){
      this.scrollableElement.addEvents({
         'mousewheel' : this.onScrollableElementMouseWheel,
         'keydown' : this.onScrollableElementKeyDown,
         'click' : this.onScrollableElementClick
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
      this.upBtn.addEvents({
         'mousedown' : function( e ) {
            clearInterval( this.upInterval );
            clearInterval( this.downInterval );
            this.upInterval = this.scrollUp.periodical( 10, this );
            this.upBtn.addClass( this.options.upBtnClass + '-Active' );
         }.bind( this ),

         'mouseup' : function( e ) { this.stopScrollUp(); }.bind( this ),
         'mouseout' : function( e ) { this.stopScrollUp(); }.bind( this )
      } );
   }.protect(),
   
   addWindowEvents : function(){
      window.addEvent( 'resize', this.onWindowResize );
   }.protect(),
   
   createContentViewElement : function(){
      this.contentViewElement = new Element( 'div', { 'class' : this.options.contentViewElementClass });
      this.contentViewElement.wraps( this.scrollableElement );
      this.contentViewElement.setStyles({  overflow : 'hidden', padding : 0, });
      this.setContentViewSize();
   }.protect(),
   
   createControlElements : function() {
      this.scrollControlsYWrapper = new Element( 'div', { 'class' : this.options.scrollControlsYClass }).inject( this.contentViewElement, 'bottom' );
      this.upBtn = new Element( 'div', { 'class' : this.options.upBtnClass }).inject( this.scrollControlsYWrapper, 'bottom' );
      this.downBtn = new Element( 'div', { 'class' : this.options.downBtnClass }).inject( this.scrollControlsYWrapper, 'bottom' );
      this.scrollBar = new Element( 'div', { 'class' : this.options.scrollBarClass }).inject( this.scrollControlsYWrapper, 'bottom' );
      this.scrollHandle = new Element( 'div', { 'class' : this.options.scrollHandleClass }).inject( this.scrollBar, 'inside' );
      this.scrollHandleTop = new Element( 'div', { 'class' : this.options.scrollHandleTopClass }).inject( this.scrollHandle, 'inside' );
      this.scrollHandleBG = new Element( 'div', { 'class' : this.options.scrollHandleBGClass }).inject( this.scrollHandle, 'inside' );
      this.scrollHandleMiddle = new Element( 'div', { 'class' : this.options.scrollHandleMiddleClass }).inject( this.scrollHandle, 'inside' );
      this.scrollHandleBottom = new Element( 'div', { 'class' : this.options.scrollHandleBottomClass }).inject( this.scrollHandle, 'inside' );
      this.coverUp = new Element( 'div' ).inject( this.scrollControlsYWrapper, 'bottom' );
   }.protect(),
   
   createPaddingElement : function(){
      this.contentWrapperElement = new Element( 'div', { 'class' : this.options.paddingElementClass });
      this.contentWrapperElement.adopt( this.contentViewElement.getChildren() );
      this.contentWrapperElement.inject( this.contentViewElement, 'top' );
      this.contentWrapperElement.setStyles( this.scrollableElementPadding );
      this.contentWrapperElement.setStyles({ display: 'inline', float: 'left', width: '100%' });
   }.protect(),
   
   destroyContentElement : function(){
      if( this.contentViewElement && this.contentViewElement.destroy ){
         this.contentViewElement.destroy();
         this.contentViewElement = null;
      }
   }.protect(),
   
   destroyControlElements : function(){
      if( this.upBtn ){ this.upBtn.destroy(); this.upBtn = null; }
      if( this.downBtn ){ this.downBtn.destroy(); this.downBtn = null; }
      if( this.scrollHandleTop ){ this.scrollHandleTop.destroy(); this.scrollHandleTop = null; }
      if( this.scrollHandleBG ){ this.scrollHandleBG.destroy(); this.scrollHandleBG = null; }
      if( this.scrollHandleMiddle ){ this.scrollHandleMiddle.destroy(); this.scrollHandleMiddle = null; }
      if( this.scrollHandleBottom ){ this.scrollHandleBottom.destroy(); this.scrollHandleBottom = null; }
      if( this.scrollHandle ){ this.scrollHandle.destroy(); this.scrollHandle = null; }
      if( this.coverUp ){ this.coverUp.destroy(); this.coverUp = null; }
      if( this.scrollBar ){ this.scrollBar.destroy(); this.scrollBar = null; }
      if( this.scrollControlsYWrapper ){ this.scrollControlsYWrapper.destroy(); this.scrollControlsYWrapper = null; }
   }.protect(),
   
   destroyPaddingElement : function(){
      if( this.contentWrapperElement && this.contentWrapperElement.destroy ){ 
         this.contentWrapperElement.destroy();
         this.contentWrapperElement = null;
      }
   }.protect(),
   
   determineBorderHeight : function(){
      this.borderHeight = parseFloat( this.scrollableElement.getStyle( 'border-top-width' )) + parseFloat( this.scrollableElement.getStyle( 'border-bottom-width' ));
   }.protect(),
   
   determineOverHang : function(){
      this.overHang = this.contentWrapperElement.getSize().y - this.contentViewElement.getSize().y;
   }.protect(),
   
   determinePadding : function(){
      this.paddingHeight = parseFloat( this.scrollableElement.getStyle( 'padding-top' )) + parseFloat( this.scrollableElement.getStyle( 'padding-bottom' ) );
      this.paddingWidth = parseFloat( this.scrollableElement.getStyle( 'padding-left' )) + parseFloat( this.scrollableElement.getStyle( 'padding-right' ) );
   }.protect(),
   
   initSlider : function() {
      var upperBound = this.overHang >= 0 ? Math.round( this.overHang ) : 0;
      this.slider = new Slider( this.scrollBar, this.scrollHandle, {
         range : [ 0, upperBound ],
         mode : 'vertical',
         onChange : function( step, e ) {
            this.contentViewElement.scrollTo( 0, step );
            this.webKitKludge( step );
         }.bind( this )
      });
      
      this.slider.set( 0 );
   }.protect(),
   
   fixIE6CSSbugs : function() {
      // fix some CSS bugs for IE6
      if (Browser.Engine.trident4) {
         this.scrollableElement.setStyle( 'height', this.scrollableElement.getStyle( 'height' ) );
         this.contentViewElement.setStyle( 'height', this.scrollableElement.getStyle( 'height' ) );
         var top = this.scrollBar.getStyle( 'top' ).toInt();
         var bottom = this.scrollBar.getStyle( 'bottom' ).toInt();
         var parentHeight = this.contentViewElement.getSize().y - this.borderHeight;
         this.scrollControlsYWrapper.setStyles({ 'height' : parentHeight });
         this.scrollBar.setStyles({ 'height' : parentHeight - top - bottom });
      }
   }.protect(),

   greyOut : function() {
      this.scrollHandle.setStyles({ 'display' : 'none' });
      this.upBtn.setStyles({ 'opacity' : this.options.disabledOpacity });
      this.scrollControlsYWrapper.setStyles({ opacity : this.options.disabledOpacity });
      this.downBtn.setStyles({ 'opacity' : this.options.disabledOpacity });
      this.scrollBar.setStyles({ 'opacity' : this.options.disabledOpacity });
      this.coverUp.setStyles({
         'display' : 'block',
         'position' : 'absolute',
         'background' : 'white',
         'opacity' : 0.01,
         'right' : '0',
         'top' : '0',
         'width' : '100%',
         'height' : this.scrollControlsYWrapper.getSize().y
      });
   }.protect(),

   removeContentElementEvents : function(){
      if( this.contentViewElement && this.contentViewElement.removeEvents ) this.contentViewElement.removeEvents();
   }.protect(),
   
   removeDocumentEvents : function(){
      document.removeEvent( 'mouseup', this.onDocumentMouseUp );
      document.removeEvent( 'keydown', this.onDocumentKeyDown );
      document.removeEvent( 'click', this.onDocumentClick );
   }.protect(),
   
   removeDownButtonEvents : function(){
      if( this.downBtn && this.downBtn.removeEvents ) this.downBtn.removeEvents();
      this.stopScrollDown();
   }.protect(),
   
   removeScrollableElementEvents : function(){
      if( this.scrollableElement && this.scrollableElement.removeEvent ){
         this.scrollableElement.removeEvent( 'mousewheel', this.onScrollableElementMouseWheel );
         this.scrollableElement.removeEvent( 'keydown', this.onScrollableElementKeyDown );
         this.scrollableElement.removeEvent( 'click', this.onScrollableElementClick );
      }
   }.protect(),
   
   removeScrollHandleEvents : function(){
      if( this.scrollHandle && this.scrollHandle.removeEvents ) this.scrollHandle.removeEvents();
   }.protect(),
   
   removeUpButtonEvents : function(){
      if( this.upBtn && this.upBtn.removeEvents ) this.upBtn.removeEvents();
      this.stopScrollUp();
      
   }.protect(),
   
   removeWindowEvents : function(){
      window.removeEvent( 'resize', this.onWindowResize );
   }.protect(),
   
   restoreContentElement : function(){
      if( this.contentViewElement ){
         this.scrollableElement.dispose();
         this.scrollableElement.inject( this.contentViewElement, 'before' );
      }
      
      this.scrollableElement.setStyles( this.scrollableElementSize );
   }.protect(),
   
   scrollUp : function(scrollPageWhenDone) {
      var target = this.contentViewElement.getScroll().y - this.options.increment;
      this.slider.set( target );
   },

   scrollDown : function(scrollPageWhenDone) {
      var target = this.contentViewElement.getScroll().y + this.options.increment;
      this.slider.set( target );
   },

   setContentElementStyle : function(){
      this.scrollableElement.setStyles({ height : '100%', margin : '0px', padding : '0px', width : '100%' });
   }.protect(),
   
   setContentViewSize : function( size ){
      if( size && size.x && size.y ){
         this.options.contentHeight = size.y - this.paddingHeight;
         this.options.contentWidth = this.overHang <= 0 ? size.x - this.paddingWidth : size.x -15 - this.paddingWidth;
      }

      var height = this.options.contentHeight ? this.options.contentHeight : parseInt( this.scrollableElement.getStyle( 'height' )) - this.paddingHeight;  
      var width = this.options.contentWidth ? this.options.contentWidth : parseInt( this.scrollableElement.getStyle( 'width' )) - this.paddingWidth;  
      this.contentViewElement.setStyles({ width : width + 'px', height : height + 'px' });
   }.protect(),
   
   setHandleHeight : function() {
      var handleHeightPercent = (100 - (( this.overHang * 100 ) / this.contentViewElement.getSize().y));
      this.handleHeight = (( handleHeightPercent * this.scrollableElement.getSize().y) / 100 ) - (this.scrollHandleTop.getSize().y + this.scrollHandleBottom.getSize().y );
      if ((this.handleHeight + this.scrollHandleTop.getSize().y + this.scrollHandleBottom.getSize().y) >= this.scrollBar.getSize().y) {
         this.handleHeight -= (this.scrollHandleTop.getSize().y + this.scrollHandleBottom.getSize().y) * 2;
      }
      
      if( this.scrollHandle.getStyle( 'min-height' ) && this.handleHeight < parseFloat( this.scrollHandle.getStyle( 'min-height' ) )) {
         this.handleHeight = parseFloat( this.scrollHandle.getStyle( 'min-height' ) ) + this.scrollHandleBottom.getSize().y + this.scrollHandleTop.getSize().y;
      }
      
      this.scrollHandle.setStyles({ 'height' : this.handleHeight });
   }.protect(),

   setSlider : function(v) {
      if( v == 'top' ) { this.slider.set( 0 );
      }else if ( v == 'bottom' ) { this.slider.set( '100%' );
      }else { this.slider.set( v ); }
   }.protect(),
   
   stopScroll : function(){
      this.stopScrollDown();
      this.stopScrollUp();
   }.protect(),
   
   stopScrollDown : function(){
      clearInterval( this.downInterval );
      this.downBtn.removeClass( this.options.downBtnClass + '-Active' );
   },
   
   stopScrollUp : function(){
      clearInterval( this.downInterval );
      this.upBtn.removeClass( this.options.upBtnClass + '-Active' );
   },
   
   switchToFullWindowMode : function(){
      $( document ).getElement( 'html' ).setStyle( 'overflow', 'hidden' );
      this.scrollableElement.setStyles({ 'height' : '100%', 'width' : '100%', 'position' : 'absolute' });
      this.contentViewElement.setStyles({ 'height' : '100%', 'width' : '100%', 'position' : 'absolute' });
   }.protect(),

   unGrey : function() {
      this.scrollHandle.setStyles({ 'display' : 'block', 'height' : 'auto' });
      this.scrollControlsYWrapper.setStyles({ opacity : 1 });
      this.upBtn.setStyles({ 'opacity' : 1 });
      this.downBtn.setStyles({ 'opacity' : 1 });
      this.scrollBar.setStyles({ 'opacity' : 1 });
      this.coverUp.setStyles({ 'display' : 'none', 'width' : 0, 'height' : 0 });
      this.setHandleHeight();
   }.protect(),

   webKitKludge : function(step) {
      if (!Browser.Engine.webkit) {
         return;
      }
      // if scrollHandle is within 1% of the bottom, kick it down that last
      // little bit since webkit browsers seem to
      // have trouble getting it that last little bit sometimes (varies with
      // amount of content.. probably due to rounding)
      if( this.step > step ) {
         this.step = step;
         return;
      }
      clearInterval( this.sliderTimeout );
      this.sliderTimeout = (function() {
         clearInterval( this.sliderTimeout );
         var onePercent = (1 * this.contentWrapperElement.getSize().y) / 100;
         if ((onePercent + step) >= this.overHang) {
            if (this.contentWrapperElementTopMargin == null) {
               this.contentWrapperElementTopMargin = parseFloat( this.contentWrapperElement.getStyle( 'margin-top' ) );
            }
            this.contentWrapperElement.setStyle( 'margin-top', this.contentWrapperElementTopMargin - onePercent );
            if (!this.scrollHandleTopMargin) {
               this.scrollHandleTopMargin = parseFloat( this.scrollHandle.getStyle( 'margin-top' ) );
            }
            this.scrollHandle.setStyle( 'margin-top', this.scrollHandleTopMargin + 2 );
            this.contentViewElement.scrollTo( 0, this.overHang );
            this.step = this.overHang;

         } else {
            this.contentWrapperElement.setStyle( 'margin-top', this.contentWrapperElementTopMargin );
            this.scrollHandle.setStyle( 'margin-top', this.scrollHandleTopMargin );
            this.contentViewElement.scrollTo( 0, step );
            this.step = step;
         }
      }.bind( this )).delay( 10 );

   }

});
