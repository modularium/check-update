const { default: axios } = require('axios')

class NoSuchVersionError extends Error {
  constructor () {
    super()
    this.name = 'NoSuchVersionError'
    this.message = 'There\'s no such a version!'
    this.code = 'noSuchVersion'
  }
}

class NoSuchPackageError extends Error {
  constructor () {
    super()
    this.name = 'NoSuchPackage'
    this.message = 'There\'s no such a package!'
    this.code = 'noSuchPackage'
  }
}

/**
 * Checks if a package needs to be updated.
 *
 * @async
 * @param {string} name Name of a package.
 * @param {string} version Version of a package.
 * @param {string?} registry Registry of a package. Standard is https://registry.npmjs.org
 * @returns {{isNeeded: boolean, lastVersion: string}}
 * @throws {NoSuchVersionError} If version to check is not finded.
 * @throws {NoSuchPackageError} If such a package is not finded on registry.
 */
const checkUpdate = async (name, version, registry = 'https://registry.npmjs.org') => {
  const response = await axios.get(`${registry}/${name}`)
  if (response.status === 404) throw new NoSuchPackageError()

  const { versions } = response.data

  if (!versions[version]) throw new NoSuchVersionError()

  const versionsKeys = Object.keys(versions)
  const lastVersionIndex = versionsKeys.length - 1
  const versionToCheckIndex = versionsKeys.indexOf(version)

  const objectToReturn = {
    lastVersion: versionsKeys[lastVersionIndex]
  }

  if (lastVersionIndex > versionToCheckIndex) {
    return {
      ...objectToReturn,
      isNeeded: true
    }
  } else {
    return {
      ...objectToReturn,
      isNeeded: false
    }
  }
}

module.exports = checkUpdate
