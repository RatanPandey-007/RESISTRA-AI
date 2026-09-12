import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[RESISTRA ErrorBoundary Caught Error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Surveillance Interface Recovered</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected interface exception occurred. The system protected application state from crashing.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-lg text-left text-xs font-mono text-rose-300 overflow-x-auto max-h-32 border border-slate-800">
                {this.state.error.message}
              </div>
            )}

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60 text-left text-[11px] text-slate-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>System Notice:</strong> RESISTRA AI is a decision-support prototype. Demonstration state can be safely restored without data loss.
              </span>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reload Surveillance Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
