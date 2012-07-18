/*
Name: ImageLensBehavior

Description: Add lens functionality for ImageElement.

Requires:
    - 

Provides:
    - ImageLensBehavior

Part of: ProcessPuzzle Browser UI, Back-end agnostic, desktop like, highly configurable, browser font-end, based on MochaUI and MooTools. 
http://www.processpuzzle.com

Authors: 
    - Zsolt Zsuffa

Copyright: (C) 2011 This program is free software: you can redistribute it and/or modify it under the terms of the 
GNU General Public License as published by the Free Software Foundation, either version 3 of the License, 
or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//= require_directory ../MochaUI
//= require_directory ../FundamentalTypes

var ImageLensBehaviour = new Class({
   Implements: [Options],
   
   options: {
      borderColor: "#888",
      borderSize: 4,
      componentName : "ImageLensBehaviour",
      lensSize: 100
   },
   
   //Constructor
   initialize: function( options ){
      this.setOptions( options );
      
      this.lensStyle;
   },
   
   //Public mutators and accessor methods
   construct: function( ){
      this.defineLensStyle();
      this.createLensElement();
      this.calculateActualImageSize();
   },
   
   destroy: function(){
   },

   setPosition: function( event ){
      var leftPos = parseInt(e.pageX - offset.left);
      var topPos = parseInt(e.pageY - offset.top);

      if (leftPos < 0 || topPos < 0 || leftPos > obj.width() || topPos > obj.height()) {
          target.hide();
      }else {
          target.show();

          leftPos = String(((e.pageX - offset.left) * widthRatio - target.width() / 2) * (-1));
          topPos = String(((e.pageY - offset.top) * heightRatio - target.height() / 2) * (-1));
          target.css({ backgroundPosition: leftPos + 'px ' + topPos + 'px' });

          leftPos = String(e.pageX - target.width() / 2);
          topPos = String(e.pageY - target.height() / 2);
          target.css({ left: leftPos + 'px', top: topPos + 'px' });
      }
   },
   
   unmarshall: function(){
   },

   //Properties
   
   //Protected, private helper methods
   calculateActualImageSize : function(){
      var imageSrc = options.imageSrc ? options.imageSrc : $(this).attr("src");
      var imageTag = "<img style='display:none;' src='" + imageSrc + "' />";

      $(imageTag).load(function () {
          widthRatio = $(this).width() / obj.width();
          heightRatio = $(this).height() / obj.height();
      }).appendTo($(this).parent());

      target.css({ backgroundImage: "url('" + imageSrc + "')" });

      target.mousemove(setPosition);
      $(this).mousemove(setPosition);
   }.protect(),
   
   createLensElement : function(){
      this.target = $("<div style='" + this.lensStyle + "' class='" + options.lensCss + "'>&nbsp;</div>").appendTo($(this).parent());
      this.targetSize = this.target.size();
   }.protect(),
   
   defineLensStyle : function(){
      this.lensStyle = "background-position: 0px 0px;width: " + String(options.lensSize) + "px;height: " + String(options.lensSize)
      + "px;float: left;display: none;border-radius: " + String(options.lensSize / 2 + options.borderSize)
      + "px;border: " + String(options.borderSize) + "px solid " + options.borderColor 
      + ";background-repeat: no-repeat;position: absolute;";
   }.protect()
});