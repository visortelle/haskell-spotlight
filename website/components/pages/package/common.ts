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

export type DependencyCondition = {
  predicate: string;
  ifDeps: Dependency[];
  elseDeps: Dependency[];
};

export type Dependency = {
  packageName: string;
  versionsRange: null | string;
};

export type Dependencies = {
  dependenciesCount: number;
  conditionalDependenciesCount: number;
  modules: {
    name: string;
    dependencies: Dependency[];
    // Examples - pandoc-2.17.0.1, hlint-3.6.6
    conditions: DependencyCondition[];
  }[];
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
