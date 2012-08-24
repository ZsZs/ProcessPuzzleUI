window.ShortCutKeyTest = new Class( {
   Implements : [Events, JsTestClass, Options],
   Binds : [],

   options : {
      testMethods : [
         { method : 'initialize_whenKeySpecificationHasNotModifiers_defaultsThemToFalse', isAsynchron : false },
         { method : 'initialize_whenKeySpecificationHasModifiers_setThemToTrue', isAsynchron : false },
         { method : 'initialize_whenKeySpecificationIsUndefined_throwsAssertionException', isAsynchron : false },
         { method : 'initialize_whenActionIsUndefined_throwsAssertionException', isAsynchron : false }]
   },

   constants : {
      ACTION_NAME : "Dummy action",
      KEY_SPECIFICATION : "alt control shift left",
      SIMPLE_KEY_SPECIFICATION : "p"
   },
   
   initialize : function( options ) {
      this.setOptions( options );
      
      this.action;
      this.shortCutKey;
      this.simpleShortCutKey;
   },   

   beforeEachTest : function(){
      this.action = new WidgetAction( this.constants.ACTION_NAME );
      this.shortCutKey = new ShortCutKey( this.constants.KEY_SPECIFICATION, this.action );
      this.simpleShortCutKey = new ShortCutKey( this.constants.SIMPLE_KEY_SPECIFICATION, this.action );
   },
   
   afterEachTest : function (){
      this.action = null;
      this.shortCutKey = null;
      this.simpleShortCutKey = null;
   },
   
   initialize_whenKeySpecificationHasNotModifiers_defaultsThemToFalse : function(){
      assertThat( this.simpleShortCutKey.getKey(), equalTo( 'p' ));
      assertThat( this.simpleShortCutKey.getAlt(), is( false ));
      assertThat( this.simpleShortCutKey.getControl(), is( false ));
      assertThat( this.simpleShortCutKey.getShift(), is( false ));
   },
   
   initialize_whenKeySpecificationHasModifiers_setThemToTrue : function(){
      assertThat( this.shortCutKey.getKey(), equalTo( 'left' ));
      assertThat( this.shortCutKey.getAlt(), is( true ));
      assertThat( this.shortCutKey.getControl(), is( true ));
      assertThat( this.shortCutKey.getShift(), is( true ));
   },
   
   initialize_whenKeySpecificationIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new ShortCutKey( null, this.action ); }, raises( AssertionException ));
   },
   
   initialize_whenActionIsUndefined_throwsAssertionException : function() {
      assertThat( function(){ new ShortCutKey( "shift p" ); }, raises( AssertionException ));
   }   

});