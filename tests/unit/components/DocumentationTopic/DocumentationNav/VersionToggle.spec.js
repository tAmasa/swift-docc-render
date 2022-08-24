/**
 * This source file is part of the Swift.org open source project
 *
 * Copyright (c) 2022 Apple Inc. and the Swift project authors
 * Licensed under Apache License v2.0 with Runtime Library Exception
 *
 * See https://swift.org/LICENSE.txt for license information
 * See https://swift.org/CONTRIBUTORS.txt for Swift project authors
*/

import { RouterLinkStub, shallowMount } from '@vue/test-utils';
import DocumentationTopicStore from 'docc-render/stores/DocumentationTopicStore';
import VersionToggle
  from 'docc-render/components/DocumentationTopic/DocumentationNav/VersionToggle.vue';
import { flushPromises } from '../../../../../test-utils';

const { NavMenuItemBase } = VersionToggle.components;

describe('VersionToggle`', () => {
  let wrapper;

  const propsData = {
    versionList: ['V3, V2, V1'],
  };

  const mocks = {
    $route: {
      path: '/documentation/foo',
    },
    $router: {
      push: jest.fn(),
    },
  };

  const provide = {
    store: {
      setPreferredVersion: jest.fn(),
    },
  };

  const stubs = {
    'router-link': RouterLinkStub,
  };

  const createWrapper = (props = propsData, mocksData = mocks) => (
    shallowMount(VersionToggle, {
      mocks: mocksData,
      propsData: props,
      provide,
      stubs,
    })
  );

  beforeEach(() => {
    wrapper = createWrapper();
    localStorage.clear();
    DocumentationTopicStore.reset();
  });

  it('renders `NavMenuItemBase` at the root', () => {
    const menuItemBase = wrapper.find(NavMenuItemBase);
    expect(menuItemBase.exists()).toBe(true);
    expect(menuItemBase.classes()).toContain('nav-menu-setting');
    expect(menuItemBase.classes()).toContain('version-container');
  });

  it('does not render the version toggle component when there are no versions', () => {
    const toggle = wrapper.find('#version-toggle');
    expect(toggle.exists()).toBe(false);
  });

  it('renders the single version element when the page contains single page', () => {
    wrapper.setProps({
      versionList: ['V3'],
    });
    const toggle = wrapper.find('#single-version-page');
    expect(toggle.exists()).toBe(true);
  });

  it('renders the version toggle element when the page contains multiples pages', async () => {
    wrapper.setProps({
      versionList: ['V3', 'V2'],
    });
    await flushPromises();
    const toggle = wrapper.find('#version-toggle');
    expect(toggle.exists()).toBe(true);
  });

  it('renders options inside select for each version', () => {
    wrapper.setProps({
      versionList: ['V3', 'V2', 'V1'],
    });
    const options = wrapper.findAll('#version-toggle option');
    expect(options.length).toBe(3);

    expect(options.at(0).attributes('value')).toBe('V3');
    expect(options.at(0).text()).toBe('V3');

    expect(options.at(1).attributes('value')).toBe('V2');
    expect(options.at(1).text()).toBe('V2');

    expect(options.at(2).attributes('value')).toBe('V1');
    expect(options.at(2).text()).toBe('V1');
  });

  it('calls router and changes v-model when different option is selected', async () => {
    wrapper.setProps({
      versionList: ['V3', 'V2', 'V1'],
    });

    expect(wrapper.find('#version-toggle').element.value).toBe('V3');

    wrapper.findAll('#version-toggle option').at(2).setSelected();

    const options = wrapper.find('#version-toggle').findAll('option');

    await options.at(2).setSelected();

    expect(wrapper.find('#version-toggle').element.value).toBe('V1');
    expect(mocks.$router.push).toHaveBeenCalledWith({ path: '/documentation/foo', query: { version: 'V1' } });
    expect(provide.store.setPreferredVersion).toHaveBeenCalledWith('V1');
  });

  it('clears out the language query if version is the most recent version', async () => {
    wrapper.setProps({
      versionList: ['V3', 'V2', 'V1'],
    });
    await flushPromises();
    expect(wrapper.find('#version-toggle').element.value).toBe('V3');

    wrapper.findAll('#version-toggle option').at(0).setSelected();

    const options = wrapper.find('#version-toggle').findAll('option');

    await options.at(0).setSelected();

    expect(mocks.$router.push).toHaveBeenCalledWith({ path: '/documentation/foo', query: { version: undefined } });

    // const link = wrapper.find('.version-list-container').find('a.nav-menu-link');
    // expect(link.props('to').query).toEqual({ version: undefined });
  });

  it('keeps extra query parameters when changing version', async () => {
    const query = {
      foo: 'foo',
      bar: 'bar',
    };
    const postVersionQuery = {
      foo: 'foo',
      bar: 'bar',
      version: 'V1',
    };
    const mocksWithQuery = {
      ...mocks,
      $route: {
        path: '/documentation/foo',
        query,
      },
    };
    wrapper = createWrapper(undefined, mocksWithQuery);
    wrapper.setProps({
      versionList: ['V3', 'V2', 'V1'],
    });

    wrapper.findAll('#version-toggle option').at(2).setSelected();

    const options = wrapper.find('#version-toggle').findAll('option');

    await options.at(2).setSelected();

    expect(wrapper.find('#version-toggle').element.value).toBe('V1');
    expect(mocks.$router.push).toHaveBeenCalledWith({ path: '/documentation/foo', query: postVersionQuery });
    // expect(mocks.$route).toEqual((query));
  });

  it('changes the model, if the preferred version changes and is within the versionlist for the page', async () => {
    wrapper = shallowMount(VersionToggle, {
      mocks,
      propsData,
      provide: {
        store: DocumentationTopicStore,
      },
      stubs,
    });

    DocumentationTopicStore.setPreferredVersion('V2');
    expect(DocumentationTopicStore.state.preferredVersion).toBe('V2');

    await flushPromises();
    wrapper.setProps({
      versionList: ['V3', 'V2', 'V1'],
    });
    expect(wrapper.find('#version-toggle').element.value).toBe('V2');
  });

  it('does not change the model, if the preferred version changes and is not within the versionlist for the page', async () => {
    wrapper = shallowMount(VersionToggle, {
      mocks,
      propsData,
      provide: {
        store: DocumentationTopicStore,
      },
      stubs,
    });

    DocumentationTopicStore.setPreferredVersion('FOO');
    expect(DocumentationTopicStore.state.preferredVersion).toBe('FOO');

    await flushPromises();
    wrapper.setProps({
      versionList: ['V3', 'V2', 'V1'],
    });
    expect(wrapper.find('#version-toggle').element.value).toBe('V3');
  });
});
