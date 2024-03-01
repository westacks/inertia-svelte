<script lang="ts" context="module">
    export type Layout = {
        component: InertiaComponentType
        props: PageProps,
        child?: Layout
    } | null

    export function h(component: InertiaComponentType | null, props: PageProps): Layout {
        if (!component) return null;
        if (!component.layout) return { component: component.default, props };

        return (Array.isArray(component.layout) ? component.layout : [component.layout])
            .concat([component.default])
            .reverse()
            .reduce((child, layout) => ({component: layout, props, child}), null)
    }
</script>

<script lang="ts">
    import type { InertiaComponentType } from '$lib/types';
    import type { PageProps } from '@inertiajs/core';

    export let component: InertiaComponentType | string | null = null
    export let props: PageProps = {}
    export let child: Layout = null
</script>

{#if component}
    {#key component}
        {#if typeof component === 'string'}
            <svelte:element this={component} {...props}>
                {#if child}
                    <svelte:self {...child} />
                {/if}
            </svelte:element>
        {:else}
            <svelte:component this={component} {...props}>
                {#if child}
                    <svelte:self {...child} />
                {/if}
            </svelte:component>
        {/if}
    {/key}
{/if}
