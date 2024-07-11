/* eslint-disable -- this is a prismic auto file */
import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'
import config from '../slicemachine.config.json'

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT ?? config.repositoryName

const routes: prismic.ClientConfig['routes'] = [
  // Examples:
  // {
  // 	type: "homepage",
  // 	path: "/",
  // },
  // {
  // 	type: "page",
  // 	path: "/:uid",
  // },
]
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === 'production'
        ? { next: { tags: ['prismic'] }, cache: 'force-cache' }
        : { next: { revalidate: 5 } },
    ...config,
  })

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client
}
