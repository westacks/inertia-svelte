# Inertia.js Svelte Adapter

Visit [inertiajs.com](https://inertiajs.com/) to learn more.

### Initialize app


```js
// app.js

import { createInertiaApp } from '@westacks/inertia-svelte'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { mount } from "svelte";

createInertiaApp({
    resolve: name => resolvePageComponent(`./pages/${name}.svelte`, import.meta.glob('./pages/**/*.svelte')),
    setup({ el, App, props }) {
        mount(App, {target: el, props})
    }
})
```

```js
// ssr.js

import createServer from '@westacks/inertia-svelte/server'
import { createInertiaApp } from '@westacks/inertia-svelte'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { render } from 'svelte/server'

createServer(page => createInertiaApp({
    page,
    resolve: name => resolvePageComponent(`./pages/${name}.svelte`, import.meta.glob('./pages/**/*.svelte')),
    setup: ({App, props}) => render(App, { props })
}))
