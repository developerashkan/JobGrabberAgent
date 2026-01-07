
import React, { useState } from 'react';
import { JobSearchService } from './services/geminiService';
import { JobListing, SearchParams } from './types';
import { JobCard } from './components/JobCard';

const App: React.FC = () => {
  const [params, setParams] = useState<SearchParams>({
    jobTitle: '',
    location: '',
    daysBack: 7,
  });
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.jobTitle || !params.location) return;

    setLoading(true);
    setError(null);
    setJobs([]);
    
    try {
      const service = new JobSearchService();
      const result = await service.searchJobs(params);
      
      if (result.jobs.length === 0) {
        setError("No fresh results found for this specific criteria. Try broadening your location or title.");
      }
      
      setJobs(result.jobs);
      setSources(result.sources);
    } catch (err: any) {
      setError('The search engine is currently checking real-time data. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100">
      {/* Hero / Header */}
      <header className="bg-slate-900 text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full mb-8 border border-blue-500/30">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest">Real-time Verification Active</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-6 tracking-tight">
            JobGrab <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Pro</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            AI-powered job discovery that filters out expired links and 404s using Gemini 3 Pro reasoning.
          </p>
        </div>
      </header>

      {/* Search Bar Container */}
      <main className="max-w-6xl mx-auto px-4 -mt-16 sm:px-6 lg:px-8 relative z-20">
        <form 
          onSubmit={handleSearch}
          className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-6 md:p-8 flex flex-col lg:flex-row gap-5 items-end border border-slate-100"
        >
          <div className="flex-1 w-full group">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Job Title / Tech Stack
            </label>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
              <input 
                type="text"
                placeholder="e.g. Senior Product Designer"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                value={params.jobTitle}
                onChange={(e) => setParams({...params, jobTitle: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex-1 w-full group">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Location / Remote
            </label>
            <div className="relative">
              <i className="fa-solid fa-location-arrow absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
              <input 
                type="text"
                placeholder="City, Country or Remote"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                value={params.location}
                onChange={(e) => setParams({...params, location: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="w-full lg:w-40">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
              Posted Within
            </label>
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-600"
                value={params.daysBack}
                onChange={(e) => setParams({...params, daysBack: parseInt(e.target.value)})}
              >
                <option value={1}>Last 24h</option>
                <option value={3}>Last 3 Days</option>
                <option value={7}>Last Week</option>
                <option value={14}>Last 2 Weeks</option>
                <option value={30}>Last Month</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs"></i>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full lg:w-auto bg-slate-900 text-white font-black py-4 px-10 rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Verifying...
              </>
            ) : (
              <>
                Search
                <i className="fa-solid fa-arrow-right text-xs opacity-50"></i>
              </>
            )}
          </button>
        </form>

        {/* Results Area */}
        <div className="mt-16">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-red-100 p-3 rounded-full">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {!loading && jobs.length === 0 && !error && (
            <div className="text-center py-32">
              <div className="inline-block p-10 bg-slate-100 rounded-full mb-6">
                <i className="fa-solid fa-bolt-lightning text-5xl text-slate-300"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready for a fresh start?</h3>
              <p className="text-slate-500 font-medium">Enter a role and location to find verified job postings.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 justify-center mb-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2">Filtering dead links...</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white border border-slate-100 h-72 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            </div>
          )}

          {jobs.length > 0 && (
            <div className="animate-in fade-in duration-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Latest Openings
                  </h2>
                  <p className="text-slate-500 font-medium mt-1">Found {jobs.length} verified listings.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 self-start">
                  <span className="text-[10px] font-black uppercase text-slate-400">Engine:</span>
                  <span className="text-xs font-bold text-blue-600">Gemini 3 Pro</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job, idx) => (
                  <JobCard key={idx} job={job} />
                ))}
              </div>
              
              {/* Grounding Sources Info */}
              {sources.length > 0 && (
                <div className="mt-24 p-10 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-10">
                    <i className="fa-solid fa-shield-halved text-9xl"></i>
                  </div>
                  <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em] mb-6 relative z-10">
                    Search Grounding Trace
                  </h3>
                  <p className="text-slate-400 text-sm mb-8 max-w-xl relative z-10 font-medium leading-relaxed">
                    Our verification engine cross-referenced multiple primary sources to ensure these listings were active at the time of your search.
                  </p>
                  <div className="flex flex-wrap gap-3 relative z-10">
                    {sources.map((source: any, idx: number) => {
                      const link = source.web;
                      if (!link) return null;
                      return (
                        <a 
                          key={idx}
                          href={link.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/5 border border-white/10 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 hover:border-blue-500/50 hover:text-white transition-all flex items-center gap-2"
                        >
                          <i className="fa-solid fa-check-double text-blue-400 text-[10px]"></i>
                          {link.title || 'Verified Source'}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-32 border-t border-slate-100 pt-16 pb-16 text-center">
        <div className="max-w-xs mx-auto mb-8 opacity-20">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
        </div>
        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">
          © {new Date().getFullYear()} JobGrab AI Professional
        </p>
        <p className="text-slate-300 text-[10px] mt-2 font-medium">
          Verified Search Environment • Gemini Pro Engine • Real-time Grounding
        </p>
      </footer>
    </div>
  );
};

export default App;
