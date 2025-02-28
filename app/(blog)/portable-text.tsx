/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */
import CodeBlocks from "./codeBlocks";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";

interface ImageBlockProps {
  value: {
    alt?: string;
    caption?: string;
    asset?: {
      _ref: string;
    };
  };
}

function ImageBlock({ value }: ImageBlockProps) {
  if (!value?.asset?._ref) {
    return null;
  }

  return (
    <figure className="my-8">
      <Image
        className="mx-auto rounded-md"
        width={800}
        height={500}
        alt={value.alt || ""}
        src={urlForImage(value)?.width(800).height(500).fit("max").url() as string}
        sizes="(min-width: 800px) 800px, 100vw"
      />
      {value.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    types: {
      code: ({ value }: any) => {
        return <CodeBlocks value={value} />;
      },
      image: ({ value }: ImageBlockProps) => {
        return <ImageBlock value={value} />;
      },
    },
    block: {
      h5: ({ children }) => (
        <h5 className="mb-2 text-sm font-semibold">{children}</h5>
      ),
      h6: ({ children }) => (
        <h6 className="mb-1 text-xs font-semibold">{children}</h6>
      ),
    },

    marks: {
      link: ({ children, value }) => {
        return (
          <a href={value?.href} rel="noreferrer noopener">
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className={["prose", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value}/>
    </div>
  );
}
