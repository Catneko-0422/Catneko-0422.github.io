import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

export default function Contact() {
  return (
    <div className="p-4 space-y-4 text-black">
      <h2 className="text-3xl font-bold text-pink-500 text-center">
        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
        聯絡我喵
      </h2>

      <ul className="space-y-4">
        <li className="p-4 rounded-xl bg-pink-200 hover:bg-pink-300 transition">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          Email：
          <a href="linyian0422@gmail.com" className="text-blue-500 hover:underline ml-1">
            linyian0422@gmail.com
          </a>
        </li>
        <li className="p-4 rounded-xl bg-purple-200 hover:bg-purple-300 transition">
          <FontAwesomeIcon icon={faGithub} className="mr-2" />
          GitHub：
          <a href="https://github.com/Catneko-0422" className="text-blue-500 hover:underline ml-1">
            github.com/Catneko-0422
          </a>
        </li>
        <li className="p-4 rounded-xl bg-yellow-200 hover:bg-yellow-300 transition">
          <FontAwesomeIcon icon={faInstagram} className="mr-2" />
          Instagram：
          <a href="https://www.instagram.com/neko._cat422/" className="text-blue-500 hover:underline ml-1">
            @neko._cat422
          </a>
        </li>
        <li className="p-4 rounded-xl bg-blue-200 hover:bg-blue-300 transition">
          <FontAwesomeIcon icon={faFacebook} className="mr-2" />
          Facebook：
          <a href="https://www.facebook.com/profile.php?id=100017903408909&locale=zh_TW" className="text-blue-500 hover:underline ml-1">
            facebook.com/Neko-Cat
          </a>
        </li>
      </ul>
    </div>
  );
}
