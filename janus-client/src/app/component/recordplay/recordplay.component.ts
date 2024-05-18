declare const Janus: any;
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { janusLocaleUrl } from 'src/app/core/helper';
import { Participants, PluginEvent } from '../../core/janus/models/plugin';
import { JanusPluginRecordPlayService } from '../../core/janus/plugin/janus-plugin-recordplay.service';

@Component({
  selector: 'app-video-record-play',
  templateUrl: './recordplay.component.html',
  styleUrls: ['./recordplay.component.scss']
})
export class RecordPlayComponent implements OnInit {
  remoteStremList$ = this.janusPluginRecordPlayService.remoteStremList$

  roomIdControl = new UntypedFormControl(1033430008);
  pinIdControl = new UntypedFormControl('4d0eb19ad82002c6fce6f02887edd424');
  videosServerControl = new UntypedFormControl('9');

  @ViewChild('videoPlayer') videoPlayerRef: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('audioPlayer') audioPlayerRef: ElementRef<HTMLAudioElement> | undefined;

  constructor(
    private janusPluginRecordPlayService: JanusPluginRecordPlayService
  ) { }

  ngOnInit(): void {

  }

  start(): void {
    console.log(this.roomIdControl.value)
    console.log(this.pinIdControl.value)
    console.log(this.videosServerControl.value)
    Janus.init({
      debug: false
    });

    const janus = new Janus({
      server: janusLocaleUrl,
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      success: () => {
        console.log('Web socket create')
        const videRoomPluginAdmin = this.janusPluginRecordPlayService.getVideoRoomPlugin('admin')
        janus.attach(videRoomPluginAdmin);
      }
    });


    this.janusPluginRecordPlayService.pluginData$
      .subscribe((pluginData) => {
        console.log(pluginData, pluginData?.event)
        switch (pluginData?.event) {
          case 'successAdmin':
            const participants = this.janusPluginRecordPlayService.sendMessage(
              pluginData.id,
              {
                request: "list",
              },
              (message: any) => {
                console.log(message)
                if (message.participants && message.participants.length) {
                  message.participants.forEach((participant: Participants) => {
                    const videRoomPluginAdmin = this.janusPluginRecordPlayService.getVideoRoomPlugin(participant.id)
                    janus.attach(videRoomPluginAdmin);
                  })
                }
              }
            )
            // this.janusPluginRecordPlayService.sendMessage(
            //   pluginData.id,
            //   {
            //     request: "update",
            //   },
            //   (message: any) => {
            //     console.log(message)
            //     if (message.participants && message.participants.length) {
            //       message.participants.forEach((participant: Participants) => {
            //         const videRoomPluginAdmin = this.janusPluginRecordPlayService.getVideoRoomPlugin(participant.id)
            //         janus.attach(videRoomPluginAdmin);
            //       })
            //     }
            //   }
            // )

            this.janusPluginRecordPlayService.sendMessage(
              pluginData.id,
              {
                "request" : "play",
                "id" : 1234
              },
              (message: any) => {
                console.log(message)
                if (message.participants && message.participants.length) {
                  message.participants.forEach((participant: Participants) => {
                    const videRoomPluginAdmin = this.janusPluginRecordPlayService.getVideoRoomPlugin(participant.id)
                    janus.attach(videRoomPluginAdmin);
                  })
                }
              }
            )
            // this.janusPluginRecordPlayService.sendMessage(
            //   pluginData.id,
            //   {
            //     request: "join",
            //     ptype: "publisher",
            //     notify_joining: true,
            //     room: Number(this.roomIdControl.value),
            //     pin: this.pinIdControl.value,
            //     autoupdate: true,
            //   })
            break;
          case 'partnerJoined':
            const videRoomPluginAdmin = this.janusPluginRecordPlayService.getVideoRoomPlugin(pluginData.id)
            janus.attach(videRoomPluginAdmin);
            // this.janusPluginRecordPlayService.send({
            //   request: "join",
            //   ptype: "subscriber",
            //   room: 1033224170,
            //   pin: "bcad55708b91c519ed584daf8302d732",
            //   feed: 17176887,
            //   video: true,
            //   audio: true
            // })
            break;

          case 'success':
            console.log('CreateOffer success')
            // console.log(pluginData)
            this.janusPluginRecordPlayService.sendMessage(
              pluginData.id,
              {
                request: "join",
                ptype: "subscriber",
                room: Number(this.roomIdControl.value),
                pin: this.pinIdControl.value,
                feed: pluginData.id,
                autoupdate: true,
                video: true,
                audio: true
              }
            )
            // this.janusPluginRecordPlayService.send({
            //   request: "start"
            // })
            break;
          case 'attached':
            // this.janusPluginRecordPlayService.send({
            //   request: "start"
            // })
            break;
          case 'participant':
            console.log(pluginData.data)
            // this.janusPluginRecordPlayService.sendMessage(
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


    this.janusPluginRecordPlayService.janusMessage$.subscribe((message) => {
    })


    this.janusPluginRecordPlayService.remoteStremList$
      .subscribe((stream) => {

        console.log(stream)
      })
  }
}
