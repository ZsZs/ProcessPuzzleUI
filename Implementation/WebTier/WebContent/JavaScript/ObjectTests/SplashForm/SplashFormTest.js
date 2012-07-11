window.SplashFormTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onError'],

   options : {
      testMethods : [
         { method : 'instantiate_identifiesContainerElement', isAsynchron : false },
         { method : 'construct_loadsImage', isAsynchron : true },
         { method : 'construct_createsDivAndImageElement', isAsynchron : true },
         { method : 'construct_createsStatusDisplayElements', isAsynchron : true },
         { method : 'updateStatus_updatesStatusText', isAsynchron : true }]
   },

   constants : {
      COMPONENT_NAME : "leftColumn",
      CONTAINER_ELEMENT_ID : "splashForm",
      IMAGE_URI : "../SplashForm/SplashForm.png"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
   },   

   beforeEachTest : function(){
      this.splashForm = new SplashForm({ 
         containerElementId : this.constants.CONTAINER_ELEMENT_ID, 
         imageUri : this.constants.IMAGE_URI,
         onConstructed : this.onConstructed,
         onDestroyed : this.onDestroyed,
         onError : this.onError
      });
   },
   
   afterEachTest : function (){
      this.splashForm.destroy();
   },
   
   instantiate_identifiesContainerElement : function() {
      assertThat( this.splashForm.getContainerElement(), equalTo( $( this.constants.CONTAINER_ELEMENT_ID )));
   },
   
   construct_loadsImage : function() {
      this.testCaseChain.chain(
         function(){ this.splashForm.construct(); }.bind( this ),
         function(){
            assertThat( this.splashForm.getImageElement(), not( nil() ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_createsDivAndImageElement : function() {
      this.testCaseChain.chain(
         function(){ this.splashForm.construct(); }.bind( this ),
         function(){
            var splashFormElement = this.splashForm.getSplashFormElement(); 
            assertThat( splashFormElement.get( 'tag' ).toUpperCase(), equalTo( 'DIV' ));
            assertThat( splashFormElement.hasClass( this.splashForm.options.containerClass ), is( true ));
            assertThat( splashFormElement.getChildren('div img').get('src').toString(), equalTo( this.splashForm.options.imageUri ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_createsStatusDisplayElements : function() {
      this.testCaseChain.chain(
         function(){ this.splashForm.construct(); }.bind( this ),
         function(){
            var statusDisplayElement = this.splashForm.getSplashFormElement().getElements( 'div.statusDisplay' )[0]; 
            assertThat( statusDisplayElement, not( nil() ));
            assertThat( statusDisplayElement.getStyle( 'height' ), equalTo( this.splashForm.options.statusDisplayStyles['height'] ));
            assertThat( statusDisplayElement.getStyle( 'width' ), equalTo( this.splashForm.options.statusDisplayStyles['width'] ));
            
            assertThat( statusDisplayElement.get( 'text' ), equalTo( SplashForm.StatusText[this.splashForm.getBrowserLanguage()] ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   updateStatus_updatesStatusText : function() {
      this.testCaseChain.chain(
         function(){ this.splashForm.construct(); }.bind( this ),
         function(){
            this.splashForm.updateStatus( this.constants.COMPONENT_NAME );
            
            var statusDisplayElement = this.splashForm.getSplashFormElement().getElements( 'div.statusDisplay' )[0]; 
            assertThat( statusDisplayElement.get( 'text' ), containsString( this.constants.COMPONENT_NAME ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function(){
      this.testCaseChain.callChain();
   },

   onError : function( error ){
      this.testCaseChain.callChain();
   }
});