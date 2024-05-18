
export const janusLocaleUrl = (() => {
  switch (window.location.hostname) {
    case 'localhost':

      return 'ws://localhost:8007/janus';
      // return 'wss://video03.vimbox.skyeng.ru:443/janus';

    default:
      return `wss://${window.location.hostname}`;
  }
})()



export const janusProdUrl = 'wss://video57.skyeng.ru/janus';
// export const janusLocaleDomain = 'wss://192.168.1.154:8007'
// export const janusLocaleDomain = 'ws://localhost:8007'
// export const janusLocaleDomain = 'wss://video57.skyeng.ru'

export const janusRoomId = 10010000312
export const defaultStreamId = 4
export const rtpAudioPort = 5002
export const rtpVideoPort = 5004
export const roomCodec = 'h264'
export const pinId = '4b5edf8659ba476b3ed1d7ebec8b546a'

// export const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }]

export const iceServers = [
  // {
  //   "urls": "stun:video8.osmi.com"
  // },
  // {
  //   "urls": "turn:video36.skyeng.ru?transport=tcp",
  //   "username": "skyvideoturn", "credential": "YxUZvcY8Q099xV2i2DGfdw"
  // },
  {
    "urls": "turn:video36.osmi.com?transport=udp",
    "username": "skyvideoturn",
    "credential": "YxUZvcY8Q099xV2i2DGfdw"
  },
  // {
  //   "urls": "turn:global.turn.twilio.com:3478?transport=udp",
  //   "username": "09c544f984a997e63f76c17b9464658894fcea0da763adcb62697a3adf2f0baa",
  //   "credential": "l3iBwq2yYrLccDsIF5fcUR0Z5RLwdtjyFcZ6wKOWPgU="
  // },
  // {
  //   "urls": "turn:global.turn.twilio.com:443?transport=tcp",
  //   "username": "09c544f984a997e63f76c17b9464658894fcea0da763adcb62697a3adf2f0baa",
  //   "credential": "l3iBwq2yYrLccDsIF5fcUR0Z5RLwdtjyFcZ6wKOWPgU="
  // }
]

export const createRandomPluginId = () => {
  return Math.round(Math.random() * 10000000000);
}
