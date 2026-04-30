/**
 * Filesystem ↔ Subject Name Mapping Layer
 *
 * Single source of truth for converting between:
 *   - Subject names (as defined in SEMESTER_SUBJECTS / branches.js)
 *   - Windows-safe folder names (as stored on disk under Notes/)
 *
 * Windows reserved characters: \ / : * ? " < > |
 * These cannot appear in folder names and must be replaced consistently.
 */

/**
 * Convert a subject name to a Windows-safe folder name.
 *
 * @param {string} subject - The subject name from SEMESTER_SUBJECTS
 * @returns {string} A sanitized folder name safe for Windows filesystems
 *
 * @example
 *   toFolderName('Kannada (Samskrutika / Balake)')
 *   // → 'Kannada (Samskrutika - Balake)'
 */
export function toFolderName(subject) {
  if (typeof subject !== 'string') return '';

  return subject
    .replace(/\//g, ' - ')    // forward slash  → spaced hyphen
    .replace(/\\/g, ' - ')    // backslash      → spaced hyphen
    .replace(/:/g, ' -')      // colon          → hyphen (Windows reserved)
    .replace(/\*/g, '')       // asterisk        (remove)
    .replace(/\?/g, '')       // question mark   (remove)
    .replace(/"/g, '')        // double quote    (remove)
    .replace(/</g, '')        // less than       (remove)
    .replace(/>/g, '')        // greater than    (remove)
    .replace(/\|/g, '')       // pipe            (remove)
    .replace(/\s+/g, ' ')    // collapse multiple spaces
    .trim();
}

/**
 * Convert a folder name back to the original subject name (for display).
 * Reverses the known transformations applied by toFolderName.
 *
 * @param {string} folderName - The sanitized folder name from disk
 * @returns {string} The original subject name
 *
 * @example
 *   toSubjectName('Kannada (Samskrutika - Balake)')
 *   // → 'Kannada (Samskrutika / Balake)'
 */
export function toSubjectName(folderName) {
  if (typeof folderName !== 'string') return '';

  return folderName
    .replace(/\s-\s/g, ' / ')  // spaced hyphen → forward slash
    .trim();
}

/**
 * Build the full relative path from Notes root to a subject folder.
 *
 * @param {string} branch   - Branch code (e.g. 'CSE')
 * @param {string} semester - Semester label (e.g. 'First Year')
 * @param {string} subject  - Subject name from SEMESTER_SUBJECTS
 * @param {string} [cycle]  - Cycle name for First Year ('Physics Cycle' | 'Chemistry Cycle')
 * @returns {string} Relative path segments joined with '/'
 *
 * @example
 *   buildSubjectPath('CSE', 'First Year', 'Kannada (Samskrutika / Balake)', 'Physics Cycle')
 *   // → 'CSE/First Year/Physics Cycle/Kannada (Samskrutika - Balake)'
 */
export function buildSubjectPath(branch, semester, subject, cycle) {
  const parts = [branch, semester];
  if (cycle) parts.push(cycle);
  parts.push(toFolderName(subject));
  return parts.join('/');
}

/**
 * Compare a subject name to a folder name, accounting for sanitization.
 *
 * @param {string} subject    - Subject name from SEMESTER_SUBJECTS
 * @param {string} folderName - Folder name from disk
 * @returns {boolean} True if they represent the same subject
 */
export function matchesFolder(subject, folderName) {
  return toFolderName(subject) === folderName;
}
