"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class NoSuchError extends Error {
    constructor(message, code) {
        super();
        this.message = message;
        this.code = code;
    }
}
/**
 * Checks if a package needs to be updated.
 *
 * @async
 */
const checkUpdate = async (name, version, registry = 'https://registry.npmjs.org') => {
    try {
        const response = await axios_1.default.get(`${registry}/${name}`, {
            validateStatus: (status) => status === 200,
        });
        const { versions } = response.data;
        if (!versions[version])
            throw new NoSuchError('There\'s no such a version!', 'noSuchVersion');
        const versionsKeys = Object.keys(versions);
        const lastVersionIndex = versionsKeys.length - 1;
        const versionToCheckIndex = versionsKeys.indexOf(version);
        const lastVersion = versionsKeys[lastVersionIndex];
        return {
            lastVersion,
            isNeeded: lastVersionIndex > versionToCheckIndex
        };
    }
    catch (e) {
        if (e.response && e.response.status === 404) {
            throw new NoSuchError('There\'s no such a package!', 'noSuchPackage');
        }
        else {
            throw e;
        }
    }
};
exports.default = checkUpdate;
