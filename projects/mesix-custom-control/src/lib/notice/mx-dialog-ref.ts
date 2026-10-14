import { InjectionToken, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** Data passed into a component opened via MxNoticeService.open(). */
export const MX_DIALOG_DATA = new InjectionToken<unknown>('MX_DIALOG_DATA');

export interface MxOpenDialogConfig {
  data?: unknown;
  /** When true, backdrop click does not close the dialog. */
  disableClose?: boolean;
}

export interface MxContentDialogState {
  id: number;
  component: Type<unknown>;
  data: unknown;
  ref: MxDialogRef<unknown>;
  disableClose: boolean;
}

/** Handle returned from MxNoticeService.open() — mirrors MatDialogRef close API. */
export class MxDialogRef<T = any> {
  private readonly closedSubject = new Subject<T | undefined>();
  private settled = false;

  constructor(private readonly onDismiss: () => void) {}

  afterClosed(): Observable<T | undefined> {
    return this.closedSubject.asObservable();
  }

  close(result?: T): void {
    if (this.settled) return;
    this.settled = true;
    this.onDismiss();
    this.closedSubject.next(result);
    this.closedSubject.complete();
  }
}
