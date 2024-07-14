import { Component, OnInit, HostListener } from '@angular/core';
import { Website } from '../website';
import { WebsiteService } from '../website.service';
import { WebpageService } from '../webpage.service';
import { Webpage } from '../webpage';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  websites: Website[] = [];
  allWebpages?: Webpage[];
  column: number = 5;

  constructor(
    private websiteService: WebsiteService,
    private webpageService: WebpageService
  ) { }

  ngOnInit(): void {
    this.getWebsites();
  }

  getWebsites(): void {
    this.websiteService.getWebsites().subscribe(websites => {
      const allWebpages: Webpage[] = [];
      this.websites = websites.sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()).slice(0, 5);
      const observables: Observable<Webpage[]>[] = [];
      websites.forEach(w => {
        observables.push(this.webpageService.getWebpages(w._id));
      })
      forkJoin(observables).subscribe(results => {
        this.allWebpages = [];
        results.forEach(pages => {
          pages.forEach(w => {
            this.allWebpages!.push(w);
          });
        });
      })
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 900) {
      this.column = 1;
    } else if (window.innerWidth < 1200) {
      this.column = 2;
    } else if (window.innerWidth < 1700) {
      this.column = 3;
    } else if (window.innerWidth < 1800) {
      this.column = 4;
    } else {
      this.column = 5;
    }
  }
}
