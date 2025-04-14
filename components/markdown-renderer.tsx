"use client"

import ReactMarkdown from "react-markdown"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-code:text-accent max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6 glow-text" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-3 mt-4" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-primary hover:text-primary/80 underline transition-colors" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="my-4 list-disc pl-6" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-4 list-decimal pl-6" {...props} />,
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-foreground/80" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            return !inline ? (
              <pre className="p-4 rounded-md my-4 bg-muted/50 overflow-x-auto">
                <code className="text-sm" {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            )
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-border" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-muted/30" {...props} />,
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => <td className="px-4 py-3 text-sm" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
