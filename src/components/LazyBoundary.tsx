import { Component, lazy, type ComponentProps, type ComponentType, type ReactNode } from "react";
import { isChunkLoadError } from "@/lib/chunk-errors";

type Locale = "en" | "es";

/**
 * React.lazy caches a rejected import forever. retryableLazy() keeps the same
 * component identity for callers but swaps the inner lazy() on retry(), so a
 * LazyBoundary "Retry" really fetches the chunk again.
 */
export function retryableLazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  let Inner = lazy(factory);
  function Retryable(props: ComponentProps<T>) {
    return <Inner {...props} />;
  }
  Retryable.retry = () => {
    Inner = lazy(factory);
  };
  return Retryable;
}

/**
 * Local error boundary for lazy blocks on tool pages. A failed chunk (blocked
 * request, flaky network, crawler renderer) only replaces this block, never the
 * page: the H1, server-rendered copy and FAQ stay visible. Without it the error
 * bubbles to the root errorComponent and Googlebot sees a soft 404.
 *
 * fallback={null} hides the block silently (ads, optional chrome).
 */
export class LazyBoundary extends Component<
  {
    children: ReactNode;
    locale?: Locale;
    onRetry?: () => void;
    fallback?: ReactNode;
    className?: string;
  },
  { failed: boolean; chunk: boolean }
> {
  override state = { failed: false, chunk: false };

  static getDerivedStateFromError(error: unknown) {
    return { failed: true, chunk: isChunkLoadError(error) };
  }

  override componentDidCatch(error: unknown) {
    if (typeof console !== "undefined") console.warn("UtiliHub: lazy block failed to load", error);
  }

  retry = () => {
    // Chromium caches a failed module fetch for the document's lifetime, so an
    // in-place retry of the same chunk URL never hits the network: reload instead.
    if (this.state.chunk) {
      window.location.reload();
      return;
    }
    this.props.onRetry?.();
    this.setState({ failed: false, chunk: false });
  };

  override render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    const es = this.props.locale === "es";
    return (
      <div
        role="status"
        className={`flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground ${this.props.className ?? ""}`}
      >
        <span>{es ? "Esta parte no se pudo cargar." : "This part couldn't load."}</span>
        <button
          type="button"
          onClick={this.retry}
          className="rounded-md border border-input bg-background px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted"
        >
          {es ? "Reintentar" : "Retry"}
        </button>
      </div>
    );
  }
}
