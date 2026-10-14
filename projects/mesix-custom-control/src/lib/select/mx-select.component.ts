import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface MxSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Drive-style filled dropdown (no floating outline label). */
@Component({
  selector: 'mx-select',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MxSelectComponent),
      multi: true,
    },
  ],
  template: `
    <label class="mx-select" [class.disabled]="disabled" [class.block]="block">
      <span class="label" *ngIf="label">{{ label }}</span>
      <div class="control">
        <select
          [disabled]="disabled"
          [ngModel]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()"
          [attr.aria-label]="label || placeholder"
        >
          <option *ngIf="placeholder" value="" disabled>{{ placeholder }}</option>
          <option
            *ngFor="let opt of options"
            [value]="opt.value"
            [disabled]="!!opt.disabled"
          >
            {{ opt.label }}
          </option>
        </select>
        <mat-icon class="chevron" aria-hidden="true">expand_more</mat-icon>
      </div>
    </label>
  `,
  styles: [
    `
      .mx-select {
        display: inline-flex;
        flex-direction: column;
        gap: 6px;
        font-family: var(--mx-font, inherit);
        min-width: 160px;
      }
      .mx-select.block {
        display: flex;
        width: 100%;
      }
      .label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mx-text-muted);
        letter-spacing: 0.01em;
      }
      .control {
        position: relative;
        display: flex;
        align-items: center;
      }
      select {
        appearance: none;
        -webkit-appearance: none;
        width: 100%;
        height: 40px;
        padding: 0 36px 0 14px;
        border: 1px solid #9aa0a6;
        border-radius: 8px;
        background: color-mix(in srgb, var(--mx-text) 4%, var(--mx-surface));
        color: var(--mx-text);
        font: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition:
          background var(--mx-motion-fast, 100ms) var(--mx-ease, ease),
          border-color var(--mx-motion-fast, 100ms) var(--mx-ease, ease),
          box-shadow var(--mx-motion-fast, 100ms) var(--mx-ease, ease);
      }
      select:hover:not(:disabled) {
        background: color-mix(in srgb, var(--mx-text) 7%, var(--mx-surface));
        border-color: #5f6368;
      }
      select:focus {
        outline: none;
        background: var(--mx-surface);
        border-color: var(--mx-primary);
        box-shadow: 0 0 0 3px var(--mx-focus-ring);
      }
      select:disabled {
        opacity: 0.55;
        cursor: default;
        border-color: var(--mx-border);
      }
      select option {
        background: var(--mx-surface);
        color: var(--mx-text);
        font-weight: 500;
        padding: 10px 12px;
      }
      .chevron {
        position: absolute;
        right: 10px;
        pointer-events: none;
        color: var(--mx-text-muted);
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      select:focus + .chevron {
        color: var(--mx-primary);
      }
      .disabled {
        pointer-events: none;
      }
    `,
  ],
})
export class MxSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() options: MxSelectOption[] = [];
  @Input() disabled = false;
  @Input() block = false;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  private onChangeFn: (value: string) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(value: string): void {
    this.value = value;
    this.onChangeFn(value);
    this.valueChange.emit(value);
  }

  onTouched(): void {
    this.onTouchedFn();
  }
}
