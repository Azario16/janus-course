import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JanusEvent, OnMessage, PluginData, PluginEvent, PluginHandle, PluginHandleId } from '../models/plugin';

@Injectable({
  providedIn: 'root'
})
export class JanusPluginEventSaveService {
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

  getEventSavePlugin(pluginNameOrId: any, callback = ()=>{}): any {
    const pluginObject = {
      plugin: "janus.plugin.eventsave_plugin",
      success: (pluginHandle: PluginHandle) => {
        const pluginHandleCreatad = this.getPluginHandle(pluginNameOrId)

        if(!pluginHandleCreatad){
          const pluginObject = {
            id: pluginNameOrId,
            pluginHandle: pluginHandle
          }
          const currentPluginHandleList = this.pluginHadleList.getValue()
          this.pluginHadleList.next([...currentPluginHandleList, pluginObject])
        }

        this.pluginData.next({
          id: pluginNameOrId,
          event: 'pluginHandleSuccess',
          data: null,
        })
        callback()
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
        // console.log(on)
      },
      onmessage: (msg: OnMessage, jsep: any) => {
        // console.log(msg)
        // console.log(jsep)
        this.janusMessage.next(msg)
        if (jsep) {
          // We have the ANSWER from the plugin
          // this.videoRoomPlugin!.handleRemoteJsep({ jsep: jsep });
        }
        if(msg.videoroom === 'event' && msg.joining){
          this.pluginData.next({
            id: msg.joining.id,
            event: 'joining',
            data: msg
          })
        }
        if (msg.videoroom === 'joined' && msg.publishers && msg.publishers.length) {
          msg.publishers
            .forEach(publisher=>{
              this.pluginData.next({
                id: publisher.id,
                event: 'joinedPublisher',
                data: msg
              })
            })
        }
        if (msg.videoroom === 'event' && msg.publishers && msg.publishers.length) {
          msg.publishers
            .forEach(publisher=>{
              this.pluginData.next({
                id: publisher.id,
                event: 'newPublisher',
                data: msg
              })
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
          // console.log('offer', jsep)
          // jsep.sdp.split(`\r\n`)
          //   .forEach((line: string)=>{
          //     if(line.includes('candidate')){
          //       console.log(line)
          //     }
          //   })

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
    // console.log('sendMessage')
    const pluginHandleId = this.getPluginHandle(pluginId)

    if (pluginHandleId) {
      // console.log('\r\n')
      // console.log('------------------')
      // console.log('request', msg.request)
      // if(msg.ptype){
      //   console.log('ptype', msg.ptype)
      // }
      // console.log('------------------')
      // console.log('\r\n')
      pluginHandleId.pluginHandle.send(
        {
          message: msg,
          success: callback
        }
      )
    }
  }

  pluginHandleCreateOffer(pluginNameOrId: any): void {
    const pluginHandel = this.getPluginHandle(pluginNameOrId)
    pluginHandel?.pluginHandle.createOffer(
      {
        tracks: [
          { type: 'audio', capture: true, recv: true },
          { type: 'video', capture: true, recv: true }
        ],
        success: (jsep: any) => {
          console.log('success')
          console.log(pluginNameOrId)

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

          pluginHandel?.pluginHandle.send({ message: body, jsep: jsep,
            error: (error: any)=>{
              // console.log(error)
            },
            success: (event: any)=>{
              console.log('configure success')
            }
          });
        },
        error: (error: any) => {
          console.log(error)
        }
      }
    );
  }

  private pluginHandleCreateAnswer(videoRoomPlugin: PluginHandle, jsep: any): void {
    // console.log('asnwer', jsep)
    // jsep.sdp.split(`\r\n`)
    //   .forEach((line: string)=>{
    //     if(line.includes('candidate')){
    //       console.log(line)
    //     }
    //   })
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
          // console.log(error)
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
