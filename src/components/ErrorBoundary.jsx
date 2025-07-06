import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #f87171',
          borderRadius: '8px',
          background: '#fef2f2',
          color: '#dc2626',
          padding: '20px'
        }}>
          <h3>Chart Error</h3>
          <p>Something went wrong with this visualization.</p>
          <details style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              border: '1px solid #dc2626',
              borderRadius: '4px',
              background: 'white',
              color: '#dc2626',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
