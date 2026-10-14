import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MxLoadingService } from './mx-loading.service';

@Component({
  selector: 'mx-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="overlay" *ngIf="loading.loading$ | async" [class.local]="mode === 'local'">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <p *ngIf="label">{{ label }}</p>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background: var(--mx-overlay-light);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
        z-index: var(--mx-z-spinner, 9999);
      }
      .overlay.local {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      p {
        margin: 0;
        color: var(--mx-text);
        font-family: var(--mx-font, inherit);
      }
    `,
  ],
})
export class MxSpinnerComponent {
  /** fixed = full page, local = relative to positioned parent */
  @Input() mode: 'fixed' | 'local' = 'fixed';
  @Input() diameter = 50;
  @Input() label = '';

  constructor(public loading: MxLoadingService) {}
}
