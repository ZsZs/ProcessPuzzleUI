// HashSet.js

/**
* use as java.util.HashSet
*/

function testHashSet(){
 alert("HashSet test begin:");
 try{
 }
 catch(e){
  alert(e);
 }
 alert("HashSet test end");
}


function HashSet(){  

    private:
 this.map=new HashMap();
 this.ZERO=new Integer(0);


 
 function HashIterator(it){
        this.it=it;
  
  this.hasNext=hasNext;
  function hasNext() {
   return this.it.hasNext();
        }

        this.next=next;
  function next() { 
   return this.it.next().getKey();
        }
    }
 
 public:
 this.size=size;
 function size(){
  return this.map.size();
    }

    this.isEmpty=isEmpty;
 function isEmpty() {
  return this.map.isEmpty();
    }

 this.contains=contains;
 function contains(o) {
  return this.map.containsKey(o);
    }
 
 this.add=add;
 function add(o) {
  return this.map.put(o,this.ZERO)==null;
    }

 this.addAll=addAll;
 function addAll(set){
  var mod=false;
  for(var it=set.iterator();it.hasNext();){
   if(this.add(it.next())) mod=true;
  }
  return mod;
 }

 
 this.remove=remove;
    function remove(o) {
  return this.map.remove(o).equals(this.ZERO);
    }
 
 
    this.clear=clear;
 function clear() {
  this.map.clear();
    }
 
 
 this.iterator=iterator;
 function iterator(){
  return new HashIterator(this.map.iterator());
 }

 
 this.equals=equals;
 function equals(o) {
  if (o.size() != this.size())
   return false;
        for(var it=this.iterator();it.hasNext();){
   if(!o.contains(it.next())) return false;
  }
  return true;
 }
 
 this.hashCode=hashCode;
 function hashCode() {
  var h=0;
  for(var it=this.iterator();it.hasNext();){
   h+=it.next().hashCode();
  }
  return h;
 }
 
 this.toArray=toArray;
 function toArray(){
  var arr=new Array();
  var i=0;
  for(var it=this.iterator();it.hasNext();){
   arr[i++]=it.next();
  }
  return arr;
 }
}

