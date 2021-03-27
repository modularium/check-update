import axios, { AxiosResponse } from 'axios'

class NoSuchError extends Error {
  constructor(public message: string, public code: string) {
    super()
  }
}

/**
 * Checks if a package needs to be updated.
 *
 * @async
 */
const checkUpdate = async (name: string, version: string, registry: string = 'https://registry.npmjs.org'): Promise<{ lastVersion: string, isNeeded: boolean }> => {
  try {
    const response: AxiosResponse<{ versions: { [key: string]: {  } }, status: number }> = await axios.get(`${registry}/${name}`, {
      validateStatus: (status) => status === 200,
    })

    const { versions } = response.data
    if (!versions[version]) throw new NoSuchError('There\'s no such a version!', 'noSuchVersion')

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
      throw new NoSuchError('There\'s no such a package!', 'noSuchPackage')
    } else {
      throw e
    }
  }
}

export default checkUpdate
