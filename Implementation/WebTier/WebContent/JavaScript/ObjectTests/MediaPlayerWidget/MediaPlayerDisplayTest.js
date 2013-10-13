window.MediaPlayerDisplayTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError', 'onDestroyed', 'onUpdated'],

   options : {
      isAfterEachTestAsynchron : true,
      testMethods : [
         { method : 'construct_constructsComponents', isAsynchron : true },
         { method : 'construct_subscribesToControllerEvents', isAsynchron : true },
         { method : 'onUpdate_updatesComponents', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }],
   },

   constants : {
      CONTAINER_ELEMENT_ID : "widgetContainer",
      IMAGE_TITLE : "Hello World",
      IMAGE_URI : "Album/IMAG0337.jpg",
      THUMBNAIL_URIS : ['Album/IMAG0337_thumb.jpg', 'Album/IMAG0339_thumb.jpg', 'Album/SANY0008_thumb.jpg', 'Album/SANY0012_thumb.jpg']
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.display;
      this.media;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.media = new Media( mock( Object ), mock( Object ));
      this.media = spy( this.media );
      when( this.media ).getThumbnailsUri().thenReturn( this.constants.THUMBNAIL_URIS );
      
      this.display = new MediaPlayerDisplay( this.containerElement, this.media, { 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         onDestroyed : this.onDestroyed,
         onUpdated : this.onUpdated
      });
   },
   
   afterEachTest : function (){
      this.afterEachTestChain.chain(
         function(){
            this.display.destroy();
         }.bind( this ),
         function(){
            assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
            this.display = null;
            this.afterEachTestReady();
         }.bind( this )
      ).callChain();
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
            assertThat( this.display.getController(), JsHamcrest.Matchers.instanceOf( MediaPlayerController ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_subscribesToControllerEvents : function() {
      this.testCaseChain.chain(
         function(){
            this.display.construct();
         }.bind( this ),
         function(){
            var spyedDisplay = spy( this.display );
            spyedDisplay.getController();
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onUpdate_updatesComponents: function(){
      this.testCaseChain.chain(
         function(){
            this.display.construct();
         }.bind( this ),
         function(){
            this.display.onUpdateDisplay({ imageUri: this.constants.IMAGE_URI, thumbnailIndex: 1, title: this.constants.IMAGE_TITLE });
         }.bind( this ),
         function(){
            assertThat( this.containerElement.getElement( 'img' ).get( 'src' ), equalTo( this.constants.IMAGE_URI ));
            assertThat( this.containerElement.getElement( 'div.slideshow-captions' ).get( 'text' ), equalTo( this.constants.IMAGE_TITLE ));
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
            // See: afterEachTests()
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
      this.afterEachTestChain.callChain();
   },

   onUpdated : function(){
      this.testCaseChain.callChain();
   }

});