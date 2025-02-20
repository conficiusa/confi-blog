import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "topic",
  title: "Topic",
  icon: DocumentIcon,
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
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    // New color field with predetermined options
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      options: {
        list: [
          { title: "Red", value: "red" },
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Orange", value: "orange" },
          { title: "Purple", value: "purple" },
          { title: "Yellow", value: "yellow" },
          { title: "Pink", value: "pink" },
          { title: "Brown", value: "brown" },
          { title: "Indigo", value: "indigo" },
          { title: "Cyan", value: "cyan" },
          { title: "Lime", value: "lime" },
          { title: "Teal", value: "teal" },
          { title: "Gray", value: "gray" },
          { title: "Black", value: "black" }
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
