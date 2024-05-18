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
  createRandomPluginId,
  defaultStreamId
} from '../../core/helper';
import { FormFieldService } from '../../service/for-filed.service';

@Component({
  selector: 'app-webinar-form-field',
  templateUrl: './webinar-form-field.component.html',
  styleUrls: ['./webinar-form-field.component.scss']
})
export class WebinarFormFieldComponent {
  form = this.formFieldService.form;

  constructor(private formFieldService: FormFieldService) {
    this.form.patchValue({
      streamId: defaultStreamId,
    })
  }
}
