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

//= require_directory ../MooTools
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
      contentElementClass : 'contentEl',
      disabledOpacity : 0,
      downBtnClass : 'downBtn',
      handleOpacity : 1,
      handleActiveOpacity : 0.85,
      fullWindowMode : false,
      increment : 30,
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
      this.contentEl;
      this.scrollableElement = scrollableElement.setProperty( 'rel', 'MooScrollArea' );
      this.scrollableElementPadding = this.scrollableElement.getStyles( 'padding-top', 'padding-right', 'padding-bottom', 'padding-left' );
      this.overHang;
      this.paddingEl;
      this.paddingHeight;
      this.paddingWidth;
      this.slider;
      this.viewPort = { x : $( window ).getSize().x, y : $( window ).getSize().y };
      this.windowFxScroll = windowFxScroll;
   },

   // Public accessors and mutators
   construct : function() {
      this.createContentElement();
      this.adjustScrollableElementSize();
      this.determineBorderHeight();
      this.setContentElementStyle();
      this.createPaddingElement();
      
      if( this.options.fullWindowMode )  this.switchToFullWindowMode();
      this.createControlElements();
      this.fixIE6CSSbugs();
      this.determineOverHang();
      this.setHandleHeight();

      if( this.overHang <= 0 ) { this.greyOut(); return; }

      this.initSlider();
      this.addScrollableElementEvents();
      this.addContentElementEvents();
      this.addScrollHandleEvents();
      this.addDocumentEvents();
      this.addWindowEvents();
      this.addUpButtonEvents();
      this.addDownButtonEvents();
   },

   destroy : function() {
      this.removeContentElementEvents();
      this.removeDocumentEvents();
      this.removeDownButtonEvents();
      this.removeScrollableElementEvents();
      this.removeScrollHandleEvents();
      this.removeUpButtonEvents();
      this.removeWindowEvents();
      
      this.destroyControlElements();
      this.destroyPaddingElement();
      this.destroyContentElement();
   },

   loadContent : function(content) {
      this.slider.set( 0 );
      this.paddingEl.empty().set( 'html', content );
      this.refresh();
   },
   
   onDocumentClick : function( e ){
      this.hasFocus = false;
   },
   
   onDocumentKeyDown : function( e ){
      if ((this.hasFocus || this.options.fullWindowMode) && (e.key === 'down' || e.key === 'space' || e.key === 'up')) {
         this.scrollableElement.fireEvent( 'keydown', e );
      }
   },
   
   onDocumentMouseUp : function( e ){
      this.scrollHandle.removeClass( this.options.scrollHandleClass + '-Active' ).setStyle( 'opacity', this.options.handleOpacity );
      this.upBtn.removeClass( this.options.upBtnClass + '-Active' );
      this.downBtn.removeClass( this.options.downBtnClass + '-Active' );
   },
   
   onScrollableElementClick : function( e ){
      this.hasFocus = true;
      this.hasFocusTimeout = (function() {
         $clear( this.hasFocusTimeout );
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
      $clear( this.refreshTimeout );
      if (this.options.fullWindowMode) {
         this.refreshTimeout = (function() {
            $clear( this.refreshTimeout );
            if (this.viewPort.x != $( window ).getSize().x || this.viewPort.y != $( window ).getSize().y) {
               this.refresh();
               this.viewPort.x = $( window ).getSize().x;
               this.viewPort.y = $( window ).getSize().y;
            }
         }.bind( this )).delay( 250 );
      }
   },

   refresh : function() {
      var scrollPercent = Math.round( ((100 * this.step) / this.overHang) );
      if (this.options.fullWindowMode) {
         this.scrollableElement.setStyles( {
            width : '100%',
            height : '100%'
         });
      }
      this.fixIE6CSSbugs();
      this.overHang = this.paddingEl.getSize().y - this.scrollableElement.getSize().y;
      this.setHandleHeight();
      if (this.overHang <= 0) {
         this.greyOut();
         return;
      } else {
         this.unGrey();
      }
      this.scrollHandle.removeEvents();
      var newStep = Math.round( (scrollPercent * this.overHang) / 100 );
      this.initSlider();
      this.slider.set( newStep );

      // another IE6 kludge
      if (Browser.Engine.trident4) {
         this.scrollHandleBG.setStyle( 'height', '0' ).setStyle( 'height', '100%' );
      }

      if (this.options.smoothMooScroll.toAnchor || this.options.smoothMooScroll.toMooScrollArea) {
         this.smoothMooScroll = new SmoothMooScroll( {
            toAnchor : this.options.smoothMooScroll.toAnchor,
            toMooScrollArea : this.options.smoothMooScroll.toMooScrollArea
         }, this.contentEl, this.windowFxScroll );
      }
   },

   // Protected, private helper methods
   addContentElementEvents : function(){
      this.contentEl.addEvents({
         'scroll' : function(e) {
            this.slider.set( this.contentEl.getScroll().y );
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
         'mousedown' : function(e) {
            $clear( this.upInterval );
            $clear( this.downInterval );
            this.downInterval = this.scrollDown.periodical( 10, this );
            this.downBtn.addClass( this.options.downBtnClass + '-Active' );
         }.bind( this ),

         'mouseup' : function(e) {
            $clear( this.upInterval );
            $clear( this.downInterval );
         }.bind( this ),

         'mouseout' : function(e) {
            $clear( this.upInterval );
            $clear( this.downInterval );
         }.bind( this )
      });
   }.protect(),
   
   adjustScrollableElementSize : function(){
      this.determinePadding();
      
      this.scrollableElement.setStyle( 'overflow', 'hidden' ).setStyles({ 
         'padding' : 0,
         width : parseFloat( this.scrollableElement.getStyle( 'width' )) + this.paddingWidth,
         height : parseFloat( this.scrollableElement.getStyle( 'height' )) + this.paddingHeight
      });
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
         'mousedown' : function(e) {
            $clear( this.upInterval );
            $clear( this.downInterval );
            this.upInterval = this.scrollUp.periodical( 10, this );
            this.upBtn.addClass( this.options.upBtnClass + '-Active' );
         }.bind( this ),

         'mouseup' : function(e) {
            $clear( this.upInterval );
            $clear( this.downInterval );
         }.bind( this ),

         'mouseout' : function(e) {
            $clear( this.upInterval );
            $clear( this.downInterval );
         }.bind( this )
      } );
   }.protect(),
   
   addWindowEvents : function(){
      window.addEvent( 'resize', this.onWindowResize );
   }.protect(),
   
   createContentElement : function(){
      this.contentEl = new Element( 'div', { 'class' : this.options.contentElementClass }).adopt( this.scrollableElement.getChildren() ).inject( this.scrollableElement, 'top' );
   }.protect(),
   
   createControlElements : function() {
      this.scrollControlsYWrapper = new Element( 'div', { 'class' : this.options.scrollControlsYClass }).inject( this.scrollableElement, 'bottom' );
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
      this.paddingEl = new Element( 'div', { 'class' : this.options.paddingElementClass }).adopt( this.contentEl.getChildren() ).inject( this.contentEl, 'top' ).setStyles( this.scrollableElementPadding );
   }.protect(),
   
   destroyContentElement : function(){
      if( this.contentEl && this.contentEl.destroy ) this.contentEl.destroy();
   }.protect(),
   
   destroyControlElements : function(){
      if( this.scrollControlsYWrapper ) this.scrollControlsYWrapper.destroy();
      if( this.upBtn ) this.upBtn.destroy();
      if( this.downBtn ) this.downBtn.destroy();
      if( this.scrollBar ) this.scrollBar.destroy();
      if( this.scrollHandle ) this.scrollHandle.destroy();
      if( this.scrollHandleTop ) this.scrollHandleTop.destroy();
      if( this.scrollHandleBG ) this.scrollHandleBG.destroy();
      if( this.scrollHandleMiddle ) this.scrollHandleMiddle.destroy();
      if( this.scrollHandleBottom ) this.scrollHandleBottom.destroy();
      if( this.coverUp ) this.coverUp.destroy();
   }.protect(),
   
   destroyPaddingElement : function(){
      if( this.paddingEl && this.paddingEl.destroy ) this.paddingEl.destroy();
   }.protect(),
   
   determineBorderHeight : function(){
      this.borderHeight = parseFloat( this.scrollableElement.getStyle( 'border-top-width' )) + parseFloat( this.scrollableElement.getStyle( 'border-bottom-width' ));
   }.protect(),
   
   determineOverHang : function(){
      this.overHang = this.paddingEl.getSize().y - this.scrollableElement.getSize().y;
   }.protect(),
   
   determinePadding : function(){
      this.paddingHeight = parseFloat( this.scrollableElement.getStyle( 'padding-top' )) + parseFloat( this.scrollableElement.getStyle( 'padding-bottom' ) );
      this.paddingWidth = parseFloat( this.scrollableElement.getStyle( 'padding-left' )) + parseFloat( this.scrollableElement.getStyle( 'padding-right' ) );
   }.protect(),

   initSlider : function() {
      this.slider = new Slider( this.scrollBar, this.scrollHandle, {
         range : [ 0, Math.round( this.overHang ) ],
         mode : 'vertical',
         onChange : function(step, e) {
            this.contentEl.scrollTo( 0, step );
            this.webKitKludge( step );
         }.bind( this )
      } ).set( 0 );
   }.protect(),
   
   fixIE6CSSbugs : function() {
      // fix some CSS bugs for IE6
      if (Browser.Engine.trident4) {
         this.scrollableElement.setStyle( 'height', this.scrollableElement.getStyle( 'height' ) );
         this.contentEl.setStyle( 'height', this.scrollableElement.getStyle( 'height' ) );
         var top = this.scrollBar.getStyle( 'top' ).toInt();
         var bottom = this.scrollBar.getStyle( 'bottom' ).toInt();
         var parentHeight = this.scrollableElement.getSize().y - this.borderHeight;
         this.scrollControlsYWrapper.setStyles( {
            'height' : parentHeight
         } );
         this.scrollBar.setStyles( {
            'height' : parentHeight - top - bottom
         } );
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
      if( this.contentEl ) this.contentEl.removeEvents();
   }.protect(),
   
   removeDocumentEvents : function(){
      document.removeEvent( 'mouseup', this.onDocumentMouseUp );
      document.removeEvent( 'keydown', this.onDocumentKeyDown );
      document.removeEvent( 'click', this.onDocumentClick );
   }.protect(),
   
   removeDownButtonEvents : function(){
      if( this.downBtn ) this.downBtn.removeEvents();
   }.protect(),
   
   removeScrollableElementEvents : function(){
      if( this.scrollableElement ){
         this.scrollableElement.removeEvent( 'mousewheel', this.onScrollableElementMouseWheel );
         this.scrollableElement.removeEvent( 'keydown', this.onScrollableElementKeyDown );
         this.scrollableElement.removeEvent( 'click', this.onScrollableElementClick );
      }
   }.protect(),
   
   removeScrollHandleEvents : function(){
      if( this.scrollHandle ) this.scrollHandle.removeEvents();
   }.protect(),
   
   removeUpButtonEvents : function(){
      if( this.upBtn ) this.upBtn.removeEvents();
   }.protect(),
   
   removeWindowEvents : function(){
      window.removeEvent( 'resize', this.onWindowResize );
   }.protect(),
   
   scrollUp : function(scrollPageWhenDone) {
      var target = this.contentEl.getScroll().y - 30;// this.options.increment;
      this.slider.set( target );
      if (this.contentEl.getScroll().y <= 0 && scrollPageWhenDone) {
         document.window.scrollTo( 0, document.window.getScroll().y - this.options.increment );
      }
   },

   scrollDown : function(scrollPageWhenDone) {
      var target = this.contentEl.getScroll().y + this.options.increment;
      this.slider.set( target );
      var onePercent = (1 * this.paddingEl.getSize().y) / 100;
      var atBottom = (this.paddingEl.getSize().y - this.scrollableElement.getSize().y) <= (this.contentEl.getScroll().y + onePercent);
      if (atBottom && scrollPageWhenDone) {
         document.window.scrollTo( 0, document.window.getScroll().y + this.options.increment );
      }
   },

   setContentElementStyle : function(){
      this.contentEl.setStyles({
         'height' : this.scrollableElement.getSize().y - this.borderHeight,
         overflow : 'hidden',
         'padding' : 0
      });
   }.protect(),
   
   setHandleHeight : function() {
      var handleHeightPercent = (100 - ((this.overHang * 100) / this.paddingEl.getSize().y));
      this.handleHeight = ((handleHeightPercent * this.scrollableElement.getSize().y) / 100) - (this.scrollHandleTop.getSize().y + this.scrollHandleBottom.getSize().y);
      if ((this.handleHeight + this.scrollHandleTop.getSize().y + this.scrollHandleBottom.getSize().y) >= this.scrollBar.getSize().y) {
         this.handleHeight -= (this.scrollHandleTop.getSize().y + this.scrollHandleBottom.getSize().y) * 2;
      }
      if (this.scrollHandle.getStyle( 'min-height' ) && this.handleHeight < parseFloat( this.scrollHandle.getStyle( 'min-height' ) )) {
         this.handleHeight = parseFloat( this.scrollHandle.getStyle( 'min-height' ) ) + this.scrollHandleBottom.getSize().y + this.scrollHandleTop.getSize().y;
      }
      this.scrollHandle.setStyles( {
         'height' : this.handleHeight
      } );
   }.protect(),

   setSlider : function(v) {
      if (v == 'top') {
         this.slider.set( 0 );
      } else if (v == 'bottom') {
         this.slider.set( '100%' );
      } else {
         this.slider.set( v );
      }
   }.protect(),
   
   switchToFullWindowMode : function(){
      // turn off overflow for html element here so non-javascript users can still scroll
      $( document ).getElement( 'html' ).setStyle( 'overflow', 'hidden' );
      this.scrollableElement.setStyles( {
         'height' : '100%',
         'width' : '100%',
         'position' : 'absolute'
      });
      this.contentEl.setStyles( {
         'height' : '100%',
         'width' : '100%',
         'position' : 'absolute'
      });
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
      // if scrollHandle is withing 1% of the bottom, kick it down that last
      // little bit since webkit browsers seem to
      // have trouble getting it that last little bit sometimes (varies with
      // amount of content.. probably due to rounding)
      if (this.step > step) {
         this.step = step;
         return;
      }
      $clear( this.sliderTimeout );
      this.sliderTimeout = (function() {
         $clear( this.sliderTimeout );
         var onePercent = (1 * this.paddingEl.getSize().y) / 100;
         if ((onePercent + step) >= this.overHang) {
            if (this.paddingElTopMargin == null) {
               this.paddingElTopMargin = parseFloat( this.paddingEl.getStyle( 'margin-top' ) );
            }
            this.paddingEl.setStyle( 'margin-top', this.paddingElTopMargin - onePercent );
            if (!this.scrollHandleTopMargin) {
               this.scrollHandleTopMargin = parseFloat( this.scrollHandle.getStyle( 'margin-top' ) );
            }
            this.scrollHandle.setStyle( 'margin-top', this.scrollHandleTopMargin + 2 );
            this.contentEl.scrollTo( 0, this.overHang );
            this.step = this.overHang;

         } else {
            this.paddingEl.setStyle( 'margin-top', this.paddingElTopMargin );
            this.scrollHandle.setStyle( 'margin-top', this.scrollHandleTopMargin );
            this.contentEl.scrollTo( 0, step );
            this.step = step;
         }
      }.bind( this )).delay( 10 );

   }

});
