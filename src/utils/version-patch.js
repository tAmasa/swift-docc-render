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

function getDiffIndex(displayName, data) {
  const index = data.versions.findIndex(item => item.version.displayName === displayName);
  return index;
}

function dataHasNoVersion(data) {
  if (!('version' in data.metadata)) return true;
  if (!('versions' in data)) return true;
  return false;
}

// function dataHasVersion(data) {
//   if (!('version' in data.metadata))
// }

function noValidDisplayName(displayName) {
  if (!displayName) return true;
  return false;
}

function patchToVersion(displayName, data) {
  if (dataHasNoVersion(data)) return data;
  // console.log('func2');
  if (noValidDisplayName(displayName, data)) return data;
  // if(noValidPatch(displayName, data)) return data;
  // if (dataHasNoVersion(data) || noValidDisplayName(displayName, data)) {
  //   return data;

  const patchIndex = getDiffIndex(displayName, data);
  if (patchIndex === -1) {
    return data;
  }

  let patchJSON = clone(data);
  for (let i = 0; i <= patchIndex; i++) {
    patchJSON = apply(patchJSON, data.versions[i].patch);
  }
  return patchJSON;
}

// eslint-disable-next-line import/prefer-default-export
export { patchToVersion };
