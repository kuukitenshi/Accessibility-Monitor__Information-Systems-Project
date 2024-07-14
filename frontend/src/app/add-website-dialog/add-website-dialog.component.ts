import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-add-website-dialog',
  templateUrl: './add-website-dialog.component.html',
  styleUrls: ['./add-website-dialog.component.scss']
})
export class AddWebsiteDialogComponent {

  inputUrl?: string;
  urlFormControl = new FormControl('', [Validators.required, this.invalidUrl]);

  constructor(
    public dialogRef: MatDialogRef<AddWebsiteDialogComponent>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  invalidUrl(control: AbstractControl): ValidationErrors | null {
    let valid: boolean = false;
    let errorObj = { value: '', errorMessage: '' };
    if (control.value) {
      valid = control.value.indexOf(' ') < 0;
      if (valid) {
        try {
          const url = new URL(control.value);
          valid = url.protocol === 'http:' || url.protocol === 'https:';
          if (!valid) {
            errorObj.errorMessage = 'The URL protocol must be either http or https!';
          }
        } catch {
          valid = false;
          errorObj.errorMessage = 'URL must contain the http or https protocol!';
        }
      } else {
        errorObj.errorMessage = 'URL cannot contain white spaces!';
      }
    }
    errorObj.value = control.value;
    return !valid ? { invalidUrl: errorObj } : null;
  }
}
