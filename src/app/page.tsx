"use client";

import AppWrapper from '@/components/app-wrapper';

export default function Home() {
  console.log('Home page component rendering');
  
  // Simple test to see if React is working
  const testMode = true; // Set to false to go back to normal app
  
  if (testMode) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 YesChef is LIVE!</h1>
        <p className="text-lg text-gray-600">Deployment successful! React is working!</p>
        <button 
          onClick={() => alert('JavaScript is working!')}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Test Button
        </button>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Next Steps:</h2>
          <p>1. Verify this page loads on Vercel ✅</p>
          <p>2. Switch back to full app mode</p>
          <p>3. Your meal planning app will be ready!</p>
        </div>
      </div>
    );
  }
  
  return <AppWrapper />;
}