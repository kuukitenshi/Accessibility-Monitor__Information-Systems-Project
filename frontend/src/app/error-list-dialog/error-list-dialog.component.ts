import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evaluation } from '../evaluation';
import { CommonError, aggregateErrors } from '../report-processor';

@Component({
  selector: 'app-error-list-dialog',
  templateUrl: './error-list-dialog.component.html',
  styleUrls: ['./error-list-dialog.component.scss']
})
export class ErrorListDialogComponent {

  errors: CommonError[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { evaluations: Evaluation[]},
    private dialogRef: MatDialogRef<ErrorListDialogComponent>
  ) {
    const aggregatedErrors = aggregateErrors(this.data.evaluations.map(e => e.report));
    this.errors = aggregatedErrors.sort((e1, e2) => e2.count - e1.count).slice(0, 10);
   }

  close(): void {
    this.dialogRef.close();
  }

}
