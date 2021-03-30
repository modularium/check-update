import axios, { AxiosResponse } from 'axios'

class NoSuchError extends Error {
  constructor(public message: string, public code: string) {
    super()
  }
}

const NOSUCHVERSION = new NoSuchError('There\'s no such a version!', 'noSuchVersion')

const NOSUCHPACKAGE = new NoSuchError('There\'s no such a package!', 'noSuchPackage')

/**
 * Checks if the package needs to be updated.
 *
 * @async
 * @author redcarti
 * @param {string} name Name of the package
 * @param {string} version Version of the package 
 * @param {string} registry Registry of the package. Standard: `https://registry.npmjs.org`
 * @returns {Promise<{ lastVersion: string, isNeeded: boolean }>} Promise with last version of the package, and is needed to be updated
 */
export const checkUpdate = async (name: string, version: string, registry: string = 'https://registry.npmjs.org'): Promise<{ lastVersion: string, isNeeded: boolean }> => {
  try {
    const response: AxiosResponse<{ versions: { [key: string]: {  } }, status: number }> = await axios.get(`${registry}/${name}`, {
      validateStatus: status => status === 200,
    })

    const { versions } = response.data
    if (!versions[version]) throw NOSUCHVERSION

    const versionsKeys: string[] = Object.keys(versions)
    const lastVersionIndex: number = versionsKeys.length - 1
    const versionToCheckIndex: number = versionsKeys.indexOf(version)

    const lastVersion: string = versionsKeys[lastVersionIndex]

    return {
      lastVersion,
      isNeeded: lastVersionIndex > versionToCheckIndex
    }
  } catch (e) {
    if (e.response && e.response.status === 404) {
      throw NOSUCHPACKAGE
    } else {
      throw e
    }
  }
}
