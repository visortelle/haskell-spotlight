export type Versions = {
  current: string,
  available: string[],
}

export type License = {
  name: string,
  url: string | null
}

export type Homepage = {
  text: string,
  url: string
}

export type PackageProps = {
  id: string,
  name: string,
  license: License | null,
  homepage: Homepage | null,
  repositoryUrl: string | null,
  bugReportsUrl: string | null,
  versions: Versions,
  shortDescription: string | null,
  longDescriptionHtml: string | null,
  // Date in ISO 8601
  updatedAt: string | null
}
