
import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <ReactMarkdown
      className={cn("prose dark:prose-invert max-w-none", className)}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-3 mb-1" {...props} />,
        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-2" {...props} />
        ),
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
          ) : (
            <pre className="bg-muted p-2 rounded-md overflow-x-auto my-2 text-sm">
              <code {...props} />
            </pre>
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
