import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableDataService } from '../services/table-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  hotelForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private service: TableDataService,
    private dialog: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.hotelForm = this.builder.group({
      title: '',
      category: '',
      image: '',
      price: '',
      description: '',
    })
  }

  ngOnInit(): void {
    this.hotelForm.patchValue(this.data)
  }

  hotelRegistr() {
    if (this.hotelForm.valid) {
      if (this.data) {
        this.service.updateItem(this.data.id, this.hotelForm.value).subscribe({
          next: (val: any) => {
            this.dialog.close(true);
          },
          error: (err: any) => {
            console.log(err)
          }
        })
      } else {
        console.log(this.hotelForm.value)
        this.service.createItem(this.hotelForm.value).subscribe({
          next: (val: any) => {
            console.log('Hotel Registration Successfull', "Congratulations!!");
            this.dialog.close(true);

          },
          error: (err: any) => {
            console.log("some error occurred")
          }
        })
      }
    }

  }
}
