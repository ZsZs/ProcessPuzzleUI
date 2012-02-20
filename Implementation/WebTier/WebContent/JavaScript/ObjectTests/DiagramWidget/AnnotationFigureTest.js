window.AnnotationFigureTest = new Class({
   Extends : DiagramFigureTest,
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'draw_instantiatesDraw2dObject', isAsynchron : false }]
   },

   constants : {
      FIGURE_SELECTOR : "//pp:widgetDefinition/figures/annotation[@name='DiagramAnnotation']",
   },
   
   initialize : function( options ) {
      this.parent( options );
      
   },   

   beforeEachTest : function(){
      this.parent();
   },
   
   afterEachTest : function (){
      this.parent();
   },
   
   unmarshall_determinesProperties : function(){
      this.figure.unmarshall();

      assertThat( this.figure.getHeight(), equalTo( this.diagramDefinition.selectNodeText( this.constants.FIGURE_SELECTOR + "/@height" ) ));
      assertThat( this.figure.getText(), equalTo( this.diagramInternationalization.getText( this.diagramDefinition.selectNodeText( this.constants.FIGURE_SELECTOR + "/text" ) )));
      assertThat( this.figure.getWidth(), equalTo( this.diagramDefinition.selectNodeText( this.constants.FIGURE_SELECTOR + "/@width" ) ));
   },
   
   draw_instantiatesDraw2dObject : function(){
      this.figure.unmarshall();
      this.figure.draw( this.diagram );
      
      assertThat( this.figure.getState(), equalTo( DiagramFigure.States.CONSTRUCTED ));
   },
            
   //Event handling methods
   onConstructed : function(){
      this.testCaseChain.callChain();
   },
   
   onDestroyed : function(){
      this.testCaseChain.callChain();
   },
   
   //Protected, private helper methods
   instantiateFigure : function(){
      this.figure = new AnnotationFigure( this.figureDefinition, this.diagramInternationalization );
   }.protect()
   
});