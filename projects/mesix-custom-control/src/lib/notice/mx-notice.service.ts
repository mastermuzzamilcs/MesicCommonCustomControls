import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  MxContentDialogState,
  MxDialogRef,
  MxOpenDialogConfig,
} from './mx-dialog-ref';

export type MxNoticeType = 'success' | 'warning' | 'error' | 'info';
export type MxDialogSize = 'compact' | 'wide' | 'auto';
export type { MxContentDialogState, MxDialogRef, MxOpenDialogConfig } from './mx-dialog-ref';
export { MX_DIALOG_DATA } from './mx-dialog-ref';

export interface MxToastOptions {
  type: MxNoticeType;
  message: string;
  durationMs?: number;
  onClose?: () => void;
}

export interface MxDialogInputOptions {
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}

export interface MxDialogOptions {
  type: MxNoticeType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  input?: MxDialogInputOptions;
  size?: MxDialogSize;
  /** Extra CSS width, e.g. '480px' or '40rem' */
  width?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
}

export interface MxDialogResult {
  confirmed: boolean;
  value?: string;
}

export interface MxToastItem {
  id: number;
  type: MxNoticeType;
  message: string;
}

export interface MxDialogItem {
  id: number;
  type: MxNoticeType;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  showCancel: boolean;
  input?: MxDialogInputOptions;
  size?: MxDialogSize;
  width?: string;
}

@Injectable({ providedIn: 'root' })
export class MxNoticeService {
  private nextId = 0;
  private toastTimers = new Map<number, ReturnType<typeof setTimeout>>();
  private toastClosers = new Map<number, () => void>();
  private readonly toastsSubject = new BehaviorSubject<MxToastItem[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  private currentDialog: MxDialogItem | null = null;
  private readonly dialogQueue: MxDialogItem[] = [];
  private readonly dialogClosers = new Map<number, (result: MxDialogResult) => void>();
  private readonly dialogSubject = new BehaviorSubject<MxDialogItem | null>(null);
  readonly dialog$ = this.dialogSubject.asObservable();

  private readonly contentDialogsSubject = new BehaviorSubject<MxContentDialogState[]>([]);
  /** All open component dialogs (supports nesting). */
  readonly contentDialogs$ = this.contentDialogsSubject.asObservable();

  toast(options: MxToastOptions): Observable<void> {
    const result = new Subject<void>();
    const id = ++this.nextId;
    const item: MxToastItem = { id, type: options.type, message: options.message };

    const close = () => {
      if (!this.toastClosers.has(id)) return;
      this.toastClosers.delete(id);
      const timer = this.toastTimers.get(id);
      if (timer) clearTimeout(timer);
      this.toastTimers.delete(id);
      this.toastsSubject.next(this.toastsSubject.value.filter((toast) => toast.id !== id));
      options.onClose?.();
      result.next();
      result.complete();
    };

    this.toastClosers.set(id, close);
    this.toastsSubject.next([...this.toastsSubject.value, item]);
    this.toastTimers.set(id, setTimeout(close, options.durationMs ?? 4000));
    return result.asObservable();
  }

  dismissToast(id: number): void {
    this.toastClosers.get(id)?.();
  }

  /**
   * Open an Angular component inside the Mesix dialog shell (flexible width, no horizontal scroll).
   * Supports stacking for nested dialogs. Component should inject MxDialogRef + MX_DIALOG_DATA.
   */
  open<T, R = any>(component: Type<T>, config?: MxOpenDialogConfig): MxDialogRef<R> {
    const id = ++this.nextId;
    const ref = new MxDialogRef<R>(() => this.dismissContentDialog(id));
    const state: MxContentDialogState = {
      id,
      component: component as Type<unknown>,
      data: config?.data ?? null,
      ref: ref as MxDialogRef<unknown>,
      disableClose: !!config?.disableClose,
    };
    this.contentDialogsSubject.next([...this.contentDialogsSubject.value, state]);
    return ref;
  }

  dismissContentDialog(id?: number): void {
    const list = this.contentDialogsSubject.value;
    if (!list.length) return;
    if (id == null) {
      this.contentDialogsSubject.next([]);
      return;
    }
    this.contentDialogsSubject.next(list.filter((item) => item.id !== id));
  }

  dialog(options: MxDialogOptions): Observable<MxDialogResult> {
    const result = new Subject<MxDialogResult>();
    const id = ++this.nextId;
    const item: MxDialogItem = {
      id,
      type: options.type,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText ?? (options.type === 'success' || options.type === 'info' ? 'OK' : 'Confirm'),
      cancelText: options.cancelText ?? 'Cancel',
      showCancel: options.type === 'warning' || options.type === 'error' || !!options.cancelText,
      input: options.input,
      size: options.size ?? 'auto',
      width: options.width,
    };

    this.dialogClosers.set(id, (value) => {
      if (value.confirmed) {
        if (options.input) options.onConfirm?.(value.value ?? '');
        else options.onConfirm?.();
      } else {
        options.onCancel?.();
      }
      result.next(value);
      result.complete();
    });

    if (this.currentDialog) this.dialogQueue.push(item);
    else this.showDialog(item);

    return result.asObservable();
  }

  confirmDialog(value?: string): void {
    const current = this.currentDialog;
    if (!current) return;
    this.finishDialog(current.id, { confirmed: true, value });
  }

  cancelDialog(): void {
    const current = this.currentDialog;
    if (!current) return;
    this.finishDialog(current.id, { confirmed: false });
  }

  private showDialog(item: MxDialogItem): void {
    this.currentDialog = item;
    this.dialogSubject.next(item);
  }

  private finishDialog(id: number, value: MxDialogResult): void {
    const close = this.dialogClosers.get(id);
    this.dialogClosers.delete(id);
    close?.(value);
    this.currentDialog = null;
    this.dialogSubject.next(null);
    const next = this.dialogQueue.shift();
    if (next) this.showDialog(next);
  }
}
