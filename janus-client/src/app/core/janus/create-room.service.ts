import { Injectable } from "@angular/core";
import { roomCodec } from "../helper";
import { PluginHandle } from "./models/plugin";

@Injectable({
  providedIn: 'root'
})

export class CreateRoomService {
  createRoom(pluginHandle: PluginHandle, roomId: number): void {
    let body = {
      request: "create",
      videocodec: roomCodec,
      room : roomId,
      notify_joining: true,
      record: false,
      publishers : 8,
      bitrate: 12800,
      rec_dir: `/opt/record/${roomId}`,
      videoorient_ext : false,
      // h264_profile: '42e01f',
      audiolevel_ext: true,

    };

    pluginHandle.send({ message: body,
      error: (error: any)=>{
        console.log(error)
      },
      success: (event: any)=>{
        console.log(event)
      }
    });
  }
}
