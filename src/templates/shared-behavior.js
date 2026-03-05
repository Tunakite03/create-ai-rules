// ================================================================
//  Shared behavior building blocks
//
//  Shared: reusable workflow/quality/communication bullet lists.
//  Target-specific: each template composes/overrides only the pieces it needs.
// ================================================================

export const sharedBehavior = {
   readBeforeWrite: [
      'Read existing files and understand project structure before making changes.',
      'Follow existing patterns and conventions. Do not introduce new architecture unless requested.',
   ],
   minimalDiff: [
      'Make minimal, focused changes. Avoid unrelated refactors.',
      'Add tests for new logic or bug fixes.',
   ],
   verification: [
      'Verify changes compile/lint and relevant tests pass.',
      'Summarize what changed and why, including risks or follow-up if needed.',
   ],
   communication: [
      'Be direct and concise. Explain non-obvious decisions.',
      'When uncertainty exists, state assumptions clearly before proceeding.',
   ],
};

export function renderBullets(items) {
   return items.map((item) => `- ${item}`).join('\n');
}
