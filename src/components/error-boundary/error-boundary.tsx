// src/components/error-boundary/error-boundary.tsx
import { Component, type ReactNode } from 'react';
import './error-boundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    
    return {
      hasError: true,
      errorMessage: error.message || 'Unknown error accured',
    };
  }  

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="error-boundary-main">
          <section className="error-boundary-section">
            <h1 className="error-boundary-title">
              Unfortunately something went wrong
            </h1>            
            <p className="error-boundary-message">
              {this.state.errorMessage || 'Please reload the page'}
            </p>
            <button
              onClick={this.handleReload}
              className="error-boundary-button"
            >
              Reload Page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}