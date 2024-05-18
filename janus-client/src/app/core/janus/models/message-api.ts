export interface RequestApi {
  request: Requset;
  room: number;
  description?: string;
  secret?: string;
  pin?: string;
  is_private?: boolean;
  notify_joining?: boolean;
  audiocodec?: AudioCodec;
  videocodec?: VideoCodec;
  record?: boolean;
  rec_dir?: string;
}

type Requset = 'create' |
'destroy' |
'edit' |
'exists' |
'list' |
'allowed' |
'kick' |
'moderate' |
'enable_recording' |
'listparticipants' |
'listforwarders'

type AudioCodec = 'opus'
type VideoCodec = 'h264' | 'vp8' | 'vp9'
