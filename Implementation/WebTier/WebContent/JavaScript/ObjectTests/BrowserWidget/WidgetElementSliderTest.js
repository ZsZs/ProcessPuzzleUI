window.WidgetElementSliderTest = new Class({
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkScrollReady'],

   options : {
      testMethods : [],
   },

   constants : {
      CONTAINER_ELEMENT_STYLE : { styles : { height : '30px', width : '200px', overflow : 'hidden', margin : '0px', padding : '0px', position: 'relative' }},
      NESTED_ELEMENTS_NUMBER : 9,
      SUBJECT_ELEMENT_STYLE : { id : 'SubjectElement', styles : { position: 'relative', height : '30px', width : '450px', left : '0px', top : '0px', margin : '0px', padding : '0px' }}
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.nestedElements;
      this.slider;
      this.timer;
      this.subjectElement;
   },   

   beforeEachTest : function(){
      this.nestedElements = new ArrayList();
      this.containerElement = ( new Element( 'div', this.constants.CONTAINER_ELEMENT_STYLE )).inject( $( document.body ));
      this.subjectElement = ( new Element( 'div', this.constants.SUBJECT_ELEMENT_STYLE )).inject( this.containerElement );
      this.injectNestedElements();
   },
   
   afterEachTest : function (){
      this.nestedElements.clear();
      this.slider = null;
      this.subjectElement.destroy();
      this.containerElement.destroy();
   },
   
   //Test cases
   
   //Helper methods
   checkScrollReady : function(){
      if( !this.slider.fxScroll.isRunning() ){
         clearInterval( this.timer );
         this.testCaseChain.callChain();
      }
   },
   
   injectNestedElements : function(){
      var height = this.subjectElement.getSize().y;
      var width = this.subjectElement.getSize().x / this.constants.NESTED_ELEMENTS_NUMBER; 
      for( var i = 0; i < this.constants.NESTED_ELEMENTS_NUMBER; i++ ){
         var nestedElement = new Element( 'div', { id : i, text: i, styles : { position : 'absolute', height : height + 'px', width : width + 'px', left : (i * width) + 'px', top : '0px', margin : '0px', padding : '0px' }});
         nestedElement.inject( this.subjectElement );
         this.nestedElements.add( nestedElement );
      }
   }.protect()
   
});