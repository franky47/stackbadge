import { Octokit } from '@octokit/rest'
import axios from 'axios'

const gitHubRepoUrlRegex =
  /^https:\/\/github\.com\/(?<owner>[\w-]+)\/(?<repo>[\w-]+)/

export function isGitHubRepo(url: string) {
  return gitHubRepoUrlRegex.test(url)
}

export function extractGitHubRepoSlug(url: string) {
  const match = url.match(gitHubRepoUrlRegex)
  if (!match) {
    return null
  }
  const owner = match.groups!.owner
  const repo = match.groups!.repo
  return [owner, repo].join('/')
}

const github = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'stackbadge',
})

export const splitSlug = (slug: string) => {
  const [owner, repo] = slug.split('/')
  return { owner, repo }
}

export async function getRepositoryMetadata(slug: string) {
  const { owner, repo } = splitSlug(slug)
  const res = await github.repos.get({ owner, repo })
  return res.data
}

export async function fetchRepositoryPackageJson(slug: string, branch: string) {
  const res = await axios.get(
    `https://raw.githubusercontent.com/${slug}/${branch}/package.json`
  )
  return res.data
}
