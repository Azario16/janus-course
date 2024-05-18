export interface PluginHandle {
  plugin: string;
  createOffer(params: OfferParams): RTCSessionDescription;
  createAnswer(params: AnswerParams): RTCSessionDescription;
  send(
    message: any,
    success?: (param: any) => void,
    error?: (param: any) => void
  ): void;
  handleRemoteJsep(params: PluginHandleRemoteJsepParam): void;
  detach(params?: DetachOptions): void;
  hangup(sendRequest: any): void
  replaceTracks(params: { tracks: OfferTrack[]; success?: Function; error?: Function }): void;
}
interface DetachOptions {
  success?: () => void;
  error?: (error: string) => void;
  noRequest?: boolean;
}


export interface OfferTrack {
  type: 'audio' | 'video' | 'screen' | 'data';
  capture?: MediaStreamTrack | boolean | MediaTrackConstraints;
  recv?: boolean;
}

type PluginHandleRemoteJsepParam = {
  jsep: JSEP;
  success?: (data: JSEP) => void;
  error?: (error: string) => void;
}

interface JSEP {
  e2ee?: boolean;
  sdp?: string;
  type?: string;
  rid_order?: "hml" | "lmh";
  force_relay?: boolean;
}


export interface OfferParamsWithTracks {
  tracks?: OfferTrack[];
  iceRestart?: boolean;
}

export interface OfferParams {
  tracks?: OfferTrack[];
  trickle?: boolean;
  iceRestart?: boolean;
  success: Function;
  error: (error: Error | string) => void;
  customizeSdp?: ({ type, sdp }: { type: string; sdp: string }) => void;
}

export interface AnswerParams extends OfferParamsWithTracks {
  jsep: RTCSessionDescription;
  success: Function;
  error: (error: Error | string) => void;
}


export interface OfferTrack {
  type: 'audio' | 'video' | 'screen' | 'data';
  capture?: MediaStreamTrack | boolean | MediaTrackConstraints;
  recv?: boolean;
}


export type JanusEvent =
| 'joined'
| 'event'
| 'attached'
| 'partnerAudioPlay';


export type PluginEvent =
| JanusEvent
| 'init'
| 'success'
| 'successAdmin'
| 'pluginHandleSuccess'
| 'error'
| 'joining'
| 'partnerJoined'
| 'joinedPublisher'
| 'newPublisher'
| 'participant'
| 'unsubscribe'
| 'createOfferSuccess';

export interface OnMessage {
  videoroom: JanusEvent;
  room: number,
  description: string,
  id: number,
  private_id: number,
  publishers: Publisher[];
  leaving: number;
  joining: {
    id: ParticipantId;
  }
}

export interface Participants {
  id: number,
  publisher: boolean,
  talking: boolean
}

export interface Publisher {
  id: ParticipantId,
  audio_codec: string,
  video_codec: string,
  streams: Stream[]
}

export interface Stream {
  type: 'audio' | 'video',
  mindex: number,
  mid: string,
  codec: string
}

export interface Participant {
  id: ParticipantId,
  publisher: boolean,
  talking: boolean
}
export interface PluginData {
  id: any,
  event: PluginEvent;
  data: OnMessage | Participant | any;
}

export type ParticipantId = number;

export interface PluginHandleId {
  id: any,
  pluginHandle: PluginHandle
}

export type PluginType = 'publisher' | 'subscriber'
