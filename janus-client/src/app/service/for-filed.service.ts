import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { combineLatest, map, Observable, startWith, tap } from "rxjs";
import { FormField } from 'src/app/core/interface';
import { rtpAudioPort, rtpVideoPort } from '../core/helper';

@Injectable({
  providedIn: 'root',
})

export class FormFieldService {
  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.form = this.formBuilder.group({
      pluginId: '',
      streamId: '',
      roomID: '',
      pinId: '',
      videosServer: '',
      rtpForwardingAudioPort: rtpAudioPort,
      rtcpForwardingAudioPort: rtpAudioPort + 1,
      rtpForwardingVideoPort: rtpVideoPort,
      rtcpForwardingVideoPort: rtpVideoPort + 1,
    });

    this.form.get('pinId')?.valueChanges
      .pipe()
      .subscribe(value => console.log(value))

    const {
      rtpForwardingAudioPortField$,
      rtpForwardingVideoPortField$
    } = this.valueChangeTrim()

    combineLatest([rtpForwardingAudioPortField$, rtpForwardingVideoPortField$])
      .subscribe()

  }

  valueChangeTrim(): FormField {
    const pluginIdField$ = this.form.get('pluginId')!.valueChanges.pipe(
      map(value => value as string),
      startWith(this.form.get('pluginId')!.value || ''),
    );
    const streamIdField$ = this.form.get('streamId')!.valueChanges.pipe(
      map(value => value as string),
      startWith(this.form.get('streamId')!.value || ''),
    );
    const roomIDField$ = this.form.get('roomID')!.valueChanges.pipe(
      map(value => value as string),
      startWith(this.form.get('roomID')!.value || ''),
    );
    const pinIdField$ = this.form.get('pinId')!.valueChanges.pipe(
      map(value => value as string),
      startWith(this.form.get('pinId')!.value || ''),
    );
    const videoServerField$ = this.form.get('videosServer')!.valueChanges.pipe(
      map(value => value as string),
      startWith(this.form.get('videosServer')!.value || ''),
    );
    const rtpForwardingAudioPortField$ = this.form.get('rtpForwardingAudioPort')!.valueChanges.pipe(
      tap((value) => {
        this.form.patchValue({
          rtcpForwardingAudioPort: Number(value) + 1
        })
      }),
      map(value => value as string),
      startWith(this.form.get('rtpForwardingAudioPort')!.value || ''),
    );
    const rtpForwardingVideoPortField$ = this.form.get('rtpForwardingVideoPort')!.valueChanges.pipe(
      tap((value) => {
        this.form.patchValue({
          rtcpForwardingVideoPort: Number(value) + 1
        })
      }),
      map(value => value as string),
      startWith(this.form.get('rtpForwardingVideoPort')!.value || ''),
    );
    return {
      pluginIdField$,
      streamIdField$,
      roomIDField$,
      pinIdField$,
      videoServerField$,
      rtpForwardingAudioPortField$,
      rtpForwardingVideoPortField$
    }
  }

  getStreamId(): number {
    return Number(this.form.get('streamId')!.value)
  }

  getMyPluginId(): number {
    return Number(this.form.get('pluginId')!.value)
  }

  getRoomId(): number {
    return Number(this.form.get('roomID')!.value)
  }

  getPinId(): number {
    return this.form.get('pinId')!.value
  }

  getVideoServer(): string {
    return this.form.get('videosServer')!.value
  }

  getRtpForwardingAudioPort(): number {
    return Number(this.form.get('rtpForwardingAudioPort')!.value)
  }

  getRtpForwardingVideoPort(): number {
    return Number(this.form.get('rtpForwardingVideoPort')!.value)
  }

}
