import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mx-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="page-header" [class.bordered]="bordered">
      <div class="text">
        <p *ngIf="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="actions"><ng-content></ng-content></div>
    </header>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: var(--mx-space-5, 24px);
        font-family: var(--mx-font, inherit);
      }
      .bordered {
        padding-bottom: 16px;
        border-bottom: 1px solid var(--mx-border);
      }
      .eyebrow {
        margin: 0 0 4px;
        color: var(--mx-primary);
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-size: clamp(1.4rem, 2vw, 1.75rem);
        color: var(--mx-text);
        font-family: var(--mx-font-display, var(--mx-font));
      }
      .subtitle {
        margin: 6px 0 0;
        color: var(--mx-text-muted);
        max-width: 60ch;
      }
      .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }

      /*
       * Systematic header actions (website pattern):
       * 1st mx-button → filled primary (white text)
       * following mx-buttons → transparent outline
       * Works even when consumers pass variant="outline" on all.
       */
      .actions ::ng-deep mx-button:first-of-type .mx-btn {
        min-width: 8.5rem;
        height: 36px;
        box-sizing: border-box;
        background-color: var(--mx-primary) !important;
        color: var(--mx-primary-contrast, #fff) !important;
        border-color: color-mix(in srgb, var(--mx-primary) 65%, #000) !important;
      }
      .actions ::ng-deep mx-button:first-of-type .mx-btn:hover:not(:disabled) {
        filter: brightness(1.06);
        border-color: color-mix(in srgb, var(--mx-primary) 55%, #000) !important;
      }
      .actions ::ng-deep mx-button:first-of-type .mx-btn:active:not(:disabled) {
        filter: brightness(0.94);
      }
      .actions ::ng-deep mx-button:not(:first-of-type) .mx-btn {
        min-width: 8.5rem;
        height: 36px;
        box-sizing: border-box;
        background-color: transparent !important;
        color: var(--mx-primary) !important;
        border-color: color-mix(in srgb, var(--mx-primary) 50%, #9aa0a6) !important;
        filter: none;
      }
      .actions ::ng-deep mx-button:not(:first-of-type) .mx-btn:hover:not(:disabled) {
        background-color: color-mix(in srgb, var(--mx-primary) 8%, transparent) !important;
        border-color: var(--mx-primary) !important;
        filter: none;
      }
    `,
  ],
})
export class MxPageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
  @Input() eyebrow = '';
  @Input() bordered = true;
}
