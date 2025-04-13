import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import authorType from "./author";

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the post to show up in the preview",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "code",
          name: "code",
          title: "Code Blocks",
          options: {
            languageAlternatives: [
              { title: "", value: "" },
              {title:"Yaml",value:"yaml"},
              { title: "Javascript", value: "javascript" },
              { title: "HTML", value: "html" },
              { title: "Jsx", value: "jsx" },
              { title: "CSS", value: "css" },
              { title: "React", value: "react" },
              { title: "Node", value: "node" },
              { title: "MySql", value: "mysql" },
              { title: "Bash", value: "bash" },
              { title: "Python", value: "python" },
              { title: "TypeScript", value: "typescript" },
              { title: "Java", value: "java" },
              { title: "PHP", value: "php" },
              { title: "Ruby", value: "ruby" },
              { title: "Go", value: "go" },
              { title: "C#", value: "csharp" },
              { title: "C++", value: "cpp" },
              { title: "Rust", value: "rust" },
              { title: "Shell", value: "shell" },
              { title: "ZH", value: "zh", mode: "sh" },
            ],
            withFilename: true,
          },
        },
        {
          type: "table",
          name: "table",
          title: "Table",
        },
        {
          type: "image",
          name: "image",
          title: "Image",
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: "alt",
            },
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
              validation: (rule) => rule.required(),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption text that appears below the image",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: authorType.name }],
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
      options: { layout: "tags" },
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "date",
      media: "coverImage",
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
