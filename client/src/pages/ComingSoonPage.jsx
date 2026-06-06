// ─── Placeholder Page Component ────────────────────────────
// Purpose: A reusable "coming soon" page for modules not yet built.
// Why: Instead of creating 8 separate empty files, this one component
//      is used for ALL unbuilt pages. As we build each module, we 
//      replace it with the real page.
// ────────────────────────────────────────────────────────────

import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';

const ComingSoonPage = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-theme(spacing.32))] animate-fadeIn">
    <div 
      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
      style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--accent-500)/10)' }}
    >
      <HiOutlineWrenchScrewdriver className="w-10 h-10" style={{ color: 'var(--primary-500)' }} />
    </div>
    <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--gray-900)' }}>
      {title}
    </h1>
    <p className="text-center max-w-md" style={{ color: 'var(--gray-500)' }}>
      {description || 'This module is under development. It will be available in the next phase.'}
    </p>
    <div className="mt-6 px-4 py-2 rounded-full text-sm font-medium"
      style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', border: '1px solid var(--primary-100)' }}>
      Coming in Phase 2–7
    </div>
  </div>
);

export default ComingSoonPage;
