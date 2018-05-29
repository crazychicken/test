'use strict';
// Create an immediately invoked functional expression to wrap our code

// ( function($) {
//   $.fn.my_function = function() {
//     console.log('tuds')
//   }
// } (jQuery) )
window.onload = function() {
document.getElementById('tin').innerHTML = 'async'
setTimeout( function() {
  console.log('tuds')
}, 20 )
}

// ( function(op) {
//   var readyList,
//   detach = function() {
//     if ( document.addEventListener ) {
//       document.removeEventListener( "DOMContentLoaded", completed, false );
//       window.removeEventListener( "load", completed, false );

//     } else {
//       document.detachEvent( "onreadystatechange", completed );
//       window.detachEvent( "onload", completed );
//     }
//   };
  
//   op.tuds = function(ops) {
//     // console.log(document.readyState)
//     // console.log(document.addEventListener)

    
//     op.onload = function() {
//       // console.log(document.querySelectorAll(ops))
//       readyList = document.querySelectorAll(ops);
//       // console.log(readyList)
//     }
//     // return a;
//     // console.log(readyList)
//   }
//   console.log(readyList)
  
//   // op.document.onload = function () {
//   //   return tuds = new tuds({
//   //     content: op
//   //   });
//   // }

//   // return window.onload = tuds;

// })( window );

// // (function(op) {
// //   op.getElement = function(opst) {
// //     var d = document.querySelectorAll(opst)
// //     d = [].slice.call(d)
// //     return d;
// //   }
// // }(window))

// // var d = tuds('.tuds')
// // console.log(d)

// // function ty() {
// //   console.log('ty')
// // }
// // ty()
