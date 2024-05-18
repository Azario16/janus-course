import { Component, OnInit } from '@angular/core';
import { JanusPluginService } from '../core/janus/plugin/janus-plugin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  constructor(
    janusPluginService: JanusPluginService
  ){}


  ngOnInit(): void {}

}
