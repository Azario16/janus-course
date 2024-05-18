import { Component, OnInit } from '@angular/core';
import { JanusPluginService } from '../../core/janus/plugin/janus-plugin.service';
import { FormFieldService } from '../../service/for-filed.service';

@Component({
  selector: 'app-record-options',
  templateUrl: './record-options.component.html',
  styleUrls: ['./record-options.component.scss']
})
export class RecordOptionsComponent {
  constructor(
    private janusPluginService: JanusPluginService,
    private formFieldService: FormFieldService,
  ) { }

  initRecord(): void {
    console.log('sendConfig')
    const roomId = this.formFieldService.getRoomId()
    this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "enable_recording",
        room: roomId,
        record: true
      },
    )
  }

  stopRecord(): void {
    console.log('sendConfig')
    const roomId = this.formFieldService.getRoomId()
    this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        request: "enable_recording",
        room: roomId,
        record: false
      },
    )
  }

  changeDirRecord(): void {
    console.log('sendConfig')
    const roomId = this.formFieldService.getRoomId()
    this.janusPluginService.sendMessage(
      this.formFieldService.getMyPluginId(),
      {
        room: roomId,
        request: "edit",
        new_rec_dir: `/opt/record/${roomId}-edit`
      },
    )
  }
}
