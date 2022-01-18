export type Versions = {
  normal: string[];
  unpreferred: string[];
  deprecated: string[];
};

export type License = {
  name: string;
  url: string | null;
};

export type Homepage = {
  text: string;
  url: string;
};

export type PackageProps = {
  id: string;
  name: string;
  license: License | null;
  homepageUrl: Homepage | null;
  repositoryUrl: string | null;
  bugReportsUrl: string | null;
  versions: Versions | null;
  currentVersion: string | null;
  versionsCount: number,
  shortDescription: string | null;
  longDescriptionHtml: string | null;
  // Date in ISO 8601
  updatedAt: string | null;
};
