/**
 * Private method: captions Builds the optional caption element, adds
 * interactivity. This method can safely be removed if the captions option is
 * not enabled.
 */

// = require_directory ../FundamentalTypes

var SlideCaption = new Class({
   Implements : [AssertionBehavior, Events, Options],
   Binds : ['signAreaUpdateFinished', 'update'],
   
   options : {
      captionClass : "captions",
      hiddenClass : "hidden",
      idPrefix : "Slideshow-",
      slideShowClass : "slideshow",
      morphProperties : { duration: 'normal', link: 'cancel', transition: Fx.Transitions.Sine.easeOut },
      visibleClass : "visible"
   },

   initialize : function( containerElement, options ) {
      this.setOptions( options );
      this.assertThat( containerElement, not( nil()), "SlideCaption.containerElement" );
      
      this.captionElement;
      this.containerElement = containerElement;
      this.id = this.options.idPrefix + Date.now();
      this.morph;
      this.text;
   },
   
   //Public accessor and mutator methods
   construct : function(){
      this.createCaptionElement();
//      slideshow.el.retrieve( 'images' ).set( 'aria-labelledby', caption.get( 'id' ));
   },
   
   destroy : function(){
      this.removeEvents();
      this.destroyCaptionElement();
   },
   
   update : function( text, fast ){
      this.text = text;
      this.fast = fast;
      
      if( this.morph ) this.morph.cancel();
      
      if( this.text ){
         if( fast ) this.flashCaption();
         else this.morphCaption();
      }else this.hideCaption();
   },
   
   //Properties
   getCaptionClass : function(){ return this.options.slideShowClass + "-" + this.options.captionClass; },
   getCaptionElement : function(){ return this.captionElement; },
   getHiddenClass : function(){ return this.getCaptionClass() + "-" + this.options.hiddenClass; },
   getId : function(){ return this.id; },
   getVisibleClass : function(){ return this.getCaptionClass() + "-" + this.options.visibleClass; },
   
   //Protected, private helper methods
   createCaptionElement : function(){
      this.captionElement = new Element( 'div', { 'class' : this.getCaptionClass(), 'id' : this.id });
      this.captionElement.set({ 'aria-busy' : false, 'aria-hidden' : false, 'role' : 'description' });
      this.captionElement.inject( this.containerElement );
   }.protect(),
   
   destroyCaptionElement : function(){
      if( this.captionElement ) this.captionElement.destroy();
   }.protect(),
   
   flashCaption : function(){
      this.captionElement.set({ 'aria-hidden': false, 'text': this.text });
      this.captionElement.removeClass( this.getHiddenClass() );
      this.captionElement.addClass( this.getVisibleClass() );
   }.protect(),
   
   hideCaption : function(){
      this.captionElement.set({ 'aria-hidden': true, 'text': "" });
      this.captionElement.removeClass( this.getVisibleClass() );
      this.captionElement.addClass( this.getHiddenClass() );
   }.protect(),
   
   morphCaption : function(){
      this.captionElement.set({ 'aria-hidden': false, 'text': this.text });
      this.morph = new Fx.Morph( this.captionElement, this.options.morphProperties );
      this.morph.start( "." + this.getVisibleClass() );
   }.protect(),
   
   signAreaUpdateFinished : function(){
      this.captionElement.set( 'aria-busy', false );
   }.protect(),
   
   removeEvents : function(){
      if( this.captionElement ) this.captionElement.removeEvents();
   }
});