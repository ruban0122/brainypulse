'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

export default function PdfDownloadButton() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDownload = async () => {
        setIsGenerating(true);
        setProgress(0);

        try {
            // Find controls
            const labels = Array.from(document.querySelectorAll('label'));
            let checkbox: HTMLInputElement | null = null;
            labels.forEach(l => {
                if (l.textContent?.includes('Show Answers')) {
                    checkbox = l.querySelector('input[type="checkbox"]');
                }
            });
            if (!checkbox) {
                 checkbox = document.querySelector('input[type="checkbox"]');
            }

            let newBtn = document.querySelector('button.new-worksheet-btn') as HTMLButtonElement;
            if (!newBtn) {
                const buttons = Array.from(document.querySelectorAll('button'));
                newBtn = buttons.find(b => b.textContent?.includes('New') || b.querySelector('.lucide-rotate-cw')) as HTMLButtonElement;
            }

            const hasNewBtn = !!newBtn;
            const originalCheckboxState = checkbox?.checked;
            const hasAnswers = !!checkbox;
            const numPages = 25;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const answerImages: string[] = [];

            // A4 dimensions
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Helper to capture a node with exact A4 dimensions
            const captureNode = async (node: HTMLElement) => {
                // Save original styles
                const originalCss = node.style.cssText;
                // Force A4 size styling for the snapshot
                node.style.position = 'fixed';
                node.style.top = '0';
                node.style.left = '0';
                node.style.margin = '0';
                node.style.width = '210mm';
                // Most standard printers use A4: 210mm x 297mm
                node.style.minHeight = '297mm'; 
                node.style.maxWidth = '210mm';
                node.style.padding = '10mm 15mm'; 
                node.style.backgroundColor = '#ffffff';
                node.style.boxSizing = 'border-box';
                node.style.zIndex = '-9999';

                // Give the browser a moment to apply these layout constraints
                await new Promise(r => setTimeout(r, 50));

                const result = await toJpeg(node, {
                    quality: 0.95,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff'
                });
                
                // Restore origin styles
                node.style.cssText = originalCss;
                return result;
            };

            for (let i = 0; i < numPages; i++) {
                if (hasNewBtn && i > 0) {
                    newBtn.click();
                    await new Promise(r => setTimeout(r, 200));
                }

                if (hasAnswers && checkbox) {
                    // Problem Page
                    if (checkbox.checked) {
                        checkbox.click(); 
                        await new Promise(r => setTimeout(r, 150)); 
                    }
                    
                    const pNode = document.querySelector('.worksheet-page') as HTMLElement;
                    if (pNode) {
                        const pageNumSpan = Array.from(pNode.querySelectorAll('span')).find(s => s.textContent?.includes('Page-'));
                        const originalText = pageNumSpan ? pageNumSpan.textContent : '';
                        if (pageNumSpan) pageNumSpan.textContent = `Page-${i + 1}`;
                        
                        const imgData = await captureNode(pNode);
                        if (i > 0) pdf.addPage();
                        
                        const imgProps = pdf.getImageProperties(imgData);
                        const scaledHeight = (imgProps.height * pdfWidth) / imgProps.width;
                        
                        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledHeight);

                        if (pageNumSpan) pageNumSpan.textContent = originalText;
                    }

                    // Answer Page
                    checkbox.click();
                    await new Promise(r => setTimeout(r, 150));

                    const aNode = document.querySelector('.worksheet-page') as HTMLElement;
                    if (aNode) {
                        const pageNumSpanA = Array.from(aNode.querySelectorAll('span')).find(s => s.textContent?.includes('Page-'));
                        const originalTextA = pageNumSpanA ? pageNumSpanA.textContent : '';
                        if (pageNumSpanA) pageNumSpanA.textContent = `Page-${i + 1} (Answers)`;
                        
                        const imgDataA = await captureNode(aNode);
                        answerImages.push(imgDataA);

                        if (pageNumSpanA) pageNumSpanA.textContent = originalTextA;
                    }
                } else {
                    // For static pages without answers
                    const pNode = document.querySelector('.worksheet-page') as HTMLElement;
                    if (pNode) {
                        const pageNumSpan = Array.from(pNode.querySelectorAll('span')).find(s => s.textContent?.includes('Page-'));
                        const originalText = pageNumSpan ? pageNumSpan.textContent : '';
                        if (pageNumSpan) pageNumSpan.textContent = `Page-${i + 1}`;
                        
                        const imgData = await captureNode(pNode);
                        if (i > 0) pdf.addPage();
                        
                        const imgProps = pdf.getImageProperties(imgData);
                        const scaledHeight = (imgProps.height * pdfWidth) / imgProps.width;
                        
                        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledHeight);

                        if (pageNumSpan) pageNumSpan.textContent = originalText;
                    }
                }
                
                setProgress(Math.floor(((i + 1) / numPages) * 100));
            }

            // Append answers at the very end
            for (const imgData of answerImages) {
                pdf.addPage();
                const imgProps = pdf.getImageProperties(imgData);
                const scaledHeight = (imgProps.height * pdfWidth) / imgProps.width;
                        
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, scaledHeight);
            }

            // Restore original state
            if (checkbox && checkbox.checked !== originalCheckboxState) {
                checkbox.click();
            }

            // Generate PDF
            setProgress(100);
            
            pdf.save(`${document.title || 'Worksheets'}.pdf`);
            
            setIsGenerating(false);

        } catch (error) {
            console.error(error);
            setIsGenerating(false);
            alert("An error occurred while generating the PDF.");
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-4 py-2 ${isGenerating ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded transition shadow-sm`}
        >
            {isGenerating ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating {progress}%
                </>
            ) : (
                <>
                    <Download size={16} />
                    Download PDF
                </>
            )}
        </button>
    );
}
