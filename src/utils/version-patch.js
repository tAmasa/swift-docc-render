/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2021 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/
/* eslint-disable no-plusplus */
import { apply } from './json-patch';
import { clone } from './data';

/**
 * Checks if a JSON file (typically index.json or a RenderNode) has version data
 * @param  {JSON} data to be inspected for version data
 * @returns {Boolean}
 */
function dataHasVersion(data) {
  if (!data) return false;
  if (!('metadata' in data)) return false;
  if (!('version' in data.metadata)) return false;
  return true;
}
/**
 * Find the index of a specific Display Name in the version list
 * @param  {string} displayName
 * @param  {JSON} data
 * @returns {number} index of display name, -1 if not found.
 */
function getDiffIndex(displayName, data) {
  if (!dataHasVersion(data)) return -1;
  if (!('versions' in data)) return -1;
  const index = data.versions.findIndex(item => item.version.displayName === displayName);
  return index;
}
/**
 * Initialize a list of versions for a given JSON file
 * @param  {JSON} data
 * @returns {Array} of versions
 */
function initializeVersionList(data) {
  let versions = [];
  if (dataHasVersion(data)) {
    if (data.versions) {
      versions = data.versions.map(x => x.version.displayName);
    }
    versions.unshift(data.metadata.version.displayName);
  }
  return versions;
}
/**
 * Patch a given JSON file to a different version/state given a display name
 * If displayName doesn't exist in the JSON file, return original data
 * @param  {string} displayName
 * @param  {JSON} data
 * @return {JSON} patchedversioned data
 */
function patchToVersion(displayName, data) {
  if (!data) return null;
  if (!displayName || !dataHasVersion(data)) return data;
  const patchIndex = getDiffIndex(displayName, data);
  if (patchIndex === -1) return data;
  let patchJSON = clone(data);
  for (let i = 0; i <= patchIndex; i++) {
    patchJSON = apply(patchJSON, data.versions[i].patch);
  }
  return patchJSON;
}

// eslint-disable-next-line import/prefer-default-export
export { dataHasVersion, patchToVersion, initializeVersionList };
