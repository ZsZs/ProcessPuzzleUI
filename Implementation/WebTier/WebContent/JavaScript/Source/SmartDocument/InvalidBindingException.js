/*
Name: InvalidBindingException

Description: Thrown when a DataElement's 'bind' attribute doesn't results in valid data.

Requires:
   - WebUIExceptions

Provides:
   - InvalidBindingException

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

var InvalidBindingException = new Class({
   Extends: WebUIException,
   options: {
      description: "Data element's: '{dataElementId}' bind property: '{bindValue}' doesn't returns any data.",
      name: "InvalidBindingException"
   },
   
   //Constructor
   initialize : function( dataElementId, bindValue, options ){
      this.setOptions( options );
      this.parent( options );
      this.parameters = { dataElementId : dataElementId, bindValue : bindValue };
   }	
});