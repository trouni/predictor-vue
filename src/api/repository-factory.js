const repositoriesContext = require.context(
  // Look for files in the repositories directory
  './repositories',
  // Do not look in subdirectories
  false,
  // Exclude `repository.js`
  /^\.\/(?!repository(\.js)?$).+\.js$/
)

const repositories = {}

repositoriesContext.keys().forEach(fileName => {
  // Get the PascalCase version of the repository name
  const repositoryName = fileName
    // Remove the "./_" from the beginning
    .replace(/^\.\//, '')
    // Remove the file extension from the end
    .replace(/\.\w+$/, '')
  // // Split up kebabs
  // .split('-')
  // // Upper case
  // .map(kebab => kebab.charAt(0).toUpperCase() + kebab.slice(1))
  // // Concatenated
  // .join('')

  repositories[repositoryName] = repositoriesContext(fileName).default
})

export const RepositoryFactory = {
  get: name => repositories[name],
}
