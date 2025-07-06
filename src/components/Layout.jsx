import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path) ? 'bg-blue-700' : 'hover:bg-gray-800';

  return (
    <div className="flex h-screen">
      {/* Menu lateral */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-6">Contrakto</h1>

        <nav className="flex flex-col gap-2">
          <Link
            to="/"
            className={`p-2 rounded ${isActive('/')}`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/contrato/novo"
            className={`p-2 rounded ${isActive('/contrato')}`}
          >
            📁 Contratos
          </Link>
          <Link
            to="/contatos"
            className={`p-2 rounded ${isActive('/contatos')}`}
          >
            👤 Contatos
          </Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-950 text-white overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
