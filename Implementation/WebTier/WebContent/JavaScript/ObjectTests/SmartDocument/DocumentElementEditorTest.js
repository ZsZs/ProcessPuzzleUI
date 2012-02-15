var DocumentElementEditorTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
          { method : 'initialize_setsStateToDetached', isAsynchron : false },
          { method : 'attach_associatesEventHandlingWithHtmlElement', isAsynchron : false },
          { method : 'onClick_storesTextAndInsertsInputElementWithElementProperties', isAsynchron : false },
          { method : 'onBlur_savesPreviousTextAndDestroysInputElement', isAsynchron : false }]
   },

   constants : {
      NEW_TEXT : "This is a modified text.",
      ORIGINAL_TEXT : "Current text of element",
      SUBJECT_ELEMENT_ID : "elementToEdit"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.elementEditor;
      this.subjectElement;
   },   

   beforeEachTest : function(){
      this.subjectElement = $( this.constants.SUBJECT_ELEMENT_ID );
      this.elementEditor = new DocumentElementEditor( this.subjectElement, {} );
   },
   
   afterEachTest : function (){
      this.elementEditor.detach();
      this.subjectElement = null;
   },
   
   initialize_setsStateToDetached : function(){
      assertThat( this.elementEditor.getState(), equalTo( DocumentElementEditor.States.DETACHED ));
   },
   
   attach_associatesEventHandlingWithHtmlElement : function() {
      var mockedOnClick = spy( this.elementEditor.onClick ); this.elementEditor.onClick = mockedOnClick;
      var mockedOnBlur = spy( this.elementEditor.onBlur ); this.elementEditor.onBlur = mockedOnBlur;
      
      this.elementEditor.attach();
      assertThat( this.elementEditor.getState(), equalTo( DocumentElementEditor.States.ATTACHED ));
      
      this.subjectElement.fireEvent( 'click' );
      verify( mockedOnClick )();
      
      this.subjectElement.fireEvent( 'focus' );
      verify( mockedOnClick, times( 2 ))();
   },
   
   onClick_storesTextAndInsertsInputElementWithElementProperties : function() {
      var elementText = this.subjectElement.get( 'text' );
      this.elementEditor.attach();
      this.elementEditor.onClick();

      assertThat( this.elementEditor.getState(), equalTo( DocumentElementEditor.States.EDITING ));
      assertThat( this.elementEditor.getText(), equalTo( this.subjectElement.get( 'text' )));
      assertThat( this.subjectElement.getNext( 'input' ), not( nil() ));
      assertThat( this.subjectElement.getNext( 'input' ).get( 'value' ), equalTo( elementText ));
   },
   
   onBlur_savesPreviousTextAndDestroysInputElement : function() {
      this.elementEditor.attach();
      this.elementEditor.onClick();
      this.elementEditor.getInputElement().set( 'value', this.constants.NEW_TEXT );
      
      this.elementEditor.getInputElement().fireEvent( 'blur' );
      
      assertThat( this.elementEditor.getState(), equalTo( DocumentElementEditor.States.ATTACHED ));
      assertThat( this.subjectElement.getNext( 'input' ), is( nil() ));
      assertThat( this.subjectElement.get( 'text' ), equalTo( this.constants.NEW_TEXT ));
      assertThat( this.elementEditor.isChanged(), is( true ));
      assertThat( this.elementEditor.getPreviousValue(), equalTo( this.constants.ORIGINAL_TEXT ));
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },

   onConstructionError : function(){
      this.testCaseChain.callChain();
   }
   
});