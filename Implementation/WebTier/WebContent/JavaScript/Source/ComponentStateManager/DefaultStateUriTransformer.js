/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//DefaultStateUriTransformer.js

var DefaultStateUriTransformer = new Class({
   initialize: function( stateManager ){
      this.stateManager = stateManager;
   },
   
   transformUriToState: function( uri ) {
      this.stateManager.parse( uri );
   },
   
   transformStateToUri: function(){
      return this.stateManager.toString();
   }
});