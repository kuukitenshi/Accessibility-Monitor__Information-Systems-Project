import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Webpage } from '../webpage';

@Component({
  selector: 'app-circle-stats',
  templateUrl: './circle-stats.component.html',
  styleUrls: ['./circle-stats.component.scss']
})
export class CircleStatsComponent implements OnChanges {

  @Input() webpages?: Webpage[]
  percentages?: number[];
  totals?: number[];
  totalEvaluatedPages?: number;
  subtitles = ["No accessibility errors", "1+ error", "1+ error of A level", "1+ error of AA level", "1+ error of AAA level"]
  strokeColors = ["#358f80"].concat(Array(4).fill("#b04654"));

  ngOnChanges(changes: SimpleChanges): void {
    console.log('circle-stats changes called');
    this.calculateValues();
  }
  
  private calculateValues(): void {
    if (this.webpages) {
      this.totalEvaluatedPages = this.webpages.filter(w => w.evaluation).length;
      this.totals = Array(5).fill(0);
      const reports = this.webpages.filter(w => w.evaluation).map(w => w.evaluation?.report);
      for (const report of reports) {
        if (report['metadata']['failed'] === 0) {
          this.totals[0]++;
          continue;
        } else {
          this.totals[1]++;
        }
        let hasA = false;
        let hasAA = false;
        let hasAAA = false;
        for (const moduleName of Object.keys(report['modules'])) {
          const module = report['modules'][moduleName];
          for (const assertionName of Object.keys(module['assertions'])) {
            const assertion = module['assertions'][assertionName];
            if (assertion['metadata']['outcome'] === 'failed') {
              for (const check of assertion['metadata']['success-criteria']) {
                if (check.level === 'A')
                  hasA = true;
                if (check.level === 'AA')
                  hasAA = true;
                if (check.level === 'AAA')
                  hasAAA = true;
              }
            }
          }
        }
        if (hasA)
          this.totals[2]++;
        if (hasAA)
          this.totals[3]++;
        if (hasAAA)
          this.totals[4]++;
      }
      this.percentages = this.totals.map(t => this.calculatePercentage(t, this.totalEvaluatedPages!));
    }
  }

  private calculatePercentage(count: number, total: number) {
    const percentage = this.roundNumber((count / total)  * 100);
    return isNaN(percentage) ? 0 : percentage;
  }

  private roundNumber(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

}
