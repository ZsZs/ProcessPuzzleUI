window.WidgetElementDefaultSliderTest = new Class({
   Extends : WidgetElementSliderTest,
   Binds : [],

   options : {
      testMethods : [
         { method : 'initialize_instantiatesFxScroll', isAsynchron : false },
         { method : 'initialize_whenElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'next_whenFirstCalled_scrollsTheFirstNestedElementToTopLeft', isAsynchron : true },
         { method : 'next_whenCalledMultiplesTimes_scrollsTheCurrentNestedElementToTopLeft', isAsynchron : true },
         { method : 'next_whenCalledMoreThanTheNumberOfElements_startsFromTheBeginning', isAsynchron : true }],
   },

   constants : {
   },
   
   initialize : function( options ) {
      this.parent( options );
   },   

   beforeEachTest : function(){
      this.parent();
      this.slider = new WidgetElementSlider( this.containerElement, { axes : 'x', linkedElements : this.nestedElements });
   },
   
   afterEachTest : function (){
      this.parent();
   },
   
   //Test cases
   initialize_instantiatesFxScroll : function(){
      assertThat( this.slider.fxScroll, JsHamcrest.Matchers.instanceOf( Fx.Scroll ));
   },
   
   initialize_whenElementIsUndefined_throwsAssertionException : function(){
      assertThat( function(){ new WidgetElementSlider(); }, raises( AssertionException ));
   },
   
   next_whenFirstCalled_scrollsTheFirstNestedElementToTopLeft : function(){
      this.testCaseChain.chain(
         function(){
            this.slider.next();
            this.timer = this.checkScrollReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.subjectElement.getElement( '#0' ).getCoordinates().top, equalTo( this.containerElement.getCoordinates().top ));
            assertThat( this.subjectElement.getElement( '#0' ).getCoordinates().left, equalTo( this.containerElement.getCoordinates().left ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   next_whenCalledMultiplesTimes_scrollsTheCurrentNestedElementToTopLeft : function(){
      this.testCaseChain.chain(
         function(){
            for( var i = 0; i < 4; i++ ) this.slider.next();
            this.timer = this.checkScrollReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.subjectElement.getElement( '#3' ).getCoordinates().top, equalTo( this.containerElement.getCoordinates().top ));
            assertThat( this.subjectElement.getElement( '#3' ).getCoordinates().left, equalTo( this.containerElement.getCoordinates().left ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   next_whenCalledMoreThanTheNumberOfElements_startsFromTheBeginning : function(){
      this.testCaseChain.chain(
         function(){
            for( var i = 0; i < this.nestedElements.size() +1; i++ ) this.slider.next();
            this.timer = this.checkScrollReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.subjectElement.getElement( '#0' ).getCoordinates().top, equalTo( this.containerElement.getCoordinates().top ));
            assertThat( this.subjectElement.getElement( '#0' ).getCoordinates().left, equalTo( this.containerElement.getCoordinates().left ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Helper methods
});