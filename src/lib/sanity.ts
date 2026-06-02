import { createClient } from '@sanity/client'
import * as Sentry from "@sentry/nextjs";

export const client = createClient({
  projectId: "h3kwrsuj",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

export async function getPosts() {
  try {
    return await client.fetch(`*[_type == "post"]{_id, title}`)
  } catch (err) {
    Sentry.captureException(err);
    return [];
  }
}