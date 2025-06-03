import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "@/components/CopyButton";

interface Props {
  isDarkMode: boolean;
  isUser: boolean;
}

export function createMarkdownComponents({
  isDarkMode,
  isUser,
}: Props) {
  // Custom component for code
  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    console.log("CodeBlock props", props);
    console.log("inline", inline);

    if (node.position.start.line === node.position.end.line) {
      return <InlineCode>{children}</InlineCode>;
    }

    return (
      <div className="relative group">
        {/* Language badge */}
        <div
          className={`flex items-center justify-between text-base-content/60 border-b-1 border-base-content/20 rounded-t-lg p-1${
            isUser && !isDarkMode ? " bg-base-100" : " bg-base-300"
          }`}
        >
          <span className="badge badge-sm text-base-content/60 bg-transparent border-transparent">
            {language && language.toUpperCase()}
          </span>
          <CopyButton text={children} />
        </div>

        {/* Syntax highlighters */}
        <SyntaxHighlighter
          style={isDarkMode ? oneDark : oneLight}
          language={language}
          PreTag="div"
          wrapLines={false}
          showLineNumbers={false}
          customStyle={{
            margin: 0,
            borderRadius: `${"0.5rem"}`,
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            backgroundColor:
              isUser && !isDarkMode
                ? "var(--color-base-100)"
                : "var(--color-base-300)",
          }}
          codeTagProps={{
            style: {
              fontSize: "0.875rem",
              fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
            },
          }}
          {...props}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    );
  };

  const InlineCode = ({ children, className, ...props }: any) => {
    return (
      <code
        className="bg-base-200 px-0.8 border-4 border-base-content/20 text-sm italic font-mono text-primary"
        {...props}
      >
        {children}
      </code>
    );
  };

  // Component for quotations
  const BlockQuote = ({ children }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 my-2 italic text-base-content/80">
      {children}
    </blockquote>
  );

  // Component for panels
  const Table = ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="table table-zebra table-sm w-full">{children}</table>
    </div>
  );

  const TableHead = ({ children }: any) => (
    <thead className="bg-base-200">{children}</thead>
  );

  const TableRow = ({ children }: any) => (
    <tr className="hover:bg-base-100">{children}</tr>
  );

  const TableCell = ({ children }: any) => (
    <td className="px-3 py-2">{children}</td>
  );

  const TableHeaderCell = ({ children }: any) => (
    <th className="px-3 py-2 font-semibold">{children}</th>
  );

  return {
    code: CodeBlock,
    blockquote: BlockQuote,
    table: Table,
    thead: TableHead,
    tr: TableRow,
    td: TableCell,
    th: TableHeaderCell,
    // Link customization
    a: ({ children, href, ...props }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="link link-primary hover:link-accent transition-colors"
        {...props}
      >
        {children}
      </a>
    ),
    // List customization
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
    ),
    li: ({ children }: any) => <li className="ml-2">{children}</li>,
    // Title customization
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>
    ),
    // Paragraph customization
    p: ({ children }: any) => (
      <p className="mb-2 leading-relaxed w-full">{children}</p>
    ),
  };
}
