export default function Contact() {
    return (
      <div className="p-4 space-y-4 text-white">
        <h2 className="text-2xl font-bold text-pink-500">聯絡我喵</h2>
  
        <ul className="space-y-2">
          <li>
            📧 Email：<a href="mailto:youremail@example.com" className="text-blue-400 hover:underline">youremail@example.com</a>
          </li>
          <li>
            🐱 GitHub：<a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/yourusername</a>
          </li>
          <li>
            📸 Instagram：<a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@yourusername</a>
          </li>
          <li>
            📘 Facebook：<a href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">facebook.com/yourusername</a>
          </li>
        </ul>
      </div>
    );
  }
  