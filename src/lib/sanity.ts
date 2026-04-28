import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: "h3kwrsuj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

export async function getPosts() {
  return await client.fetch(`*[_type == "post"]{_id, title}`)
}