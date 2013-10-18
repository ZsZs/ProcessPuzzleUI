/*
Name: 
    - MediaForwardButton

Description: 
    - Represents the go forward in the media controller panel. 

Requires:
   - MediaControllerButton

Provides:
    - MediaForwardButton

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
//= require ../MediaPlayerWidget/MediaControllerButton.js

var MediaForwardButton = new Class({
   Extends : MediaControllerButton,
   Binds: [],
   
   options : {
      action : 'next',
      buttonClass : 'next',
      componentName : "MediaForwardButton",
      key : 'right',
      label : 'Rightwards Arrow',
      tabIndex : 3
   },

   //Constructor
   initialize: function( containerElement, options ){
      this.parent( containerElement, options );
   },
   
   //Public accessor and mutator methods
   
   //Properties
   
   //Protected, private helper methods
});
