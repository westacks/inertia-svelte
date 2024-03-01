import { type Page, router, setupProgress, type InertiaAppResponse } from '@inertiajs/core'
import type { ComponentResolver, InertiaComponentType } from './types'
import type { RenderOutput } from 'svelte/server'
import SvelteApp from './components/App.svelte'
import SSR from './components/SSR.svelte'
import store from './store'
import type { ComponentType } from 'svelte'

interface CreateInertiaAppProps<T = RenderOutput | SvelteApp | void> {
  id?: string
  resolve: ComponentResolver
  setup: (props: {
    el: Element
    App: ComponentType
    props?: {
      id: string
      initialPage: Page
    }
  }) => T
  progress?:
    | false
    | {
        delay?: number
        color?: string
        includeCSS?: boolean
        showSpinner?: boolean
      }
  page?: Page
}

async function makeStore(resolve: ComponentResolver, initialPage: Page) {
  const resolveComponent = (name: string) => Promise.resolve(resolve(name))

  await resolveComponent(initialPage.component).then((initialComponent) => {
    store.set({
      component: initialComponent as unknown as InertiaComponentType,
      page: initialPage,
    })
  })

  return resolveComponent
}

async function createSpaApp({ id = 'app', resolve, progress, setup }: CreateInertiaAppProps<void | SvelteApp>): InertiaAppResponse {
  const el = document.getElementById(id)
  const initialPage = JSON.parse(el?.dataset.page ?? '{}')

  if (!el) {
    throw new Error(`Element with ID "${id}" not found.`)
  }

  router.init({
    initialPage,
    resolveComponent: await makeStore(resolve, initialPage),
    swapComponent: async ({ component, page, preserveState }) => {
      store.update((current) => ({
        component: component as InertiaComponentType,
        page,
        key: preserveState ? current.key : Date.now(),
      }))
    },
  })

  if (progress) {
    setupProgress(progress)
  }

  // @ts-ignore
  setup({ el, App: SvelteApp })
}

async function createSsrApp({ id = 'app', page, setup, resolve }: CreateInertiaAppProps<RenderOutput>): InertiaAppResponse {
  if (!page) {
    throw new Error('Page is required for SSR')
  }

  await makeStore(resolve, page)

  // @ts-ignore
  const {html, head} = setup({ App: SSR, props: {id, initialPage: page} })

  return {
    body: html,
    head: [head],
  }
}

export default async function createInertiaApp(props: CreateInertiaAppProps): InertiaAppResponse {
  return typeof window === 'undefined' ?
    await createSsrApp(props as CreateInertiaAppProps<RenderOutput>) :
    await createSpaApp(props as CreateInertiaAppProps<void | SvelteApp>)
}
