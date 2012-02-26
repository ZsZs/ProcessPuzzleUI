window.WidgetElementFactoryTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onFailure', 'onSuccess'],

   options : {
      testMethods : [
          { method : 'create_InstantiatesNewElementWithGivenProperties', isAsynchron : false },
          { method : 'create_WhenTextIsGivenAddsToNode', isAsynchron : false }, 
          { method : 'create_WhenTextIsGivenTranslatesIt', isAsynchron : false }, 
          { method : 'create_InsertsNewElementIntoGivenPosition', isAsynchron : false }, 
          { method : 'createAnchor_WhenOnClickIsNull_SetsHref', isAsynchron : false }, 
          { method : 'createAnchor_WhenOnClickIsGiven_SetsHrefToNumber', isAsynchron : false }, 
          { method : 'createButton_CreatesNewInputElement', isAsynchron : false }, 
          { method : 'createCollapsibleArea_CreatesNewDivElement', isAsynchron : false }, 
          { method : 'createDivisionElement', isAsynchron : false }, 
          { method : 'createFieldSet_CreatesFieldsetAndNestedLegendAndImageElements', isAsynchron : false }, 
          { method : 'createForm_AppendsNewFormToContainer', isAsynchron : false }, 
          { method : 'createHiddenDivision_SetsDisplayToNone', isAsynchron : false }, 
          { method : 'createRowLabel_InstantiatesSpanWithGivenTextAndClass', isAsynchron : false }, 
          { method : 'createRowValue_InstantiatesSpanWithClass', isAsynchron : false }, 
          { method : 'createStaticRow_AppendsNewDivWithLabelAndSpan', isAsynchron : false },
          { method : 'createTable_InstantiatesTableHeaderAndRowsElements', isAsynchron : false }]
   },

   constants : {
      ANCHOR_ID : "anchorId",
      ANCHOR_LINK : "http://processpuzzle.com",
      ANCHOR_TEXT : "a link",
      CLICK_EVENT_HANDLER : function anchorClickEvent() { alert("You clicked me."); },
      CONTEXT_ELEMENT_ID : "contextElement",
      FIELDSET_IMAGE_ID : "fieldSetImageId",
      FORM_NAME : "newForm",
      FORM_METHOD_TYPE : "POST",
      HIDDEN_DIVISION_ID : "hiddenVisionId",
      INTERNATIONALIZATION_URI : "../BrowserWidget/WidgetInternationalization.xml",
      LANGUAGE : "hu",
      NEW_ELEMENT_CLASS : "newElementClass",
      NEW_ELEMENT_ID : "newElementId",
      NEW_ELEMENT_TEXT : "Hello World!",
      RESOURCE_KEY : "Widget.ItemOne",
      ROW_LABEL : "row label:",
      ROW_VALUE : "row value",
      ROW_VALUE_ID : "rowValueId",
      TABLE_COLUMN_ONE : "First Column",
      TABLE_COLUMN_TWO : "Second Column",
      WEBUI_CONFIGURATION_URI : "../ToolBarWidget/WebUIConfiguration.xml",
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      this.contextElement = null;
      this.elementFactory = null;
      this.i18Resource = null;
      this.locale = new Locale( this.constants.LANGUAGE );
      this.newElement = null;
      this.webUIConfiguration = null;
      this.webUILogger = null;
   },   

   beforeEachTest : function(){
      this.webUIConfiguration = new WebUIConfiguration( this.constants.WEBUI_CONFIGURATION_URI );
      this.webUILogger = new WebUILogger( this.webUIConfiguration );
      this.i18Resource = new XMLResourceBundle( this.webUIConfiguration );
      this.i18Resource.load( this.locale );
      this.contextElement = $( this.constants.CONTEXT_ELEMENT_ID );
      this.elementFactory = new WidgetElementFactory( this.contextElement, this.i18Resource );
   },
   
   afterEachTest : function (){
      this.i18Resource.release();
      if( this.newElement ) this.newElement.destroy();
      this.newElement = null;
      this.elementFactory = null;
   },
   
   create_InstantiatesNewElementWithGivenProperties : function() {
      this.newElement = this.elementFactory.create( 'div', null, null, null, { id : this.constants.NEW_ELEMENT_ID, 'class' : "newElementClass" } );
      assertThat( this.newElement.get( 'tag' ).toUpperCase(), equalTo( "DIV" ));
      assertThat( this.newElement.get( 'id' ), equalTo( this.constants.NEW_ELEMENT_ID ));
      assertThat( this.newElement.get( 'class'), equalTo( this.constants.NEW_ELEMENT_CLASS ));
   },
   
   create_WhenTextIsGivenAddsToNode : function() {
      this.newElement = this.elementFactory.create( 'div', this.constants.NEW_ELEMENT_TEXT );
      assertThat( this.newElement.get( 'text' ), equalTo( this.constants.NEW_ELEMENT_TEXT ));
   },
   
   create_WhenTextIsGivenTranslatesIt : function() {
      this.newElement = this.elementFactory.create( 'div', this.constants.RESOURCE_KEY );
      assertThat( this.newElement.get( 'text' ), equalTo( this.i18Resource.getText( this.constants.RESOURCE_KEY )));
   },
   
   create_InsertsNewElementIntoGivenPosition : function() {
      var elementBefore = this.elementFactory.create( 'div', "Before", this.contextElement, WidgetElementFactory.Positions.Before );
      assertThat( this.contextElement.getPrevious(), equalTo( elementBefore ));
      
      var elementAfter = this.elementFactory.create( 'div', "After", this.contextElement, WidgetElementFactory.Positions.After );
      assertThat( this.contextElement.getNext(), equalTo( elementAfter ));
      
      var firstChild = this.elementFactory.create( 'div', "FirstChild", this.contextElement, WidgetElementFactory.Positions.FirstChild );
      assertThat( this.contextElement.getFirst(), equalTo( firstChild ));

      var lastChild = this.elementFactory.create( 'div', "LastChild", this.contextElement, WidgetElementFactory.Positions.LastChild );
      assertThat( this.contextElement.getLast(), equalTo( lastChild ));

      //TEAR DOWN:
      elementBefore.destroy();
      elementAfter.destroy();
      firstChild.destroy();
      lastChild.destroy();
   },
   
   createAnchor_WhenOnClickIsNull_SetsHref : function() {
      //SETUP:
      //EXCERCISE:
      this.newElement = this.elementFactory.createAnchor( this.constants.ANCHOR_TEXT, this.constants.ANCHOR_LINK, null, null, null, {'id' : this.constants.ANCHOR_ID } );
      
      //VERIFY:
      assertEquals( "A", this.newElement.tagName.toUpperCase() );
      assertEquals( this.constants.ANCHOR_ID, this.newElement.get( 'id' ));
      assertEquals( this.constants.ANCHOR_TEXT, this.newElement.get( 'text' ));
      assertThat( this.newElement.get( 'href' ), equalTo( this.constants.ANCHOR_LINK ));
   },
   
   createAnchor_WhenOnClickIsGiven_SetsHrefToNumber : function() {
      //SETUP:
      //EXCERCISE:
      this.newElement = this.elementFactory.createAnchor( this.constants.ANCHOR_TEXT, this.constants.ANCHOR_LINK, this.constants.CLICK_EVENT_HANDLER, null, null, {'id' : this.constants.ANCHOR_ID } );
      
      //VERIFY:
      assertNotNull( "A new achor was created.", this.newElement );
      assertEquals( "A", this.newElement.tagName.toUpperCase() );
      assertEquals( this.constants.ANCHOR_ID, this.newElement.get( 'id' ));
      assertEquals( this.constants.ANCHOR_TEXT, this.newElement.get( 'text' ));
      assertEquals( "#", this.newElement.get( 'href' ));

      var events = this.newElement.retrieve( 'events' );
      var clickEventHandler = events['click'].keys[0];
      assertEquals( this.constants.CLICK_EVENT_HANDLER, clickEventHandler );
   },
   
   createButton_CreatesNewInputElement : function() {
      //SETUP: see setUp()
      //EXERCISE:
      this.newElement = this.elementFactory.createButton( this.constants.RESOURCE_KEY, this.constants.CLICK_EVENT_HANDLER );
        
      //VERIFY:
      assertEquals( "INPUT", this.newElement.tagName.toUpperCase() );
      assertEquals( "button", this.newElement.get( 'type' ));
      assertEquals( this.i18Resource.getText( this.constants.RESOURCE_KEY ), this.newElement.get( 'value' ));
      assertTrue( this.newElement.hasClass( this.elementFactory.options.buttonClass ) );
      assertEquals( this.constants.CLICK_EVENT_HANDLER, this.newElement.retrieve( 'events' )['click'].keys[0] );
   },
   
   createCollapsibleArea_CreatesNewDivElement : function() {
      //SETUP:
      //EXCERCISE:
      this.newElement = this.elementFactory.createCollapsibleArea();
      
      //VERIFY:
      assertNotNull( "A new division element was created.", this.newElement ); 
      assertEquals( "DIV", this.newElement.tagName.toUpperCase() );
      assertTrue( this.newElement.hasClass( this.elementFactory.options.readOnlyContainerClassName ) );
   },
   
   createDivisionElement : function() {
      //SETUP:
      //EXCERCISE:
      this.newElement = this.elementFactory.createDivision();
      
      //VERIFY:
      assertNotNull( "A new division element was created.", this.newElement ); 
      assertEquals( "DIV", this.newElement.tagName.toUpperCase() );
      assertTrue( this.newElement.hasClass( this.elementFactory.options.readOnlyContainerClassName ));
   },
   
   createFieldSet_CreatesFieldsetAndNestedLegendAndImageElements : function() {
      //SETUP:
      //EXCERCISE:
      this.newElement = this.elementFactory.createFieldSet( this.constants.FIELDSET_IMAGE_ID );
      
      //VERIFY:
      assertNotNull( "A new FIELDSET element was created.", this.newElement ); 
      assertEquals( "FIELDSET", this.newElement.tagName.toUpperCase() );
      
      assertEquals( this.elementFactory.options.fieldSetStyle["border-color"], this.newElement.getStyle( "border-color" ));
      assertEquals( this.elementFactory.options.fieldSetStyle["width"], this.newElement.getStyle( "width" ));
      
      var legend = this.newElement.getElement( "LEGEND" );
      assertNotNull( "Fieldset has a LEGEND child element.", legend );
      
      var image = this.newElement.getElement( "LEGEND IMG" );
      assertNotNull( "LEGEND within FIELDSET element has an IMG child element.", image );
      assertEquals( this.constants.FIELDSET_IMAGE_ID, image.get( "id" ));
      assertEquals( this.elementFactory.options.fieldSetImageSource, image.get( "src" ));
      assertEquals( this.elementFactory.options.fieldSetImageAlt, image.get( "alt" ));
      assertEquals( this.elementFactory.options.fieldSetImageTitle, image.get( "title" ));
      assertEquals( this.elementFactory.options.fieldSetImageStyle["cursor"], image.getStyle( "cursor" ));
   },
   
   createForm_AppendsNewFormToContainer : function() {
      //SETUP: See setUp()
      
      //EXCERCISE:
      this.newElement = this.elementFactory.createForm( this.constants.FORM_NAME, this.constants.FORM_METHOD_TYPE );
      
      //VERIFY:
      assertThat( this.newElement.get('id'), equalTo( this.constants.FORM_NAME ));
      assertThat( this.newElement.get('method').toUpperCase(), equalTo( this.constants.FORM_METHOD_TYPE ));
      assertThat( this.contextElement.getElementById( this.constants.FORM_NAME ).get( 'tag' ).toUpperCase(), equalTo( "FORM" ));
   },
   
   createHiddenDivision_SetsDisplayToNone : function() {
      //SETUP:
      //EXCERCISE:
      this.newElement = this.elementFactory.createHiddenDivision( this.constants.HIDDEN_DIVISION_ID );
       
      //VERIFY:
      assertNotNull( "A new DIV element was created.", this.newElement );
      assertEquals( "DIV", this.newElement.tagName.toUpperCase() );
      assertEquals( this.constants.HIDDEN_DIVISION_ID, this.newElement.id );
      assertEquals( "none", this.newElement.getStyle( "display" ) );
      assertTrue( this.newElement.hasClass( this.elementFactory.options.readOnlyContainerClassName ));
   },
   
   createRowLabel_InstantiatesSpanWithGivenTextAndClass : function() {
      //SETUP:
      //EXCERCISE:
      this.newElement = this.elementFactory.createRowLabel( this.constants.ROW_LABEL );
       
      //VERIFY:
      this.assertElementExists( this.newElement, "SPAN" );
      assertTrue( this.newElement.hasClass( this.elementFactory.options.labelClassName ) );
      assertEquals( this.constants.ROW_LABEL, this.newElement.get( 'text' ) );
   },
   
   createRowValue_InstantiatesSpanWithClass : function() {
      //SETUP:
      //EXCERCISE:
      this.newElement = this.elementFactory.createRowValue( this.constants.ROW_VALUE, this.constants.ROW_VALUE_ID );
       
      //VERIFY:
      this.assertElementExists( this.newElement, "SPAN" );
      assertThat( this.newElement.get( 'text' ), equalTo( this.constants.ROW_VALUE ));
      assertThat( this.newElement.get( 'id' ), equalTo( this.constants.ROW_VALUE_ID ));
      assertTrue( this.newElement.hasClass( this.elementFactory.options.valueClassName ) );
   },
   
   createStaticRow_AppendsNewDivWithLabelAndSpan : function() {
      //SETUP: See setUp()
      
      //EXCERCISE:
      this.newElement = this.elementFactory.createStaticRow( this.constants.ROW_LABEL, this.constants.ROW_VALUE, this.constants.ROW_VALUE_ID, this.contextElement );

      //VERIFY:
      assertThat( this.newElement.get( 'class' ), equalTo( this.elementFactory.options.rowClassName ) );
      assertThat( this.newElement.getFirst().get( 'tag' ).toUpperCase(), equalTo( "LABEL" ));
      assertThat( this.newElement.getFirst().get( 'class' ), equalTo( this.elementFactory.options.labelClassName ));
      assertThat( this.newElement.getFirst().get( 'text' ), equalTo( this.constants.ROW_LABEL ));
      assertThat( this.newElement.getLast().get( 'tag' ).toUpperCase(), equalTo( "SPAN" ));
      assertThat( this.newElement.getLast().get( 'class' ), equalTo( this.elementFactory.options.valueClassName ));
      assertThat( this.newElement.getLast().get( 'text' ), equalTo( this.constants.ROW_VALUE ));
      assertThat( this.newElement.getLast().get( 'id' ), equalTo( this.constants.ROW_VALUE_ID ));
   },
   
   createTable_InstantiatesTableHeaderAndRowsElements : function() {
      //SETUP:
      var tableDefinition = this.defineTestTable();
      
      //EXCERCISE:
      this.newElement = this.elementFactory.createTable( tableDefinition, this.contextElement );
       
      //VERIFY:
      assertNotNull( "A new TABLE element was created.", this.newElement );
      assertEquals( "TABLE", this.newElement.tagName.toUpperCase() );
      
      assertNotNull( "The TABLE contains THEAD element.", this.newElement.getElement( "THEAD" ) );
      assertNotNull( "The table head (THEAD) contains a TR element.", this.newElement.getElement( "THEAD TR" ) );
      assertEquals( tableDefinition.getColumns().size(), this.newElement.getElements( "THEAD TR TH" ).length );
       
      this.newElement.getElements( "THEAD TR TH" ).each( function( tableHeader, index ){
         assertEquals( tableDefinition.getColumns().getColumnByIndex( index ).getCaption(), tableHeader.get( 'text' ));
      });
       
      assertNotNull( "The TABLE contains TBODY element.", this.newElement.getElement( "TBODY" ) );
      assertEquals( "The table body contains 2 TR elements.", 2, this.newElement.getElements( "TBODY TR" ).length );
      assertEquals( "The 2 rows contains 4 TD elements.", 4, this.newElement.getElements( "TBODY TR TD" ).length );
      this.newElement.getElements( "TBODY TR TD" ).each( function( tableData, index ){
         assertEquals( index +1, tableData.get( 'text' ).toInt() );
      }); 
   },
   
   //Private helper methods
   assertElementExists : function( element, tagName ){
      assertNotNull( "The given element exists.", element );
      assertEquals( tagName, element.tagName.toUpperCase() );
   },
   
   defineTestTable : function() {
      var tableDefinition = new TableDefinition( this.i18Resource );
      tableDefinition.addColumn( this.constants.TABLE_COLUMN_ONE );
      tableDefinition.addColumn( this.constants.TABLE_COLUMN_TWO );
      tableDefinition.addRow( new Array( 1,2 ) );
      tableDefinition.addRow( new Array( 3,4 ) );
     
      return tableDefinition;
   }

});