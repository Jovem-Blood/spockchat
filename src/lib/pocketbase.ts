import PocketBase from 'pocketbase'

import { writable } from 'svelte/store'

export const pb = new PocketBase('http://localhost:8090').autoCancellation(false)

export const currentUser = writable(pb.authStore.model)

pb.authStore.onChange((_auth) => {
  currentUser.set(pb.authStore.model)
})
