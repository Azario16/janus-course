import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormFieldComponent } from "./form-field/form-field.component";
import { RecordPlayComponent } from "./recordplay/recordplay.component";
import { RoomOptionsComponent } from "./videoroom/room-options.component";
import { WebinarFormFieldComponent } from "./webinar-form-field/webinar-form-field.component";

@NgModule({
  declarations: [
    RecordPlayComponent,
    FormFieldComponent
  ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [FormFieldComponent]
})

export class Module {}

