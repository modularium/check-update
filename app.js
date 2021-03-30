/**
 * https://github.com/modularium/check-update
 * 
 * Example of using this library
 * Provide name and version of the library you want to check
 * 
 * .then returns the value of necessity of updating
 * If there's no such a version, then script will throw an error
 * Check error's code to expect it.
 */

let { checkUpdate } = require('./dist/index')

checkUpdate('modularium', '0.1.18-beta.1')
.then(({ isNeeded, lastVersion }) => {
    console.log(isNeeded)
})
.catch(err => {
    if (err.code === 'noSuchVersion') {
        // Not found version
        console.log(err.message)
    } else if (err.code === 'noSuchPackage') {
        // Not found this package on provided registry
        console.log(err.message)
    } else {
        console.error(err)
    }
})