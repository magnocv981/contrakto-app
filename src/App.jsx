import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Formulario from './pages/Formulario';
import VisualizarContrato from './pages/VisualizarContrato';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contrato/novo" element={<Formulario />} />
          <Route path="/contrato/:id" element={<Formulario />} />
          <Route path="/visualizar/:id" element={<VisualizarContrato />} />
          <Route path="/relatorio" element={<div className="text-white">Relatórios em construção</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
