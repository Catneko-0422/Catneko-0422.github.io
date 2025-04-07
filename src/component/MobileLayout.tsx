import React, { useState } from 'react';
import About from './About';
import Project from './Project';
import Contact from './Contact';
import Chat from './Chat';

const MobileLayout = () => {
  const [activeTab, setActiveTab] = useState('about');

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <About />;
      case 'project':
        return <Project />;
      case 'contact':
        return <Contact />;
      case 'chat':
        return <Chat />;
      default:
        return <About />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black/90">
      {/* 頂部導航欄 */}
      <div className="w-full bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold text-center text-white">Catneko</h1>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 overflow-y-auto p-4 text-white">
        {renderContent()}
      </div>

      {/* 底部導航欄 */}
      <div className="flex justify-around items-center h-16 bg-gray-900 border-t border-gray-700">
        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            activeTab === 'about' ? 'text-blue-500' : 'text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">About</span>
        </button>
        <button
          onClick={() => setActiveTab('project')}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            activeTab === 'project' ? 'text-blue-500' : 'text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs mt-1">Project</span>
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            activeTab === 'contact' ? 'text-blue-500' : 'text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Contact</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            activeTab === 'chat' ? 'text-blue-500' : 'text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs mt-1">Chat</span>
        </button>
      </div>
    </div>
  );
};

export default MobileLayout; 