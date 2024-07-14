import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-check-remove-web',
  templateUrl: './check-remove-web.component.html',
  styleUrls: ['./check-remove-web.component.scss']
})
export class CheckRemoveWebComponent {

  btnOk: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string, type: string},
    public dialogRef: MatDialogRef<CheckRemoveWebComponent>
  ) {}

  onClick(): void {
    this.dialogRef.close(this.btnOk);
  }
}
