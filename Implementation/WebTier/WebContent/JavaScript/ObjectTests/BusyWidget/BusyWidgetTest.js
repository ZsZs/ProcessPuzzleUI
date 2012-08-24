window.BusyElementTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onConstructed', 'onConstructionError', 'onDestroyed', 'waitForFewAnimationCalls'],

   options : {
      testMethods : [
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsBusyElements', isAsynchron : true },
         { method : 'construct_loadsBackgroundImage', isAsynchron : true },
         { method : 'construct_determinesAnimationProperties', isAsynchron : true },
         { method : 'show_callsAnimatePeriodically', isAsynchron : true },
         { method : 'hide_stopsAnimation', isAsynchron : true },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : true }],
   },

   constants : {
      CONTAINER_ELEMENT_ID : "SlideShowContainer",
      CONTROLLER_CLASS : "controller",
      ELEMENT_CLASS : "slideshow-loader",
      SPINNER_IMAGE_URI : "../BrowserWidget/Images/busy.png"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.busyElement;
      this.timer;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.busyElement = new BusyElement( this.containerElement, {
         elementClass : this.constants.ELEMENT_CLASS,
         imageUri : this.constants.SPINNER_IMAGE_URI,
         onConstructed : this.onConstructed, 
         onConstructionError : this.onConstructionError, 
         onDestroyed : this.onDestroyed
      });
   },
   
   afterEachTest : function (){
      this.busyElement.destroy();
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new BusyElement(); }, raises( AssertionException ));
   },
   
   construct_createsBusyElements : function(){
      this.testCaseChain.chain(
            function(){
               this.busyElement.construct();
            }.bind( this ),
            function(){
               assertThat( this.containerElement.getElement( '.' + this.busyElement.getElementClass() ), equalTo( this.busyElement.getElement() ));
               this.testMethodReady();
            }.bind( this )
         ).callChain();
   },
   
   construct_loadsBackgroundImage : function(){
      this.testCaseChain.chain(
         function(){
            this.busyElement.construct();
         }.bind( this ),
         function(){
            assertThat( this.busyElement.getBackgroundImageElement().get( 'src' ), equalTo( this.constants.SPINNER_IMAGE_URI ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   construct_determinesAnimationProperties : function(){
      this.testCaseChain.chain(
         function(){
            this.busyElement.construct();
         }.bind( this ),
         function(){
            assertThat( this.busyElement.backgroundSlideDirection, equalTo( BusyElement.BackgroundSlideDirections.horizontal ));
            assertThat( this.busyElement.numberOfFrames, equalTo( 12 ));
            assertThat( this.busyElement.backgroundSlideValue, equalTo( 30 ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   show_callsAnimatePeriodically : function(){
      this.testCaseChain.chain(
         function(){
            this.busyElement.construct();
         }.bind( this ),
         function(){
            this.mockedBusyElement = mock( this.busyElement );
            this.mockedBusyElement.show();
            this.timer = this.waitForFewAnimationCalls.periodical( 500 );
         }.bind( this ),
         function(){
            verify( this.mockedBusyElement ).show();
            assertThat( this.busyElement.getElement().get( 'aria-hidden' ), equalTo( 'false' ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   hide_stopsAnimation : function(){
      this.testCaseChain.chain(
         function(){
            this.busyElement.construct();
         }.bind( this ),
         function(){
            this.busyElement.show();
            this.timer = this.checkMorphReady.periodical( 500 );
         }.bind( this ),
         function(){
            this.busyElement.hide();
            this.timer = this.checkMorphReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.busyElement.getElement().get( 'aria-hidden' ), equalTo( 'true' ));
            
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   destroy_removesAllCreatedElements : function(){
      this.testCaseChain.chain(
            function(){
               this.busyElement.construct();
            }.bind( this ),
            function(){
               this.busyElement.destroy();
            }.bind( this ),
            function(){
               assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
               this.testMethodReady();
            }.bind( this )
         ).callChain();
   },
   
   //Protected, private helper methods
   checkMorphReady : function(){
      if( !this.busyElement.morph || !this.busyElement.morph.isRunning() ){
         clearInterval( this.timer );
         this.testCaseChain.callChain();
      }
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
   },
   
   waitForFewAnimationCalls : function(){
      if( this.busyElement.currentFrame >= 2 ){
         clearInterval( this.timer );
         this.testCaseChain.callChain();
      }
   }
});