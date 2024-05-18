import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConferenceComponent } from './conference.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EventsaveComponent } from '../component/eventsave/eventsave.component';
import { RecordOptionsComponent } from '../component/record-options/record-options.component';
import { RoomOptionsComponent } from '../component/videoroom/room-options.component';
import { Module } from '../component/module';

const routes: Routes = [
  {
    path: '',
    component: ConferenceComponent,
  },
];

@NgModule({
  declarations: [
    ConferenceComponent,
    EventsaveComponent,
    RecordOptionsComponent,
    RoomOptionsComponent
  ],
  imports: [
    Module,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ConferenceModule { }
