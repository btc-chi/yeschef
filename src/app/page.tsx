"use client";

import AppWrapper from '@/components/app-wrapper';

export default function Home() {
  console.log('Home page component rendering');
  
  // Simple test to see if React is working
  const testMode = false; // Set to false to go back to normal app
  
  if (testMode) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">yeschef - React Test</h1>
        <p className="text-lg text-gray-600">If you can see this, React is working!</p>
        <button 
          onClick={() => alert('JavaScript is working!')}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Test Button
        </button>
      </div>
    );
  }
  
  return <AppWrapper />;
}