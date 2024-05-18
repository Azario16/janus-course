declare const Janus: any;
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Participant, ParticipantId, PluginType } from '../core/janus/models/plugin';
import { CreateRoomService } from '../core/janus/create-room.service';
import { JanusPluginEventSaveService } from '../core/janus/plugin/janus-plugin-eventsave.service';
import { JanusPluginStreamingService } from '../core/janus/plugin/janus-plugin-streaming.service';
import { janusLocaleUrl, janusProdUrl, janusRoomId, iceServers, rtpAudioPort, rtpVideoPort, defaultStreamId, createRandomPluginId } from '../core/helper';
import { FormFieldService } from '../service/for-filed.service';

@Component({
  selector: 'app-home',
  templateUrl: './webinar.component.html',
  styleUrls: ['./webinar.component.scss']
})
export class WebinarComponent implements OnInit {
  remoteStreamList$ = this.JanusPluginStreamingService.remoteStremList$

  private janus: any


  constructor(
    private JanusPluginStreamingService: JanusPluginStreamingService,
    private janusPluginEventSaveService: JanusPluginEventSaveService,
    private createRoomService: CreateRoomService,
    private formFieldService: FormFieldService
  ) {
    this.remoteStreamList$
      .pipe()
      .subscribe((stream) => {
        this.logDebug([stream])
      })
  }


  ngOnInit(): void {
    this.subscribePluginData()
  }

  connect(): void {
    Janus.init({
      debug: true,
      callback: (event: any) => {
        if (event) {
          // console.log(event)
        }
        // console.log('JanusInitSuccess')
      }
    });

    this.janus = new Janus({
      server: janusLocaleUrl,
      iceServers: iceServers,
      success: () => {
        // console.log('Web socket create')
        const videRoomPluginAdmin = this.JanusPluginStreamingService.getVideoRoomPlugin(this.formFieldService.getMyPluginId())
        this.janus.attach(videRoomPluginAdmin);

        // const eventsavePlugin = this.janusPluginEventSaveService.getEventSavePlugin(this.formFieldService.getMyPluginId())
        // this.janus.attach(eventsavePlugin);
      },
      error: function (cause: any) {
        this.logDebug([cause])
      },
    });
  }

  sendConfig(): void {
    this.janusPluginEventSaveService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "configure",
      },
    )

    this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "configure",
      },
    )
  }


  getList(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "list",
      },
    )
  }

  requestWatch(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        id: this.formFieldService.getStreamId(),
        request: "watch",
      },
    )
  }

  requestInfo(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        id: this.formFieldService.getStreamId(),
        request: "info",
      },
    )
  }

  createRTP(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "create",
        type: "rtp",
        id: this.formFieldService.getStreamId(),
        name: "rtp-sample-test-1",
        description: "rtp-sample-test-1",
        is_private: false,
        audio: true,
        video: true,
        audiopt: 111,
        videopt: 100,
        media: [
          {
            type: "audio",
            mid: "0",
            // msid: "<msid to add to the m-line, if needed>",
            port: this.formFieldService.getRtpForwardingAudioPort(),
            rtpmap: "opus/48000/2",
            pt: 111,
            rtcpport: this.formFieldService.getRtpForwardingAudioPort() + 1,
          },
          {
            type: "video",
            mid: "1",
            // msid: "<msid to add to the m-line, if needed>",
            port: this.formFieldService.getRtpForwardingVideoPort(),
            rtpmap: "H264/90000",
            pt: 100,
            rtcpport: this.formFieldService.getRtpForwardingVideoPort() + 1
          }
        ],
        permanent: true,
        audiortcpport: this.formFieldService.getRtpForwardingAudioPort() + 1,
        videortcpport: this.formFieldService.getRtpForwardingVideoPort() + 1
      },
    )
  }

  start(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: 'start',
      }
    )
  }

  private requestListParticipants(): void {
    const participants = this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "listparticipants",
        room: this.formFieldService.getRoomId(),
      },
      (message: any) => {
        this.logDebug([message])
        if (message.participants && message.participants.length) {
          message.participants.forEach((participant: Participant) => {
            if (participant.id !== this.formFieldService.getMyPluginId()) {
              this.createPluginForPartner(participant.id)
            }
          })
        }
      }
    )
  }

  private subscribePluginData(): void {
    this.JanusPluginStreamingService.pluginData$.subscribe((pluginData) => {
      // console.log('PluginData', pluginData?.event)
      switch (pluginData?.event) {
        case 'pluginHandleSuccess':

          const handleType = this.getHanldeType(pluginData.id)
          this.logDebug(['pluginAttachSuccess', handleType])
          // if(handleType === 'subscriber'){
          //   this.subscribeStream(pluginData.id)
          // }

          break;
        case 'joining':
          this.createPluginForPartner(pluginData.id)
          break;
        case 'joinedPublisher':
          this.logDebug(['newPublisher'])
          const callback = () => {
            this.subscribeStream(pluginData.id)
          }
          this.createPluginForPartner(pluginData.id, callback)
          break;
        case 'newPublisher':
          this.logDebug(['newPublisher'])
          this.subscribeStream(pluginData.id)
          break;

        case 'createOfferSuccess':
          this.logDebug(['CreateOffer success'])
          // console.log(pluginData)
          // this.JanusPluginStreamingService.sendMessage(
          //   pluginData.id,
          //   {
          //     request: "join",
          //     ptype: "subscriber",
          //     room: this.formFieldService.getRoomId(),
          //     pin: this.pinIdControl.value,
          //     feed: pluginData.id,
          //     autoupdate: true,
          //     video: true,
          //     audio: true
          //   }
          // )
          // this.JanusPluginStreamingService.send({
          //   request: "start"
          // })
          break;
        case 'attached':
          // this.JanusPluginStreamingService.send({
          //   request: "start"
          // })
          break;
        case 'participant':
          this.logDebug([pluginData.data])
          // this.JanusPluginStreamingService.sendMessage(
          //   pluginData.id,
          //   {
          //     request: "join",
          //     ptype: "subscriber",
          //     room: 1033232306,
          //     pin: "1fe6e38448e58f5204fd000c8f795364",
          //     feed: pluginData.data.id,
          //     video: true,
          //     audio: true
          //   })
          break;
      }
    })
  }

  private createPluginForPartner(participantId: ParticipantId, callback = () => { }): boolean {
    this.logDebug(['createPluginHandleSunscriber', participantId])
    const videRoomPluginAdmin = this.JanusPluginStreamingService.getVideoRoomPlugin(participantId, callback)
    this.janus.attach(videRoomPluginAdmin);

    return true;
  }

  private getHanldeType(pluginId: number): PluginType {
    if (pluginId === this.formFieldService.getMyPluginId()) {
      return 'publisher'
    }
    return 'subscriber'
  }

  private subscribeStream(pluginId: number): void {
    this.JanusPluginStreamingService.sendMessage(
      pluginId,
      {
        request: "join",
        ptype: "subscriber",
        room: this.formFieldService.getRoomId(),
        feed: pluginId,
        video: true,
        audio: true
      })
  }

  private logDebug(msg: Array<any>): void {
    msg.forEach(element => {
      // console.log(element)
    });
  }
}
