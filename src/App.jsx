// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Contratos from './pages/Contratos'
import VisualizarContrato from './pages/VisualizarContrato'
import Relatorio from './pages/Relatorio' // importando a nova tela de relatório

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/contratos" element={<Contratos />} />
        <Route path="/relatorio" element={<Relatorio />} />
        <Route path="/visualizar/:id" element={<VisualizarContrato />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
