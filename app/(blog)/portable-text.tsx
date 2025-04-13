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

interface TableProps {
  value: {
    rows?: {
      cells: string[];
    }[];
  };
}

function TableBlock({ value }: TableProps) {
  const { rows = [] } = value;

  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <div className="my-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => {
                if (rowIndex === 0) {
                  return (
                    <th
                      key={cellIndex}
                      className="bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      {cell}
                    </th>
                  );
                }
                return (
                  <td key={cellIndex} className="px-4 py-3 text-sm">
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
      table: ({ value }: TableProps) => {
        return <TableBlock value={value} />;
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
