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

export type Dependencies = {
  packageName: string;
  versionsRange: string;
};

export type ReverseDependency = {
  packageName: string;
  versionsRange: string;
  isOutdated: boolean;
  hasReverseDependencies: boolean;
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
  versionsCount: number;
  shortDescription: string | null;
  longDescriptionHtml: string | null;
  // Date in ISO 8601
  updatedAt: string | null;
  reverseDependencies: ReverseDependency[] | null;
  dependencies: Dependencies | null;
};
