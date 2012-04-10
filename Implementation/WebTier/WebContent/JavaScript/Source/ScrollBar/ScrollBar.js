/*
 * MooScroll beta [for mootools 1.2]
 * @author Jason J. Jaeger | greengeckodesign.com
 * @version 0.59
 * @license MIT-style License
 *			Permission is hereby granted, free of charge, to any person obtaining a copy
 *			of this software and associated documentation files (the "Software"), to deal
 *			in the Software without restriction, including without limitation the rights
 *			to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *			copies of the Software, and to permit persons to whom the Software is
 *			furnished to do so, subject to the following conditions:
 *	
 *			The above copyright notice and this permission notice shall be included in
 *			all copies or substantial portions of the Software.
 *	
 *			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *			IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *			FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *			AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *			LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *			OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *			THE SOFTWARE.
 *	
 *  @changeLog_________________________________________________________________________________
 *  
 *  Jan 3nd 2008
 *  JJJ - Incremented version to 0.59
 *  	- Finished adding smoothMooScroll.toAnchor and smoothMooScroll.toMooScrollArea options
 *  	  Thanks for Ivan Gascon and David Fink for the suggestions and contribution.
 *  
 *  Dec 28th 2008
 *  JJJ - Adding smoothMooScroll option
 *  
 *  Dec 27th 2008
 *  JJJ - Adding smoothMooScroll option (customized version of smoothscroll) and setSlider function
 *  
 *  Dec 24th 2008
 *  JJJ - Added refresh function to main MooScroll class (thanks to David's post on the blog for the suggestion)
 *  
 *  Dec 7th 2008
 *  JJJ - Incremented version to 0.58
 *  	- Implemented bug fixes (for ie6 and webkit) submitted by Mattia Placido Opizzi of moikano.it
 *  
 *  Nov 8th 2008
 *  JJJ	- Incremented version to 0.57.2
 *  	- Added line to unGrey method to bring full opacity back after a scollbar had been greyed out and then brought back
 *  
 *  Nov 8th 2008
 *  JJJ	- Incremented version to 0.57
 *  	- Fixed bug related to the disabledOpacity option (Thanks to Simon Terres at gmx.net) 
 *  
 *  Sept 21st 2008
 *  JJJ	- Incremented version to 0.56
 *  	- Added restrictedBrowsers option. Made Opera 9.25 or lower, Safari 2 or lower, and iPhone/iPod Touch the default restricted browsers
 *  	- Fixed small bug introduced with previous webkit fix which prevented webkit browsers from scrolling the document down when the MooScroll
 *  		area is all the way scrolled down and the end-user is still scrolling via mousewheel or keyboard.
 *  
 *  Sept 21st 2008
 *  JJJ - Incremented version to 0.55
 *  	- Fixed jitter bug for webkit browsers
 *  	- Made arrow keys and space key work in Firefox, Opera, Safari, and Chrome
 *  
 *  Sept 20th 2008
 *  JJJ - Incremented version to 0.54
 *  	- Disabled MooScroll for iphone/ipod touch until I can get an iphone to test on 
 *  	- Factored in border height when setting content area height
 *  
 *  Sept 6th 2008
 *  JJJ - Incremented version to 0.53
 *  	- Changed initialize function so that instead of wrapping the original element, an empty div (contentEl) adopts the children and is 
 *  		then injected into the the original element (parentEl). This way all the stlying of the original element is perfectly preserved.
 *  		An extra element then wraps the children of the contentDiv and the padding from the original element is transfered to 
 *  		this padding element (paddingEl).
 *  	- Added refresh function
 *  	- Added fullWindowMode option
 *  	- Added loadContent function
 *  
 *  August 31st 2008
 *  JJJ - Made the wrapper element absorb certain styles from the parentEl so that it works in layouts where the scrolled
 *  		element is positioned (thanks to Bob Ralian for suggesting and contributing to this feature!)
 *  		This allowed the styles for the parentEl (.scroll) to be separated out to the example.css file (from mooScroll.css)
 *  		in the example (where it should be). Also this makes appling MooScroll to a scrollable area in a pre-existing design easier.  
 *  	- Fixed bug which kept the scrollHandle from going all the way to the bottom sometimes when scrolling via the down button
 *  	- Moved some code from init function to dedicated functions (setHandleHeight and greyOut) in order to prepare to add refresh function
 *  	- Ran across some Mootools 1.2 bugs:
 *  		a.) In Firefox 2 and 3  element.getStyle('width') reports the actual element dimension in px even when the width is set in percent in the CSS
 *  		b.) In Firefox 3 element.getScrollSize().y is not including padding (this means that in FF3 you loose any bottom padding 
 *  			you may have set on the scollElement 
 *  	- Added unGrey function
 *  
 *  August 9th 2008
 *  JJJ - Incremented version to 0.52
 *  	- Disabled for Safari 2 to atleast keep it from crashig or looking messed up due to bugs that I don't currently have time to fix, Sorry Safari 2 users :(
 *  
 *  August 2nd 2008
 *  JJJ	- Incremented version to 0.51
 *  	- Made tweaks for IE6's poor CSS support
 *  	- Wrapped scroll controls in wrapper div so positioning can be easily tweaked via CSS
 *  	- Made scrollHandle position update when scroll area is scrolled via tabbing through links
 *  	- Made Scroll area scroll via arrow keys when that scroll area (or something in it) is in focus
 *  	- Made page scroll up if you are scrolling up through a scroll area via the mousewheel and you get to 
 *  	  the top of the scroll area but you keep scrolling up with the wheel (same with down).
 *  	- Made greyed out scroll controlls non-functional (css hover overs and all)
 *  	- Added opacity of greyed out scroll controls option (disabledOpacity)
 *  	- Added refresh option
 *  
 *  July 26th 2008
 *  JJJ - Incremented version to 0.50
 *  	- Improved class I had previously written to prepare it for public release:
 *  		* Updated for MooTools 1.2
 *  		* Made able to have multiple instances on a page
 *  
 *  
 *  
 *  TO DO:
 *  --------------------
 *  1. Add horizontal scrollbar ability
 *  2. Add Callback functions
 *  
 */

//= require_directory ../MooTools
//= require_directory ../FundamentalTypes

var ScrollBar = new Class({
   Implements : Options,
   options : {
      selector : '.scroll',
      increment : 30,
      upBtnClass : 'upBtn',
      downBtnClass : 'downBtn',
      scrollBarClass : 'scrollBar',
      scrollHandleClass : 'scrollHandle',
      scrollHandleBGClass : 'scrollHandleBG',
      scrollHandleTopClass : 'scrollHandleTop',
      scrollHandleMiddleClass : 'scrollHandleMiddle',
      scrollHandleBottomClass : 'scrollHandleBottom',
      scrollControlsYClass : 'scrollControlsY',
      handleOpacity : 1,
      handleActiveOpacity : 0.85,
      disabledOpacity : 0,
      fullWindowMode : false,
      smoothMooScroll : {
         toAnchor : true,
         toMooScrollArea : true
      },
      restrictedBrowsers : [ Browser.Engine.presto925, Browser.Platform.ipod, Browser.Engine.webkit419 ]
   // Opera 9.25 or lower, Safari 2 or lower, iPhone/iPod Touch
   },

   //Constructor
   initialize : function( scrollableElementId, options ) {
      if( this.options.restrictedBrowsers.contains( true )) { return; }
      this.setOptions( options );

      this.scrollArea;
      this.scrollableElement;
      this.windowFxScroll = new Fx.Scroll( document.window, { wait : false });
      
      this.identifyScrollableElement( scrollableElementId );
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
      this.scrollArea.destroy();
   },

   loadContent : function( content ) {
      this.scrollArea.loadContent( content );
   },

   refresh : function() {
      this.mooScrollAreas.each( function( item, index ) {
         item.refresh();
      });
   },

   setSlider : function(v) {
      this.mooScrollAreas.each( function(item, index) {
         item.setSlider( v );
      });
   },
   
   //Properties
   getScrollableElement : function() { return this.scrollableElement; },
   getScrollArea : function() { return this.scrollArea; },
   
   //Protected, private helper methods
   identifyScrollableElement : function( scrollableElementId ){
      this.scrollableElement = $( scrollableElementId );
      if( !this.scrollableElement ) throw new NoneExistingScrollableElementException( scrollableElementId );
   }
});
