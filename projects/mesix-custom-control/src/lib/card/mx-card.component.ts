import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MxControlSize } from '../shared/mx-control.types';

@Component({
  selector: 'mx-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card" [ngClass]="[padding, elevation]" [class.clickable]="clickable">
      <header *ngIf="title || subtitle" class="head">
        <div>
          <h3 *ngIf="title">{{ title }}</h3>
          <p *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="actions"><ng-content select="[mxCardActions]"></ng-content></div>
      </header>
      <div class="body"><ng-content></ng-content></div>
      <footer *ngIf="hasFooter" class="foot"><ng-content select="[mxCardFooter]"></ng-content></footer>
    </section>
  `,
  styles: [
    `
      .card {
        background: var(--mx-surface);
        color: var(--mx-text);
        border: 1px solid var(--mx-border);
        border-radius: var(--mx-radius-lg, 14px);
        font-family: var(--mx-font, inherit);
      }
      .elevated {
        box-shadow: var(--mx-shadow);
        border-color: transparent;
      }
      .flat {
        box-shadow: none;
      }
      .clickable {
        cursor: pointer;
        transition: box-shadow var(--mx-motion-fast) var(--mx-ease);
      }
      .clickable:hover {
        box-shadow: var(--mx-shadow-lg);
      }
      .sm {
        padding: var(--mx-space-3, 12px);
      }
      .md {
        padding: var(--mx-space-4, 16px);
      }
      .lg {
        padding: var(--mx-space-5, 24px);
      }
      .head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }
      h3 {
        margin: 0;
        font-size: 1.05rem;
      }
      p {
        margin: 4px 0 0;
        color: var(--mx-text-muted);
        font-size: 0.875rem;
      }
      .foot {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--mx-border);
      }
    `,
  ],
})
export class MxCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() padding: MxControlSize = 'md';
  @Input() elevation: 'flat' | 'elevated' = 'elevated';
  @Input() clickable = false;
  @Input() hasFooter = false;
}
