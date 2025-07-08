"use client";

import { useEffect } from 'react';

const Builder = () => {
  useEffect(() => {
    import('grapesjs').then((grapesjs) => {
      const editor = grapesjs.init({
        container: '#gjs', // Container for the editor
        fromElement: true,  // Allow dragging from the element
        height: '100vh',
        width: 'auto',
        storageManager: {
          type: 'local', // Store the design in local storage
        },
        blockManager: {
          appendTo: '#blocks', // Where blocks will be displayed
        },
      });
    });
  }, []);

  return (
    <div className="flex">
      <div id="blocks" className="w-1/4 bg-gray-200 p-4">
        <button className="bg-blue-500 text-white p-2">Add Text Block</button>
      </div>
      <div id="gjs" className="w-3/4 bg-white"></div>
    </div>
  );
};

export default Builder;
