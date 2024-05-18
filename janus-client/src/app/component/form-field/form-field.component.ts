import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { JanusPluginService } from '../../core/janus/plugin/janus-plugin.service';
import {
  janusLocaleUrl,
  janusRoomId,
  iceServers,
  rtpAudioPort,
  rtpVideoPort,
  pinId,
  createRandomPluginId
} from '../../core/helper';
import { FormFieldService } from '../../service/for-filed.service';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {

  form = this.formFieldService.form;

  pluginId = createRandomPluginId();

  constructor(private formFieldService: FormFieldService) {
    this.form.patchValue({
      pluginId: this.pluginId,
      roomID: janusRoomId,
      pinId: pinId,
      videosServer: janusLocaleUrl
    })
  }
}
