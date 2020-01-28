
// var w_net;
// var w_image;
// var w_segmentation;
// var w_doBodyPix = 0;


// var queryableFunctions = {
//     init: function() {
//         initBodyPix();
//     },
//     setImage: function() {
//         setIm(w_image);
//     }
//   };



// function initBodyPix() {
//     w_doBodyPix = 1;
//     loadBodyPix();
//     runBodyPix();
// }

// function stopBodyPix() {
//     w_doBodyPix = 0;
// }

// function setIm(im) {
//     w_image = im;
// }

// async function loadBodyPix() {
//     net = await bodyPix.load({
//       architecture: 'MobileNetV1',
//       outputStride: 16,
//       multiplier: 0.75,
//       quantBytes: 2
//     });
//   }

//   async function runBodyPix() {
//       while (w_doBodyPix) {
//         const seggy = await net.segmentPersonParts(w_image, {
//             flipHorizontal: false,
//             internalResolution: 'medium',
//             segmentationThreshold: 0.7
//           });
//           w_segmentation = seggy;
//       }
//   }

//   function getBM() {
//       postMessage({'seg': w_segmentation});
//   }
  
//   function defaultReply(message) {
//     // your default PUBLIC function executed only when main page calls the queryableWorker.postMessage() method directly
//     // do something
//   }

//   onmessage = function(oEvent) {
//     if (oEvent.data instanceof Object && oEvent.data.hasOwnProperty('queryMethod') && oEvent.data.hasOwnProperty('queryMethodArguments')) {
//       queryableFunctions[oEvent.data.queryMethod].apply(self, oEvent.data.queryMethodArguments);
//     } else {
//       defaultReply(oEvent.data);
//     }
//   };