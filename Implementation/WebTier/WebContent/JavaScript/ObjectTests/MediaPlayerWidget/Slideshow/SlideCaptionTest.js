window.SlideCaptionTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : ['checkMorphReady', 'onFailure', 'onSuccess'],

   options : {
      testMethods : [
         { method : 'initialize_generatesId', isAsynchron : false },
         { method : 'initialize_whenContainerElementIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'construct_createsCaptionElement', isAsynchron : false },
         { method : 'update_whenTextIsValid_appliesVisibleClass', isAsynchron : false },
         { method : 'update_whenTextIsValidAndSmoothTransition_appliesMorph', isAsynchron : true },
         { method : 'update_whenTextIsEmpty_appliesHiddenClass', isAsynchron : false },
         { method : 'destroy_removesAllCreatedElements', isAsynchron : false }]
   },

   constants : {
      CAPTION_CLASS : "captions",
      CAPTION_TEXT : "Hellow world!",
      CONTAINER_ELEMENT_ID : "SlideShowContainer",
      FAST_TRANSITION : true,
      SLIDESHOW_CLASS : "slideshow",
      SMOOTH_TRANSITION : false,
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.containerElement;
      this.slideCaption;
      this.timer;
   },   

   beforeEachTest : function(){
      this.containerElement = $( this.constants.CONTAINER_ELEMENT_ID );
      this.slideCaption = new SlideCaption( this.containerElement, { captionClass : this.constants.CAPTION_CLASS, slideShowClass : this.constants.SLIDESHOW_CLASS });
   },
   
   afterEachTest : function (){
      this.slideCaption.destroy();
   },
   
   initialize_generatesId : function(){
      assertThat( this.slideCaption.getId(), startsWith( this.slideCaption.options.idPrefix ));
   },
   
   initialize_whenContainerElementIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new SlideCaption(); }, raises( AssertionException ));
   },
   
   construct_createsCaptionElement : function() {
      this.slideCaption.construct();
      
      assertThat( this.slideCaption.getCaptionElement(), JsHamcrest.Matchers.instanceOf( Element ));
      assertThat( this.slideCaption.getCaptionElement().hasClass( this.constants.SLIDESHOW_CLASS + "-" + this.constants.CAPTION_CLASS ), is( true ));
      assertThat( this.containerElement.getElement( '.' + this.slideCaption.getCaptionClass() ), equalTo( this.slideCaption.getCaptionElement() ));
   },
   
   update_whenTextIsValid_appliesVisibleClass : function(){
      this.slideCaption.construct();
      this.slideCaption.update( this.constants.CAPTION_TEXT, this.constants.FAST_TRANSITION );
      
      assertThat( this.slideCaption.getCaptionElement().get( 'text' ), equalTo( this.constants.CAPTION_TEXT ));
      assertThat( this.slideCaption.getCaptionElement().hasClass( this.slideCaption.getVisibleClass() ), is( true ));
      assertThat( this.slideCaption.getCaptionElement().hasClass( this.slideCaption.getHiddenClass() ), is( false ));
   },
   
   update_whenTextIsValidAndSmoothTransition_appliesMorph : function(){
      this.testCaseChain.chain(
         function(){
            this.slideCaption.construct();
            this.slideCaption.update( this.constants.CAPTION_TEXT, this.constants.SMOOTH_TRANSITION );
            
            this.timer = this.checkMorphReady.periodical( 500 );
         }.bind( this ),
         function(){
            assertThat( this.slideCaption.morph, not( nil() ));
            assertThat( this.slideCaption.getCaptionElement().get( 'text' ), equalTo( this.constants.CAPTION_TEXT ));
            assertThat( this.slideCaption.getCaptionElement().getStyles( 'height', 'opacity' ), hasMember( 'height' ));
            assertThat( this.slideCaption.getCaptionElement().getStyles( 'height', 'opacity' ), hasMember( 'opacity' ));
            assertThat( this.slideCaption.getCaptionElement().hasClass( this.slideCaption.getHiddenClass() ), is( false ));
            this.testMethodReady();
         }.bind( this )
      ).callChain();
   },
   
   update_whenTextIsEmpty_appliesHiddenClass : function(){
      this.slideCaption.construct();
      this.slideCaption.update( "", this.constants.FAST_TRANSITION );
      
      assertThat( this.slideCaption.getCaptionElement().get( 'text' ), equalTo( "" ));
      assertThat( this.slideCaption.getCaptionElement().hasClass( this.slideCaption.getHiddenClass() ), is( true ));
      assertThat( this.slideCaption.getCaptionElement().hasClass( this.slideCaption.getVisibleClass() ), is( false ));
   },
   
   destroy_removesAllCreatedElements : function(){
      this.slideCaption.construct();
      this.slideCaption.destroy();
      
      assertThat( this.containerElement.getElements( '*' ).length, equalTo( 0 ));
   },
   
   //Protected, private helper methods
   checkMorphReady : function(){
      if( !this.slideCaption.morph.isRunning() ){
         clearInterval( this.timer );
         this.testCaseChain.callChain();
      }
   },
   
   onSuccess : function(){
      this.testCaseChain.callChain();
   },
   
   onFailure : function( error ){
      this.testCaseChain.callChain();
   }

});