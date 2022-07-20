<template>
  <NavMenuItemBase class="nav-menu-setting language-container">
     <label>Show API Changes:  </label>
    <input
    type="checkbox"
    v-model="toggle"
    >
  </NavMenuItemBase>
</template>

<script>
import NavMenuItemBase from 'docc-render/components/NavMenuItemBase.vue';

export default {
  name: 'ShowApiChangesToggle',
  components: { NavMenuItemBase },
  watch: {
    toggle(newValue) {
      this.store.setShowAPIVersionChanges(newValue);
      if (newValue === false) {
        this.store.setComparedVersion(null);
      }
    },
  },
  created() {
    console.log('created', this.docState.showAPIVersionChanges);
    this.toggle = this.docState.showAPIVersionChanges;
  },
  data() {
    return {
      docState: this.store.state,
      toggle: false,
    };
  },
  computed: {
    currentShowApiChanges() {
      return this.docState.showApiChanges;
    },
  },
  inject: {
    store: {
      default() {
        return {
          setShowAPIVersionChanges() {},
          state: { showApiChanges: false },
        };
      },
    },
  },
};

</script>

<style lang="scss" scoped>
@import 'docc-render/styles/_core.scss';

$dropdown-icon-padding: 11px;
$nav-menu-toggle-label-margin: 6px;

.nav-menu-setting-label {
  margin-right: $nav-menu-label-margin;
  white-space: nowrap;
}

.language {
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

.language-list {
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
