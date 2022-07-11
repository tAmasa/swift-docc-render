/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2021 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/

/*
Used to replace the fetched data for the navigator/index.json file
Takes an array of API objects with an version data to produce a singular key
of change, used
{
  "foo": {
    "v4": "modified",
    "v3": "modified",
    "v2": "added",
  },
  "bar": {
    "v4": "added",
    "v2": "added",
    "v1": "modified",  },
  "fizz": {
    "v2": "modified",
    "v1": "added",
  },
};
Transforms it to this format:
{
  "foo": {
    "change": "modified",
  },
  "bar": {
    "change": "added"
  },
  "fizz": {
    "change": "modified"
  },
}
*/
/**
 * Used to replace the fetched data for each Documentation Topic
 * Takes an array of API objects with an array of version data to produce an array
 * of JSON objects with a singular key with the "change" for the given version.
 * E.g. for the "foo" object in the array with versionID "v2",
 * "foo" : { "v4": "modified", "v3": added, "v2": "modified"} turns to
 * "foo" : {"change" : "modified"}
 * @param  {JSON} apiChanges this usually is versionDifferences.swift or versionDifferences.objc found in index.json
 * @param  {string} versionID
 * @returns  {JSON} An array of JSON objects with a "change" key
 */
function versionedApiChangesDocTopic(apiChanges, versionID) {
  const versionedAPIChanges = {};
  Object.keys(apiChanges).forEach((url) => {
    if (apiChanges[url][versionID]) {
      const versionedUrlInfo = { change: apiChanges[url][versionID] }; // key name
      versionedAPIChanges[url] = versionedUrlInfo;
    }
  });
  return versionedAPIChanges;
}

/*
Used to replace the navigator/interfacesLanguages data
Takes an array of json pbjects in this format:
{
  "foo": {
    "v4": "modified",
    "v3": "modified",
    "v2": "added",
  },
  "bar": {
    "v4": "added",
    "v2": "added",
    "v1": "modified",  },
  "fizz": {
    "v2": "modified",
    "v1": "added",
  },
};
Transforms it to this format:
{
  "foo": "modified",
  "bar": "added",
  "fizz": "modified",
}
*/

/**
 * Used to replace the fetched data for each Documentation Topic
 * Takes an array of API objects with an array of version data to produce an array
 * of URL keys with a value of the API changefor the given version.
 * E.g. for the "foo" object in the array with versionID "v2",
 * "foo" : { "v4": "modified", "v3": added, "v2": "modified"} turns to
 * "foo" : "modified"
 * @param  {JSON} apiChanges, this usually is versionDifferences.swift or versionDifferences.objc found in index.json
 * @param  {string} versionID, the version of information
 * @returns  {JSON} A JSON array with URL keys and the API changes as their values.
 */
function versionedApiChangesNavigation(apiChanges, versionID) {
  const versionedURLs = {};
  Object.keys(apiChanges).forEach((url) => {
    if (apiChanges[url][versionID]) {
      versionedURLs[url] = apiChanges[url][versionID];
    }
  });
  return versionedURLs;
}

// eslint-disable-next-line import/prefer-default-export
export {
};
