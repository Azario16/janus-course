import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WebinarAutoStartComponent } from './webinar-auto-start.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes: Routes = [
  {
    path: '',
    component: WebinarAutoStartComponent,
  },
];

@NgModule({
  declarations: [
    WebinarAutoStartComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class WebinarAutoStartModule { }
