import { Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsiteService } from '../website.service';
import { Website } from '../website';
import { Webpage } from '../webpage';
import { Location } from '@angular/common';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddWebpageDialogComponent } from '../add-webpage-dialog/add-webpage-dialog.component';
import { CheckRemoveWebComponent } from '../check-remove-web/check-remove-web.component';
import { WebpageService } from '../webpage.service';
import { EvaluationDialogComponent } from '../evaluation-dialog/evaluation-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { Renderer2 } from '@angular/core';
import { ErrorListDialogComponent } from '../error-list-dialog/error-list-dialog.component';
import { ReportFileType, getFileTypeExtension } from '../report-file-type';
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-website-detail',
  templateUrl: './website-detail.component.html',
  styleUrls: ['./website-detail.component.scss']
})
export class WebsiteDetailComponent implements OnInit {

  ReportFileType = ReportFileType;

  website?: Website;
  webpages?: Webpage[];
  webpagesSelected: Webpage[] = [];
  column: number = 4;
  websiteId = String(this.route.snapshot.paramMap.get('id'));
  downloadingFile = false;

  @ViewChildren('checkboxes') checkboxes: QueryList<MatCheckbox> | undefined;
  @ViewChild('selectAllCheckbox') selectAllCheckbox: MatCheckbox | undefined;

  private snackBarCofig: MatSnackBarConfig<any> = {
    duration: 3000,
    verticalPosition: 'bottom'
  }

  constructor(
    private route: ActivatedRoute,
    private websiteService: WebsiteService,
    private snackBarService: MatSnackBar,
    private dialog: MatDialog,
    private location: Location,
    private webpageService: WebpageService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.getWebsite(this.websiteId);
    this.getWebpages(this.websiteId);
  }

  getWebsite(id: string): void {
    this.websiteService.getWebsite(id).subscribe(website => {
      this.website = website
    });
  }

  getWebpages(id: string): void {
    this.webpageService.getWebpages(id).subscribe(pages => {
      this.webpages = pages;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddWebpageDialogComponent, {
      data: {
        website: this.website
      },
    });
    dialogRef.afterClosed().subscribe(inputUrl => {
      if (inputUrl)
        this.addWebpage({ url: inputUrl, website: this.website } as Webpage);
    });
  }

  openEvalDialog(): void {
    const dialogRef = this.dialog.open(EvaluationDialogComponent, {
      data: {
        webpages: this.webpages
      },
    });
    dialogRef.afterClosed().subscribe(selectedWebpages => {
      console.log(selectedWebpages);
      if (selectedWebpages)
        this.evaluateWebpages(selectedWebpages);
    });
  }

  openErrorsDialog(): void {
    if (this.webpages) {
      this.dialog.open(ErrorListDialogComponent, { data: { evaluations: this.webpages.filter(w => w.evaluation).map(w => w.evaluation) } })
    }
  }

  addWebpage(webpage: Webpage): void {
    this.webpageService.addWebpage(webpage).subscribe(w => {
      this.webpages = [...this.webpages!, w];
      let url = webpage.url;
      if (url.length > 30) {
        url = url.substring(0, 30) + '...';
      }
      this.snackBarService.open(`Webpage ${url} has been added!`, 'Dismiss', this.snackBarCofig);
    });
  }

  evaluateWebpages(webpages: Webpage[]): void {
    this.website!.state = 'in evaluation';
    for (const webpage of webpages) {
      webpage.state = 'in evaluation';
    }
    const webpages_ids = webpages.map(w => w._id);
    this.websiteService.startEvaluation(this.website!, webpages_ids).subscribe(result => {
      this.website = result.website;
      if (this.webpages) {
        this.webpages = this.webpages.map(w => {
          const resultWebpage = result.webpages.find(r => r._id === w._id);
          return resultWebpage ? resultWebpage : w;
        })
      }
    });
  }

  updateWebsiteState(): void {
    this.webpageService.getWebpages(this.websiteId).subscribe(webpages => {
      if (webpages.length === 0) {
        this.website!.state = 'not evaluated';
        return;
      }
      for (const page of webpages) {
        if (page.state === 'error in evaluation') {
          this.website!.state = 'error in evaluation';
          return;
        }
        if (page.state === 'in evaluation') {
          this.website!.state = 'in evaluation';
          return;
        }
      }
      this.website!.state = 'evaluated';
    });
  }

  removeWebpage(webpage: Webpage): void {
    if (this.webpages) {
      this.webpages = this.webpages.filter(w => w._id !== webpage._id);
      this.webpageService.deleteWebpage(webpage).subscribe(_ => {
        this.websiteService.getWebsite(this.website!._id).subscribe(w => {
          this.website = w;
        });
        let url = webpage.url;
        if (url.length > 30) {
          url = url.substring(0, 30) + '...';
        }
        this.snackBarService.open(`Webpage ${url} has been removed!`, 'Dismiss', this.snackBarCofig);
      });
    }
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

  goBack(): void {
    this.location.back();
  }

  removeSelected(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CheckRemoveWebComponent, {
      data: {
        url: 'the selected webpages',
        type: 'Webpage'
      },
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe(btnOk => {
      if (btnOk) {
        for (const webpage of this.webpagesSelected) {
          this.removeWebpage(webpage);
        }
      }
      this.webpagesSelected = [];
      this.selectAllCheckbox!.checked = false;
      this.removeDisplayBox();
    });
    this.updateWebsiteState();
  }

  addToRemove(event: any, webpage: Webpage): void {
    if (event.checked) {
      this.webpagesSelected.push(webpage);
    } else {
      this.webpagesSelected = this.webpagesSelected.filter(w => w._id !== webpage._id);
    }
    if (this.webpagesSelected.length === 0) {
      this.selectAllCheckbox!.indeterminate = false;
      this.selectAllCheckbox!.checked = false;
      this.removeDisplayBox();
    } else if (this.webpagesSelected.length > 0 && this.webpages && this.webpagesSelected.length < this.webpages.length) {
      this.selectAllCheckbox!.indeterminate = true;
      this.selectAllCheckbox!.checked = false;
      this.showDisplayBox();
    } else if (this.webpagesSelected.length === this.webpagesSelected.length) {
      this.selectAllCheckbox!.checked = true;
      this.selectAllCheckbox!.indeterminate = false;
      this.showDisplayBox();
    }
  }

  isChecked(webpage: Webpage): boolean {
    for (const w of this.webpagesSelected) {
      if (w._id === webpage._id)
        return true;
    }
    return false;
  }

  selectAll(event: any): void {
    if (event.checked && this.webpages) {
      this.webpagesSelected = this.webpages;
      this.checkboxes!.forEach(checkbox => {
        checkbox.checked = true;
      });
    } else {
      this.webpagesSelected = [];
      this.checkboxes!.forEach(checkbox => {
        checkbox.checked = false;
      });
      this.removeDisplayBox();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', _ => {
      if (reader.result) {
        let addCount = 0;
        const links = (reader.result as string).split(/\r?\n/);
        for (const link of links) {
          try {
            const url = new URL(link);
            console.log(url.origin === this.website?.url);
            console.log(url.origin);
            console.log(this.website?.url);
            if ((url.protocol === 'http:' || url.protocol === 'https:') && url.origin === this.website?.url) {
              this.addWebpage({ url: link, website: this.website } as Webpage);
              addCount++;
            }
          } catch { }
        }
        if (addCount === 0) {
          this.snackBarService.open(`Couldn't add any webpage, please check the file format!`, 'Dismiss', this.snackBarCofig);
        }
      } else {
        this.snackBarService.open(`Couldn't read file ${file.name}`, 'Dismiss', this.snackBarCofig);
      }
    });
    reader.readAsText(file);
  }

  downloadFile(type: ReportFileType) : void {
    const fileName = 'report.' + getFileTypeExtension(type);
    this.downloadingFile = true;
    this.websiteService.downloadReport(this.website!, type).subscribe(blob => {
      saveAs(blob, fileName);
      this.downloadingFile = false;
      // sessionStorage.removeItem(this.website?._id!);
    });
  }

  showErrorButton() : boolean {
    return this.webpages?.some(w => w.evaluation !== undefined) ?? false;
    
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 950) {
      this.column = 1;
    } else if (window.innerWidth < 1370) {
      this.column = 2;
    } else if (window.innerWidth < 1800) {
      this.column = 3;
    } else {
      this.column = 4;
    }
  }

}
