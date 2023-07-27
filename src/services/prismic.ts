import * as Prismic from "@prismicio/client";

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.createClient(
    process.env.PRISMIC_END_POINT,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN
    }
  )
  return prismic
}
