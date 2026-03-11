import React from 'react';
import ELearnPlatform from './components/ELearnPlatform';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ELearnPlatform />
    </ErrorBoundary>
  );
}

export default App;
