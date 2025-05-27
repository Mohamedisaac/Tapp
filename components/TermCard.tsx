
import React from 'react';
import { Term, Subject } from '../types';

interface TermCardProps {
  term: Term;
}

const subjectColorMap: Record<Subject, string> = {
  [Subject.Physics]: 'bg-indigo-100 text-indigo-700',
  [Subject.Math]: 'bg-emerald-100 text-emerald-700',
  [Subject.Biology]: 'bg-amber-100 text-amber-700',
};

const TermCard: React.FC<TermCardProps> = ({ term }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out border border-sky-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-sky-700">{term.term}</h3>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${subjectColorMap[term.subject]}`}>
          {term.subject}
        </span>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{term.definition}</p>
    </div>
  );
};

export default TermCard;
