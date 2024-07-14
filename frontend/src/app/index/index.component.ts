import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { WebsitesComponent } from '../websites/websites.component';
import { TabService } from '../tab.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild('dashboard') dashboardComponent!: DashboardComponent;
  @ViewChild('websites') websitesComponent!: WebsitesComponent;
  index: number = 0;

  constructor(private tabService: TabService) { }

  ngOnInit() {
    this.tabService.getIndex().subscribe(index => {
      this.index = index;
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabService.setIndex(event.index);
    if (event.index === 0) {
      this.index = event.index;
      this.dashboardComponent.ngOnInit();
    } else if (event.index === 1) {
      this.index = event.index;

      this.websitesComponent.ngOnInit();
    }
  }

  ngAfterViewInit() {
    this.dashboardComponent.ngOnInit();
    this.websitesComponent.ngOnInit();
  }
}
