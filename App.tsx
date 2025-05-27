
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Term, Subject } from './types';
import SearchBar from './components/SearchBar';
import SubjectFilterTabs from './components/SubjectFilterTabs';
import TermCard from './components/TermCard';

const App: React.FC = () => {
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [displayedTerms, setDisplayedTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const allSubjects = useMemo(() => Object.values(Subject), []);

  const transformJsonToTerms = (jsonData: Record<string, string>, subject: Subject, subjectKey: string): Term[] => {
    return Object.entries(jsonData).map(([term, definition], index) => ({
      id: `${subjectKey}-${index + 1}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      subject,
      term,
      definition,
    }));
  };

  useEffect(() => {
    const fetchTerms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const subjectFiles: { subject: Subject, path: string, key: string }[] = [
          { subject: Subject.Physics, path: '/data/physics.json', key: 'phy' },
          { subject: Subject.Math, path: '/data/mathematics.json', key: 'math' },
          { subject: Subject.Biology, path: '/data/biology.json', key: 'bio' },
        ];

        const fetchedTermsPromises = subjectFiles.map(async (fileInfo) => {
          const response = await fetch(fileInfo.path);
          if (!response.ok) {
            throw new Error(`Failed to load ${fileInfo.subject} terms from ${fileInfo.path}. Status: ${response.status}`);
          }
          const jsonData: Record<string, string> = await response.json();
          if (Object.keys(jsonData).length === 0) {
            console.warn(`No terms found in ${fileInfo.path} for ${fileInfo.subject}. The file might be empty or not a valid term-definition JSON object.`);
            return []; // Return empty array if JSON is empty
          }
          return transformJsonToTerms(jsonData, fileInfo.subject, fileInfo.key);
        });

        const termsBySubject = await Promise.all(fetchedTermsPromises);
        const combinedTerms = termsBySubject.flat();
        
        if (combinedTerms.length === 0) {
          // This implies all files were empty or failed to parse in a way that produced terms
          console.warn("No terms were loaded. Check JSON files, paths, and format (e.g., /data/physics.json). Ensure they are non-empty objects.");
          setError("No terms found. Please check if the data files (e.g., /data/physics.json) are correctly placed, formatted as JSON objects, and contain data.");
        }
        setAllTerms(combinedTerms);

      } catch (err) {
        console.error("Error loading or parsing terms:", err);
        let errorMessage = "An unknown error occurred while loading terms.";
        if (err instanceof SyntaxError) {
            errorMessage = "Failed to parse JSON data. Please ensure the data files are in valid JSON format.";
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }
        setError(errorMessage);
        setAllTerms([]); // Ensure allTerms is empty on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []); // Runs once on component mount

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSelectSubject = useCallback((subject: Subject | null) => {
    setSelectedSubject(subject);
  }, []);

  useEffect(() => {
    if (isLoading) return; 

    let filteredTerms = allTerms;

    if (selectedSubject) {
      filteredTerms = filteredTerms.filter(term => term.subject === selectedSubject);
    }

    const trimmedSearchTerm = searchTerm.trim(); 

    if (trimmedSearchTerm !== '') {
      const lowerCaseSearchTerm = trimmedSearchTerm.toLowerCase();
      filteredTerms = filteredTerms.filter(term =>
        term.term.toLowerCase().includes(lowerCaseSearchTerm) ||
        term.definition.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    setDisplayedTerms(filteredTerms);
  }, [searchTerm, selectedSubject, allTerms, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-50 to-cyan-100 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-sky-700 mb-2">
            Terminology Dictionary
          </h1>
          <p className="text-lg text-sky-600">
            Explore terms from Physics, Mathematics, and Biology.
          </p>
        </header>

        <div className="mb-8 p-6 bg-white/70 backdrop-blur-md shadow-lg rounded-xl border border-sky-200">
          <div className="mb-6">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchTermChange={handleSearchTermChange}
              placeholder="Search for terms or definitions..."
            />
          </div>
          <SubjectFilterTabs
            subjects={allSubjects}
            selectedSubject={selectedSubject}
            onSelectSubject={handleSelectSubject}
          />
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div role="status" className="flex justify-center items-center">
                <svg aria-hidden="true" className="w-10 h-10 text-sky-300 animate-spin fill-sky-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            <p className="text-xl text-sky-500 font-semibold mt-4">Loading terms...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-12 bg-red-50 p-6 rounded-lg border border-red-200">
             <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <p className="text-xl text-red-600 font-semibold">Error Loading Data</p>
            <p className="text-slate-600">{error}</p>
            <p className="text-slate-500 mt-2">Please ensure JSON files (e.g., <code className="bg-red-100 px-1 rounded">/data/physics.json</code>) exist, are valid JSON, and are correctly formatted.</p>
          </div>
        )}

        {!isLoading && !error && displayedTerms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTerms.map(term => (
              <TermCard key={term.id} term={term} />
            ))}
          </div>
        )}
        
        {!isLoading && !error && displayedTerms.length === 0 && allTerms.length > 0 && (
           <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-sky-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <p className="text-xl text-sky-500 font-semibold">No terms match your current search or filter.</p>
            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

         {!isLoading && !error && allTerms.length === 0 && (
           <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-sky-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <p className="text-xl text-sky-500 font-semibold">No terms available.</p>
            <p className="text-slate-500">It seems the dictionary data files are empty or could not be processed. Please check the JSON files in the <code className="bg-sky-100 px-1 rounded">/data/</code> directory.</p>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-sky-500">
          <p>&copy; {new Date().getFullYear()} Terminology Dictionary. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
