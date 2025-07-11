import React, { useState, useEffect } from 'react';

const PerformanceTest = () => {
  const [scrollCount, setScrollCount] = useState(0);
  const [frameRate, setFrameRate] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastFrameTime = performance.now();

    const measureFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastFrameTime >= 1000) {
        setFrameRate(frameCount);
        frameCount = 0;
        lastFrameTime = currentTime;
      }
      
      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollCount(prev => prev + 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Performance Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Frame Rate</h2>
            <p className="text-3xl font-bold text-green-600">{frameRate} FPS</p>
            <p className="text-sm text-gray-500 mt-2">
              {frameRate >= 55 ? 'Excellent' : frameRate >= 45 ? 'Good' : frameRate >= 30 ? 'Fair' : 'Poor'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Scroll Events</h2>
            <p className="text-3xl font-bold text-blue-600">{scrollCount}</p>
            <p className="text-sm text-gray-500 mt-2">Total scroll events</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Memory Usage</h2>
            <p className="text-3xl font-bold text-purple-600">
              {performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-2">JavaScript heap</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Scroll Test Area</h2>
          <p className="text-gray-600 mb-4">Scroll up and down this area to test performance:</p>
          
          <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
            {Array.from({ length: 50 }, (_, i) => (
              <div key={i} className="mb-4 p-4 bg-white rounded border border-gray-200">
                <h3 className="font-semibold text-gray-800">Test Item {i + 1}</h3>
                <p className="text-gray-600 mt-2">
                  This is a test item to simulate content scrolling. Lorem ipsum dolor sit amet, 
                  consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Tag 1</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Tag 2</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Tag 3</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Performance Tips</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Frame rate should be 55+ FPS for smooth scrolling
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Scroll events should be responsive and not lag
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Memory usage should be reasonable (&lt; 100MB for simple pages)
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
              Try closing other browser tabs if performance is poor
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTest; 