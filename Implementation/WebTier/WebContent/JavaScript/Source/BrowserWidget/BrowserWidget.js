// BrowserWidget.js

/**
 * ProcessPuzzle User Interface Backend agnostic, desktop like configurable,
 * browser font-end based on MochaUI. Copyright (C) 2011 Joe Kueser, Zsolt
 * Zsuffa
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

// Abstract root class of all widgets. Provides standardized way for different
// HTML element creation.
var BrowserWidget = new Class( {
	Implements : Options,
	Binds : 'webUIMessageHandler',

	// public constants
	BUTTON_CLASS : "buttonSmall",
	FIELDSET_STYLE : {
		'border-color' : '#336699',
		'width' : '100%'
	},
	FIELDSET_IMAGE_ALT : "Show/Hide",
	FIELDSET_IMAGE_STYLE : {
		'cursor' : 'pointer'
	},
	FIELDSET_IMAGE_SOURCE : "images/expver.png",
	FIELDSET_IMAGE_TITLE : "Show/Hide",
	READ_ONLY_CONTAINER_CLASS_NAME : "readOnlyContainer",
	ROW_CLASS_NAME : "row",
	LABEL_CLASS_NAME : "label",
	VALUE_CLASS_NAME : "formw",

	options : {
		definitionXmlNameSpace : "xmlns:pp='http://www.processpuzzle.com'",
		domDocument : this.document,
		subscribeToWebUIMessages : false,
		widgetContainerId : "widgetContainer",
		widgetDefinitionURI : null
	},

	// constructor
	initialize : function(options, resourceBundle) {
		this.setOptions( options );

		// private instance variables
		this.containerElement;
		this.definitionXml;
		this.i18Resource = null;
		this.isConfigured = false;
		this.lastHandledMessage = null;
		this.locale;
		this.logger;
		this.messageBus;
		this.webUIController = null;

		// initialize object
		this.deduceInitializationArguments( options, resourceBundle );
		this.containerElement = $( this.options.widgetContainerId );
		this.configureLogger();
		this.configureMessageBus();
		this.loadWidgetDefinition();

		assertThat( this.i18Resource, not( nil() ));
		if (this.containerElement == null)
			throw new IllegalArgumentException( "Parameter 'widgetContainerId' in invalid." );
		if (!this.i18Resource.isLoaded)
			throw new IllegalArgumentException( "ResourceBundle should be already loaded." );
		;
	},

	// public accessor and mutator methods
	appendElement : function(element, parentElement) {
		parentElement = $( parentElement );
		var contextElement = parentElement == undefined ? this.containerElement : parentElement;
		contextElement.grab( element );
	},

	appendNewAnchor : function(elementProperties, nodeText, clickEventHandler, parentElement) {
		var newAnchor = this.createAnchor( elementProperties, nodeText, clickEventHandler );
		this.appendElement( newAnchor, parentElement );
		return newAnchor;
	},

	appendNewButton : function(elementProperties, buttonCaption, clickEventHandler, parentElement) {
		var newButton = this.createButton( buttonCaption, clickEventHandler );
		this.appendElement( newButton, parentElement );
		return newButton;
	},

	appendNewCollapsibleArea : function(parentElement) {
		var newCollapsibleArea = this.createCollapsibleArea();
		this.appendElement( newCollapsibleArea, parentElement );
		return newCollapsibleArea;
	},

	appendNewDivision : function(parentElement) {
		var newDivision = this.createDivision();
		this.appendElement( newDivision, parentElement );
		return newDivision;
	},

	appendNewFieldSet : function(imageId, parentElement) {
		var newFieldSet = this.createFieldSet( imageId );
		this.appendElement( newFieldSet, parentElement );
		return newFieldSet;
	},

	appendNewForm : function(formName, methodType, parentElement) {
		var newForm = this.createForm( formName, methodType );
		this.appendElement( newForm, parentElement );
		return newForm;
	},

	appendNewHiddenDivision : function(divId, parentElement) {
		var newDivision = this.createHiddenDivision( divId );
		this.appendElement( newDivision, parentElement );
		return newDivision;
	},

	appendNewListItem : function(elementProperties, parentElement) {
		var newListItem = this.createListItem( elementProperties );
		this.appendElement( newListItem, parentElement );
		return newListItem;
	},

	appendNewOption : function(value, text, parentElement) {
		var newOption = this.createElement( "OPTION" );
		newOption.set( 'value', value );
		this.appendNewText( text, newOption );
		this.appendElement( newOption, parentElement );
		return newOption;
	},

	appendNewRowLabel : function(labelText, parentElement) {
		var newRowLabel = this.createRowLabel( labelText );
		this.appendElement( newRowLabel, parentElement );
		return newRowLabel;
	},

	appendNewRowValue : function(parentElement) {
		var newRowValue = this.createRowValue();
		this.appendElement( newRowValue, parentElement );
		return newRowValue;
	},

	appendNewSelect : function(elementProperties, parentElement) {
		var newElement = this.createSelect( elementProperties );
		this.appendElement( newElement, parentElement );
		return newElement;
	},

	appendNewSpan : function(elementProperties, parentElement) {
		var newSpan = this.createSpan( elementProperties );
		this.appendElement( newSpan, parentElement );
		return newSpan;
	},

	appendNewStaticRow : function(labelText, valueText, valueElementId, parentElement) {
		var staticRow = this.createStaticRow( labelText, valueText, valueElementId );
		this.appendElement( staticRow, parentElement );

		return staticRow;
	},

	appendNewTable : function(tableDefinition, parentElement) {
		var newTable = this.createTable( tableDefinition );
		this.appendElement( newTable, parentElement );
		return newTable;
	},

	appendNewText : function(text, parentElement) {
		var newText = this.createText( text );
		this.appendElement( newText, parentElement );
		return newText;
	},

	appendNewUnOrderedList : function(elementProperties, parentElement) {
		var newULElement = this.createElement( "UL", elementProperties );
		this.appendElement( newULElement, parentElement );
		return newULElement;
	},

	configure : function() {
		this.isConfigured = true;
		return this;
	},

	createAnchor : function(elementProperties, nodeText, clickEventHandler) {
		var anchor = this.createElement( "A", elementProperties );
		anchor.set( "href", "#" );

		anchor.addEvent( 'click', clickEventHandler );
		anchor.appendChild( this.createText( nodeText ) );

		return anchor;
	},

	createButton : function(elementProperties, buttonCaption, clickEventHandler) {
		var button = this.createElement( "INPUT", elementProperties );
		button.set( "type", "button" );
		button.set( "value", this.getText( buttonCaption ) );
		if (elementProperties == null || elementProperties['class'] == null)
			button.addClass( this.BUTTON_CLASS );
		button.addEvent( 'click', clickEventHandler );

		return button;
	},

	createCollapsibleArea : function() {
		var collapsibleElement = this.createElement( "DIV" );
		collapsibleElement.addClass( this.READ_ONLY_CONTAINER_CLASS_NAME );

		return collapsibleElement;
	},

	createDivision : function() {
		var division = this.createElement( "DIV" );
		division.addClass( this.READ_ONLY_CONTAINER_CLASS_NAME );

		return division;
	},

	createElement : function(elementName, elementProperties) {
		var newElement = new Element( elementName, elementProperties );
		newElement = $( newElement );
		return newElement;
	},

	createFieldSet : function(imageId) {
		var fieldSet = this.createElement( "FIELDSET" );
		fieldSet.setStyles( this.FIELDSET_STYLE );

		var legend = this.createElement( "LEGEND" );
		var image = this.createElement( "IMG" );
		image.set( "id", imageId );
		image.set( "src", this.FIELDSET_IMAGE_SOURCE );
		image.set( "alt", this.FIELDSET_IMAGE_ALT );
		image.set( "title", this.FIELDSET_IMAGE_TITLE );
		image.setStyles( this.FIELDSET_IMAGE_STYLE );

		fieldSet.appendChild( legend );
		legend.appendChild( image );

		return fieldSet;
	},

	createForm : function(formName, methodType) {
		assertThat( formName, not( nil() ));
		assertThat( methodType == "POST" || methodType == "GET", is( true ) );

		var form = this.createElement( "FORM" );
		form.id = formName;
		form.method = methodType;

		return form;
	},

	createHiddenDivision : function(divId) {
		var hiddenDiv = this.createElement( "DIV" );
		hiddenDiv.addClass( this.READ_ONLY_CONTAINER_CLASS_NAME );
		hiddenDiv.setStyle( 'display', 'none' );
		hiddenDiv.set( 'id', divId );

		return hiddenDiv;
	},

	createListItem : function(elementProperties) {
		var listItem = this.createElement( "LI", elementProperties );
		return listItem;
	},

	createRowLabel : function(labelText) {
		var label = this.createElement( "SPAN" );
		label.className = this.LABEL_CLASS_NAME;
		var textNode = this.createText( labelText );
		label.appendChild( textNode );
		return label;
	},

	createRowValue : function() {
		var value = this.createElement( "SPAN" );
		value.addClass( this.VALUE_CLASS_NAME );
		return value;
	},

	createSelect : function(elementProperties) {
		var selectElement = this.createElement( "SELECT", elementProperties );
		return selectElement;
	},

	createSpan : function(elementProperties) {
		var spanElement = this.createElement( "SPAN", elementProperties );
		return spanElement;
	},

	createStaticRow : function( labelText, valueText, valueElementId) {
		var rowElement = this.createElement( "DIV" );
		rowElement.className = this.ROW_CLASS_NAME;

		var label = this.createRowLabel( labelText );
		rowElement.appendChild( label );

		var valueElement = this.createRowValue();
		var valueTextNode = this.createText( valueText );
		if (valueElementId != null) {
			valueElement.set( "id", valueElementId );
			// valueElement.set( "name", valueElementId );
		}
		
		valueElement.appendChild( valueTextNode );
		rowElement.appendChild( valueElement );

		return rowElement;
	},

	createTable : function(theTableDefinition) {
		var tableElement = this.createElement( "TABLE" );
		var tableHeadElement = this.createElement( "THEAD" );
		var tableBodyElement = this.createElement( "TBODY" );
		var tableHeadRowElement = this.createElement( "TR" );

		tableElement.appendChild( tableHeadElement );
		tableHeadElement.appendChild( tableHeadRowElement );

		for ( var i = 1; i <= theTableDefinition.getColumns().size(); i++) {
			var tableColumnDefinition = theTableDefinition.getColumns().getColumnByIndex( i - 1 );

			var tableColumnElement = this.createElement( "TH" );
			var tableColumnText = this.createText( tableColumnDefinition.getCaption() );
			tableColumnElement.appendChild( tableColumnText );

			tableHeadRowElement.appendChild( tableColumnElement );
		}

		tableElement.appendChild( tableBodyElement );

		for ( var i = 0; i < theTableDefinition.getRows().size(); i++) {
			var tableRow = theTableDefinition.getRow( i );
			var tableBodyRowElement = this.createElement( "TR" );
			tableBodyElement.appendChild( tableBodyRowElement );

			for ( var c = 0; c < tableRow.length; c++) {
				var tableDataElement = this.createElement( "TD" );
				var tableDataText = this.createText( tableRow[c] );
				tableDataElement.appendChild( tableDataText );
				tableBodyRowElement.appendChild( tableDataElement );
			}
		}

		return tableElement;
	},

	createText : function(text) {
		return this.options.domDocument.createTextNode( this.getText( text ) );
	},

	destroy : function() {
		if (this.isConfigured) {
			this.containerElement.getElements( '*' ).each( function(childElement, index) {
				if (childElement.removeEvents)
					childElement.removeEvents();
				if (childElement.destroy)
					childElement.destroy();
			} );
			this.isConfigured = false;
		}
	},

	findElementById : function(elementId, parentElement) {
		var foundElement = null;
		parentElement = $( parentElement );
		var contextElement = parentElement == undefined ? this.containerElement : parentElement;

		for ( var item = contextElement.firstChild; item; item = item.nextSibling) {
			if (item.id == elementId)
				return item;
			else if (item.hasChildNodes)
				foundElement = this.findElementById( elementId, item );
			if (foundElement != null)
				return foundElement;
		}
		return foundElement;
	},

	getText : function(key) {
		var text = null;
		try {
			text = this.i18Resource.getText( key );
		} catch (e) {
			text = key;
		}
		return text;
	},

	removeChild : function(childElement, parentElement) {
		var contextElement = parentElement == undefined ? this.containerElement : parentElement;

		if (contextElement != null && childElement != null) {
			contextElement.removeChild( childElement );
		}
	},

	removeWidget : function() {
		while (this.containerElement.hasChildNodes())
			this.containerElement.removeChild( this.containerElement.firstChild );
	},

	updateText : function(theContainerElement, parentElementId, newTextValue) {
		var parentElement = this.findElementById( theContainerElement, parentElementId );
		var oldTextElement = parentElement.firstChild;
		var newTextElement = self.createTextNode( newTextValue );
		parentElement.replaceChild( newTextElement, oldTextElement );
	},

	webUIMessageHandler : function(webUIMessage) {
		if (!this.isConfigured)
			throw new UnconfiguredWidgetException( {
				source : 'BrowserWidget.webUIMessageHandler()'
			} );
		this.lastHandledMessage = webUIMessage;
	},

	// Properties
	getContainerElement : function() {
		return this.containerElement;
	},
	getDefinitionXml : function() {
		return this.definitionXml;
	},
	getHtmlDOMDocument : function() {
		return this.options.domDocument;
	},
	getLastMessage : function() {
		return this.lastHandledMessage;
	},
	getLocale : function() {
		return this.locale;
	},
	getLogger : function() {
		return this.logger;
	},
	getMessageBus : function() {
		return this.messageBus;
	},
	getResourceBundle : function() {
		return this.i18Resource;
	},

	// Private helper methods
	configureLogger : function() {
		if (this.webUIController == null) {
			this.logger = Class.getInstanceOf( WebUILogger );
			if (this.logger == null)
				this.logger = new WebUILogger();
		} else
			this.logger = this.webUIController.getLogger();
	}.protect(),

	configureMessageBus : function() {
		if (this.webUIController == null)
			this.messageBus = Class.getInstanceOf( WebUIMessageBus );
		else
			this.messageBus = this.webUIController.getMessageBus();

		this.subscribeToWebUIMessages();
	}.protect(),

	deduceInitializationArguments : function(options, resourceBundle) {
		if (resourceBundle) {
			this.i18Resource = resourceBundle;
			this.locale = resourceBundle.getLocale();
		} else {
			this.webUIController = Class.getInstanceOf( WebUIController );
			this.i18Resource = this.webUIController.getResourceBundle();
			this.locale = this.webUIController.getCurrentLocale();
		}
	}.protect(),

	loadWebUIConfiguration : function() {
		try {
			this.webUIConfiguration = new WebUIConfiguration( this.options.configurationUri );
		} catch (e) {
			alert( "Couldn't load Browser Front-End configuration: " + this.options.configurationUri );
		}
	}.protect(),

	loadWidgetDefinition : function() {
		if (this.options.widgetDefinitionURI) {
			try {
				this.definitionXml = new XmlResource( this.options.widgetDefinitionURI, {
					nameSpaces : this.options.definitionXmlNameSpace
				} );
			} catch (e) {
				this.logger.info( "Widget definition: '" + this.options.widgetDefinitionURI + "' not found." );
			}
		}
	}.protect(),

	subscribeToWebUIMessages : function() {
		if (this.options.subscribeToWebUIMessages) {
			this.options.subscribeToWebUIMessages.each( function(messageClass, index) {
				this.messageBus.subscribeToMessage( messageClass, this.webUIMessageHandler );
			}, this );
		}
	}.protect()

} );

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
