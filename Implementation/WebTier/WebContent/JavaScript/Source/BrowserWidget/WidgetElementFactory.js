/*
Name: 
    - HtmlElementFactory

Description: 
    - Instantiates a new HTML element with given properties and appends to the element hierarchy. 

Requires:
    - 
    
Provides:
    - HtmlElementFactory

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

var WidgetElementFactory = new Class( {
   Implements : Options,
   
   options : {
      appendByDefault : true,
      buttonClassName : "buttonSmall", 
      defaultPosition : 3,
      formFieldsContainerClassName : "editableContainer",
      fieldSetImageAlt : "Show/Hide",
      fieldSetImageSource : "Images/expver.png",
      fieldSetImageStyle : { 'cursor' : 'pointer' },
      fieldSetImageTitle : "Show/Hide",
      fieldSetStyle : { 'border-color' : '#336699', 'width' : '100%' },
      labelClassName : "label",
      readOnlyContainerClassName : "readOnlyContainer",
      rowClassName : "row",
      valueClassName : "formw"
   },

   // Constructor
   initialize : function( containerElement, i18Resource, options ) {
      assertThat( containerElement, not( nil() ) );
      assertThat( i18Resource, not( nil() ) );
      this.setOptions( options );

      this.containerElement = containerElement;
      this.i18Resource = i18Resource;
   },

   // Public accessors and mutator methods
   create : function( tagName, nodeText, contextElement, position, properties ) {
      var newElement = new Element( tagName, properties );
      if( nodeText )
         newElement.appendText( this.i18Resource.getText( nodeText ) );
      if( contextElement || this.options.appendByDefault )
         this.appendElement( newElement, contextElement, position );
      return newElement;
   },

   createAnchor : function( nodeText, anchorLink, clickEventHandler, contextElement, position, elementProperties ) {
      var defaultProperties;
      if( clickEventHandler ){
         defaultProperties = { href : "#", events : { click : clickEventHandler } };
      }else {
         defaultProperties = { href : anchorLink };
      }
      var properties = this.mergeProperties( defaultProperties, elementProperties );
      var newAnchor = this.create( 'A', nodeText, contextElement, position, properties );
      return newAnchor;
   },

   createButton : function( buttonCaption, clickEventHandler, contextElement, position, elementProperties ) {
      var defaultProperties = { 'class' : this.BUTTON_CLASS, type : "button", value : buttonCaption, events : { click : clickEventHandler } };
      var properties = this.mergeProperties( defaultProperties, elementProperties );
      var button = this.create( "INPUT", null, contextElement, position, properties );
      if( buttonCaption ) {
         var i18Caption = this.i18Resource.getText( buttonCaption );
         button.set( 'value', i18Caption );
      }
      return button;
   },

   createCollapsibleArea : function( contextElement, position, elementProperties ) {
      return this.create( "div", null, contextElement, position, this.mergeProperties( { 'class' : this.options.readOnlyContainerClassName }, elementProperties ));
   },

   createDivision : function( contextElement, position, elementProperties ) {
      return this.create( "div", null, contextElement, position, this.mergeProperties( { 'class' : this.options.readOnlyContainerClassName }, elementProperties ));
   },

   createFieldSet : function( imageId, contextElement, position, elementProperties ) {
      var defaultProperties = { styles : this.options.fieldSetStyle };
      var properties = this.mergeProperties( defaultProperties, elementProperties );
      var fieldSet = this.create( "FIELDSET", null, contextElement, position, properties );

      var legend = this.create( "LEGEND", null, fieldSet, WidgetElementFactory.Positions.LastChild );
      var imageProperties = { 
         id : imageId, 
         src : this.options.fieldSetImageSource, 
         "alt" : this.options.fieldSetImageAlt, 
         "title" : this.options.fieldSetImageTitle, 
         styles : this.options.fieldSetImageStyle 
      };
      this.create( "IMG", null, legend, WidgetElementFactory.Positions.LastChild, imageProperties );

      return fieldSet;
   },

   createForm : function( formName, methodType, contextElement, position, elementProperties ) {
      assertThat( formName, not( nil() ));
      assertThat( methodType.toUpperCase() == "POST" || methodType.toUpperCase() == "GET", is( true ) );
      
      var newForm = this.create( 'FORM', null, contextElement, position, this.mergeProperties( { id : formName, name : 'form', method : methodType }, elementProperties ) );
      this.create( 'DIV', null, newForm, WidgetElementFactory.Positions.LastChild, { 'class' : this.options.formFieldsContainerClassName } );
      this.create( 'DIV', null, newForm, WidgetElementFactory.Positions.LastChild, { 'class' : this.options.readOnlyContainerClassName } );
      return newForm;
   },

   createHiddenDivision : function( divId, contextElement, position, elementProperties ) {
      var defaultProperties = { id : divId, styles : { display : 'none' }, 'class' : this.options.readOnlyContainerClassName };
      var newDivision = this.create( 'DIV', null, contextElement, position, this.mergeProperties( defaultProperties, elementProperties ));
      return newDivision;
   },

   createOption : function( value, text, contextElement, position, elementProperties ) {
      var defaultProperties = { 'value' : value };
      return this.create( "OPTION", text, contextElement, position, this.mergeProperties( defaultProperties, elementProperties ) );
   },

   createRowLabel : function( labelText, contextElement, position, elementProperties ) {
      return this.create( 'span', labelText, contextElement, position, { 'class' : this.options.labelClassName } );
   },

   createRowValue : function( valueText, valueElementId, contextElement, position, elementProperties ) {
      return this.create( 'span', valueText, contextElement, position, { id : valueElementId, 'class' : this.options.valueClassName } );
   },

   createStaticRow : function( labelText, valueText, valueElementId, contextElement, position ) {
      var staticRow = this.create( 'div', null, contextElement, position, { 'class' : this.options.rowClassName } );
      this.create( 'label', labelText, staticRow, WidgetElementFactory.Positions.LastChild, { 'class' : this.options.labelClassName } );
      this.create( 'span', valueText, staticRow, WidgetElementFactory.Positions.LastChild, { id : valueElementId, 'class' : this.options.valueClassName } );
      return staticRow;
   },

   createTable : function( tableDefinition, contextElement, position ) {
      var tableElement = this.create( "TABLE", null, contextElement, position );
      var tableHeadElement = this.create( "THEAD", null, tableElement, WidgetElementFactory.Positions.LastChild );
      var tableBodyElement = this.create( "TBODY", null, tableElement, WidgetElementFactory.Positions.LastChild );
      var tableHeadRowElement = this.create( "TR", null, tableHeadElement, WidgetElementFactory.Positions.LastChild );

      for( var i = 1; i <= tableDefinition.getColumns().size(); i++) {
         var tableColumnDefinition = tableDefinition.getColumns().getColumnByIndex( i - 1 );
         this.create( "TH", tableColumnDefinition.getCaption(), tableHeadRowElement, WidgetElementFactory.Positions.LastChild );
      }

      for( var i = 0; i < tableDefinition.getRows().size(); i++) {
         var tableRow = tableDefinition.getRow( i );
         var tableBodyRowElement = this.create( "TR", null, tableBodyElement, WidgetElementFactory.Positions.LastChild );

         for( var c = 0; c < tableRow.length; c++ ) {
            this.create( "TD", tableRow[c], tableBodyRowElement, WidgetElementFactory.Positions.LastChild );
         }
      }

      return tableElement;
   },

   // Protected, private helper methods
   appendElement : function( element, contextElement, position ) {
      contextElement = $( contextElement );
      var context = contextElement == undefined ? this.containerElement : contextElement;
      switch( position ){
      case WidgetElementFactory.Positions.Before:
         context.grab( element, 'before' );
         break;
      case WidgetElementFactory.Positions.After:
         context.grab( element, 'after' );
         break;
      case WidgetElementFactory.Positions.FirstChild:
         context.grab( element, 'top' );
         break;
      case WidgetElementFactory.Positions.LastChild:
         context.grab( element, 'bottom' );
         break;
      default:
         context.appendChild( element, 'Last' );
         break;
      }
   }.protect(),
   
   mergeProperties : function( baseProperties, additionalProperties ){
      var mergedProperties = Object.merge( baseProperties, additionalProperties );
      return mergedProperties;
   }.protect()

});

var TableColumnDefinition = new Class( {
   // Constructor
   initialize : function(theCaptionKey, i18Resource) {
       // Private instance variables
       this.caption = null;
       this.i18Resource = i18Resource;
       try {
           this.caption = this.i18Resource.getText( theCaptionKey );
       } catch (e) {
           this.caption = theCaptionKey;
       }
   },

   // Properties
   getCaption : function() {
       return this.caption;
   }
});

var TableColumnList = new Class({
   //Constructor
   initialize: function(){
       this.tableColumns = new ArrayList();        
   },

   //Public accessor and mutator methods
   add : function( tableColumnDefinition ){
       this.tableColumns.add( tableColumnDefinition );
   },
   
   getColumnByIndex : function( columnIndex ){
       var searchedColumn = null;
       this.tableColumns.each( function( columnDefinition, index ){
           if( index == columnIndex ) { searchedColumn = columnDefinition; }
       }, this );
       
       return searchedColumn;
   },
   
   size : function() {
       return this.tableColumns.size();
   }
});

var TableHeaderDefinition = new Class( {
   // Constructor
   initialize : function(i18Resource) {
       this.tableColumns = new TableColumnList();
       this.i18Resource = i18Resource;
   },

   // Public accessor and mutator methods
   addColumn : function(theCaptionKey) {
       var columnDefinition = new TableColumnDefinition( theCaptionKey, this.i18Resource );
       this.tableColumns.add( columnDefinition );
       //this.tableColumns.add( columnDefinition.getCaption, columnDefinition );
   },

   getColumns : function() {
       return this.tableColumns;
   }
});

var TableDefinition = new Class( {
   // Constructor
   initialize : function(i18Resource) {
       this.tableHeaderDefinition = new TableHeaderDefinition( i18Resource );
       this.tableRows = new TableRowList();
   },

   // Public accessor and mutator methods
   addColumn : function(theCaptionKey) {
       this.tableHeaderDefinition.addColumn( theCaptionKey );
   },

   addRow : function( rowArray ) {
       this.tableRows.add( rowArray );
   },

   // Properties
   getColumns : function() {
       return this.tableHeaderDefinition.getColumns();
   },
   
   getRow : function( rowIndex ) {
       return this.tableRows.getRowByIndex( rowIndex );
   },
   
   getRows : function() {
       return this.tableRows;
   }
});

var TableRowList = new Class({
   //Constructor
   initialize: function(){
       this.tableRows = new ArrayList();       
   },

   //Public accessor and mutator methods
   add : function( tableRowDefinition ){
       this.tableRows.add( tableRowDefinition );
   },
   
   getRowByIndex : function( rowIndex ){
       var searchedRow = null;
       this.tableRows.each( function( rowDefinition, index ){
           if( index == rowIndex ) { searchedRow = rowDefinition; }
       }, this );
       
       return searchedRow;
   },
   
   size : function() {
       return this.tableRows.size();
   }
});

WidgetElementFactory.Positions = {
   Before : 0,
   After : 1,
   FirstChild : 2,
   LastChild : 3,
   Undefined : 4 };