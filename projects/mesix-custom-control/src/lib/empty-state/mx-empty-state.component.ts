import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mx-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="empty" [class.compact]="compact">
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      <h3 *ngIf="title">{{ title }}</h3>
      <p *ngIf="description">{{ description }}</p>
      <div class="actions"><ng-content></ng-content></div>
    </div>
  `,
  styles: [
    `
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 8px;
        padding: var(--mx-space-6, 32px);
        color: var(--mx-text-muted);
        font-family: var(--mx-font, inherit);
      }
      .compact {
        padding: var(--mx-space-4, 16px);
      }
      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: var(--mx-primary);
        opacity: 0.85;
      }
      h3 {
        margin: 4px 0 0;
        color: var(--mx-text);
        font-size: 1.1rem;
      }
      p {
        margin: 0;
        max-width: 420px;
        line-height: 1.5;
      }
      .actions {
        margin-top: 8px;
      }
    `,
  ],
})
export class MxEmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() description = '';
  @Input() icon = 'inbox';
  @Input() compact = false;
}
