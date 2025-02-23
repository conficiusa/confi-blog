import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
  "topics": topics[]->{
    _id,
    title,
    color,
    "slug": slug.current
  }
`;

export const postsByTopicQuery = defineQuery(`
  *[_type == "post" && $topicId in topics[]._ref] | order(date desc) {
    ${postFields}
  }
`);

export const topicsQuery = defineQuery(`
  *[_type == "topic"] {
    _id,
    title,
    color,
    "slug":
      slug.current,
  }
`);

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

export const postsByInterestsQuery = defineQuery(`
  *[_type == "post" && count((topics[]._ref)[@ in $interests]) > 0] | order(date desc) {
    ${postFields}
  }[0...11]
`);
