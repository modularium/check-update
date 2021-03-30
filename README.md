# check-update
A library to check for updates from npm or other npm registry

## Installing
```shell
npm install @modularium/check-update
```

## Way of using it

`checkUpdate()` is an async function that requires 3 arguments, but the last one is optional

```javascript
let { checkUpdate } = require('@modularium/check-update')

checkUpdate(packageName, packageVersion, packageRegistry)
```

If your package is on npm registry (https://registry.npmjs.org) then don't provide the last argument

Don't use it with `await` keyword because of throwed errors

#### Example
```javascript
let { checkUpdate } = require('@modularium/check-update')

checkUpdate('@modularium/discord', '0.1.18-beta.1')
```

### .then
On callback `checkUpdate()` returns an object with `isNeeded` and `lastVersion` properties.

`isNeeded` is a boolean to say that you need to update a package, or not.

`lastVersion` is a string with last version on a registry.

#### Example
```javascript
let { checkUpdate } = require('@modularium/check-update')

checkUpdate('@modularium/discord', '0.1.18-beta.1')
.then(({ isNeeded, lastVersion }) => {
    if (isNeeded) {
        console.log(`Hey! modularium is updated to ${lastVersion}. Please update it!`)
    } else {
        console.log('Looks like you have last version of modularium. That\'s great!')
    }
})
```

### .catch
`.catch` callback might be called only in 3 ways:
- No such version
- No suck package
- Or other error

You can catch those errors accessing `code` property of an error

#### NoSuchVersionError
This error is being throwed because there's no provided version on a registry

#### NoSuchPackageError
This error is being throwed because there's no such package on a registry

#### Example
```javascript
let { checkUpdate } = require('@modularium/check-update')

checkUpdate('@modularium/discord', '0.1.18-beta.1')
.then(({ isNeeded, lastVersion }) => {
    if (isNeeded) {
        console.log(`Hey! modularium is updated to ${lastVersion}. Please update it!`)
    } else {
        console.log('Looks like you have last version of modularium. That\'s great!')
    }
})
.catch(err => {
    if (err.code === 'noSuchVersion') {
        console.log('Hmm, your version of modularium is not found on npm...')
    } else if (err.code === 'noSuchPackage') {
        console.log('Errm... modularium is not found. Check for correctness of provided arguments')
    } else {
        // Other error
        console.error(err)
    }
})
```
