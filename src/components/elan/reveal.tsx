import type { ReactNode, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/use-animations";

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variant?: "up" | "scale" | "mask";
  delay?: number;
}) {
  const [ref, visible] = useReveal();
  const baseClass =
    variant === "scale"
      ? "elan-reveal-scale"
      : variant === "mask"
        ? "elan-mask-reveal"
        : "elan-reveal";

  const style: CSSProperties | undefined =
    delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <div
      ref={ref}
      className={`${baseClass} ${visible ? "is-visible" : ""} ${className ?? ""}`}
      {...(style ? { style } : {})}
    >
      {children}
    </div>
  );
}

export function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [open]);

  if (!open) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    startYRef.current = touch.clientY;
    setDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || !dragging) return;
    const delta = touch.clientY - startYRef.current;
    if (delta > 0) setDragY(delta);
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden rounded-t-3xl border-t border-border bg-card shadow-2xl shadow-black/60"
        style={{
          transform: dragY > 0
            ? `translateY(${dragY}px)`
            : visible
              ? "translateY(0)"
              : "translateY(100%)",
          transition: dragging
            ? "none"
            : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>
        {children}
      </div>
    </div>
  );
}
