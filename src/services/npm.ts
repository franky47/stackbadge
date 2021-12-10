import axios from 'axios'
import { isGitHubRepo } from './github'

export async function resolveNpmPackageRepository(
  packageName: string
): Promise<string | null> {
  const res = await axios.get(`https://unpkg.com/${packageName}/package.json`)
  const packageJson = res.data
  if (!packageJson.repository) {
    return null
  }
  let output = ''
  if (typeof packageJson.repository === 'string') {
    output = packageJson.repository
  } else {
    output = packageJson.repository.url
  }
  output = output.replace(/^git:\/\/github\.com\//, 'https://github.com/')
  output = output.replace(
    /^git\+https:\/\/github\.com\//,
    'https://github.com/'
  )
  output = output.replace(/\.git$/, '')
  if (!isGitHubRepo(output) && output.split('/').length === 2) {
    output = `https://github.com/${output}`
  }
  return output
}
