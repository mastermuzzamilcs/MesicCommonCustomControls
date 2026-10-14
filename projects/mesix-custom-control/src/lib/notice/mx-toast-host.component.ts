import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MxNoticeService, MxNoticeType } from './mx-notice.service';

@Component({
  selector: 'mx-toast-host',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="toast-stack" [class.left]="position === 'top-left'" [class.center]="position === 'top-center'" aria-live="polite">
      <article *ngFor="let toast of notice.toasts$ | async" class="toast" [ngClass]="toast.type">
        <mat-icon aria-hidden="true">{{ iconFor(toast.type) }}</mat-icon>
        <p>{{ toast.message }}</p>
        <button type="button" class="close" (click)="notice.dismissToast(toast.id)" aria-label="Dismiss">
          <mat-icon>close</mat-icon>
        </button>
      </article>
    </div>
  `,
  styles: [
    `
      .toast-stack {
        position: fixed;
        top: var(--mx-space-4, 16px);
        right: var(--mx-space-4, 16px);
        z-index: var(--mx-z-toast, 10050);
        display: flex;
        flex-direction: column;
        gap: var(--mx-space-2, 8px);
        width: min(360px, calc(100vw - 32px));
        pointer-events: none;
      }
      .toast-stack.left {
        right: auto;
        left: var(--mx-space-4, 16px);
      }
      .toast-stack.center {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
      }
      .toast {
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 12px 12px 14px;
        border-radius: var(--mx-radius, 10px);
        border: 1px solid transparent;
        box-shadow: var(--mx-shadow);
        background: var(--mx-surface, #fff);
        font-family: var(--mx-font, inherit);
        animation: mx-toast-in var(--mx-motion, 200ms) var(--mx-ease, ease);
      }
      .toast p {
        margin: 2px 0 0;
        flex: 1;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }
      .toast.success {
        background: var(--mx-success-bg);
        border-color: var(--mx-success-border);
        color: var(--mx-success);
      }
      .toast.warning {
        background: var(--mx-warning-bg);
        border-color: var(--mx-warning-border);
        color: var(--mx-warning);
      }
      .toast.error {
        background: var(--mx-error-bg);
        border-color: var(--mx-error-border);
        color: var(--mx-warn);
      }
      .toast.info {
        background: color-mix(in srgb, var(--mx-primary) 10%, white);
        border-color: color-mix(in srgb, var(--mx-primary) 30%, white);
        color: var(--mx-primary);
      }
      .close {
        border: 0;
        background: transparent;
        color: inherit;
        padding: 0;
        cursor: pointer;
        line-height: 0;
      }
      @keyframes mx-toast-in {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
    `,
  ],
})
export class MxToastHostComponent {
  /** Where toasts appear */
  @Input() position: 'top-right' | 'top-left' | 'top-center' = 'top-right';

  constructor(public notice: MxNoticeService) {}

  iconFor(type: MxNoticeType): string {
    if (type === 'success') return 'check_circle';
    if (type === 'warning') return 'warning';
    if (type === 'info') return 'info';
    return 'error';
  }
}
