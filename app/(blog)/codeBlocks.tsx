"use client";
import { CheckmarkIcon, CopyIcon } from "@sanity/icons";
import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeBlocks = ({ value }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value?.code) return;
    await navigator.clipboard.writeText(value.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-10 relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-10  text-white rounded"
      >
        <div className="relative">
          <CopyIcon
            className={`absolute w-4 h-4 text-black  transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"}`}
          />
          <CheckmarkIcon
            className={`absolute w-4 h-4 transition-opacity text-black duration-300 ${copied ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </button>
      <SyntaxHighlighter
        language="react"
        style={docco}
        lineNumberStyle={{ color: "rgba(255, 255, 255, 0.5)" }}
        showInlineLineNumbers
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlocks;
