import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Placeholder table rows with shimmer bars for data-grid loading states.
 * Use standalone or via `mx-grid` `[loading]`.
 */
@Component({
  selector: 'mx-table-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="mx-table-skeleton"
      role="status"
      aria-live="polite"
      aria-busy="true"
      [attr.aria-label]="ariaLabel"
    >
      <div class="sk-header" *ngIf="showHeader">
        <span
          class="sk-cell"
          *ngFor="let w of widths; let i = index"
          [style.flex]="flexFor(w)"
          [style.max-width.%]="w"
        >
          <span class="sk-bar sk-bar--header"></span>
        </span>
      </div>
      <div class="sk-row" *ngFor="let _ of rowSlots">
        <span
          class="sk-cell"
          *ngFor="let w of widths; let i = index"
          [style.flex]="flexFor(w)"
          [style.max-width.%]="w"
        >
          <span
            class="sk-bar"
            [style.width.%]="barWidth(i)"
            [style.animation-delay.ms]="delayFor(i)"
          ></span>
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .mx-table-skeleton {
        width: 100%;
        font-family: var(--mx-font, inherit);
      }
      .sk-header,
      .sk-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0 16px;
        min-height: 52px;
        box-sizing: border-box;
      }
      .sk-header {
        min-height: 48px;
        background: color-mix(in srgb, var(--mx-primary, #0b5fff) 16%, var(--mx-surface, #fff));
        border-bottom: 1px solid
          color-mix(in srgb, var(--mx-primary, #0b5fff) 28%, var(--mx-border, rgba(0, 0, 0, 0.08)));
      }
      .sk-row {
        border-bottom: 1px solid var(--mx-border, rgba(0, 0, 0, 0.08));
      }
      .sk-row:last-child {
        border-bottom: 0;
      }
      .sk-cell {
        flex: 1 1 0;
        min-width: 0;
        display: flex;
        align-items: center;
      }
      .sk-bar {
        display: block;
        height: 12px;
        border-radius: 6px;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--mx-text, #101828) 8%, var(--mx-surface, #fff)) 0%,
          color-mix(in srgb, var(--mx-text, #101828) 14%, var(--mx-surface, #fff)) 45%,
          color-mix(in srgb, var(--mx-text, #101828) 8%, var(--mx-surface, #fff)) 100%
        );
        background-size: 200% 100%;
        animation: mx-sk-shimmer 1.35s ease-in-out infinite;
      }
      .sk-bar--header {
        height: 10px;
        width: 56%;
        opacity: 0.9;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--mx-primary, #0b5fff) 22%, var(--mx-surface, #fff)) 0%,
          color-mix(in srgb, var(--mx-primary, #0b5fff) 34%, var(--mx-surface, #fff)) 45%,
          color-mix(in srgb, var(--mx-primary, #0b5fff) 22%, var(--mx-surface, #fff)) 100%
        );
        background-size: 200% 100%;
      }
      @keyframes mx-sk-shimmer {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: -100% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .sk-bar {
          animation: none;
        }
      }
    `,
  ],
})
export class MxTableSkeletonComponent implements OnInit, OnChanges {
  /** Number of columns (ignored when `columnWidths` is set). */
  @Input() columns = 5;
  /** Placeholder row count. */
  @Input() rows = 6;
  /** Optional per-column flex share / max width percentages. */
  @Input() columnWidths: number[] | null = null;
  @Input() showHeader = true;
  @Input() ariaLabel = 'Loading table';

  widths: number[] = [];
  rowSlots: number[] = [];

  ngOnInit(): void {
    this.syncSlots();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.syncSlots();
  }

  flexFor(width: number): string {
    return `${width} 1 0`;
  }

  barWidth(colIndex: number): number {
    const pattern = [72, 58, 84, 46, 66, 52, 78];
    return pattern[colIndex % pattern.length];
  }

  delayFor(colIndex: number): number {
    return (colIndex % 5) * 80;
  }

  private syncSlots(): void {
    if (this.columnWidths?.length) {
      this.widths = [...this.columnWidths];
    } else {
      const count = Math.max(1, Math.floor(this.columns) || 1);
      const each = Math.floor(100 / count);
      this.widths = Array.from({ length: count }, () => each);
    }
    const rowCount = Math.max(1, Math.floor(this.rows) || 1);
    this.rowSlots = Array.from({ length: rowCount }, (_, i) => i);
  }
}
