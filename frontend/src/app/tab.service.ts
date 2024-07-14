import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  private index = new BehaviorSubject<number>(0);

  setIndex(index: number) {
    this.index.next(index);
  }

  getIndex() {
    return this.index.asObservable();
  }
}
