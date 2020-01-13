  class webCamera {

    constructor() {
    }

    static async getColorStream() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices ||
        !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support the required mediaDevices APIs.");
      }
      const supported_constraints = navigator.mediaDevices.getSupportedConstraints();
      if (supported_constraints.videoKind) {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: {
            videoKind: {exact: "video"},
            frameRate: {exact: 30}
          }
        });
        const track = stream.getVideoTracks()[0];
        let settings = track.getSettings ? track.getSettings() : null;
        return stream;
      }

      const constraints = {
        audio: false,
        video: {
          width: 960,
          height: 540,
          frameRate: {ideal: 30},
        }
      }

      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      // let track = stream.getVideoTracks()[0];
      // if (track.label.indexOf("RealSense") == -1) {
      //   throw new Error(chromeVersion() < 58 ?
      //     "Your browser version is too old. Get Chrome version 58 or later." :
      //     "No RealSense camera connected.");
      // }
      return stream;
    }

}

function chromeVersion() {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : false;
}
