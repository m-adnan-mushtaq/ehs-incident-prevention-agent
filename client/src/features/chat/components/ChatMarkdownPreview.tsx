import MarkdownPreview from "@uiw/react-markdown-preview";
import "@uiw/react-markdown-preview/markdown.css";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Props = {
  source?: string | null;
  className?: string;
};

const rehypeRewrite: NonNullable<
  ComponentProps<typeof MarkdownPreview>["rehypeRewrite"]
> = (node, _index, parent) => {
  if (
    node.type !== "element" ||
    node.tagName !== "a" ||
    !parent ||
    parent.type !== "element"
  ) {
    return;
  }
  if (/^h(1|2|3|4|5|6)/.test(parent.tagName)) {
    parent.children = parent.children.slice(1);
  }
};

export const ChatMarkdownPreview = ({ source, className }: Props) => {
  const text = source?.trim();
  if (!text) return null;

  return (
    <div
      data-color-mode="light"
      className={cn("chat-markdown-preview", className)}
    >
      <MarkdownPreview
        source={text}
        style={{ padding: 0, backgroundColor: "transparent" }}
        rehypeRewrite={rehypeRewrite}
      />
    </div>
  );
};
