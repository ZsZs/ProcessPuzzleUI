/*
Name: 
    - TextAreaEditor

Description: 
    - Provides text editing features for text areas. The edited area can be a whole HTML document or just a text area component of a SmartDocument. 

Requires:
    - MooEditable, DocumentEditor
    
Provides:
    - TextAreaEditor

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

var TextAreaEditor = new Class({
   Extends: DocumentEditor,
   Binds: ['onMooEditableAttach'],
   options : {
      componentName : "TextAreaEditor",
      dimensions : { x : 500, y : 100 },
      numberOfColumns : 120,
      numberOfRows : 50
   },

   //Constructor
   initialize: function( internationalization, options ){
      this.parent( internationalization, options );
      
      //Private attributes
      this.initialContent;
      this.mooEditable;
   },
   
   //Public accessor and mutator methods
   attach: function( subjectElement, initialContent ){
      this.initialContent = initialContent;
      this.parent( subjectElement );
   },
   
   destroy: function(){
      this.mooEditable.detach();
   },
   
   onContainerResize: function( newSize ){
      this.mooEditable.onContainerResize( newSize );
   },
   
   onMooEditableAttach: function(){
      this.mooEditable.setContent( this.initialContent );
      this.attachChain.callChain();
   },
   
   textAddImage: function(){ this.mooEditable.action( 'urlimage' ); },
   textAddLink: function(){ this.mooEditable.action( 'createlink' ); },
   textAlignCenter: function(){ this.mooEditable.action( 'justifycenter' ); },
   textAlignLeft: function(){ this.mooEditable.action( 'justifyleft' ); },
   textAlignJustify: function(){ this.mooEditable.action( 'justifyfull' ); },
   textAlignRight: function(){ this.mooEditable.action( 'justifyright' ); },
   textBold: function(){ this.mooEditable.action( 'bold' ); },
   textIndent: function(){ this.mooEditable.action( 'indent' ); },
   textItalic: function(){ this.mooEditable.action( 'italic' ); },
   textOrderedList: function(){ this.mooEditable.action( 'insertorderedlist' ); },
   textOutdent: function(){ this.mooEditable.action( 'outdent' ); },
   textRedo: function(){ this.mooEditable.action( 'redo' ); },
   textRemoveLink: function(){ this.mooEditable.action( 'unlink' ); },
   textStrikethrough: function(){ this.mooEditable.action( 'strikethrough' ); },
   textToggleView: function(){ this.mooEditable.action( 'toggleview' ); },
   textUnderline: function(){ this.mooEditable.action( 'underline' ); },
   textUndo: function(){ this.mooEditable.action( 'undo' ); },
   textUnorderedList: function(){ this.mooEditable.action( 'insertunorderedlist' ); },
   
   //Properties
   
   //Protected and private helper methods   
   defineDialogWindows: function(){
      MooEditable.Actions.createlink.dialogs.alert = function() { var dialog = new DocumentEditorDialog( this.internationalization ); return dialog; }.bind( this );
      MooEditable.Actions.createlink.dialogs.prompt = function() { var dialog = new DocumentEditorDialog( this.internationalization ); return dialog; }.bind( this );
      
      MooEditable.Actions.urlimage.dialogs.prompt = function() { var dialog = new DocumentEditorDialog( this.internationalization ); return dialog; }.bind( this );
   }.protect(),
   
   instantiateTools: function(){
      this.defineDialogWindows();
      var styleSheetLinks = "";
      this.styleSheets.each( function( styleSheetUri, index ){
         styleSheetLinks += "<link rel='stylesheet' type='text/css' href='" + styleSheetUri + "'>";
      }, this );
      
      this.mooEditable = new MooEditable( this.subjectElement, { 
         externalCSS : styleSheetLinks,
         handleDialogs : false, 
         handleLabel : false, 
         handleSubmit : false,
         onAttach: this.onMooEditableAttach, 
         toolbar : false
      });
   }.protect(),
});