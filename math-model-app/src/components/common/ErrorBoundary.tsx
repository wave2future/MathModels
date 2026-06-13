import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Pre-translated message shown when an error occurs, e.g. "Something went wrong in the graph." */
  message?: string;
  /** Pre-translated retry button label. */
  retryLabel?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/** Catches render errors (e.g. in WebGL/3D) and shows a friendly fallback. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex h-full min-h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          <p className="text-sm font-semibold">{this.props.message ?? "Something went wrong."}</p>
          {this.state.message && (
            <p className="max-w-md text-xs opacity-80">{this.state.message}</p>
          )}
          <button
            className="mt-2 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
            onClick={() => this.setState({ hasError: false, message: undefined })}
          >
            {this.props.retryLabel ?? "Try again"}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
