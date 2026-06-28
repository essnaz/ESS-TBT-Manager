/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { PenTool, Trash2, CheckCircle2 } from "lucide-react";

interface SignaturePadProps {
  onSave: (base64Data: string) => void;
  onClose: () => void;
  title?: string;
}

export default function SignaturePad({ onSave, onClose, title = "Draw Signature" }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let lastWidth = 0;
    let lastHeight = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const rect = canvas.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        // Only resize backing store if physical layout size has changed
        if (Math.abs(width - lastWidth) > 1 || Math.abs(height - lastHeight) > 1) {
          canvas.width = width;
          canvas.height = height;
          
          lastWidth = width;
          lastHeight = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.strokeStyle = "#1e293b"; // Charcoal/Slate slate-800
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
          }
        }
      }
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return { x: 0, y: 0 };
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent scrolling on touch screens
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasDrawn) {
      // Create simple default indicator if empty, but drawing is better
      return;
    }
    
    try {
      // Scale down signature to max 200px width / 100px height to keep it extremely light (PNG size <= 3KB)
      const maxW = 200;
      const maxH = 100;
      let width = canvas.width;
      let height = canvas.height;
      
      if (width > maxW || height > maxH) {
        const ratio = Math.min(maxW / width, maxH / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const ctx = offscreen.getContext("2d");
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, width, height);
        const dataUrl = offscreen.toDataURL("image/png");
        onSave(dataUrl);
        return;
      }
    } catch (e) {
      console.error("Failed to compress signature:", e);
    }

    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in" id="signature-modal">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-4 py-3 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-sm tracking-wide">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded-md transition-all cursor-pointer"
            id="close-sig-pad"
          >
            Cancel
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col bg-slate-50">
          <p className="text-xs text-slate-500 mb-2 leading-relaxed">
            Please draw clearly in the box below using your finger or stylus pen. Click Save when finished.
          </p>

          {/* Canvas Box */}
          <div className="w-full h-44 bg-white border-2 border-dashed border-slate-300 rounded-lg overflow-hidden relative shadow-inner">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 select-none pointer-events-none">
                <PenTool className="h-10 w-10 text-slate-500 mb-1" />
                <span className="text-xs font-mono">Sign Here</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={clearCanvas}
              disabled={!hasDrawn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-medium cursor-pointer"
              id="clear-sig"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Pad
            </button>

            <button
              onClick={saveSignature}
              disabled={!hasDrawn}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-md cursor-pointer"
              id="save-sig"
            >
              <CheckCircle2 className="h-4 w-4" />
              Accept & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
