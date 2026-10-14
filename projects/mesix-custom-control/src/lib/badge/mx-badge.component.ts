import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MxControlSize, MxTone } from '../shared/mx-control.types';

/** Drive-style status / role chips with readable contrast on light and dark. */
@Component({
  selector: 'mx-badge',
  standalone: true,
  imports: [CommonModule],
  template: ` <span class="badge" [ngClass]="[tone, size]" [class.pill]="pill"><ng-content></ng-content></span> `,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-family: var(--mx-font, inherit);
        font-weight: 500;
        line-height: 1.2;
        border: 1px solid var(--mx-border);
        white-space: nowrap;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sm {
        font-size: 0.6875rem;
        padding: 2px 8px;
        border-radius: 6px;
      }
      .md {
        font-size: 0.75rem;
        padding: 3px 10px;
        border-radius: 8px;
      }
      .lg {
        font-size: 0.8125rem;
        padding: 4px 12px;
        border-radius: 10px;
      }
      .pill {
        border-radius: var(--mx-radius-full, 999px);
      }
      .neutral {
        background: color-mix(in srgb, var(--mx-text) 8%, var(--mx-surface-elevated));
        color: var(--mx-text);
        border-color: var(--mx-border);
      }
      .primary,
      .info {
        background: color-mix(in srgb, var(--mx-primary) 16%, var(--mx-surface));
        color: var(--mx-primary);
        border-color: color-mix(in srgb, var(--mx-primary) 35%, var(--mx-border));
      }
      .success {
        background: var(--mx-success-bg);
        color: var(--mx-success);
        border-color: var(--mx-success-border);
      }
      .warning {
        background: var(--mx-warning-bg);
        color: color-mix(in srgb, var(--mx-warning) 70%, var(--mx-text));
        border-color: var(--mx-warning-border);
      }
      .danger {
        background: var(--mx-error-bg);
        color: var(--mx-warn);
        border-color: var(--mx-error-border);
      }
    `,
  ],
})
export class MxBadgeComponent {
  @Input() tone: MxTone = 'neutral';
  @Input() size: MxControlSize = 'md';
  @Input() pill = true;
}
