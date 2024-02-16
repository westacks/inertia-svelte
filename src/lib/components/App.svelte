<script lang="ts">
  import type { Page } from '@inertiajs/core'
  import type { ComponentResolver } from '../types'
  import Render, { h } from './Render.svelte'
  import store from '../store'

  export let initialPage: Page | null = null
  export let resolveComponent: ComponentResolver | null = null

  $: child = $store.component && h($store.component.default, $store.page?.props)
  $: layout = $store.component && $store.component.layout
  $: components = layout
    ? Array.isArray(layout)
      ? layout
          .concat(child)
          .reverse()
          .reduce((child, layout) => h(layout, $store.page?.props, [child]))
      : h(layout, $store.page?.props, [child])
    : child
</script>

<Render {...components} />
