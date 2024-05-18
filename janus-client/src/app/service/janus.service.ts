declare const Janus: any;

import { Injectable } from '@angular/core';
import { iceServers } from '../core/helper';

@Injectable({
  providedIn: 'root',
})

export class JanusService {

  private janus: any;

  constructor(){}

  init(url: string, successCallback: Function): any {
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
      server: url,
      iceServers: iceServers,
      success: () => {
        // const videRoomPluginAdmin = this.janusPluginService.getVideoRoomPlugin(pluginId)
        // this.janus.attach(videRoomPluginAdmin);

        successCallback()
      },
      error: function (cause: any) {
        console.log(cause)
      },
    });
  }

  attach(plugin: any): void {
    console.log('attach')
    this.janus.attach(plugin);
  }
}
