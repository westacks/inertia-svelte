<script lang="ts">
    import store from '$lib/store'
    import Render, { h } from './Render.svelte';

    $$restProps;
</script>

<Render {...h($store.component, $store.page?.props || {})} />