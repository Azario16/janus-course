import { Component, OnInit } from '@angular/core';
import { JanusPluginService } from '../../core/janus/plugin/janus-plugin.service';
import { FormFieldService } from '../../service/for-filed.service';
import { iceServers } from '../../core/helper';
import { CreateRoomService } from 'src/app/core/janus/create-room.service';
import { Participant } from '../../core/janus/models/plugin';
import { JanusService } from 'src/app/service/janus.service';

@Component({
  selector: 'app-room-options',
  templateUrl: './room-options.component.html',
  styleUrls: ['./room-options.component.scss']
})
export class RoomOptionsComponent {

  private janus: any;

  constructor(
    private janusPluginService: JanusPluginService,
    private createRoomService: CreateRoomService,
    private formFieldService: FormFieldService,
    private janusService: JanusService
  ) { }

  connect(): void {

    const callback = (): void =>{

    }

    this.janusService.init(
      this.formFieldService.getVideoServer(),
      ()=>{
        console.log('attach init')
        const pluginId = this.formFieldService.getMyPluginId()
        const videRoomPluginAdmin = this.janusPluginService.getVideoRoomPlugin(pluginId)

        this.janusService.attach(videRoomPluginAdmin)
      }
    )
  }



  createRoom(): void {
    const pluginHandle = this.janusPluginService.getPluginHandle(this.formFieldService.getMyPluginId());
    if (!pluginHandle) {
      return;
    }
    this.createRoomService.createRoom(pluginHandle.pluginHandle, this.formFieldService.getRoomId())
  }

  destroyRoom(): void {
    console.log('detachRoom')
    this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "destroy",
        room: this.formFieldService.getRoomId()
      },
    )
  }

  detachPlugin(): void {
    console.log('detachRoom')
    const plugnId = this.formFieldService.getMyPluginId()
    this.janusPluginService.detachPlugin(plugnId)
  }

  joinRoom(): void {
    this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "join",
        ptype: "publisher",
        id: this.formFieldService.getMyPluginId(),
        notify_joining: true,
        room: this.formFieldService.getRoomId(),
        pin: this.formFieldService.getPinId(),
        autoupdate: true,
      },
      (data: any) => {
        this.requestListParticipants()
      }
    )
  }

  hangUp(): void {
    this.janusPluginService.hangUp(this.formFieldService.getMyPluginId())
  }

  async initVideoCall(): Promise<void>{

    await this.janusPluginService.replaceMedia(this.formFieldService.getMyPluginId())

    this.janusPluginService.pluginHandleCreateOffer(this.formFieldService.getMyPluginId())
  }

  sendConfig(): void {
    console.log('sendConfig')
    this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "configure",
        video: true
      },
    )
  }

  forwardRtp(): void {
    this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request : "rtp_forward",
        host: '127.0.0.1',
        publisher_id: this.formFieldService.getMyPluginId(),
        room: this.formFieldService.getRoomId(),
        streams: [
          {
            mid: '0',
            port: this.formFieldService.getRtpForwardingAudioPort(),
            rtcp_port: this.formFieldService.getRtpForwardingAudioPort() + 1,
          },
          {
            mid: '1',
            port: this.formFieldService.getRtpForwardingVideoPort(),
            rtcp_port: this.formFieldService.getRtpForwardingVideoPort() + 1,
          }
        ]
      },
    )
  }

  listForwarders(): void {
    this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request : "listforwarders",
        room :  this.formFieldService.getRoomId(),
      }
    )
  }

  requestListParticipants(): void {
    const participants = this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "listparticipants",
        room: this.formFieldService.getRoomId(),
      },
      (message: any) => {
        console.log(message)
        if (message.participants && message.participants.length) {
          message.participants.forEach((participant: Participant) => {
            const plugin = this.janusPluginService.getVideoRoomPlugin(participant.id)
            console.log(plugin)


            if(!plugin && participant.id !== this.formFieldService.getMyPluginId()){
              console.log('attach partner plugin ' + participant.id)
              const videRoomPluginAdmin = this.janusPluginService.getVideoRoomPlugin(participant.id)
              this.janusService.attach(videRoomPluginAdmin);
            }
          })
        }
      }
    )
  }
}
