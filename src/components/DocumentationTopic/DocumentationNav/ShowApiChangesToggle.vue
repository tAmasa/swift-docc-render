<template>
  <NavMenuItemBase class="nav-menu-setting language-container">
     <label>Show API Changes:  &nbsp; </label>
    <label class="toggle">
    <input
      class="toggle__input"
      type="checkbox"
      :checked="docState.showAPIVersionChanges"
      @input="store.setShowAPIVersionChanges($event.target.checked)"
    >
    <div class="toggle__fill"></div>
    </label>
  </NavMenuItemBase>
</template>

<script>
import NavMenuItemBase from 'docc-render/components/NavMenuItemBase.vue';

export default {
  name: 'ShowApiChangesToggle',
  components: { NavMenuItemBase },
  data() {
    return {
      docState: this.store.state,
    };
  },
  inject: {
    store: {
      default() {
        return {
          setShowAPIVersionChanges() {},
          state: { showAPIVersionChanges: false },
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

.toggle {
  --width: 30px;
  --height: calc(var(--width) / 2);
  --border-radius: calc(var(--height) / 2);

  display: inline-block;
  cursor: pointer;
}

.toggle__input {
  display: none;
}

.toggle__fill {
  position: relative;
  width: var(--width);
  height: var(--height);
  border-radius: var(--border-radius);
  background: #dddddd;
  transition: background 0.2s;
}

.toggle__input:checked ~ .toggle__fill {
  background: #4ED164;
}

.toggle__fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: var(--height);
  width: var(--height);
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  border-radius: var(--border-radius);
  transition: transform 0.2s;
}

.toggle__input:checked ~ .toggle__fill::after {
  transform: translateX(var(--height));
}

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
