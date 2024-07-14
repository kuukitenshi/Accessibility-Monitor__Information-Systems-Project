import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebsitesComponent } from './websites/websites.component';
import { WebsiteDetailComponent } from './website-detail/website-detail.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddWebsiteDialogComponent } from './add-website-dialog/add-website-dialog.component';
import { AddWebpageDialogComponent } from './add-webpage-dialog/add-webpage-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CheckRemoveWebComponent } from './check-remove-web/check-remove-web.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EvaluationDialogComponent } from './evaluation-dialog/evaluation-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ErrorListDialogComponent } from './error-list-dialog/error-list-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { WebpageDetailsComponent } from './webpage-details/webpage-details.component';
import { CircleStatsComponent } from './circle-stats/circle-stats.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    WebsitesComponent,
    WebsiteDetailComponent,
    IndexComponent,
    DashboardComponent,
    AddWebsiteDialogComponent,
    AddWebpageDialogComponent,
    CheckRemoveWebComponent,
    EvaluationDialogComponent,
    ErrorListDialogComponent,
    WebpageDetailsComponent,
    CircleStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatGridListModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    NgxChartsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      showInnerStroke: false,
      showUnits: false,
      titleColor: "#ffffff",
      subtitleFontSize: "15"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
