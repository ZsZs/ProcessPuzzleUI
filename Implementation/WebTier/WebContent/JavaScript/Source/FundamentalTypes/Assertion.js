/**
ProcessPuzzle User Interface
Backend agnostic, desktop like configurable, browser font-end based on MochaUI.
Copyright (C) 2011  Joe Kueser, Zsolt Zsuffa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function AssertUtil(){
}
new AssertUtil();
AssertUtil.assertInclude = function (object, jsFile) {
	if (object==null) {
		throw new AssertException( "file " + jsFile + " was not included ");
	}
}
AssertUtil.assertParamNotNull = function (value, paramName){
	if (value == null) {
		throw new IllegalArgumentException(  "Parameter must not be null: " + paramName );
	}
}
AssertUtil.assertParamIsNotEmpty = function (value, paramName){
	AssertUtil.assertParamNotNull(value, paramName);
	if (StringUtil.isEmpty(value)){
		throw new IllegalArgumentException(  "Parameter must not be empty: " + paramName );
	}
}
AssertUtil.assertIntegerParam = function (value, paramName){	AssertUtil.assertParamNotNull (value, paramName);
	var i = parseInt(value, 10);
	if ((i == null) || (isNaN(i))) {
		throw new IllegalArgumentException( "Invalid Integer Parameter: " + paramName);
	}
}
AssertUtil.assertTrue = function (expr, exprName){
	if (!expr) {
		throw new IllegalArgumentException(  "Expression: " + exprName + " evaluated to false." );
	}
}

AssertUtil.assertGreaterThanZeroParam = function (value, paramName){
	AssertUtil.assertIntegerParam (value, paramName);
	var i = parseInt(value, 10);
	if (i <= 0) {
		throw new IllegalArgumentException( " assertGreaterThanZeroParam : " + paramName);
	}
}
AssertUtil.assertInstance = function (param, clazz, clazzName){
	AssertUtil.assertParamNotNull(param, "param");
	AssertUtil.assertParamFalse(typeof(clazz) == "string", "Invalid clazz parameter");
	if (!(param instanceof clazz)) {
	    throw new IllegalArgumentException( " Invalid parameter must be instance of " + clazzName);
	}
} 
AssertUtil.assertParamInstance = function (param, clazz, clazzName){
	if (!(param instanceof clazz)) {
		throw new IllegalArgumentException( " Invalid parameter must be instance of " + clazzName);
	}
}
AssertUtil.assertResultNotNull = function (valueOfResult, message) {
	if ( valueOfResult == null ){
		throw new AssertException( "Invalid result value: " + message);
	}
}
AssertUtil.assertParamFalse = function(booleanValue , message) {
	if (booleanValue) {
	    throw new IllegalArgumentException( "AssertParamFalse Exception message: " + message);
	}
}
AssertUtil.assertMethodExists = function(object, functionName) {
	AssertUtil.assertParamNotNull( object, "object");
	if (object[functionName]==null) {
		throw new AssertException(  " Object " + object + " does not have function :" + functionName );
	}
}
AssertUtil.assertMemberState = function(member, memberName, clazz, clazzName, mandatory, valueRange) {
    if (mandatory){
		if (member == null){
			throw new AssertException( " Member " + memberName + " must not be null ");
		}
		if (!(member instanceof clazz)) {
			throw new AssertException( " Invalid state " + memberName + " must be instance of " + clazzName);
		}
	}
    else if (member != null){
		if (!(member instanceof clazz)) {
			throw new AssertException( "Invalid state " + memberName + " must be instance of " + clazzName);
		}
	}
} 
AssertUtil.assertMemberStateString = function(member, memberName, mandatory, valueRange){    if (mandatory){
		if (typeof(member) != typeof(" ")) {
			throw new AssertException( new AssertException( "Invalid state " + memberName + 
                        " must be instance of string and not " + typeof(member)) );		}
		if (StringUtil.isEmpty(member)){			throw new AssertException( "AssertException "  + memberName + " must not be empty");
		}
	}else if (member != null){
		if (typeof(member) != typeof(" ")) {
			throw new AssertException( "Invalid state " + memberName + " must be instance string " );
		}
	}
}
