import { cn } from "@/lib/utils";
import * as demo from "@/sanity/lib/demo";
import PortableText from "@/app/(blog)/portable-text";

export function Intro(props: {
  title: string | null | undefined;
  description: any;
  textClassname?: string;
}) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
      <h1
        className={cn(
          "text-balance text-6xl font-bold leading-tight tracking-tighter lg:pr-8 lg:text-8xl",
          props.textClassname
        )}
      >
        {title || demo.title}
      </h1>

      <h2 className="text-pretty mt-5 text-center text-sm lg:pl-8 lg:text-left sr-only">
        <PortableText
          className="prose-lg"
          value={description?.length ? description : demo.description}
        />
      </h2>
    </section>
  );
}
