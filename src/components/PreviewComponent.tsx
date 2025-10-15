import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import nomnoml from 'nomnoml';

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
        remarkPlugins={[remarkGfm, remarkEmoji]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code(_props) {
            const { className, children, ...props } = _props as any;
            const isInlineFlag = (_props as any)?.inline as boolean | undefined;
            const isMermaid = /language-mermaid/.test(className || "");
            const isPlantUML = /language-plantuml/.test(className || "");
            
            if (isMermaid) {
              return (
                <div className="mermaid">
                  {String(children).replace(/\n$/, "")}
                </div>
              );
            }
            
            if (isPlantUML) {
              const umlCode = String(children).replace(/\n$/, "");
              
              // Render nomnoml diagram offline
              try {
                const svg = nomnoml.renderSvg(umlCode);
                
                return (
                  <div 
                    className="plantuml-diagram" 
                    style={{ textAlign: 'center', margin: '1em 0' }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                );
              } catch (error) {
                // If rendering fails, show the code with error message
                return (
                  <div className="plantuml-diagram" style={{ textAlign: 'center', margin: '1em 0', color: 'red' }}>
                    <p>Error rendering UML diagram:</p>
                    <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                      {String(error)}
                    </pre>
                    <details style={{ marginTop: '10px' }}>
                      <summary style={{ cursor: 'pointer' }}>View source code</summary>
                      <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                        {umlCode}
                      </pre>
                    </details>
                  </div>
                );
              }
            }
            
            // ReactMarkdown provides `inline` flag to distinguish inline vs fenced code
            const isInline = !!isInlineFlag;
            
            return (
              <code 
                className={`${isInline ? 'inline-code' : 'code-block'} ${className || ''}`} 
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            // Detect box-drawing characters so ASCII UI blocks render with fixed width
            const flatten = (nodes: any): string => {
              if (!nodes) return '';
              const arr = Array.isArray(nodes) ? nodes : [nodes];
              return arr
                .map((n) => {
                  if (typeof n === 'string') return n;
                  // Treat <br/> as newline
                  // @ts-ignore
                  if (n && n.type === 'br') return '\n';
                  // @ts-ignore
                  if (n && n.props && n.props.children) return flatten(n.props.children as any);
                  return '';
                })
                .join('');
            };

            const text = flatten(children);
            const hasBoxChars = /[\u2500-\u257F]/.test(text);
            const looksLikeAsciiArt = hasBoxChars && /\n/.test(text);

            if (looksLikeAsciiArt) {
              return (
                <pre className="ascii-art">{text}</pre>
              );
            }

            return <p>{children}</p>;
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