/**
 * Validation script — verifies every subject in SEMESTER_SUBJECTS
 * produces a valid Windows folder name via toFolderName().
 *
 * Run with:  node --experimental-vm-modules scripts/validateFolderNames.mjs
 * Or via:    npm run validate:folders  (if added to package.json)
 */

import { SEMESTER_SUBJECTS } from '../src/data/branches.js';
import { toFolderName, toSubjectName } from '../src/utils/fsName.js';

// Windows reserved characters that must NOT appear in folder names
const WINDOWS_ILLEGAL = /[\\/:*?"<>|]/;

let totalSubjects = 0;
let sanitizedCount = 0;
const issues = [];
const sanitized = [];

Object.entries(SEMESTER_SUBJECTS).forEach(([semester, branches]) => {
  Object.entries(branches).forEach(([branch, data]) => {
    const subjects = Array.isArray(data)
      ? data
      : Object.values(data).flat();

    subjects.forEach((subject) => {
      totalSubjects++;
      const folder = toFolderName(subject);

      // Check 1: toFolderName must produce a non-empty string
      if (!folder) {
        issues.push({ semester, branch, subject, error: 'Empty folder name' });
        return;
      }

      // Check 2: folder name must not contain illegal characters
      if (WINDOWS_ILLEGAL.test(folder)) {
        issues.push({
          semester,
          branch,
          subject,
          folder,
          error: `Contains illegal char: ${folder.match(WINDOWS_ILLEGAL)[0]}`,
        });
        return;
      }

      // Check 3: folder name must not end with a dot or space (Windows restriction)
      if (/[. ]$/.test(folder)) {
        issues.push({
          semester,
          branch,
          subject,
          folder,
          error: 'Ends with dot or space',
        });
        return;
      }

      // Track subjects that got modified
      if (folder !== subject) {
        sanitizedCount++;
        sanitized.push({
          semester,
          branch,
          original: subject,
          folderName: folder,
          reversible: toSubjectName(folder) === subject,
        });
      }
    });
  });
});

// ──────── Report ────────
console.log('\n╔══════════════════════════════════════════════╗');
console.log('║   FOLDER NAME VALIDATION REPORT              ║');
console.log('╚══════════════════════════════════════════════╝\n');

console.log(`Total subjects scanned:  ${totalSubjects}`);
console.log(`Passed (unchanged):      ${totalSubjects - sanitizedCount - issues.length}`);
console.log(`Sanitized (renamed):     ${sanitizedCount}`);
console.log(`Issues (FAILED):         ${issues.length}\n`);

if (sanitized.length > 0) {
  console.log('── Sanitized Subjects ──');
  sanitized.forEach((s) => {
    const rev = s.reversible ? '✔ reversible' : '✘ NOT reversible';
    console.log(`  [${s.branch}/${s.semester}]`);
    console.log(`    "${s.original}"  →  "${s.folderName}"  (${rev})`);
  });
  console.log('');
}

if (issues.length > 0) {
  console.log('── ISSUES ──');
  issues.forEach((i) => {
    console.log(`  ✘ [${i.branch}/${i.semester}] "${i.subject}" — ${i.error}`);
  });
  console.log('');
  process.exit(1);
} else {
  console.log('✔ All subjects produce valid Windows folder names.\n');
  process.exit(0);
}
