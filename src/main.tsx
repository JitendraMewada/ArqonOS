import { Component, ReactNode, StrictMode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

// Simple logging for mobile debugging
console.log('[ArqonOS] Application initializing...');

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ArqonOS] React Crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px 20px', 
          color: '#ef4444', 
          fontFamily: 'monospace', 
          backgroundColor: '#0a0a0a', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '16px' }}>SYSTEM CRASH</h1>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px', marginBottom: '24px' }}>
            The application encountered a fatal error and could not start.
          </p>
          <pre style={{ 
            fontSize: '10px', 
            padding: '16px', 
            backgroundColor: '#1a1a1a', 
            borderRadius: '8px',
            overflow: 'auto',
            maxWidth: '100%',
            textAlign: 'left'
          }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '32px',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            RELOAD SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[ArqonOS] Root element not found');
} else {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );

  // Remove the static HTML loader once React starts mounting
  // We use a small delay to ensure hydration starts
  setTimeout(() => {
    const loader = document.querySelector('.app-loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 1000);
    }
  }, 100);
}
