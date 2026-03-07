import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SLIDE_CANVAS_HEIGHT, SLIDE_CANVAS_WIDTH } from '../config/slideCanvas';

interface SlideCanvasProps {
  children: React.ReactNode | ((context: { scale: number }) => React.ReactNode);
  containerClassName?: string;
  canvasClassName?: string;
}

export default function SlideCanvas({
  children,
  containerClassName = '',
  canvasClassName = '',
}: SlideCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateBounds = () => {
      setBounds({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateBounds();

    const observer = new ResizeObserver(() => updateBounds());
    observer.observe(element);
    window.addEventListener('resize', updateBounds);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBounds);
    };
  }, []);

  const scale = useMemo(() => {
    if (!bounds.width || !bounds.height) return 0;

    return Math.min(
      bounds.width / SLIDE_CANVAS_WIDTH,
      bounds.height / SLIDE_CANVAS_HEIGHT,
    );
  }, [bounds.height, bounds.width]);

  const scaledWidth = SLIDE_CANVAS_WIDTH * scale;
  const scaledHeight = SLIDE_CANVAS_HEIGHT * scale;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${containerClassName}`.trim()}
    >
      {scale > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}>
            <div
              className={canvasClassName}
              style={{
                width: `${SLIDE_CANVAS_WIDTH}px`,
                height: `${SLIDE_CANVAS_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              {typeof children === 'function' ? children({ scale }) : children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
