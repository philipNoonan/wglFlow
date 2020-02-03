  let stream;

  async function getColorStream(w, h) {


    const constraints = {
      audio: false,
      video: {
        width: w,
        height: h,
        frameRate: {ideal: 30},
      }
    }

    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    // let track = stream.getVideoTracks()[0];
    // if (track.label.indexOf("RealSense") == -1) {
    //   throw new Error(chromeVersion() < 58 ?
    //     "Your browser version is too old. Get Chrome version 58 or later." :
    //     "No RealSense camera connected.");
    // }
    return stream;
  }


function chromeVersion() {
const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
return raw ? parseInt(raw[2], 10) : false;
}