import { Injectable } from "@angular/core";
import { RequestApi } from "./models/message-api";
import { PluginHandle } from "./models/plugin";

@Injectable({
  providedIn: 'root'
})

export class JanusRequestApiService {
  request(pluginHandle: PluginHandle, roomId: number): RequestApi {
    return {
      request: 'create',
      room : roomId,
      notify_joining: true
    };
  }
}
