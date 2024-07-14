import { Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Website } from '../website';
import { WebsiteService } from '../website.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'
import { AddWebsiteDialogComponent } from '../add-website-dialog/add-website-dialog.component';
import { SortingOption, ALL_SORTING_OPTIONS, CREATION_DATE_ASC } from '../website-sorting-options'
import { CheckRemoveWebComponent } from '../check-remove-web/check-remove-web.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.scss']
})
export class WebsitesComponent implements OnInit {

  loaded: boolean = false;
  websites: Website[] = [];
  websitesSelected: Website[] = [];
  column: number = 4;

  sortingOptions = ALL_SORTING_OPTIONS;
  possibleStateOptions = ['not evaluated', 'in evaluation', 'evaluated', 'error in evaluation'];
  sortingOption: SortingOption = CREATION_DATE_ASC;
  filterFunction: (w: Website) => boolean = () => true;

  @ViewChildren('checkboxes') checkboxes: QueryList<MatCheckbox> | undefined;
  @ViewChild('selectAllCheckbox') selectAllCheckbox: MatCheckbox | undefined;
  
  private snackBarCofig: MatSnackBarConfig<any> = {
    duration: 3000,
    verticalPosition: 'bottom'
  };

  constructor(
    private websiteService: WebsiteService,
    private snackBarService: MatSnackBar,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.websiteService.getWebsites().subscribe(websites => {
      this.websites = websites;
      this.loaded = true;
    });
  }

  addWebsite(website: Website): void {
    this.websiteService.addWebsite(website).subscribe(w => {
      this.websites.push(w);
      let url = website.url;
      if (url.length > 30) {
        url = url.substring(0, 30) + '...';
      }
      this.snackBarService.open(`Website ${url} has been added!`, 'Dismiss', this.snackBarCofig);
    });
  }
  
  applyStatusFilter(event: any): void {
    if (event.value === 'all') {
      this.filterFunction = () => true;
    } else {
      this.filterFunction = (w: Website) => w.state === event.value;
    }
  }
  
  applySorting(event: any): void {
    const selectedOption = this.sortingOptions.find(o => o.value === event.value);
    if (selectedOption)
      this.sortingOption = selectedOption;
  }
  
  openAddDialog() {
    const dialogRef = this.dialog.open(AddWebsiteDialogComponent);
    dialogRef.afterClosed().subscribe(inputUrl => {
      if (inputUrl) {
        const url = new URL(inputUrl);
        this.addWebsite({ url: url.origin } as Website);
      }
    });
  }
  
  removeWebsite(website: Website): void {
    this.websites = this.websites.filter(w => w._id !== website._id);
    this.websiteService.deleteWebsite(website).subscribe(w => {
      let url = website.url;
      if (url.length > 30) {
        url = url.substring(0, 30) + '...';
      }
    });
    this.snackBarService.open(`The selected websites have been removed!`, 'Dismiss', this.snackBarCofig)
  }

  showDisplayBox(): void { 
    if (!this.selectAllCheckbox!._elementRef.nativeElement.classList.contains('showBox')) {
      this.renderer.addClass(this.selectAllCheckbox!._elementRef.nativeElement, 'showBox');
    }
  }

  removeDisplayBox(): void {
    if (this.selectAllCheckbox!._elementRef.nativeElement.classList.contains('showBox')) {
      this.renderer.removeClass(this.selectAllCheckbox!._elementRef.nativeElement, 'showBox');
    }
  }

  removeSelected(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CheckRemoveWebComponent, {
      data: {
        url: 'the selected websites',
        type: 'Website'
      },
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe(btnOk => {
      if (btnOk) {
        for (const website of this.websitesSelected) {
          this.removeWebsite(website);
        }
      }
      this.websitesSelected = [];
      this.selectAllCheckbox!.checked = false;
      this.removeDisplayBox();
    });
  }

  addToRemove(event: any, website: Website): void {
    console.log(event);
    if (event.checked) {
      this.websitesSelected.push(website);
    }else {
      this.websitesSelected = this.websitesSelected.filter(w => w._id !== website._id);
    }
    if(this.websitesSelected.length === 0) {
      this.selectAllCheckbox!.indeterminate = false;
      this.selectAllCheckbox!.checked = false;
      this.removeDisplayBox();
    }else if(this.websitesSelected.length > 0 && this.websitesSelected.length < this.websites.length) {
      this.selectAllCheckbox!.indeterminate = true;
      this.selectAllCheckbox!.checked = false;
      this.showDisplayBox();
    }else if(this.websitesSelected.length === this.websites.length) {
      this.selectAllCheckbox!.checked = true;
      this.selectAllCheckbox!.indeterminate = false;
      this.showDisplayBox();
    }
  }

  isChecked(website: Website): boolean {
    for(const w of this.websitesSelected) {
      if(w._id === website._id)
        return true;
    }
    return false;
  }

  selectAll(event: any): void {
    console.log(event);
    if (event.checked) {
      this.websitesSelected = this.websites;
      this.checkboxes!.forEach(checkbox => {
        checkbox.checked = true;
      });
    }else {
      this.websitesSelected = [];
      this.checkboxes!.forEach(checkbox => {
        checkbox.checked = false;
      });
      this.removeDisplayBox();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', e => {
      if (reader.result) {
        let addCount = 0;
        const links = (reader.result as string).split(/\r?\n/);
        for (const link of links) {
          try {
            const url = new URL(link);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
              this.addWebsite({ url: url.origin } as Website);
              addCount++;
            }
          } catch { }
        }
        if (addCount === 0) {
          this.snackBarService.open(`Couldn't add any website, please check the file format!`, 'Dismiss', this.snackBarCofig);
        }
      } else {
        this.snackBarService.open(`Couldn't read file ${file.name}`, 'Dismiss', this.snackBarCofig);
      }
    });
    reader.readAsText(file);
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 950) {
      this.column = 1;
    } else if (window.innerWidth < 1300) {
      this.column = 2;
    } else if (window.innerWidth < 1740) {
      this.column = 3;
    } else {
      this.column = 4;
    }
  }
}
