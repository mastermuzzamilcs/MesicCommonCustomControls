import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MxTableSkeletonComponent } from '../table-skeleton/mx-table-skeleton.component';

/**
 * Drive-style data grid shell.
 * Set `showFilter` to offer a search field that filters across projected table content
 * (consumers typically bind filterChange to MatTableDataSource.filter).
 * Set `loading` to show an in-grid table skeleton without destroying projected content.
 */
@Component({
  selector: 'mx-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MxTableSkeletonComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="mx-grid" [class.elevated]="elevated" [class.is-loading]="loading">
      <div class="toolbar" *ngIf="showFilter || hasToolbar">
        <label class="filter" *ngIf="showFilter">
          <mat-icon class="search-icon" aria-hidden="true">search</mat-icon>
          <input
            type="search"
            [placeholder]="filterPlaceholder"
            [ngModel]="filter"
            (ngModelChange)="onFilter($event)"
            [attr.aria-label]="filterPlaceholder"
            [disabled]="loading"
          />
        </label>
        <div class="toolbar-actions" *ngIf="hasToolbar">
          <ng-content select="[mxGridActions]"></ng-content>
        </div>
      </div>
      <div class="body">
        <mx-table-skeleton
          *ngIf="loading"
          [columns]="skeletonColumns"
          [rows]="skeletonRows"
          [columnWidths]="skeletonColumnWidths"
        ></mx-table-skeleton>
        <div class="body-content" [class.is-loading]="loading" [attr.aria-hidden]="loading ? true : null">
          <ng-content></ng-content>
        </div>
      </div>
      <footer class="footer" *ngIf="hasFooter">
        <ng-content select="[mxGridFooter]"></ng-content>
      </footer>
    </section>
  `,
  styles: [
    `
      mx-grid .mx-grid {
        display: flex;
        flex-direction: column;
        background: var(--mx-surface, #fff);
        border: 1px solid var(--mx-border);
        border-radius: var(--mx-radius-lg, 12px);
        overflow: hidden;
        font-family: var(--mx-font, inherit);
      }
      mx-grid .mx-grid.elevated {
        border-color: transparent;
        box-shadow: var(--mx-shadow);
      }
      mx-grid .toolbar {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        padding: 12px 16px;
        border-bottom: 1px solid var(--mx-border);
        background: var(--mx-surface);
      }
      mx-grid .filter {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1 1 220px;
        min-width: 180px;
        max-width: 420px;
        height: 40px;
        padding: 0 16px 0 14px;
        border-radius: 24px;
        background: color-mix(in srgb, var(--mx-text) 6%, var(--mx-bg));
        border: 1px solid transparent;
        transition:
          background var(--mx-motion-fast, 100ms) var(--mx-ease, ease),
          border-color var(--mx-motion-fast, 100ms) var(--mx-ease, ease),
          box-shadow var(--mx-motion-fast, 100ms) var(--mx-ease, ease);
      }
      mx-grid .filter:focus-within {
        background: var(--mx-surface);
        border-color: var(--mx-primary);
        box-shadow: 0 0 0 3px var(--mx-focus-ring);
      }
      mx-grid .search-icon {
        color: var(--mx-text-muted);
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      mx-grid .filter input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        box-shadow: none;
        background: transparent;
        color: var(--mx-text);
        font: inherit;
        font-size: 0.875rem;
        -webkit-appearance: none;
        appearance: none;
      }
      /* Outer focus is on .filter:focus-within only — no inner rectangular ring */
      mx-grid .filter input:focus,
      mx-grid .filter input:focus-visible,
      mx-grid .filter input[type='search']:focus,
      mx-grid .filter input[type='search']:focus-visible {
        border: 0 !important;
        outline: none !important;
        box-shadow: none !important;
      }
      mx-grid .filter input::placeholder {
        color: var(--mx-text-muted);
      }
      mx-grid .filter input:disabled {
        cursor: default;
        opacity: 0.7;
      }
      mx-grid .toolbar-actions {
        display: flex;
        gap: 8px;
        margin-left: auto;
        align-items: center;
      }
      mx-grid .body {
        overflow: auto;
        position: relative;
        min-height: 120px;
      }
      mx-grid .body-content.is-loading {
        display: none;
      }
      mx-grid .body table.mat-mdc-table,
      mx-grid .body table[mat-table] {
        width: 100%;
        background: transparent;
      }
      mx-grid .body .mat-mdc-header-row,
      mx-grid .body tr[mat-header-row] {
        background: color-mix(in srgb, var(--mx-primary) 16%, var(--mx-surface)) !important;
      }
      mx-grid .body .mat-mdc-row {
        background: transparent;
      }
      mx-grid .body .mat-mdc-header-cell,
      mx-grid .body th[mat-header-cell] {
        background: color-mix(in srgb, var(--mx-primary) 16%, var(--mx-surface)) !important;
        color: var(--mx-primary) !important;
        font-size: 0.875rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        border-bottom: 1px solid color-mix(in srgb, var(--mx-primary) 28%, var(--mx-border)) !important;
      }
      mx-grid .body .mat-sort-header-arrow,
      mx-grid .body .mat-sort-header-arrow .mat-sort-header-stem,
      mx-grid .body .mat-sort-header-arrow .mat-sort-header-head {
        color: var(--mx-primary) !important;
      }
      mx-grid .body .mat-mdc-cell {
        color: var(--mx-text);
        border-bottom-color: var(--mx-border) !important;
      }
      mx-grid .body .mat-mdc-row:hover .mat-mdc-cell {
        background: color-mix(in srgb, var(--mx-primary) 6%, transparent);
      }
      mx-grid .footer {
        border-top: 1px solid var(--mx-border);
        padding: 4px 8px;
        background: var(--mx-surface);
      }
      mx-grid .footer .mat-mdc-paginator {
        background: transparent;
        color: var(--mx-text-muted);
      }
    `,
  ],
})
export class MxGridComponent {
  /** Show Drive-style search box that filters grid text. */
  @Input() showFilter = false;
  @Input() filterPlaceholder = 'Search';
  @Input() filter = '';
  @Input() elevated = true;
  @Input() hasToolbar = false;
  @Input() hasFooter = false;
  /** When true, shows `mx-table-skeleton` and hides projected table content. */
  @Input() loading = false;
  @Input() skeletonColumns = 5;
  @Input() skeletonRows = 6;
  @Input() skeletonColumnWidths: number[] | null = null;
  @Output() filterChange = new EventEmitter<string>();

  onFilter(value: string): void {
    this.filter = value;
    this.filterChange.emit(value);
  }
}
