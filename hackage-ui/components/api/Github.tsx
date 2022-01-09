import axios from 'axios';
import { useEffect, useState, useContext } from "react";
import AppContext from '../AppContext';

import { PackageProps } from './common';



function githubStars( r: Repository): number {

  try {
    res = await ( await axios.get(
      `https://api.github.com/repos/${r.owner}/${r.repo}/stargazers`,
      { headers: { 'Content-Type': 'application/json' } }
    )).data;
  } catch (err) {
    console.log(err);
  }

  // TODO the returned JSON is an array, with the 'stargazers' of the repository

}



// adapted from    components/pages/package/Sidebar.tsx

type Repository = {
  kind: 'unknown' | 'github',
  displayText: string,
  browserUrl: string,
  gitUrl: string | null,
  owner: string | null,
  repo: string | null
}

// TODO - add tests, GitLab, BitBucket, others.
function parseRepositoryUrl(url: string): Repository {

  // GitHub
  function gitHub(owner: string, repo: string): Repository {
    return {
      kind: 'github',
      displayText: `${owner}/${repo}`,
      browserUrl: `https://github.com/${owner}/${repo}`,
      gitUrl: `git@github.com:${owner}/${repo}.git`,
      owner: owner,
      repo: repo
    }
  }

  if (url.match(/^git@github.com:.*$/g)) {
    const [owner, repo] = url.replace(/^git@github\.com:\/?/, '').replace(/\/$/, '').replace(/\.git$/, '').split('/');
    return gitHub(owner, repo);

  } else if (url.match(/^(https?|git)\:\/\/github.com\/.*$/g)) {
    const [owner, repo] = url.replace(/^(https?|git)\:\/\/github\.com\/?/, '').replace(/\/$/, '').replace(/\.git$/, '').split('/');
    return gitHub(owner, repo);

  }

  // Unknown
  return {
    kind: 'unknown',
    displayText: url,
    browserUrl: url,
    gitUrl: url.match(/git\:\/\//) ? url : null,
    owner: null,
    repo: null
  }
}
