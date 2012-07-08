/*
Name: 
    - MooEditableDialog

Description: 
    - Mediates user interactions between MooEditable and ProcessPuzzleUI. 

Requires:
    - 
    
Provides:
    - MooEditableDialog

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

var MooEditableDialog = new Class({
   Implements: [Options],
   Binds: ['open'],
   options : {
      action : null,
      componentName : "MooEditableDialog",
      notification : null,
      windowName : null
   },

   //Constructor
   initialize: function( editor, options ){
      this.setOptions( options );
      
      //Private attributes
      this.editor = editor;
      this.name;
   },
   
   //Public accessor and mutator methods
   open: function(){
      switch( this.options.action ){
      case DesktopWindow.Activity.SHOW_NOTIFICATION:
         this.editor.showNotification( this.options.notification ); break;
      case DesktopWindow.Activity.SHOW_WINDOW:
         this.editor.showWindow( this.options.windowName ); break;
      }
   },
   
   prompt: function(){
      this.editor.showNotification( this.options.windowName );
   },
   
   //Properties
   isCollapsed: function() { return false; },
   
   //Protected and private helper methods
});