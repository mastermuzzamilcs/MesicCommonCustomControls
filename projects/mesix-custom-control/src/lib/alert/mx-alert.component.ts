import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MxTone } from '../shared/mx-control.types';

@Component({
  selector: 'mx-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="alert" [ngClass]="tone" role="status">
      <mat-icon aria-hidden="true">{{ iconName }}</mat-icon>
      <div class="content">
        <strong *ngIf="title">{{ title }}</strong>
        <div><ng-content></ng-content></div>
      </div>
      <button *ngIf="dismissible" type="button" class="close" (click)="dismissed.emit()" aria-label="Dismiss">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .alert {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 12px 14px;
        border-radius: var(--mx-radius, 10px);
        border: 1px solid transparent;
        font-family: var(--mx-font, inherit);
      }
      .content {
        flex: 1;
        min-width: 0;
      }
      strong {
        display: block;
        margin-bottom: 2px;
      }
      .close {
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        line-height: 0;
        padding: 0;
      }
      .neutral,
      .info {
        background: color-mix(in srgb, var(--mx-primary) 10%, white);
        border-color: color-mix(in srgb, var(--mx-primary) 25%, white);
        color: var(--mx-primary);
      }
      .primary {
        background: color-mix(in srgb, var(--mx-primary) 12%, white);
        border-color: color-mix(in srgb, var(--mx-primary) 28%, white);
        color: var(--mx-primary);
      }
      .success {
        background: var(--mx-success-bg);
        border-color: var(--mx-success-border);
        color: var(--mx-success);
      }
      .warning {
        background: var(--mx-warning-bg);
        border-color: var(--mx-warning-border);
        color: var(--mx-warning);
      }
      .danger {
        background: var(--mx-error-bg);
        border-color: var(--mx-error-border);
        color: var(--mx-warn);
      }
    `,
  ],
})
export class MxAlertComponent {
  @Input() tone: MxTone = 'info';
  @Input() title = '';
  @Input() icon = '';
  @Input() dismissible = false;
  @Output() dismissed = new EventEmitter<void>();

  get iconName(): string {
    if (this.icon) return this.icon;
    if (this.tone === 'success') return 'check_circle';
    if (this.tone === 'warning') return 'warning';
    if (this.tone === 'danger') return 'error';
    return 'info';
  }
}
