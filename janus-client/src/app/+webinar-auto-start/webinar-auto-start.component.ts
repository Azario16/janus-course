declare const Janus: any;
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Participant, ParticipantId, PluginType } from '../core/janus/models/plugin';
import { CreateRoomService } from '../core/janus/create-room.service';
import { JanusPluginEventSaveService } from '../core/janus/plugin/janus-plugin-eventsave.service';
import { JanusPluginStreamingService } from '../core/janus/plugin/janus-plugin-streaming.service';
import { janusLocaleUrl, janusProdUrl, janusRoomId, iceServers, rtpAudioPort, rtpVideoPort, defaultStreamId, createRandomPluginId } from '../core/helper';

@Component({
  selector: 'app-webinar-auto-start',
  templateUrl: './webinar-auto-start.component.html',
  styleUrls: ['./webinar-auto-start.component.scss']
})
export class WebinarAutoStartComponent implements OnInit {
  remoteStreamList$ = this.JanusPluginStreamingService.remoteStremList$

  pluginId = new UntypedFormControl(createRandomPluginId());
  streamId = new UntypedFormControl(defaultStreamId);
  roomIdControl = new UntypedFormControl(janusRoomId);
  pinIdControl = new UntypedFormControl('d1a2c70da7f1c7d4dbd8b6512ebcf3ee');
  videosServerControl = new UntypedFormControl(janusLocaleUrl);

  rtpForwardingAudioPort = new UntypedFormControl(rtpAudioPort);
  rtpForwardingVideoPort = new UntypedFormControl(rtpVideoPort);

  private janus: any


  constructor(
    private JanusPluginStreamingService: JanusPluginStreamingService,
    private janusPluginEventSaveService: JanusPluginEventSaveService,
    private createRoomService: CreateRoomService
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
      server: `${this.videosServerControl.value}/janus`,
      iceServers: iceServers,
      success: () => {
        // console.log('Web socket create')
        const videRoomPluginAdmin = this.JanusPluginStreamingService.getVideoRoomPlugin(this.getMyPluginId())
        this.janus.attach(videRoomPluginAdmin);

        // const eventsavePlugin = this.janusPluginEventSaveService.getEventSavePlugin(this.getMyPluginId())
        // this.janus.attach(eventsavePlugin);
      },
      error: function (cause: any) {
        this.logDebug([cause])
      },
    });
  }



  createRoom(): void {
    const pluginHandle = this.JanusPluginStreamingService.getPluginHandle(this.getMyPluginId());
    if (!pluginHandle) {
      return;
    }
    this.createRoomService.createRoom(pluginHandle.pluginHandle, Number(this.roomIdControl.value))
  }

  joinRoom(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.getMyPluginId(),
      {
        request: "join",
        ptype: "publisher",
        id: this.getMyPluginId(),
        notify_joining: true,
        room: Number(this.roomIdControl.value),
        pin: this.pinIdControl.value,
        autoupdate: true,
      },
      (data: any) => {
        // if (data) {
        //   console.log(data)
        // }
        // console.log('joinSuccess')
        this.requestListParticipants()
      }
    )
  }

  hangUp(): void {
    this.JanusPluginStreamingService.hangUp(this.getMyPluginId())
  }

  initVideoCall(): void {
    this.JanusPluginStreamingService.pluginHandleCreateOffer(this.getMyPluginId())
  }

  sendConfig(): void {
    this.janusPluginEventSaveService.sendMessage(
      this.getMyPluginId(),
      {
        request: "configure",
      },
    )

    this.JanusPluginStreamingService.sendMessage(
      this.getMyPluginId(),
      {
        request: "configure",
      },
    )
  }


  getList(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.getMyPluginId(),
      {
        request: "list",
      },
    )
  }

  requestWatch(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.getMyPluginId(),
      {
        id: this.getCurrentStreamId(),
        request: "watch",
      },
    )
  }

  requestInfo(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.getMyPluginId(),
      {
        id: this.getCurrentStreamId(),
        request: "info",
      },
    )
  }

  createRTP(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.getMyPluginId(),
      {
        request: 'create',
        type: 'rtp',
        id: 21,
        name: "Test my rtp",
        description: "description of mountpoint; optional",
        is_private: false,
        media: [
          {
            type: "audio",
            mid: "0",
            // msid: "<msid to add to the m-line, if needed>",
            port: this.getRtpForwardingAudioPort(),
            rtpmap: "opus/48000/2"
          },
          {
            type: "video",
            mid: "1",
            // msid: "<msid to add to the m-line, if needed>",
            port: this.getRtpForwardingVideoPort(),
            rtpmap: "VP8/90000"
          }
        ],
        permanent: false
      },
    )
  }

  start(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.getMyPluginId(),
      {
        request: 'start',
      }
    )
  }

  private getRtpForwardingAudioPort(): number {
    return Number(this.rtpForwardingAudioPort.value)
  }

  private getRtpForwardingVideoPort(): number {
    return Number(this.rtpForwardingVideoPort.value)
  }

  private requestListParticipants(): void {
    const participants = this.JanusPluginStreamingService.sendMessage(
      this.getMyPluginId(),
      {
        request: "listparticipants",
        room: Number(this.roomIdControl.value),
      },
      (message: any) => {
        this.logDebug([message])
        if (message.participants && message.participants.length) {
          message.participants.forEach((participant: Participant) => {
            if (participant.id !== this.getMyPluginId()) {
              this.createPluginForPartner(participant.id)
            }
          })
        }
      }
    )
  }

  private getRoomId(): number {
    return Number(this.roomIdControl.value)
  }

  private getMyPluginId(): number {
    return Number(this.pluginId.value)
  }

  private getCurrentStreamId(): number {
    return Number(this.streamId.value)
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
          //     room: Number(this.roomIdControl.value),
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
    if (pluginId === this.getMyPluginId()) {
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
        room: this.getRoomId(),
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
