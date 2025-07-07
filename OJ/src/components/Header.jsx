import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold neon-text">
        <Link to="/">Algo Arena</Link>
      </h1>
      <nav className="space-x-4 text-lg font-medium">
        <Link to="/dashboard" className="hover:text-pink-400 transition">Dashboard</Link>
        <Link to="/progress" className="hover:text-pink-400 transition">Progress</Link>
        <Link to="/unsolved" className="hover:text-pink-400 transition">Unsolved</Link>
        <Link to="/problems" className="hover:text-pink-400 transition">Problems</Link>
      </nav>
    </header>
  );
}
