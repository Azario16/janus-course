import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';

const routes: Route[] = [];

@NgModule({
  imports: [ReactiveFormsModule, CommonModule, MatToolbarModule, RouterModule.forChild(routes)],
  declarations: [ToolbarComponent],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
