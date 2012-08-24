window.WidgetElementAdvancedSliderTest = new Class({
   Extends : WidgetElementSliderTest,
   Binds : [],

   options : {
      testMethods : [
         { method : 'next_whenLinkedElementAlignmentIsCenter_positionsCurrentNestedElementInCenterOfSubjectElement', isAsynchron : true }],
   },

   constants : {
   },
   
   initialize : function( options ) {
      this.parent( options );
   },   

   beforeEachTest : function(){
      this.parent();
      this.slider = new WidgetElementSlider( this.containerElement, { axes : 'x', linkedElementAlignment : 'center', linkedElements : this.nestedElements });
   },
   
   afterEachTest : function (){
      this.parent();
   },
   
   //Test cases
   next_whenLinkedElementAlignmentIsCenter_positionsCurrentNestedElementInCenterOfSubjectElement : function(){
      this.testCaseChain.chain(
         function(){
            for( var i = 0; i < 4; i++ ) this.slider.next();
            this.timer = this.checkScrollReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.subjectElement.getElement( '#3' ).getCoordinates().top, equalTo( this.containerElement.getCoordinates().top ));
            assertThat( this.determineElementCenterCoordinates( this.subjectElement.getElement( '#3' )).x, equalTo( this.determineElementCenterCoordinates( this.containerElement ).x ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Helper methods
   determineElementCenterCoordinates : function( subjectElement ){
      var centerCoordinates = { x : 0, y : 0 };
      var elementCoordinates = subjectElement.getCoordinates();
      var elementSize = subjectElement.getSize();
      
      centerCoordinates.x = elementCoordinates.left + Math.round( elementSize.x / 2 );
      centerCoordinates.y = elementCoordinates.top + Math.round( elementSize.y / 2 );
      
      return centerCoordinates;
   }.protect()
});