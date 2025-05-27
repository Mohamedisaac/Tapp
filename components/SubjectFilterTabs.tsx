
import React from 'react';
import { Subject } from '../types';

interface SubjectFilterTabsProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject | null) => void;
}

const SubjectFilterTabs: React.FC<SubjectFilterTabsProps> = ({ subjects, selectedSubject, onSelectSubject }) => {
  const allSubjectsOption = null; // Represents "All Subjects"

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
      <button
        onClick={() => onSelectSubject(allSubjectsOption)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50
          ${selectedSubject === allSubjectsOption ? 'bg-sky-600 text-white shadow-md' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
      >
        All Subjects
      </button>
      {subjects.map((subject) => (
        <button
          key={subject}
          onClick={() => onSelectSubject(subject)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50
            ${selectedSubject === subject ? 'bg-sky-600 text-white shadow-md' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
        >
          {subject}
        </button>
      ))}
    </div>
  );
};

export default SubjectFilterTabs;
