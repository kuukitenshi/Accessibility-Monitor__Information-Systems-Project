import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Webpage } from '../webpage';
import { MatSelectionListChange } from '@angular/material/list';


@Component({
  selector: 'app-evaluation-dialog',
  templateUrl: './evaluation-dialog.component.html',
  styleUrls: ['./evaluation-dialog.component.scss']
})
export class EvaluationDialogComponent {

  searchTerm: string = '';
  selectedWebpages: Webpage[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { webpages: Webpage[] },
    public dialogRef: MatDialogRef<EvaluationDialogComponent>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectionChange(event: MatSelectionListChange): void {
    for (const option of event.options) {
      const webpage: Webpage = option.value;
      if (option.selected)
        this.selectedWebpages.push(webpage);
      else
        this.selectedWebpages = this.selectedWebpages.filter(w => w._id !== webpage._id);
    }
  }

  select(): void {
    if (this.selectedWebpages.length !== this.data.webpages.length) {
      this.selectedWebpages = this.data.webpages.slice();
    } else {
      this.selectedWebpages = [];
    }
  }
  
  filteredWebpages(): Webpage[] {
    if (this.searchTerm) {
      return this.data.webpages.filter(webpage => webpage.url.includes(this.searchTerm));
    } else {
      return this.data.webpages;
    }
  }
}
