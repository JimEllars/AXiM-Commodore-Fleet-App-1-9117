import React from 'react';
import SafeIcon from './SafeIcon';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReboot = this.handleReboot.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReboot() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-axim-panel border border-axim-border rounded-lg p-6">
          <div className="w-16 h-16 rounded-full border border-axim-alert bg-axim-alert/10 flex items-center justify-center text-axim-alert mb-4">
            <SafeIcon name="AlertTriangle" className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-widest uppercase">HUD Offline / System Degraded</h2>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest text-center max-w-md mb-6">
            A critical subsystem failure was detected. Component rendering has been suspended to prevent cascade failure.
          </p>
          <button
            onClick={this.handleReboot}
            className="flex items-center gap-2 px-6 py-2 bg-axim-teal text-void font-bold rounded hover:bg-axim-teal/90 hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all uppercase font-mono tracking-wider"
          >
            <SafeIcon name="RefreshCw" className="w-4 h-4" />
            Reboot Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
