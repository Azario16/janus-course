declare const Janus: any;
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Participant, ParticipantId, PluginType } from '../../core/janus/models/plugin';
import { CreateRoomService } from '../../core/janus/create-room.service';
import { JanusPluginEventSaveService } from '../../core/janus/plugin/janus-plugin-eventsave.service';
import { createRandomPluginId, janusLocaleUrl, janusRoomId, pinId } from 'src/app/core/helper';

@Component({
  selector: 'app-eventsave',
  templateUrl: './eventsave.component.html',
  styleUrls: ['./eventsave.component.scss']
})
export class EventsaveComponent implements OnInit {
  remoteStreamList$ = this.janusPluginEventSaveService.remoteStremList$

  pluginId = new UntypedFormControl(createRandomPluginId());
  roomIdControl = new UntypedFormControl(janusRoomId);
  pinIdControl = new UntypedFormControl(pinId);
  videosServerControl = new UntypedFormControl(janusLocaleUrl);

  private janus: any

  constructor(
    private janusPluginEventSaveService: JanusPluginEventSaveService,
    private createRoomService: CreateRoomService
  ) { }


  ngOnInit(): void {
    this.subscribePluginData()
  }

  connect(): void {
    Janus.init({
      debug: false,
      callback: (event: any) => {
        if (event) {
          // console.log(event)
        }
        // console.log('JanusInitSuccess')
      }
    });

    this.janus = new Janus({
      server: this.videosServerControl.value,
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      success: () => {
        // console.log('Web socket create')
        const videRoomPluginAdmin = this.janusPluginEventSaveService.getEventSavePlugin(this.getMyPluginId())
        this.janus.attach(videRoomPluginAdmin);
      },
      error: function (cause: any) {
        console.log(cause)
      },
    });
  }



  createRoom(): void {
    const pluginHandle = this.janusPluginEventSaveService.getPluginHandle(this.getMyPluginId());
    if (!pluginHandle) {
      return;
    }
    this.createRoomService.createRoom(pluginHandle.pluginHandle, Number(this.roomIdControl.value))
  }

  joinRoom(): void {
    this.janusPluginEventSaveService.sendMessage(
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

  initVideoCall(): void {
    this.janusPluginEventSaveService.pluginHandleCreateOffer(this.getMyPluginId())
  }

  sendConfig(): void {
    this.janusPluginEventSaveService.sendMessage(
      this.getMyPluginId(),
      {
        request: "configure",
        video: true
      },
    )
  }


  private requestListParticipants(): void {
    const participants = this.janusPluginEventSaveService.sendMessage(
      this.getMyPluginId(),
      {
        request: "listparticipants",
        room: Number(this.roomIdControl.value),
      },
      (message: any) => {
        console.log(message)
        if (message.participants && message.participants.length) {
          message.participants.forEach((participant: Participant) => {
            this.createPluginForPartner(participant.id)
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

  private subscribePluginData(): void {
    this.janusPluginEventSaveService.pluginData$.subscribe((pluginData) => {
      // console.log('PluginData', pluginData?.event)
      switch (pluginData?.event) {
        case 'pluginHandleSuccess':

          const handleType = this.getHanldeType(pluginData.id)
          console.log('pluginAttachSuccess', handleType)
          // if(handleType === 'subscriber'){
          //   this.subscribeStream(pluginData.id)
          // }

          break;
        case 'joining':
          this.createPluginForPartner(pluginData.id)
          break;
        case 'joinedPublisher':
          console.log('newPublisher')
          const callback = ()=>{
            this.subscribeStream(pluginData.id)
          }
          this.createPluginForPartner(pluginData.id, callback)
          break;
        case 'newPublisher':
          console.log('newPublisher')
          this.subscribeStream(pluginData.id)
          break;

        case 'createOfferSuccess':
          console.log('CreateOffer success')
          // console.log(pluginData)
          // this.janusPluginService.sendMessage(
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
          // this.janusPluginService.send({
          //   request: "start"
          // })
          break;
        case 'attached':
          // this.janusPluginService.send({
          //   request: "start"
          // })
          break;
        case 'participant':
          console.log(pluginData.data)
          // this.janusPluginService.sendMessage(
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

  private createPluginForPartner(participantId: ParticipantId, callback = ()=>{}): boolean {
    // console.log('createPluginHandleSunscriber', participantId)
    const videRoomPluginAdmin = this.janusPluginEventSaveService.getEventSavePlugin(participantId, callback)
    this.janus.attach(videRoomPluginAdmin);

    return true;
  }

  private getHanldeType(pluginId: number): PluginType {
    if(pluginId === this.getMyPluginId()){
      return 'publisher'
    }
    return 'subscriber'
  }

  private subscribeStream(pluginId: number): void {
    this.janusPluginEventSaveService.sendMessage(
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
}
