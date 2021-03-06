/*
Name: 
   - TimeOutBehaviour

Description: 
   - Throws a TimeOutException when the timer isn't stopped within the the specified time interval.

Requires:

Provides:
   - TimeOutBehaviour

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

var TimeOutBehaviour = new Class({
   Implements : [Options],
   options : {
      delay : 200,
      maxTries : 20
   },

   // Constructor
   initialize : function( options ) {
      this.setOptions( options );
      this.checkedProcessName;
      this.numberOfTries;
      this.timer;
   },

   // Public accessors and mutators
   checkTimeOut : function() {
      this.numberOfTries++;
      if (this.numberOfTries >= this.options.maxTries) {
         clearInterval( this.timer );
         this.timeOut( new TimeOutException( this.options.componentName, this.checkedProcessName, { source : this.options.componentName + ".checkTimeOut()" }));
      }
   },

   startTimeOutTimer : function( processName ) {
      this.checkedProcessName = processName;
      this.numberOfTries = 0;
      this.timer = this.checkTimeOut.periodical( this.options.delay );
   },

   stopTimeOutTimer : function() {
      clearInterval( this.timer );
   }
   
   //Properties
   
   //Protected, private helper methods
});
