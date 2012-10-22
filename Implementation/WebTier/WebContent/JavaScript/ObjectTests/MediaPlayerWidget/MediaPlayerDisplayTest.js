window.SlideShowTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'construct_constructsComponents', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }],
   },

   constants : {
      CONTAINER_ELEMENT_ID : "widgetContainer",
      THUMBNAIL_URIS : ['IMAG0337_thumb.jpg', 'IMAG0339_thumb.jpg', 'SANY0008_thumb.JPG', 'SANY0012_thumb.JPG']
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.display;
      this.media;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.media = mock( Media );
      when( this.media ).getThumbnailsUri().thenReturn( this.constants.THUMBNAIL_URIS);
      
      this.display = new MediaPlayerDisplay( this.containerElement, this.media, { 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         onDestroyed : this.onDestroyed });
   },
   
   afterEachTest : function (){
      this.display.destroy();
   },
   
   construct_constructsComponents : function() {
      this.testCaseChain.chain(
         function(){
            this.display.construct();
         }.bind( this ),
         function(){
            assertThat( this.display.getScreen(), JsHamcrest.Matchers.instanceOf( MediaPlayerScreen ));
            assertThat( this.display.getTitleBar(), JsHamcrest.Matchers.instanceOf( MediaPlayerTitleBar ));
            assertThat( this.display.getThumbnailsBar(), JsHamcrest.Matchers.instanceOf( MediaPlayerThumbnailsBar ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function(){
      this.testCaseChain.chain(
         function(){
            this.display.construct();
         }.bind( this ),
         function(){
            this.display.destroy();
               
            assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
               
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   //Protected, private helper methods
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onConstructionError : function( error ){
      this.error = error;
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function( error ){
      this.testCaseChain.callChain();
   }

});