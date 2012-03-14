/*
Name: TimeOutException

Description: Thrown when the specified component's configuration or other process timed out.

Requires: WebUIException

Provides: TimeOutException

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

var TimeOutException = new Class({
   Extends: WebUIException,
   options: {
      description: "Executing the '{componentName}' element's '{processName}' timed out. See the stack trace for the root cause.",
      name: "TimeoutException"
   },
   
   //Constructor
   initialize : function( componentName, processName, options ){
      this.parent( options );
      this.parameters = { componentName : componentName, processName : processName };
      this.componentName = componentName;
      this.processName = processName;
   },
   
   //Properties
   getComponentName: function() { return this.componentName; },
   getProcessName: function() { return this.processName; },
});