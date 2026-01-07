
export interface JobListing {
  title: string;
  company: string;
  location: string;
  publishDate: string;
  url: string;
  snippet: string;
  source: string;
}

export interface SearchParams {
  jobTitle: string;
  location: string;
  daysBack: number;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}
