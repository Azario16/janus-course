import { Component } from "@angular/core";
import { UntypedFormControl } from '@angular/forms';
import { CreateRoomService } from '../../core/janus/create-room.service';
import { JanusPluginEventSaveService } from '../../core/janus/plugin/janus-plugin-eventsave.service';
import { JanusPluginStreamingService } from '../../core/janus/plugin/janus-plugin-streaming.service';

import { janusLocaleUrl, janusProdUrl, janusRoomId, iceServers, rtpAudioPort, rtpVideoPort, defaultStreamId, createRandomPluginId } from '../../core/helper';
import { FormFieldService } from "../../service/for-filed.service";


@Component({
  selector: 'app-home',
  templateUrl: './webinar-options.component.html',
  styleUrls: ['./webinar-options.component.scss']
})

export class WebinarOptionsComponent {
  remoteStreamList$ = this.JanusPluginStreamingService.remoteStremList$

  pluginId = new UntypedFormControl(createRandomPluginId());
  streamId = new UntypedFormControl(defaultStreamId);
  roomIdControl = new UntypedFormControl(janusRoomId);
  pinIdControl = new UntypedFormControl('d1a2c70da7f1c7d4dbd8b6512ebcf3ee');
  videosServerControl = new UntypedFormControl(janusLocaleUrl);

  rtpForwardingAudioPort = new UntypedFormControl(rtpAudioPort);
  rtpForwardingVideoPort = new UntypedFormControl(rtpVideoPort);


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

  createRTP(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: 'create',
        type: 'rtp',
        id: 21,
        name: "Test my rtp",
        description: "Test my rtp",
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
        id: this.getCurrentStreamId(),
        request: "watch",
      },
    )
  }

  requestInfo(): void {
    this.JanusPluginStreamingService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        id: this.getCurrentStreamId(),
        request: "info",
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


  private getCurrentStreamId(): number {
    return Number(this.streamId.value)
  }

  private getRtpForwardingAudioPort(): number {
    return Number(this.rtpForwardingAudioPort.value)
  }

  private getRtpForwardingVideoPort(): number {
    return Number(this.rtpForwardingVideoPort.value)
  }

  private logDebug(msg: Array<any>): void {
    msg.forEach(element => {
      // console.log(element)
    });
  }
}

