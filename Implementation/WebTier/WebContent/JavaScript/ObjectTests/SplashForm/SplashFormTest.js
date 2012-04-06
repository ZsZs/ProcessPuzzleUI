window.SplashFormTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed', 'onError'],

   options : {
      testMethods : [
         { method : 'instantiate_identifiesContainerElement', isAsynchron : false },
         { method : 'construct_loadsImage', isAsynchron : true },
         { method : 'construct_createsDivAndImageElement', isAsynchron : true }]
   },

   constants : {
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
            assertThat( splashFormElement.get('tag').toUpperCase(), equalTo( 'DIV' ));
            assertThat( splashFormElement.getChildren('img').get('src').toString(), equalTo( this.splashForm.options.imageUri ));
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