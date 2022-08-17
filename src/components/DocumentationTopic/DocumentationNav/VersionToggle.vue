<!--
  This source file is part of the Swift.org open source project

  Copyright (c) 2022 Apple Inc. and the Swift project authors
  Licensed under Apache License v2.0 with Runtime Library Exception

  See https://swift.org/LICENSE.txt for license information
  See https://swift.org/CONTRIBUTORS.txt for Swift project authors
-->

<template>
  <NavMenuItemBase class="nav-menu-setting version-container">
    <div :class="{ 'version-toggle-container': hasMultipleVersions }">
      <!-- Faux element to get width of select, with current element-->
      <select
        class="version-dropdown version-sizer"
        ref="version-sizer"
        aria-hidden="true"
        tabindex="-1"
      >
        <option selected>{{ versionModel }}</option>
      </select>
      <!-- Faux element is above -->
      <label
        :for="versionList.length ? 'version-toggle' : null"
        class="nav-menu-setting-label"
        >Version:</label
      >
      <select
        v-if="versionList.length > 1"
        id="version-toggle"
        class="version-dropdown nav-menu-link"
        :style="`width: ${adjustedWidth}px`"
        v-model="versionModel"
        @change="pushRoute(versionRoute)"
      >
        <option v-for="version in versionList" :key="version" :value="version">
          {{ version }}
        </option>
      </select>
      <span
        v-else-if="singleVersionPage"
        class="nav-menu-toggle-none current-version"
        aria-current="page"
        >{{ singleVersionPage }}</span
      >
      <InlineChevronDownIcon
        v-if="hasMultipleVersions"
        class="toggle-icon icon-inline"
      />
    </div>
  </NavMenuItemBase>
</template>

<script>
import DocumentationTopicStore from 'docc-render/stores/DocumentationTopicStore';
import { waitFrames } from 'docc-render/utils/loading';
import debounce from 'docc-render/utils/debounce';
import NavMenuItemBase from 'docc-render/components/NavMenuItemBase.vue';
import InlineChevronDownIcon from 'theme/components/Icons/InlineChevronDownIcon.vue';

export default {
  name: 'VersionToggle',
  components: { InlineChevronDownIcon, NavMenuItemBase },
  inject: {
    store: {
      default() {
        return {
          setPreferredVersion() {},
        };
      },
    },
  },
  props: {
    versionList: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      adjustedWidth: 0,
      versionModel: null,
    };
  },
  mounted() {
    // on resize, re-calculate the width of the select.
    const cb = debounce(
      async () => {
        // we wait for 3 frames, as that is the minimum it takes
        // for the browser orientation-change transitions to finish
        await waitFrames(3);
        this.calculateSelectWidth();
      },
      150,
      true,
    );
    window.addEventListener('resize', cb);
    window.addEventListener('orientationchange', cb);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', cb);
      window.removeEventListener('orientationchange', cb);
    });
  },
  updated() {
    this.versionModel = this.currentVersion;
  },
  watch: {
    // interfaceversion: {
    //   immediate: true,
    //   handler(version) {
    //     this.versionModel = version;
    //   },
    // },
    versionModel: {
      immediate: true,
      handler: 'calculateSelectWidth',
    },
  },
  methods: {
    /**
     * Returns a formatted route object
     * @param {{ query: string, path: string }} route - a config object passed by the render JSON
     * @returns {{ path: (null|string), query: { version: (string|undefined) }}}
     */
    getRoute(route) {
      // pass undefined to remove the query param if its most recent version
      const version = route.query === this.versionList[0] ? undefined : route.query;
      return {
        // make sure we dont loose any extra query params on the way
        query: { ...this.$route.query, version },
        path: this.isCurrentPath(route.path) ? null : this.normalizePath(route.path),
      };
    },
    pushRoute(route) {
      // Persist the selected version as a preference in the store (backed by
      // the browser's local storage so that it can be retrieved later for
      // subsequent navigation without the query parameter present)
      this.store.setPreferredVersion(route.query);
      // Navigate to the version variant page
      this.$router.push(this.getRoute(route));
    },
    isCurrentPath(path) {
      // the `.replace` call is needed since paths vended by the backend do not
      // include a leading slash, while the router provided path does
      return this.$route.path.replace(/^\//, '') === path;
    },
    normalizePath(path) {
      // Sometimes `paths` data from `variants` are prefixed with a leading
      // slash and sometimes they aren't
      return path.startsWith('/') ? path : `/${path}`;
    },
    /**
     * Calculated the width of the select by fetching it from the faux select.
     * @return {Promise<void>}
     */
    async calculateSelectWidth() {
      // await next tick, so we are sure the element is rendered.
      await this.$nextTick();
      this.adjustedWidth = this.$refs['version-sizer'].clientWidth + 6;
    },
  },
  computed: {
    singleVersionPage() {
      return this.versionList && this.versionList.length === 1 ? this.versionList[0] : null;
    },
    hasMultipleVersions: ({ versionList }) => versionList.length > 1,
    versionRoute() {
      return {
        // make sure we dont loose any extra query params on the way
        query: this.versionModel,
        // need to fix to get default
        path: this.$route.path,
      };
    },
    currentVersion() {
      // Check if versionModel toggle is being used

      // If it hasnt been used, check the state.
      if (
        DocumentationTopicStore.state.preferredVersion
        && this.versionList
        && this.versionList.includes(DocumentationTopicStore.state.preferredVersion)
      ) {
        return DocumentationTopicStore.state.preferredVersion;
      }
      // If the version doesn't exist.
      return this.versionList[0];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "docc-render/styles/_core.scss";

$dropdown-icon-padding: 11px;
$nav-menu-toggle-label-margin: 6px;

.nav-menu-setting-label {
  margin-right: $nav-menu-label-margin;
  white-space: nowrap;
}

.version {
  &-dropdown {
    -webkit-text-size-adjust: none;
    appearance: none;
    border: none;
    background-color: transparent;
    box-sizing: inherit;
    // add left padding, but then nudge it back, so we have a consistent spacing with the label.
    padding: 0 $dropdown-icon-padding 0 4px;
    margin-left: -4px;
    @include font-styles(nav-toggles);

    // remove the default focus styles, and re-add them on keyboard navigation, only.
    &:focus {
      outline: none;
    }

    @include on-keyboard-focus() {
      @include focus-outline();
    }
  }

  &-sizer {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    padding: 0;
  }

  &-toggle {
    &-container {
      display: flex;
      align-items: center;
      padding-right: rem(3px);
      position: relative;

      @include nav-in-breakpoint() {
        display: none;
      }

      .toggle-icon {
        width: 0.6em;
        height: 0.6em;
        position: absolute;
        right: 7px;
      }
    }

    &-label {
      margin-right: 2px;
    }

    &.nav-menu-toggle-label {
      margin-right: $nav-menu-toggle-label-margin;
    }
  }
}

.version-list {
  display: inline-block;
  margin-top: 0;

  &-container {
    display: none;

    @include nav-in-breakpoint() {
      display: inline-block;
    }
  }

  &-item {
    display: inline-block;

    &:not(:first-child) {
      border-left: 1px solid dark-color(fill-gray-tertiary);
      margin-left: $nav-menu-toggle-label-margin;
      padding-left: $nav-menu-toggle-label-margin;
    }
  }
}
</style>
