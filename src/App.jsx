import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Formulario from './pages/Formulario';
import VisualizarContrato from './pages/VisualizarContrato';
import Contatos from './pages/Contatos';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/contrato/novo"
          element={
            <Layout>
              <Formulario />
            </Layout>
          }
        />
        <Route
          path="/contrato/:id"
          element={
            <Layout>
              <Formulario />
            </Layout>
          }
        />
        <Route
          path="/visualizar/:id"
          element={
            <Layout>
              <VisualizarContrato />
            </Layout>
          }
        />
        <Route
          path="/contatos"
          element={
            <Layout>
              <Contatos />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
