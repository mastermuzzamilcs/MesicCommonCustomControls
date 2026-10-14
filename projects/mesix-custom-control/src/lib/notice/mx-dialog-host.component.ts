import {
  Component,
  DestroyRef,
  Injector,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  MxContentDialogState,
  MxDialogItem,
  MxNoticeService,
  MxNoticeType,
} from './mx-notice.service';
import { MX_DIALOG_DATA, MxDialogRef } from './mx-dialog-ref';

@Component({
  selector: 'mx-dialog-host',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NgComponentOutlet],
  template: `
    <div class="backdrop" *ngIf="notice.dialog$ | async as dialog" (click)="notice.cancelDialog()">
      <section
        class="panel"
        [ngClass]="dialog.type"
        [class.compact]="dialog.size === 'compact'"
        [class.wide]="dialog.size === 'wide'"
        [style.width]="dialog.width || null"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'mx-notice-title-' + dialog.id"
        (click)="$event.stopPropagation()"
      >
        <header>
          <mat-icon aria-hidden="true">{{ iconFor(dialog.type) }}</mat-icon>
          <h2 [id]="'mx-notice-title-' + dialog.id">{{ dialog.title }}</h2>
        </header>
        <p class="message">{{ dialog.message }}</p>
        <label class="field" *ngIf="dialog.input as input">
          <span>{{ input.label }}</span>
          <textarea
            *ngIf="input.multiline; else singleLine"
            [(ngModel)]="draft"
            rows="4"
            [placeholder]="input.placeholder || ''"
          ></textarea>
          <ng-template #singleLine>
            <input
              [(ngModel)]="draft"
              [placeholder]="input.placeholder || ''"
              [attr.aria-required]="input.required || null"
            />
          </ng-template>
        </label>
        <footer>
          <button *ngIf="dialog.showCancel" type="button" class="ghost" (click)="notice.cancelDialog()">
            {{ dialog.cancelText }}
          </button>
          <button type="button" class="confirm" [disabled]="confirmDisabled(dialog)" (click)="confirm(dialog)">
            {{ dialog.confirmText }}
          </button>
        </footer>
      </section>
    </div>

    <div
      class="backdrop"
      *ngFor="let active of contentDialogs; let i = index"
      [style.zIndex]="10000 + i"
      (click)="onContentBackdrop(active)"
    >
      <section
        class="panel content-panel"
        role="dialog"
        aria-modal="true"
        (click)="$event.stopPropagation()"
      >
        <ng-container
          *ngComponentOutlet="active.component; injector: injectorFor(active)"
        />
      </section>
    </div>
  `,
  styles: [
    `
      .backdrop {
        position: fixed;
        inset: 0;
        z-index: var(--mx-z-dialog, 10000);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--mx-space-5, 24px);
        background: var(--mx-overlay, rgba(0, 0, 0, 0.45));
      }
      .panel {
        width: fit-content;
        min-width: 280px;
        max-width: min(96vw, 1200px);
        max-height: 80vh;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 20px 22px;
        border-radius: var(--mx-radius-lg, 14px);
        background: var(--mx-surface, #fff);
        color: var(--mx-text, #101828);
        box-shadow: var(--mx-shadow-lg);
        font-family: var(--mx-font, inherit);
        animation: mx-dialog-in var(--mx-motion, 200ms) var(--mx-ease, ease);
        box-sizing: border-box;
      }
      .panel.content-panel {
        min-width: min(480px, 92vw);
      }
      .panel.compact {
        max-width: min(360px, 92vw);
      }
      .panel.wide {
        width: fit-content;
        max-width: min(96vw, 1200px);
      }
      header {
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }
      h2 {
        margin: 2px 0 0;
        font-size: 1.2rem;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }
      .message {
        margin: 12px 0 0;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.5;
        color: var(--mx-text-muted, inherit);
      }
      .panel.success header {
        color: var(--mx-success);
      }
      .panel.warning header {
        color: var(--mx-warning);
      }
      .panel.error header {
        color: var(--mx-warn);
      }
      .panel.info header {
        color: var(--mx-primary);
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 16px;
      }
      .field input,
      .field textarea {
        width: 100%;
        min-width: 240px;
        box-sizing: border-box;
        border: 1px solid var(--mx-border);
        border-radius: calc(var(--mx-radius, 10px) - 2px);
        padding: 10px 12px;
        font: inherit;
        background: var(--mx-surface);
        color: var(--mx-text);
        resize: vertical;
      }
      footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 18px;
      }
      button {
        border-radius: 20px;
        padding: 8px 18px;
        font: inherit;
        font-weight: 500;
        cursor: pointer;
        min-height: 36px;
        border: 1px solid var(--mx-border);
        box-sizing: border-box;
      }
      .ghost {
        border-color: var(--mx-border);
        background: transparent;
        color: var(--mx-primary);
      }
      .ghost:hover {
        background: color-mix(in srgb, var(--mx-primary) 8%, transparent);
        border-color: color-mix(in srgb, var(--mx-primary) 45%, var(--mx-border));
      }
      .confirm {
        border-color: var(--mx-primary);
        color: var(--mx-primary-contrast, #fff);
        background: var(--mx-primary);
      }
      .confirm:hover:not(:disabled) {
        filter: brightness(1.06);
        border-color: var(--mx-primary);
      }
      .confirm:disabled {
        border-color: var(--mx-border);
      }
      .panel.success .confirm {
        background: var(--mx-success);
      }
      .panel.warning .confirm {
        background: var(--mx-warning);
      }
      .panel.error .confirm {
        background: var(--mx-warn);
      }
      .confirm:disabled {
        opacity: 0.5;
        cursor: default;
      }
      @keyframes mx-dialog-in {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
    `,
  ],
})
export class MxDialogHostComponent {
  draft = '';
  contentDialogs: MxContentDialogState[] = [];

  private draftDialogId: number | null = null;
  private readonly destroyRef = inject(DestroyRef);
  private readonly parentInjector = inject(Injector);
  private readonly injectors = new Map<number, Injector>();

  constructor(public notice: MxNoticeService) {
    this.notice.dialog$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((dialog) => {
      const id = dialog?.id ?? null;
      if (id !== this.draftDialogId) {
        this.draftDialogId = id;
        this.draft = '';
      }
    });

    this.notice.contentDialogs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((list) => {
      const activeIds = new Set(list.map((item) => item.id));
      for (const id of [...this.injectors.keys()]) {
        if (!activeIds.has(id)) this.injectors.delete(id);
      }
      this.contentDialogs = list;
    });
  }

  injectorFor(state: MxContentDialogState): Injector {
    let injector = this.injectors.get(state.id);
    if (!injector) {
      injector = Injector.create({
        providers: [
          { provide: MxDialogRef, useValue: state.ref },
          { provide: MX_DIALOG_DATA, useValue: state.data },
        ],
        parent: this.parentInjector,
      });
      this.injectors.set(state.id, injector);
    }
    return injector;
  }

  iconFor(type: MxNoticeType): string {
    if (type === 'success') return 'check_circle';
    if (type === 'warning') return 'warning';
    if (type === 'info') return 'info';
    return 'error';
  }

  confirmDisabled(dialog: MxDialogItem): boolean {
    return !!dialog.input?.required && !this.draft.trim();
  }

  confirm(dialog: MxDialogItem): void {
    if (this.confirmDisabled(dialog)) return;
    this.notice.confirmDialog(dialog.input ? this.draft.trim() : undefined);
  }

  onContentBackdrop(state: MxContentDialogState): void {
    if (state.disableClose) return;
    state.ref.close(undefined);
  }
}
