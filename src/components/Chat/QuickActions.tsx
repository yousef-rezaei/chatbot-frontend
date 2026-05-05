import React from 'react';
import type { Category, FAQ } from '../../types/chatbot';

interface QuickActionsProps {
  categories: Category[];
  selectedCategory: string | null;
  questions: FAQ[];
  onCategoryClick: (categoryName: string) => void;
  onQuestionClick: (question: string) => void;
  onBack: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  categories,
  selectedCategory,
  questions,
  onCategoryClick,
  onQuestionClick,
  onBack,
}) => {
  return (
    <div className="sticky bottom-0 z-10 bg-gradient-to-t from-sage-100 to-transparent px-4 pt-3 pb-2 border-t border-sage-200/50 backdrop-blur-sm">
      {/* Back Button */}
      {selectedCategory && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 mb-2 bg-white border border-sage-300 rounded-lg text-xs font-semibold text-sage-600 cursor-pointer transition-all duration-200 hover:bg-sage-100 hover:border-sage-500 w-fit"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to Categories
        </button>
      )}

      {/* Categories View */}
      {!selectedCategory && (
        <div className="flex gap-2 overflow-x-auto scroll-smooth py-0.5 scrollbar-thin scrollbar-thumb-sage-400 scrollbar-track-transparent">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategoryClick(category.name)}
              className="whitespace-nowrap flex-shrink-0 px-3.5 py-2 bg-white border border-sage-300 rounded-lg text-[13px] font-medium text-sage-700 cursor-pointer transition-all duration-200 shadow-[0_1px_3px_rgba(107,158,120,0.12)] hover:bg-sage-500 hover:border-sage-500 hover:text-white hover:-translate-y-0.5"
            >
              <span className="text-sm font-bold mr-1.5">{category.icon}</span>
              {category.display_name}
            </button>
          ))}
        </div>
      )}

      {/* Questions View */}
      {selectedCategory && (
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto py-0.5 scrollbar-thin scrollbar-thumb-sage-400 scrollbar-track-transparent">
          {questions.map((faq, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(faq.q)}
              className="whitespace-normal text-left px-3 py-2 bg-white border border-sage-300 rounded-lg text-xs font-medium text-sage-700 cursor-pointer transition-all duration-200 shadow-[0_1px_3px_rgba(107,158,120,0.12)] hover:bg-sage-500 hover:border-sage-500 hover:text-white"
            >
              {faq.q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickActions;