import type { FC } from 'react';
import type { Category, FAQ } from '../../types/chatbot';

interface QuickActionsProps {
  categories: Category[];
  selectedCategory: string | null;
  questions: FAQ[];
  onCategoryClick: (categoryName: string) => void;
  onQuestionClick: (question: string) => void;
  onBack: () => void;
}

const QuickActions: FC<QuickActionsProps> = ({
  categories,
  selectedCategory,
  questions,
  onCategoryClick,
  onQuestionClick,
  onBack,
}) => (
  <div
    className="flex-shrink-0 px-[18px] pt-2.5"
    style={{ background: 'linear-gradient(to top, rgba(243,247,243,0.6) 0%, transparent 100%)' }}
  >
    {selectedCategory && (
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1.5 rounded-full bg-white border border-sage-200 text-[12px] font-medium text-ink-2 transition hover:bg-sage-50 hover:border-sage-300"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        All categories
      </button>
    )}

    {!selectedCategory ? (
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-0.5 px-0.5 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-sage-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => onCategoryClick(c.name)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-sage-200 text-[12.5px] font-medium text-ink-2 transition hover:-translate-y-0.5 hover:bg-sage-500 hover:border-sage-500 hover:text-white"
          >
            <span className="text-[13px] leading-none">{c.icon}</span>
            {c.display_name}
          </button>
        ))}
      </div>
    ) : (
      <div className="flex flex-col gap-1.5 max-h-[168px] overflow-y-auto pb-2 px-0.5">
        {questions.length === 0 && (
          <div className="text-[12.5px] text-ink-4 py-3">No quick questions in this category yet.</div>
        )}
        {questions.map((faq, i) => (
          <button
            key={i}
            onClick={() => onQuestionClick(faq.q)}
            className="text-left px-3 py-2 rounded-xl bg-white border border-sage-200 text-[13px] leading-snug text-ink-2 transition hover:translate-x-0.5 hover:bg-sage-50 hover:border-sage-400 hover:text-sage-800"
          >
            {faq.q}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default QuickActions;
