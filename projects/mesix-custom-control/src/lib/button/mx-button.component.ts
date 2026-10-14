import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MxButtonVariant, MxControlSize, MxTone } from '../shared/mx-control.types';

/**
 * Drive-style actions — every non-link state keeps a visible 1px border.
 * - solid + primary  → filled primary (default)
 * - outline          → secondary / Cancel
 */
@Component({
  selector: 'mx-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <button
      class="mx-btn"
      [attr.type]="type"
      [disabled]="disabled || loading"
      [ngClass]="[variant, tone, size]"
      [class.block]="block"
      [class.icon-only]="iconOnly"
      (click)="pressed.emit($event)"
    >
      <mat-icon *ngIf="loading" class="spin">autorenew</mat-icon>
      <mat-icon *ngIf="!loading && icon" class="lead-icon">{{ icon }}</mat-icon>
      <span *ngIf="!iconOnly" class="label"><ng-content></ng-content></span>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      .mx-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: 20px;
        border: 1px solid #9aa0a6;
        box-sizing: border-box;
        font-family: var(--mx-font, inherit);
        font-weight: 500;
        letter-spacing: 0.01em;
        cursor: pointer;
        box-shadow: none;
        background-color: transparent;
        transition:
          background-color var(--mx-motion-fast, 100ms) var(--mx-ease, ease),
          border-color var(--mx-motion-fast, 100ms) var(--mx-ease, ease),
          color var(--mx-motion-fast, 100ms) var(--mx-ease, ease),
          filter var(--mx-motion-fast, 100ms) var(--mx-ease, ease);
        white-space: nowrap;
      }
      .mx-btn .lead-icon,
      .mx-btn .spin {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      .mx-btn:hover:not(:disabled) {
        box-shadow: none;
      }
      .mx-btn:active:not(:disabled) {
        filter: brightness(0.96);
      }
      .mx-btn:disabled {
        opacity: 0.45;
        cursor: default;
        box-shadow: none;
        border-color: #9aa0a6;
      }
      .sm {
        height: 32px;
        padding: 0 14px;
        font-size: 0.8125rem;
      }
      .md {
        height: 36px;
        padding: 0 18px;
        font-size: 0.875rem;
      }
      .lg {
        height: 40px;
        padding: 0 22px;
        font-size: 0.9375rem;
      }
      .icon-only.sm {
        width: 32px;
        padding: 0;
      }
      .icon-only.md {
        width: 36px;
        padding: 0;
      }
      .icon-only.lg {
        width: 40px;
        padding: 0;
      }
      .block {
        width: 100%;
      }

      /* Primary filled */
      .solid.primary {
        background-color: var(--mx-primary);
        color: var(--mx-primary-contrast);
        border-color: color-mix(in srgb, var(--mx-primary) 65%, #000);
      }
      .solid.primary:hover:not(:disabled) {
        filter: brightness(1.06);
        border-color: color-mix(in srgb, var(--mx-primary) 55%, #000);
      }
      .solid.primary:active:not(:disabled) {
        filter: brightness(0.94);
      }
      .solid.primary:disabled {
        border-color: color-mix(in srgb, var(--mx-primary) 45%, #5f6368);
      }
      .solid.success {
        background-color: var(--mx-success);
        color: #fff;
        border-color: color-mix(in srgb, var(--mx-success) 65%, #000);
      }
      .solid.warning {
        background-color: var(--mx-warning);
        color: #202124;
        border-color: color-mix(in srgb, var(--mx-warning) 55%, #000);
      }
      .solid.danger {
        background-color: var(--mx-warn);
        color: #fff;
        border-color: color-mix(in srgb, var(--mx-warn) 65%, #000);
      }
      .solid.neutral,
      .solid.info {
        background-color: var(--mx-text);
        color: var(--mx-surface);
        border-color: color-mix(in srgb, var(--mx-text) 75%, #000);
      }

      .soft.primary {
        background-color: color-mix(in srgb, var(--mx-primary) 16%, var(--mx-surface));
        color: var(--mx-primary);
        border-color: color-mix(in srgb, var(--mx-primary) 55%, #9aa0a6);
      }
      .soft.primary:hover:not(:disabled) {
        background-color: color-mix(in srgb, var(--mx-primary) 22%, var(--mx-surface));
        border-color: color-mix(in srgb, var(--mx-primary) 70%, #5f6368);
      }
      .soft.success {
        background-color: var(--mx-success-bg);
        color: var(--mx-success);
        border-color: var(--mx-success-border);
      }
      .soft.warning {
        background-color: var(--mx-warning-bg);
        color: var(--mx-warning);
        border-color: var(--mx-warning-border);
      }
      .soft.danger {
        background-color: var(--mx-error-bg);
        color: var(--mx-warn);
        border-color: var(--mx-error-border);
      }
      .soft.neutral,
      .soft.info {
        background-color: color-mix(in srgb, var(--mx-text-muted) 14%, var(--mx-surface));
        color: var(--mx-text);
        border-color: #9aa0a6;
      }

      /* Secondary / Cancel */
      .outline {
        background-color: transparent;
        border-color: color-mix(in srgb, var(--mx-primary) 50%, #9aa0a6);
        color: var(--mx-primary);
      }
      .outline:hover:not(:disabled) {
        background-color: color-mix(in srgb, var(--mx-primary) 8%, transparent);
        border-color: var(--mx-primary);
      }
      .outline:active:not(:disabled) {
        background-color: color-mix(in srgb, var(--mx-primary) 12%, transparent);
      }
      .outline.neutral {
        color: var(--mx-text);
        border-color: #9aa0a6;
      }
      .outline.neutral:hover:not(:disabled) {
        border-color: var(--mx-text-muted);
      }
      .outline.danger {
        border-color: color-mix(in srgb, var(--mx-warn) 65%, #9aa0a6);
        color: var(--mx-warn);
      }
      .outline.danger:hover:not(:disabled) {
        border-color: var(--mx-warn);
        background-color: color-mix(in srgb, var(--mx-warn) 8%, transparent);
      }

      .ghost {
        background-color: transparent;
        color: var(--mx-text-muted);
        border-color: #9aa0a6;
      }
      .ghost:hover:not(:disabled) {
        background-color: color-mix(in srgb, var(--mx-text) 6%, transparent);
        border-color: var(--mx-text-muted);
        color: var(--mx-text);
      }
      .ghost.primary {
        color: var(--mx-primary);
        border-color: color-mix(in srgb, var(--mx-primary) 45%, #9aa0a6);
      }
      .ghost.primary:hover:not(:disabled) {
        border-color: var(--mx-primary);
        background-color: color-mix(in srgb, var(--mx-primary) 8%, transparent);
      }
      .ghost.danger {
        color: var(--mx-warn);
        border-color: color-mix(in srgb, var(--mx-warn) 50%, #9aa0a6);
      }
      .ghost.danger:hover:not(:disabled) {
        border-color: var(--mx-warn);
        background-color: color-mix(in srgb, var(--mx-warn) 8%, transparent);
      }

      .link {
        background-color: transparent;
        color: var(--mx-primary);
        padding-inline: 4px;
        height: auto;
        text-decoration: underline;
        border-color: transparent;
        box-shadow: none;
      }
      .link:hover:not(:disabled) {
        border-color: color-mix(in srgb, var(--mx-primary) 35%, transparent);
      }

      .spin {
        animation: mx-spin 0.8s linear infinite;
      }
      @keyframes mx-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class MxButtonComponent {
  @Input() variant: MxButtonVariant = 'solid';
  @Input() tone: MxTone = 'primary';
  @Input() size: MxControlSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon = '';
  @Input() iconOnly = false;
  @Input() block = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Output() pressed = new EventEmitter<MouseEvent>();
}
