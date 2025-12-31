
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import mermaid from 'mermaid';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const saveAsPDF = async (editorContent: string) => {
    try {
        const pdf = new jsPDF();
        let currentY = 10;
    
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);
    
        const sections = editorContent.split(/(```mermaid[\s\S]*?```)/);
    
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
    
          if (section.startsWith('```mermaid')) {
            // Pre-calculate mermaid diagram height
            const diagramContent = section
              .replace('```mermaid', '')
              .replace('```', '')
              .trim();
    
            const svg = await mermaid.render('mermaid-' + i, diagramContent);
            const mermaidDiv = document.createElement('div');
            mermaidDiv.innerHTML = svg.svg;
            container.appendChild(mermaidDiv);
    
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const diagramCanvas = await html2canvas(mermaidDiv, {
              logging: false,
              scale: 2
            });
    
            const imageHeight = (diagramCanvas.height * 190) / diagramCanvas.width;
    
            // Check if diagram needs new page
            if (currentY + imageHeight > pdf.internal.pageSize.height - 10) {
              pdf.addPage();
              currentY = 10;
            }
    
            pdf.addImage(
              diagramCanvas.toDataURL('image/png'),
              'PNG',
              10,
              currentY,
              190,
              imageHeight
            );
            currentY += imageHeight + 10;
            container.removeChild(mermaidDiv);
          } else if (section.trim()) {
            const markdownDiv = document.createElement('div');
            markdownDiv.className = 'markdown-body';
            markdownDiv.style.width = '800px';
            markdownDiv.style.padding = '20px';
            markdownDiv.style.backgroundColor = 'white';
            
            const styleElement = document.createElement('style');
            styleElement.textContent = `
              .markdown-body table {
                border-collapse: collapse;
                width: 100%;
                margin: 10px 0;
              }
              .markdown-body th, .markdown-body td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              .markdown-body pre {
                background-color: #f6f8fa;
                padding: 16px;
                border-radius: 6px;
                overflow: auto;
              }
              .markdown-body img {
                max-width: 100%;
              }
            `;
            markdownDiv.appendChild(styleElement);
    
            const markdownHtml = renderToString(
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section}
              </ReactMarkdown>
            );
            markdownDiv.innerHTML += markdownHtml;
            container.appendChild(markdownDiv);
    
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const mdCanvas = await html2canvas(markdownDiv, {
              logging: false,
              scale: 2,
              width: 800,
              windowWidth: 800
            });
    
            const contentHeight = (mdCanvas.height * 190) / mdCanvas.width;
    
            // Check if content needs new page
            if (currentY + contentHeight > pdf.internal.pageSize.height - 10) {
              pdf.addPage();
              currentY = 10;
            }
    
            pdf.addImage(
              mdCanvas.toDataURL('image/png'),
              'PNG',
              10,
              currentY,
              190,
              contentHeight
            );
            currentY += contentHeight + 10;
            container.removeChild(markdownDiv);
          }
        }
    
        document.body.removeChild(container);
        pdf.save('easyeditor.pdf');
      } catch (err) {
        console.error('PDF generation error:', err);
      }
    };