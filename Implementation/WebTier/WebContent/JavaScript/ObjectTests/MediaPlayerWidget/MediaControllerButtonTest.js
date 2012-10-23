window.MediaControllerButtonTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onSelected'],

   options : {
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsButtonElements', isAsynchron : false },
         { method : 'onSelected_firesSelectedEvent', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : false }]
   },

   constants : {
      BUTTON_OPTIONS : { action : 'prev', buttonClass : 'prev', key : 'shift left', label : 'Shift + Leftwards Arrow', tabIndex : 1 },
      CONTAINER_ELEMENT_ID : "widgetContainer",
      CONTROLLER_CLASS : "controller",
      SLIDESHOW_CLASS : "slideshow"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.button;
      this.onSelectedWasCalled = false;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      var buttonOptions = Object.merge( { onSelected : this.onSelected }, this.constants.BUTTON_OPTIONS );
      this.button = new MediaControllerButton( this.containerElement, buttonOptions );
   },
   
   afterEachTest : function (){
      this.button.destroy();
      this.onSelectedWasCalled = false;
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new MediaControllerButton(); }, raises( AssertionException ));
   },
   
   construct_createsButtonElements : function(){
      this.button.construct();
      
      assertThat( this.containerElement.getElement( '.' + this.button.getElementClass() ), equalTo( this.button.getListItemElement() ));
      assertThat( this.containerElement.getElement( '.' + this.button.getElementClass() + ' a' ), equalTo( this.button.getAnchorElement() ));
   },
   
   onSelected_firesSelectedEvent : function(){
      this.testCaseChain.chain(
         function(){
            this.button.construct();
            this.button.onSelected();
         }.bind( this ),
         function(){
            assertThat( this.onSelectedWasCalled, is( true ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function(){
      this.button.construct();
      this.button.destroy();
      
      assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
   },
   
   onSelected : function(){
      this.onSelectedWasCalled = true;
      this.testCaseChain.callChain();
   }
   
});