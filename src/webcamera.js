
  async function getColorStream(w, h, id) {

    let stream;

    const constraints = {
      audio: false,
      video: {
        deviceId: {
          exact: id
        },
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
    let track = stream.getVideoTracks()[0];

    if (track.label.includes('RGB') || track.label.includes('Webcam')) {
      return [stream, 'color'];
    }
    else if (track.label.includes('Depth')) {
      if (track.label.includes('435'))
      {
        return [stream, 'depth'];
      }
      else if (track.label.includes('415')) {
        return [stream, 'depth'];
      }
    }
    else {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }      return [null, null];
    }
  }


function chromeVersion() {
const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
return raw ? parseInt(raw[2], 10) : false;
}