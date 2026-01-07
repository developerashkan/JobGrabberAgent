
import React from 'react';
import { JobListing } from '../types';

interface JobCardProps {
  job: JobListing;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  // Simple check to identify the source platform for an icon
  const getSourceIcon = (url: string) => {
    if (url.includes('linkedin')) return <i className="fa-brands fa-linkedin text-blue-700"></i>;
    if (url.includes('indeed')) return <i className="fa-solid fa-circle-info text-blue-500"></i>;
    if (url.includes('greenhouse') || url.includes('lever')) return <i className="fa-solid fa-building-columns text-emerald-600"></i>;
    return <i className="fa-solid fa-globe text-slate-400"></i>;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tight flex items-center">
              <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1 animate-pulse"></span>
              Verified Active
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
          <p className="text-slate-600 font-semibold text-sm mt-1">{job.company}</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-md font-bold uppercase mb-2">
            {job.publishDate}
          </span>
          <div className="text-lg">
            {getSourceIcon(job.url)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center text-slate-400 text-xs mb-4">
        <i className="fa-solid fa-location-dot mr-1.5 text-slate-300"></i>
        <span className="font-medium">{job.location}</span>
      </div>

      <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
        {job.snippet}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-50">
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg font-bold hover:bg-blue-600 transition-all shadow-sm hover:shadow-blue-200"
        >
          View Job Details
          <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-[10px] opacity-70"></i>
        </a>
      </div>
    </div>
  );
};
