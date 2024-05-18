import { Observable } from "rxjs";

export type FormField = {
  pluginIdField$: Observable<string>;
  streamIdField$: Observable<string>;
  roomIDField$: Observable<string>;
  pinIdField$: Observable<string>;
  videoServerField$: Observable<string>;
  rtpForwardingAudioPortField$: Observable<string>;
  rtpForwardingVideoPortField$: Observable<string>;
};
