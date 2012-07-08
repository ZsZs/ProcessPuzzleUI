/*
Name: 
    - ScrollingBehaviour

Description: 
    - Add scrolling behaviour to any div or span element.

Requires:
    - 
Provides:
    - ScrollingBehaviour

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

var ScrollingBehaviour = new Class({
   Implements : Options,
   options : {
      contentHeight : null,
      contentWidth : null,
      disabledOpacity : 0,
      downBtnClass : 'downBtn',
      fullWindowMode : false,
      handleOpacity : 1,
      handleActiveOpacity : 0.85,
      increment : 15,
      restrictedBrowsers : [ Browser.Engine.presto925, Browser.Platform.ipod, Browser.Engine.webkit419 ],
      scrollBarClass : 'scrollBar',
      scrollHandleClass : 'scrollHandle',
      scrollHandleBGClass : 'scrollHandleBG',
      scrollHandleTopClass : 'scrollHandleTop',
      scrollHandleMiddleClass : 'scrollHandleMiddle',
      scrollHandleBottomClass : 'scrollHandleBottom',
      scrollControlsYClass : 'scrollControlsY',
      selector : '.scroll',
      smoothMooScroll : {
         toAnchor : true,
         toMooScrollArea : true
      },
      upBtnClass : 'upBtn'
   // Opera 9.25 or lower, Safari 2 or lower, iPhone/iPod Touch
   },

   //Constructor
   initialize : function( scrollableElement, options ) {
      if( this.options.restrictedBrowsers.contains( true )) { return; }
      this.setOptions( options );

      this.scrollArea;
      this.scrollableElement;
      this.windowFxScroll = new Fx.Scroll( document.window, { wait : false });
      
      this.identifyScrollableElement( scrollableElement );
   },
   
   //Public accessors and mutators
   construct : function(){
      this.scrollArea = new ScrollArea( this.scrollableElement, this.windowFxScroll, this.options );
      this.scrollArea.construct();
      
      if( this.options.smoothMooScroll.toAnchor || this.options.smoothMooScroll.toMooScrollArea ) {
         this.smoothMooScroll = new SmoothScroll({
            toAnchor : this.options.smoothMooScroll.toAnchor,
            toMooScrollArea : this.options.smoothMooScroll.toMooScrollArea
         }, this.scrollArea.contentEl, this.windowFxScroll );
      }
   },
   
   destroy : function(){
      if( this.scrollArea ) this.scrollArea.destroy();
   },

   loadContent : function( content ) {
      this.scrollArea.loadContent( content );
   },

   refresh : function( size ) {
      this.scrollArea.refresh( size );
   },

   setSlider : function(v) {
      this.scrollAreas.setSlider( v );
   },
   
   //Properties
   getContentViewSize : function() { return this.scrollArea.getContentViewSize(); },
   getScrollableElement : function() { return this.scrollableElement; },
   getScrollArea : function() { return this.scrollArea; },
   
   //Protected, private helper methods
   identifyScrollableElement : function( scrollableElement ){
      this.scrollableElement = $( scrollableElement );
      if( !this.scrollableElement ) throw new NoneExistingScrollableElementException( scrollableElement );
   }
});
