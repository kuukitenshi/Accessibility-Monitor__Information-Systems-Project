import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebpageService } from '../webpage.service';
import { Webpage } from '../webpage';
import { Location } from '@angular/common';
import { AssertionLevel, TestResult, EvaluationAssertion, AssertionType, AssertionResult } from '../evaluation';

@Component({
  selector: 'app-webpage-details',
  templateUrl: './webpage-details.component.html',
  styleUrls: ['./webpage-details.component.scss']
})
export class WebpageDetailsComponent implements OnInit {

  Object = Object;
  TestResult = TestResult;
  AssertionLevel = AssertionLevel
  AssertionType = AssertionType;

  webpage?: Webpage;
  testSelected?: EvaluationAssertion;
  column = 4;
  levelMap = new Map();
  openedResults = new Set();

  assertionFilterFunc: (a: EvaluationAssertion) => boolean = _ => true;

  assertions: EvaluationAssertion[] = [];

  selectedType = 'all';
  selectedOutcome = 'all';
  selectedLevel = 'all';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private webpageService: WebpageService
  ) { }

  ngOnInit(): void {
    this.getWebpage();
    this.testSelected = undefined;
  }

  getWebpage(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.webpageService.getWebpage(id).subscribe(webpage => {
      this.webpage = webpage;
      if (webpage.evaluation) {
        const report = webpage.evaluation.report;
        for (const moduleName of Object.keys(report['modules'])) {
          const module = report['modules'][moduleName];
          for (const assertionName of Object.keys(module['assertions'])) {
            const assertion = module['assertions'][assertionName];
            const evalAssertion: EvaluationAssertion = {
              code: assertion['code'],
              description: assertion['description'],
              outcome: assertion['metadata']['outcome'],
              type: moduleName === 'act-rules' ? AssertionType.ACT : AssertionType.WCAG,
              levels: [],
              results: []
            };
            for (const criteria of assertion['metadata']['success-criteria']) {
              evalAssertion.levels.push(criteria['level']);
            }
            for (const result of assertion['results']) {
              const evalResult: AssertionResult = {
                verdict: result['verdict'],
                description: result['description'],
                code: result['resultCode'],
                elements: []
              };
              for (const element of result['elements']) {
                evalResult.elements.push({
                  htmlCode: element['htmlCode'],
                  pointer: element['pointer']
                })
              }
              evalAssertion.results.push(evalResult);
            }
            this.assertions.push(evalAssertion);
          }
        }
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  roundNumber(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  numTotalTests(): number {
    return this.assertions.length;
  }

  numSpecificTests(type: TestResult): number {
    return this.assertions.filter(a => a.outcome === type).length;
  }

  percentageSpecificTests(type: TestResult): number {
    const perc = this.roundNumber(this.numSpecificTests(type) / this.numTotalTests() * 100);
    return isNaN(perc) ? 0 : perc;
  }

  displayPercentageTest(type: TestResult): string {
    return this.numSpecificTests(type) + "/" + this.numTotalTests();
  }

  applyTypeFilter(event: any): void {
    this.selectedType = event.value;
    this.applyFilters();
  }

  applyOutcomeFilter(event: any): void {
    this.selectedOutcome = event.value;
    this.applyFilters();
  }

  applyLevelFilter(event: any): void {
    this.selectedLevel = event.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.assertionFilterFunc = a => {
      let valid = true;
      if (this.selectedType !== 'all')
        valid = valid && this.selectedType === a.type;
      if (this.selectedOutcome !== 'all')
        valid = valid && this.selectedOutcome === a.outcome;
      if (this.selectedLevel !== 'all')
        valid = valid && a.levels.includes(this.selectedLevel as AssertionLevel);
      return valid;
    };
  }

  setTestSelected(test: EvaluationAssertion): void {
    if (this.testSelected !== test)
      this.openedResults.clear();
    this.testSelected = test;
  }

  getLevels(): string {
    this.levelMap.clear();
    if (this.testSelected && this.testSelected.levels) {
      this.testSelected.levels.forEach(level => {
        let levelString = level as string;
        if (this.levelMap.has(levelString))
          this.levelMap.set(levelString, this.levelMap.get(levelString) + 1);
        else
          this.levelMap.set(levelString, 1);
      });
      let ret = "";
      this.levelMap.forEach((value, key) => {
        if (value > 0)
          ret += key + " (" + value + "), ";
      });
      ret = ret.slice(0, -2);
      return ret;
    }
    return "";
  }

  getColorVerdict(result: TestResult): string {
    if (result === TestResult.PASSED)
      return "#82e5c8";
    else if (result === TestResult.FAILED)
      return "rgb(230, 82, 102)";
    else if (result === TestResult.WARNING)
      return "#ffb700";
    else
      return "#adb5bd";
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
