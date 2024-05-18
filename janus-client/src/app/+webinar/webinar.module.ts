import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WebinarComponent } from './webinar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Module } from '../component/module';
import { WebinarFormFieldComponent } from '../component/webinar-form-field/webinar-form-field.component';

const routes: Routes = [
  {
    path: '',
    component: WebinarComponent,
  }
];

@NgModule({
  declarations: [
    WebinarFormFieldComponent,
    WebinarComponent
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
export class WebinarModule { }
