window.SlideShowTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onConstructionError'],

   options : {
      testMethods : [
         { method : 'initialize_whenOverlapIsFalse_doublesDuration', isAsynchron : false },
         { method : 'initialize_whenTrailingSlashIsMissing_appendsToImageFolder', isAsynchron : false },
         { method : 'initialize_whenFastIsTrue_setWhenPausedAndPlaying', isAsynchron : false },
//         { method : 'initialize_whenContainerElementHasAnchor_infersLink', isAsynchron : false },
//         { method : 'initialize_whenImageDataIsUndefined_infersFromHtml', isAsynchron : false },
//         { method : 'initialize_addsModifierKeysToAccessKeys', isAsynchron : false },
//         { method : 'initialize_definesElementsClasses', isAsynchron : false },
//         { method : 'initialize_definesDocumentEventPushFunction', isAsynchron : false },
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_constructsComponents', isAsynchron : true }]
   },

   constants : {
      CONTAINER_ELEMENT_ID : "SlideShowContainer",
      IMAGES : { 'IMAG0337.jpg': { caption: '1' }, 'IMAG0339.jpg': { caption: '2' }, 'SANY0008.JPG': { caption: '3' }, 'SANY0012.JPG': { caption: '4' }},
      IMAGE_IN_HTML : '../PhotoGaleryWidget/Album/SANY0071.JPG',
      SLIDESHOW_OPTIONS : { 
         duration : 1500, 
         height: 300, 
         imageFolder: '../PhotoGaleryWidget/Album', 
         fast : true, 
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         overlap : false, 
         width: 400 
      }
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.slideShow;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.slideShow = new Slideshow( this.containerElement, this.constants.IMAGES, Object.merge( this.constants.SLIDESHOW_OPTIONS, {
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         onDestroyed : this.onDestroyed
      }));
   },
   
   afterEachTest : function (){
      //this.slideShow.destroy();
   },
   
   initialize_whenOverlapIsFalse_doublesDuration : function(){
      assertThat( this.slideShow.getDuration(), equalTo( 2 * this.constants.SLIDESHOW_OPTIONS['duration'] ));
   },
   
   initialize_whenTrailingSlashIsMissing_appendsToImageFolder : function(){
      assumeThat( this.constants.SLIDESHOW_OPTIONS['imageFolder'], not( endsWith( "/" )));
      assertThat( this.slideShow.getImageFolder(), endsWith( "/" ));
   },
   
   initialize_whenFastIsTrue_setWhenPausedAndPlaying : function(){
      assertThat( this.slideShow.getFast(), equalTo( this.slideShow.constants.WhenPaused | this.slideShow.constants.WhenPlaying ));
   },
   
   initialize_whenContainerElementHasAnchor_infersLink : function(){
      assertThat( this.slideShow.getLink(), equalTo( this.containerElement.getElement( 'a').get( 'href' )));
   },
   
   initialize_whenImageDataIsUndefined_infersFromHtml : function(){
      this.slideShow = new Slideshow( this.containerElement, null, this.constants.SLIDESHOW_OPTIONS );
      
      assertThat( this.slideShow.getImageDefinitions(), hasMember( this.constants.IMAGE_IN_HTML ));
      assertThat( this.slideShow.getImageDefinitions()[this.constants.IMAGE_IN_HTML], hasMember( 'caption' ));
      assertThat( this.slideShow.getImageDefinitions()[this.constants.IMAGE_IN_HTML], hasMember( 'href' ));
      assertThat( this.slideShow.getImageDefinitions()[this.constants.IMAGE_IN_HTML], hasMember( 'thumbnail' ));
   },
   
   initialize_addsModifierKeysToAccessKeys : function(){
      assertThat( this.slideShow.getAccessKeys()['first'], hasMember( "shift" ));
      assertThat( this.slideShow.getAccessKeys()['first'], hasMember( "control" ));
      assertThat( this.slideShow.getAccessKeys()['first'], hasMember( "alt" ));
   },
   
   initialize_definesElementsClasses : function(){
      assertThat( this.slideShow.getElementsClasses(), hasMember( "slideshow" ));
   },
   
   initialize_definesDocumentEventPushFunction : function(){
      assertThat( this.slideShow.getEvents(), hasFunction( 'push' ));
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function() { new Slideshow( null, this.constants.IMAGES, this.constants.SLIDESHOW_OPTIONS );}.bind( this ), raises( AssertionException ));
   },
   
   construct_constructsComponents : function() {
      this.testCaseChain.chain(
         function(){
            this.slideShow.construct();
         }.bind( this ),
         function(){
            assertThat( this.slideShow.getScreen(), JsHamcrest.Matchers.instanceOf( Screen ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
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