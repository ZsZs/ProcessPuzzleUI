window.InheritanceConnectionFigureTest = new Class({
   Extends : DiagramFigureTest,
   Implements : [Events, JsTestClass, Options],
   Binds : ['onConstructed', 'onDestroyed'],

   options : {
      testMethods : [
         { method : 'unmarshall_determinesProperties', isAsynchron : false },
         { method : 'draw_instantiatesDraw2dObject', isAsynchron : false }]
   },

   constants : {
      FIGURE_SELECTOR : "//pp:widgetDefinition/figures/inheritanceConnection[@name='ClassIsSpecializedFigure']",
   },
   
   initialize : function( options ) {
      this.parent( options );
      
      this.sourceFigure;
      this.targetFigure;
   },   

   beforeEachTest : function(){
      this.parent();
      this.instantiateSourceAndTarget();
   },
   
   afterEachTest : function (){
      this.parent();
   },
   
   unmarshall_determinesProperties : function(){
      this.figure.unmarshall();

      assertThat( this.figure.getSourceFigureName(), equalTo( this.diagramDefinition.selectNodeText( this.constants.FIGURE_SELECTOR + "/@source" ) ));
      assertThat( this.figure.getTargetFigureName(), equalTo( this.diagramDefinition.selectNodeText( this.constants.FIGURE_SELECTOR + "/@target" ) ));
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
      this.figure = new InheritanceConnectionFigure( this.figureDefinition, this.diagramInternationalization );      
   }.protect(),
   
   instantiateSourceAndTarget : function(){
      this.sourceFigure = new ClassFigure( this.diagramDefinition.selectNode( "//pp:widgetDefinition/figures/class[@name='ClassFigure']" ), this.diagramInternationalization );
      this.sourceFigure.unmarshall();
      this.sourceFigure.draw( this.diagram );
      this.diagram.getFigures().add( this.sourceFigure );
      
      this.targetFigure = new ClassFigure( this.diagramDefinition.selectNode( "//pp:widgetDefinition/figures/class[@name='DiagramFigure']" ), this.diagramInternationalization );
      this.targetFigure.unmarshall();
      this.targetFigure.draw( this.diagram );
      this.diagram.getFigures().add( this.targetFigure );
   }.protect()
});