import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';

interface PreviewComponentProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  editorContent: string;
  isPreviewFull: boolean;
  isHorizontal: boolean;
  initializeMermaid: () => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = React.memo(({
  previewRef,
  editorContent,
  isPreviewFull,
  isHorizontal,
  initializeMermaid
}) => {
  // Effect for view mode changes
  useEffect(() => {
    const reinitializeMermaid = async () => {
      try {
        // Reset mermaid
        mermaid.initialize({ startOnLoad: true });
        // Clear any existing diagrams
        document.querySelectorAll('.mermaid').forEach(node => {
          node.removeAttribute('data-processed');
        });
        // Force re-render
        await mermaid.init();
        initializeMermaid();
      } catch (error) {
        console.error('Mermaid initialization failed:', error);
      }
    };

    const timer = setTimeout(reinitializeMermaid, 100);
    return () => clearTimeout(timer);
  }, [isPreviewFull, isHorizontal, initializeMermaid]);

  // Effect for content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      mermaid.initialize({ startOnLoad: true });
      initializeMermaid();
    }, 100);
    return () => clearTimeout(timer);
  }, [editorContent, initializeMermaid]);

  useEffect(() => {
    if (!previewRef.current) return;

    const observer = new MutationObserver(() => {
      if (previewRef.current) {
        setTimeout(() => {
          previewRef.current!.scrollTop = previewRef.current!.scrollHeight;
        }, 100);
      }
    });

    observer.observe(previewRef.current, {
      childList: true,
      subtree: true,
      attributes: true
    });

    setTimeout(() => {
      if (previewRef.current) {
        previewRef.current.scrollTop = previewRef.current.scrollHeight;
      }
    }, 100);

    return () => observer.disconnect();
  }, [editorContent]);

  return (
    <div
      className={
        isPreviewFull
          ? 'preview-horizontal-full'
          : isHorizontal
            ? 'preview-horizontal'
            : 'preview-parallel'
      }
      ref={previewRef}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-mermaid/.test(className || "");
            if (match) {
              return (
                <div className="mermaid">
                  {String(children).replace(/\n$/, "")}
                </div>
              );
            }
            const isInline = !className;
            
            return (
              <code 
                className={`${isInline ? 'inline-code' : 'code-block'} ${className || ''}`} 
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return (
              <pre className="code-block-container">
                {children}
              </pre>
            );
          }
        }}
      >
        {editorContent}
      </ReactMarkdown>
    </div>
  );
});

export default PreviewComponent;