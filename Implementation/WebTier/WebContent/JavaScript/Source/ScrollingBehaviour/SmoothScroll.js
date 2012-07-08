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

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var SmoothScroll = new Class({
   Extends: Fx.Scroll,
   initialize: function(options, context, windowFxScroll){
      this.setOptions(options);
      this.windowFxScroll = windowFxScroll;
      this.context = context;
      context = context || document;
      this.context = context;
      var doc = context.getDocument(), win = context.getWindow();    
      this.parent(context, options);
      
      this.links = (this.options.links) ? $$(this.options.links) : $$(doc.links);
      var location = win.location.href.match(/^[^#]*/)[0] + '#';
      this.links.each(function(link){
         if (link.href.indexOf(location) != 0) {   return;  }
         var anchor = link.href.substr(location.length);
         if (anchor && $(anchor) && $(anchor).getParents().contains($(this.context))) {
            this.useLink(link,anchor, true);
         }else if(anchor && $(anchor) && !this.inMooScrollArea($(anchor))){
            this.useLink(link,anchor, false);
         }
      }, this);
      if (!Browser.Engine.webkit419) this.addEvent('complete', function(){
         win.location.hash = this.anchor;
      }, true);
   },
   
   inMooScrollArea:function(el){
      return el.getParents().filter(function(item, index){return item.match('[rel=MooScrollArea]');}).length > 0;
   },
   
   putAnchorInAddressBar:function(anchor){
      window.location.href = "#" + anchor;      
   },

   useLink: function(link, anchor, inThisMooScrollArea){    
      link.removeEvents('click');
      link.addEvent('click', function(event){         
         if(!anchor || !$(anchor)){return;}        
         this.anchor = anchor;
         if (inThisMooScrollArea) {
            if(this.options.toMooScrollArea && this.options.toAnchor){
               this.windowFxScroll.toElement(this.context.getParent()).chain(function(item, index){            
                  this.toElement(anchor).chain(function(){  this.putAnchorInAddressBar(anchor); }.bind(this));          
               }.bind(this));
            }else if(this.options.toMooScrollArea){
               this.windowFxScroll.toElement(this.context.getParent()).chain(function(){  this.putAnchorInAddressBar(anchor); }.bind(this));
            }else if(this.options.toAnchor){
               this.toElement(anchor).chain(function(){  this.putAnchorInAddressBar(anchor); }.bind(this)); 
            }           
         }else{
            this.windowFxScroll.toElement(anchor).chain(function(){  this.putAnchorInAddressBar(anchor); }.bind(this));     
         }
         event.stop();     
      }.bind(this));
   }

});
