/*
Name: 
    - StartStopSlideButton

Description: 
    - Represents the start/stop button in a slide show controller panel. 

Requires:
   - SlideshowControllerButton

Provides:
    - StartStopSlideButton

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
//= require ../SlideShow/SlideshowControllerButton.js

var StartStopSlideButton = new Class({
   Extends : SlideshowControllerButton,
   Binds: [],
   
   options : {
      action : 'pause',
      buttonClass : 'pause',
      key : 'p',
      label : 'P',
      playClass : 'play',
      tabIndex : 2
   },

   //Constructor
   initialize: function( containerElement, options ){
      this.parent( containerElement, options );
      
      this.paused = false;
   },
   
   //Public accessor and mutator methods
   start: function(){
      this.paused = false;
   },
   
   stop: function(){
      this.paused = true;
   },
   
   //Properties
   getElementClass : function(){ return this.paused ? this.options.playClass + ' ' + this.options.buttonClass : this.options.buttonClass; },
   
   //Protected, private helper methods
});
