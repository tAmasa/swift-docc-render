/* eslint-disable no-plusplus */
import { apply } from './json-patch';
import { clone } from './data';

function getDiffIndex(displayName, data) {
  const index = data.versions.findIndex(item => item.version.displayName === displayName);
  return index;
  // let index = -1;
  // data.versions.find((item, i) => {
  //   if (item.version.displayName === displayName) {
  //     index = i;
  //     return index;
  //   }
  // });
  // return index;
}

function patchToVersion(displayName, data) {
  if (displayName === data.metadata.version.displayName) {
    return data;
  }
  const patchIndex = getDiffIndex(displayName, data);
  if (patchIndex === -1) {
    return data;
  }
  console.log('patchIndex', patchIndex);
  //
  let patchJSON = clone(data);
  for (let i = 0; i <= patchIndex; i++) {
    console.log('applied this patch', data.versions[i].patch);
    patchJSON = apply(patchJSON, data.versions[i].patch);
    console.log('postpatch', patchJSON);
    // console.log(data.versions[i].patch);
  }
  return patchJSON;
}

// eslint-disable-next-line import/prefer-default-export
export { patchToVersion };
