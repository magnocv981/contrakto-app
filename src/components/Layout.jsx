import { Link, Outlet, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/contrato/novo', label: 'Novo Contrato' },
  { path: '/relatorio', label: 'Relatórios' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-950 text-white">
      {/* Menu Responsivo */}
      <nav className="bg-gray-900 w-full lg:w-64 p-4">
        <div className="flex lg:flex-col justify-around lg:space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded hover:bg-gray-800 text-sm font-medium transition
                ${location.pathname === item.path ? 'bg-gray-800 text-blue-400' : 'text-white'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Conteúdo da Página */}
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
