/**
 * Shared constants used across multiple components.
 * Centralized here to avoid duplication and ensure consistency.
 */

// Badge colors for note labels — used in Sidebar file items and Search results.
// Search uses { bg, color } for inline styles; Sidebar uses bg only (white text).
export const LABEL_COLORS = Object.freeze({
  Notes: Object.freeze({ bg: '#dbeafe', color: '#1d4ed8', sidebar: '#3b82f6' }),
  PYQ: Object.freeze({ bg: '#fef3c7', color: '#b45309', sidebar: '#f59e0b' }),
  Important: Object.freeze({ bg: '#fee2e2', color: '#dc2626', sidebar: '#ef4444' }),
})
