import React, { ReactNode } from 'react';

interface DemoErrorBoundaryProps {
  title: string;
  accent: string;
  children: ReactNode;
}

interface DemoErrorBoundaryState {
  error: Error | null;
  resetKey: number;
}

export class DemoErrorBoundary extends React.Component<
  DemoErrorBoundaryProps,
  DemoErrorBoundaryState
> {
  state: DemoErrorBoundaryState = { error: null, resetKey: 0 };

  static getDerivedStateFromError(error: Error): Partial<DemoErrorBoundaryState> {
    return { error };
  }

  private reload = () => {
    this.setState((current) => ({ error: null, resetKey: current.resetKey + 1 }));
  };

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="relative"
          style={{
            minHeight: '420px',
            background: 'var(--t-panel-ember-deep)',
            border: '1px solid var(--t-line-strong)',
          }}
        >
          <div className="h-[2px] w-full" style={{ background: this.props.accent }} aria-hidden="true" />
          <div className="p-8 sm:p-12">
            <p
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-mono)', color: this.props.accent }}
            >
              SPECIMEN OFFLINE
            </p>
            <h3
              className="mt-3 leading-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--t-bone)',
              }}
            >
              {this.props.title}
            </h3>
            <p
              className="mt-3 max-w-md leading-relaxed"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--t-bone-soft)' }}
            >
              This specimen hit an error. The rest of the lab is still running.
            </p>
            <button
              type="button"
              onClick={this.reload}
              className="mt-6 border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--t-bone)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--t-world-violet)]"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--t-bone-soft)',
                borderColor: 'var(--t-line-strong)',
                background: 'transparent',
              }}
            >
              RELOAD SPECIMEN
            </button>
          </div>
        </div>
      );
    }

    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
  }
}
