/* JsTestFrameAnalyser */

var JsTestFrameAnalyser = new Class({
   //Constructor
   initialize : function( testFrame ){
      this.testFrame = testFrame;
   },
   
   //Public accessors and mutators
   getTestClassNames : function(){
      return this.getTestClassNamesFromFrameProperties();
   },
   
   getTestFunctionNames : function() {
      return this.getTestFunctionNamesFromExposedTestFunctionNames( this.testFrame ) || 
             this.getTestFunctionNamesFromFrameProperties( this.testFrame ) || 
             this.getTestFunctionNamesFromRuntimeObject( this.testFrame ) || 
             this.getTestFunctionNamesUsingPlainTextSearch( this.testFrame );
   },
   
   //Properties
   getTestFrame : function() { return this.testFrame; },

   //Protected, private helper methods
   getTestClassNamesFromFrameProperties : function() {
      var testClassNames = new Array();

      for( var i in this.testFrame ){
         if( this.isJsTestClass( i )) testClassNames.include( i );
      }

      return testClassNames;
   }.protect(),

   getTestFunctionNamesFromExposedTestFunctionNames : function( testFrame ) {
      if( testFrame && typeof (testFrame.exposeTestFunctionNames) == 'function' ){
         return testFrame.exposeTestFunctionNames();
      }else{
         return null;
      }
   }.protect(),

   getTestFunctionNamesFromFrameProperties : function( testFrame ) {
      var testFunctionNames = new Array();

      for( var i in testFrame ){
         if( this.isTestFunction( i, testFrame ) ) testFunctionNames.include( i );
      }

      return testFunctionNames.length > 0 ? testFunctionNames : null;
   }.protect(),

   getTestFunctionNamesFromRuntimeObject : function( testFrame ) {
      var testFunctionNames = new Array();

      if( testFrame.RuntimeObject ){
         var runtimeObject = testFrame.RuntimeObject( "test*" );
         for( var i in runtimeObject ){
            if( this.isTestFunction( i, runtimeObject ) ) testFunctionNames.include( i );
         }
      }

      return testFunctionNames.length > 0 ? testFunctionNames : null;
   }.protect(),

   /**
    * Method of last resort. This will pick up functions that are commented-out
    * and will not be able to pick up tests in included JS files.
    */
   getTestFunctionNamesUsingPlainTextSearch : function( testFrame ) {
      var testFunctionNames = new Array();

      if( testFrame && testFrame.document && typeof (testFrame.document.scripts) != 'undefined' && testFrame.document.scripts.length > 0 ){ // IE5 and up
         var scriptsInTestFrame = testFrame.document.scripts;

         for( var i = 0; i < scriptsInTestFrame.length; i++ ){
            var someNames = this._extractTestFunctionNamesFromScript( scriptsInTestFrame[i] );
            if( someNames ){
               testFunctionNames = testFunctionNames.concat( someNames );
            }
         }
      }

      return testFunctionNames.length > 0 ? testFunctionNames : null;
   }.protect(),

   isJsTestClass : function( propertyName ) {
      try{
         var isJsTestClassFunction = eval( "this.testFrame." + propertyName + ".prototype.isJsTestClass" );
         if( propertyName === 'JsTestClass' ) return false;
         else return isJsTestClassFunction();
      }catch (e){
         return false;
      }
   }.protect(),

   isTestFunction : function( propertyName, obj ) {
      return propertyName.substring( 0, 4 ) == 'test' && typeof (obj[propertyName]) == 'function';
   },

});