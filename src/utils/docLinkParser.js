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
// Used to replace the API change fetch for navigator and documentation topics

/*
Used to replace the fetched data for each Documentation Topic
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
function generateVersionURLApiChanges(apiChanges, versionID) {
  const allURLApiChanges = {};
  Object.keys(apiChanges).forEach((url) => {
    if (apiChanges[url][versionID]) {
      const versionedUrlInfo = { change: apiChanges[url][versionID] }; // key name
      allURLApiChanges[url] = versionedUrlInfo;
    }
  });
  return allURLApiChanges;
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
Transforms it to this format for "v2"
{
  "foo": "modified",
  "bar": "added",
  "fizz": "modified",
}
*/

/**
 * Used to replace the fetched data for navigator/index.json file
 * Takes an array of API objects with an array of version data to produce an array
 * of URL keys with a value of the API changefor the given version.
 * E.g. for the "foo" object in the array with versionID "v2",
 * "foo" : { "v4": "modified", "v3": added, "v2": "modified"} turns to
 * "foo" : "modified"
 * @param  {JSON} apiChanges, this usually is versionDifferences.swift or versionDifferences.objc found in index.json
 * @param  {string} versionID, the version of information
 * @returns  {JSON} A JSON array with URL keys and the API changes as their values.
 */
function generateVersionNavigationChanges(apiChanges, versionID) {
  const versionedURLs = {};
  Object.keys(apiChanges).forEach((url) => {
    if (apiChanges[url][versionID]) {
      versionedURLs[url] = apiChanges[url][versionID];
    }
  });
  return versionedURLs;
}

/*
Used to replace the navigator/interfacesLanguages data
Takes an array of json pbjects in this format:
{
  "swift": {
    "foo": {
    "v4": "modified",
    "v3": "modified",
    "v2": "added",
    },
  "bar": {
    "v4": "added",
    "v2": "added",
    "v1": "modified",
   },
  },
  "occ": {
    "foo": {
    "v4": "modified",
    "v3": "modified",
    "v2": "added",
    },
  "bar": {
    "v4": "added",
    "v2": "modified",
    "v1": "modified",
   },
  }
};
Transforms it to this format for "v2"
{
  "swift" :{
    "foo": "modified",
    "bar": "added",
  },
  "occ" :{
    "foo": "modified",
    "bar": "modified",
  }
}
*/

function generateLanguageNavigationChanges(apiChanges, versionID) {
  const languageUrlChanges = {};
  Object.keys(apiChanges).forEach((language) => {
    languageUrlChanges[language] = this.generateAllNavigationChanges(apiChanges.language, versionID);
  });
  return languageUrlChanges;
}

/*
transforms this
{
  "/documentation/fazz/boo" : "modified",
  "/documentation/fazz/lala" : "modified",
  "/documentation/fazz/gaga" : "modified"
}
using this data
references :{
  "doc://com.foo.barTech/documentation/fazz/boo": {
  "identifier" : "doc:\/\/com.foo.barTech\/documentation\/fazz\/boo\",
  "url" : "\/documentation\/fazz\/boo"
  },
  "doc://com.foo.barTech/documentation/fazz/lala": {
  "identifier" : "doc:\/\/com.foo.barTech\/documentation\/fazz\/lala\",
  "url" : "\/documentation\/fazz\/lala"
  },
}
to this:
{
  {
  "doc://com.foo.barTech/documentation/fazz/boo" : {
    change: "modified"
  },
   "doc://com.foo.barTech/documentation/fazz/lala" : {
    change: "modified"
  },
}
}
*/
/**
 * Used to create relevant API change file for each Rendernode in the correct format
 * Transforms the url/path data to use the identifiers
 * the Rendernode needs for API changes based on the references data
 * (tldr: using identifiers instead of paths/URLS)
 * @param  {JSON} Rendernode a Rendernode that is used to create documentation topics or tutorials
 * @param  {JSON} NavigationChanges a JSON file with navigation path/url changes in the correct format.
 * !This has to be generated language dependendent! e.g. NavigationChanges[preferredLanguage]
 * @returns {JSON} a json file with identifier objects and their respective change
 * Also the performance is o(n^2), which may need to be optimized
 * Need to find how to handle the '\/' in reference data
 */

function IdentifierAPIChangesFromNavigation(Rendernode, NavigationChanges) {
  const RendernodeReferences = Rendernode.references;
  const documentationTopicApiIdentifiers = {};
  Object.keys(NavigationChanges).forEach((path) => {
    Object.keys(RendernodeReferences).forEach((reference) => {
      if (reference.url === path) {
        const identifierApiChange = { change: NavigationChanges[path] };
        documentationTopicApiIdentifiers[reference] = identifierApiChange;
      }
    });
  });
  return documentationTopicApiIdentifiers;
}

/*
transforms this
{
  "/documentation/fazz/boo" : {
    change: "modified"
  },
   "/documentation/fazz/lala" : {
    change: "modified"
  },
   "/documentation/fazz/gaga" : {
    change: "modified"
  }
}
using this data
references :{
  "doc://com.foo.barTech/documentation/fazz/boo": {
  "identifier" : "doc:\/\/com.foo.barTech\/documentation\/fazz\/boo\",
  "url" : "\/documentation\/fazz\/boo"
  },
  "doc://com.foo.barTech/documentation/fazz/lala": {
  "identifier" : "doc:\/\/com.foo.barTech\/documentation\/fazz\/lala\",
  "url" : "\/documentation\/fazz\/lala"
  },
}
to this:
{
  {
  "doc://com.foo.barTech/documentation/fazz/boo" : {
    change: "modified"
  },
   "doc://com.foo.barTech/documentation/fazz/lala" : {
    change: "modified"
  },
}
}
*/
/**
 * Used to create relevant API change file for each Rendernode in the correct format
 * Transforms the url/path data to use the identifiers
 * the Rendernode needs for API changes based on the references data
 * (tldr: using identifiers instead of paths/URLS)
 * @param  {JSON} Rendernode a Rendernode that is used to create documentation topics or tutorials
 * @param  {JSON} allURLApiChanges a JSON file with urlAPI changes in the correct format.
 * !This has to be generated language dependendent!
 * @returns {JSON} a json file with identifier objects and their respective change
 * Also the performance is o(n^2), which may need to be optimized
 * Need to find how to handle the '\/' in reference data
 */
function IdentifierAPIChangesFromURL(Rendernode, allURLApiChanges) {
  const RendernodeReferences = Rendernode.references;
  const documentationTopicApiIdentifiers = {};
  Object.keys(allURLApiChanges).forEach((url) => {
    Object.keys(RendernodeReferences).forEach((reference) => {
      if (reference.url === url) {
        const identifierApiChange = { change: allURLApiChanges[url].change };
        documentationTopicApiIdentifiers[reference] = identifierApiChange;
      }
    });
  });
  return documentationTopicApiIdentifiers;
}

// eslint-disable-next-line import/prefer-default-export
export {};
