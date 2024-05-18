import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JanusEvent, OnMessage, PluginData, PluginEvent, PluginHandle, PluginHandleId } from '../models/plugin';

@Injectable({
  providedIn: 'root'
})
export class JanusPluginRecordPlayService {

  echoTestPlugin: any;
  // videoRoomPlugin: PluginHandle | null = null;
  streaming: any;

  private remoteStremList = new BehaviorSubject<any>([]);
  remoteStremList$ = this.remoteStremList.asObservable();

  // private videoRoomPlugin = new BehaviorSubject<VideoRoomPlugin | null>(null);
  // videoRoomPlugin$ = this.remoteStremList.asObservable();

  pluginData = new BehaviorSubject<PluginData | null>(null);
  pluginData$ = this.pluginData.asObservable();


  private janusMessage = new BehaviorSubject<OnMessage | null>(null);
  janusMessage$ = this.janusMessage.asObservable();


  pluginHadleList = new BehaviorSubject<PluginHandleId[] | []>([]);
  pluginHadleList$ = this.pluginHadleList.asObservable();

  constructor() { }

  getVideoRoomPlugin(pluginNameOrId: any): any {
    const pluginObject = {
      plugin: "janus.plugin.recordplay",
      // plugin: "janus.plugin.recordplay",
      success: (pluginHandle: PluginHandle) => {
        console.log('pluginHandle', pluginHandle)
        // this.videoRoomPlugin = pluginHandle;

        const pluginObject = {
          id: pluginNameOrId,
          pluginHandle: pluginHandle
        }
        const currentPluginHandleList = this.pluginHadleList.getValue()
        this.pluginHadleList.next([...currentPluginHandleList, pluginObject])

        /* Убрать для подписки с видео */
        // this.pluginHandleCreateOffer(pluginNameOrId, pluginHandle)


        this.pluginData.next({
          id: pluginNameOrId,
          event: 'pluginHandleSuccess',
          data: null,
        })
      },
      error: (cause: any) => {
        console.log('error')
        console.log(cause)
      },
      onlocaltrack: (track: any, added: any) => {
        // console.log('onlocaltrack')
        // console.log(track)
        // console.log(added)

        // A local track to display has just been added (getUserMedia worked!) or removed
      },
      onremotetrack: (track: MediaStreamTrack, mid: any, added: any, metadata: any) => {
        // console.log('onremotetrack')
        // console.log(track)
        // console.log(mid)
        // console.log(added)
        // console.log(metadata)

        if (metadata.reason === 'unmute') {
          const mediaStream = new MediaStream([track])
          const currentRemoteStreamList = this.remoteStremList.getValue()

          if (track.kind === 'video') {
            const participantObjesct = {
              id: pluginNameOrId,
              kind: track.kind,
              mediaStream: mediaStream
            }
            this.remoteStremList.next([...currentRemoteStreamList, participantObjesct])
          } else {
            const participantObjesct = {
              id: pluginNameOrId,
              kind: track.kind,
              mediaStream: mediaStream
            }
            this.remoteStremList.next([...currentRemoteStreamList, participantObjesct])
          }
        }
      },
      consentDialog: (on: any) => {
        // e.g., Darken the screen if on=true (getUserMedia incoming), restore it otherwise
        console.log(on)
      },
      onmessage: (msg: OnMessage, jsep: any) => {
        // console.log(msg)
        // console.log(jsep)
        this.janusMessage.next(msg)
        if (jsep) {
          // We have the ANSWER from the plugin
          // this.videoRoomPlugin!.handleRemoteJsep({ jsep: jsep });
        }
        if (msg.videoroom === 'event' && msg.publishers && msg.publishers.length) {
          console.log('new join')
          this.pluginData.next({
            id: pluginNameOrId,
            event: 'partnerJoined',
            data: msg
          })
        }

        if (msg.videoroom === 'event' && msg.leaving) {
          console.log('leaving')
          const pluginHandleId = this.getPluginHandle(msg.leaving)

          if (pluginHandleId) {
            this.destroyPluginHandle(msg.room, pluginHandleId)
            console.log(pluginHandleId.id)
          }
        }

        if (msg.videoroom === 'attached') {
          this.pluginData.next({
            id: pluginNameOrId,
            event: 'attached',
            data: null
          })
        }
        if (jsep) {
          console.log('offer', jsep)
          jsep.sdp.split(`\r\n`)
            .forEach((line: string)=>{
              if(line.includes('candidate')){
                console.log(line)
              }
            })

          // We have an OFFER from the plugin
          const pluginHandle = this.getPluginHandle(pluginNameOrId)
          if (pluginHandle) {
            this.pluginHandleCreateAnswer(pluginHandle.pluginHandle, jsep)
          }
        }
      },
    }

    return pluginObject;
  }



  getPluginHandle(pluginNameOrId: any): PluginHandleId | null {
    const currentPluginHandleList = this.pluginHadleList.getValue()
    // console.log(currentPluginHandleList)

    const findPluginHandle = currentPluginHandleList
      .find((pluginHandle: PluginHandleId) => {
        return pluginHandle.id === pluginNameOrId
      })

    if (findPluginHandle) {
      return findPluginHandle;
    }

    return null;
  }


  sendMessage(pluginId: any, msg: any, callback = (msg: any) => { }): void {
    const pluginHandleId = this.getPluginHandle(pluginId)

    if (pluginHandleId) {
      pluginHandleId.pluginHandle.send(
        {
          message: msg,
          success: callback
        }
      )
    }
  }

  private pluginHandleCreateOffer(pluginNameOrId: any, videoRoomPlugin: PluginHandle): void {
    videoRoomPlugin.createOffer(
      {
        tracks: [],
        success: (jsep: any) => {
          // console.log('success')
          // console.log(jsep)
          this.pluginData.next({
            id: pluginNameOrId,
            event: 'createOfferSuccess',
            data: null,
          })
          let body = {
            request: "configure",
            audio: true,
            video: true
          };
          console.log(jsep.sdp.split(`\r\n`))

          videoRoomPlugin.send({ message: body, jsep: jsep });
        },
        error: (error: any) => {
          console.log(error)
        }
      }
    );
  }

  private pluginHandleCreateAnswer(videoRoomPlugin: PluginHandle, jsep: any): void {
    console.log('asnwer', jsep)
    jsep.sdp.split(`\r\n`)
      .forEach((line: string)=>{
        if(line.includes('candidate')){
          console.log(line)
        }
      })
    videoRoomPlugin.createAnswer(
      {
        jsep: jsep,
        tracks: [
          { type: 'data' }
        ],
        success: (ourjsep: any) => {
          // console.log(ourjsep)
          var body = { request: "start" };
          videoRoomPlugin.send({ message: body, jsep: ourjsep });
        },
        error: (error: any) => {
          console.log(error)
        }
      });
  }


  private destroyPluginHandle(roomId: number, pluginHandleId: PluginHandleId): void {
    pluginHandleId.pluginHandle.detach({
      success: () => {
        const currentPluginHandleList = this.pluginHadleList.getValue()

        const filteredPlugin = currentPluginHandleList
          .filter((pluginHandle) => {
            return pluginHandle.id !== pluginHandleId.id
          })

        console.log(filteredPlugin)
        this.pluginHadleList.next(filteredPlugin)



        const currentRemoteStreamList = this.remoteStremList.getValue()

        const folteredStreamList = currentRemoteStreamList
          .filter((stream: any) => {
            return stream.id !== pluginHandleId.id
          })

        this.remoteStremList.next(folteredStreamList)

        console.log('destroyPluginHandle success');
      },
      error: (error) => {
        console.log('destroyPluginHandle success');
        console.log('error')
        console.log(error)
      }
    })
  }
}
