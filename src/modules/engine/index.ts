import {
  extractGitHubRepoSlug,
  fetchRepositoryPackageJson,
  getRepositoryMetadata,
  isGitHubRepo,
  splitSlug,
} from '../../services/github'
import { resolveNpmPackageRepository } from '../../services/npm'
import prettyNamesDict from './prettyNames.json'

export interface DependencyInfo {
  packageName: string
  repoUrl: string
  repoSlug: string
  stars: number
  prettyName: string
  owner: string
  avatarUrl: string
}

async function processDependency(
  packageName: string
): Promise<DependencyInfo | null> {
  if (packageName.startsWith('@types/')) {
    return null // Don't bother with DefinitelyTyped
  }
  try {
    const repoUrl = await resolveNpmPackageRepository(packageName)
    if (!repoUrl || !isGitHubRepo(repoUrl)) {
      return null
    }
    const repoSlug = extractGitHubRepoSlug(repoUrl)!
    const { owner } = splitSlug(repoSlug)

    const packageNameWithoutScope = packageName.startsWith('@')
      ? packageName.split('/')[1]
      : packageName
    const prettyName =
      (prettyNamesDict as Record<string, string>)[packageName] ??
      packageNameWithoutScope
    const repoMeta = await getRepositoryMetadata(repoSlug)

    return {
      packageName,
      repoSlug,
      repoUrl,
      prettyName,
      owner,
      stars: repoMeta.stargazers_count,
      avatarUrl: repoMeta.owner.avatar_url,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

async function processDependencyObject(obj: { [dep: string]: string }) {
  const deps = Object.keys(obj)
  const info = await Promise.all(deps.map(processDependency))
  return (info.filter(Boolean) as DependencyInfo[]).sort(
    (a, b) => b.stars - a.stars // Highest count first
  )
}

// --

export async function process(slug: string) {
  const repoMeta = await getRepositoryMetadata(slug)
  const packageJson = await fetchRepositoryPackageJson(
    slug,
    repoMeta.default_branch
  )
  const dependencies = await processDependencyObject(
    packageJson.dependencies ?? {}
  )
  const devDependencies = await processDependencyObject(
    packageJson.devDependencies ?? {}
  )
  return {
    dependencies,
    devDependencies,
  }
}
