import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="relative w-full h-[60vh] md:h-[40vh] overflow-hidden">
      {/* 背景圖片，GIF 版本拉伸為 20% 高度 */}
      <div className="w-full h-[80%]">
        <img src="/background.gif" className="w-full h-full object-cover" alt="Background" />
      </div>

      {/* 內容區域，文字自適應顏色 */}
      <div className="relative z-20 flex flex-col items-center justify-center h-[80%] text-white">
        <img src="/profile.jpg" className="w-24 h-24 rounded-full mb-4" alt="Profile" />
        <h2 className="text-2xl font-bold mb-2">Hello~ I'm a <span className="text-purple-400">NYUST student</span></h2>
        <h1 className="text-4xl font-bold mt-2">Nekocat.cc</h1>
        <p className="max-w-lg text-center mt-4">
          I am a student who loves <span className="text-pink-400">AI</span> and <span className="text-yellow-400">programming</span>.<br />
          I am familiar with both <span className="text-green-400">hardware</span> and <span className="text-green-400">software</span>, exploring various technologies.<br />
          From <span className="text-blue-400">Python machine learning</span> to <span className="text-blue-400">React front-end development</span>, I stay <span className="text-pink-400">curious</span>, always <span className="text-pink-400">learning</span>.
        </p>
      </div>
    </div>
  );
};

export default Home;
