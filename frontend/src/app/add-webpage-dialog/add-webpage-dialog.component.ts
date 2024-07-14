import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Website } from '../website';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-webpage-dialog',
  templateUrl: './add-webpage-dialog.component.html',
  styleUrls: ['./add-webpage-dialog.component.scss']
})
export class AddWebpageDialogComponent {

  inputUrl?: string;
  fileName?: string;
  urlFormControl = new FormControl('', [Validators.required, this.invalidUrl()]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { website: Website},
    public dialogRef: MatDialogRef<AddWebpageDialogComponent>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  invalidUrl(): ValidatorFn {
    const website = this.data.website;
    return (control: AbstractControl): ValidationErrors | null => {
      let valid: boolean = false;
      let errorObj = { value: '', errorMessage: '' };
      if (control.value) {
        valid = control.value.indexOf(' ') < 0;
        if (valid) {
          try {
            const url = new URL(control.value);
            const validProtocol = url.protocol === 'http:' || url.protocol === 'https:';
            const validOrigin = url.origin === website.url;
            valid = validProtocol && validOrigin;
            if (!validProtocol) {
              errorObj.errorMessage = 'The URL protocol must be either http or https!';
            } else if (!validOrigin) {
              errorObj.errorMessage = `URL must be from ${website.url}!`;
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
}