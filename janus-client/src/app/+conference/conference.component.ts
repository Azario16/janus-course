declare const Janus: any;

import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Participant, ParticipantId, PluginType } from '../core/janus/models/plugin';
import { CreateRoomService } from '../core/janus/create-room.service';
import { JanusPluginService } from '../core/janus/plugin/janus-plugin.service';
import { JanusPluginEventSaveService } from '../core/janus/plugin/janus-plugin-eventsave.service';
import { FormFieldService } from '../service/for-filed.service';

import { janusRoomId, rtpAudioPort, rtpVideoPort, pinId } from '../core/helper';
import { JanusService } from '../service/janus.service';

@Component({
  selector: 'app-home',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {
  remoteStreamList$ = this.janusPluginService.remoteStremList$
  private janus: any

  constructor(
    private janusPluginService: JanusPluginService,
    private janusPluginEventSaveService: JanusPluginEventSaveService,
    private createRoomService: CreateRoomService,
    private formFieldService: FormFieldService,
    private janusService: JanusService
  ) { }

  ngOnInit(): void {
    this.subscribePluginData()
  }

  private subscribePluginData(): void {
    this.janusPluginService.pluginData$.subscribe((pluginData) => {
      switch (pluginData?.event) {
        case 'pluginHandleSuccess':
          const handleType = this.getHanldeType(pluginData.id)
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
          break;
        case 'attached':
          break;
        case 'participant':
          console.log(pluginData.data)
          break;
      }
    })
  }

  private createPluginForPartner(participantId: ParticipantId, callback = ()=>{}): boolean {
    console.log('createPluginHandleSunscriber', participantId)
    const videRoomPluginAdmin = this.janusPluginService.getVideoRoomPlugin(participantId, callback)
    this.janusService.attach(videRoomPluginAdmin);

    return true;
  }

  private getHanldeType(pluginId: number): PluginType {
    if(pluginId === this.formFieldService.getMyPluginId()){
      return 'publisher'
    }
    return 'subscriber'
  }

  private subscribeStream(pluginId: number): void {
    this.janusPluginService.sendMessage(
      pluginId,
      {
      request: "join",
      ptype: "subscriber",
      pin: this.formFieldService.getPinId(),
      room: this.formFieldService.getRoomId(),
      feed: pluginId,
      video: true,
      audio: true
    })
  }
}
