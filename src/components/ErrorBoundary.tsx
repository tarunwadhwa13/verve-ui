import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-4">
                An unexpected error occurred while rendering this page.
              </p>
              {!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? (
                <details className="text-left bg-gray-100 p-4 rounded mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Error Details
                  </summary>
                  <div className="mt-2 text-xs text-gray-600">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error?.message}
                    </div>
                    {this.state.error?.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              ) : null}
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}