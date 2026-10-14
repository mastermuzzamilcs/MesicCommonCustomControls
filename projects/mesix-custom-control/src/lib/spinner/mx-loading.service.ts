import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MxLoadingService {
  private count = 0;
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.count += 1;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) this.loadingSubject.next(false);
  }

  reset(): void {
    this.count = 0;
    this.loadingSubject.next(false);
  }
}
