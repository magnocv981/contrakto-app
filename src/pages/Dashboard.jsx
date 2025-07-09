import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { BarChart2, FileText, ClipboardList, Handshake, ArrowRight } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

export default function Dashboard() {
  const [contratos, setContratos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchContratos()
  }, [])

  async function fetchContratos() {
    const { data, error } = await supabase.from('contratos').select('*')
    if (!error && data) setContratos(data)
  }

  const anoAtual = new Date().getFullYear()
  const mesAtual = new Date().getMonth() + 1

  const vendasAno = contratos
    .filter((c) => new Date(c.inicio).getFullYear() === anoAtual)
    .reduce((acc, c) => acc + (parseFloat(c.valor_global) || 0), 0)

  const vendasMes = contratos
    .filter((c) => {
      const d = new Date(c.inicio)
      return d.getFullYear() === anoAtual && d.getMonth() + 1 === mesAtual
    })
    .reduce((acc, c) => acc + (parseFloat(c.valor_global) || 0), 0)

  const totalElevadores = contratos.reduce((acc, c) => acc + (parseInt(c.quantidadeElevador) || 0), 0)
  const totalPlataformas = contratos.reduce((acc, c) => acc + (parseInt(c.quantidadePlataforma) || 0), 0)
  const totalGlobal = contratos.reduce((acc, c) => acc + (parseFloat(c.valor_global) || 0), 0)

  const totalAtivos = contratos.filter((c) => c.status === 'Ativo').length
  const totalPendentes = contratos.filter((c) => c.status === 'Pendente').length

  const contratosPorEstado = Object.values(
    contratos.reduce((acc, curr) => {
      const estado = curr.estado || 'N/A'
      acc[estado] = acc[estado] || { estado, quantidade: 0 }
      acc[estado].quantidade += 1
      return acc
    }, {})
  ).sort((a, b) => a.estado.localeCompare(b.estado))

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">Gestão de Contratos</h1>

        {/* Botões de Navegação (Tabs) */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/contratos')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white flex items-center"
          >
            <ArrowRight className="mr-2" size={18} /> Ir para Contratos
          </button>
          <button
            onClick={() => navigate('/relatorio')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white flex items-center"
          >
            <ArrowRight className="mr-2" size={18} /> Ver Relatório
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card title="Vendas no Ano" value={vendasAno} icon={<FileText />} />
          <Card title="Vendas no Mês" value={vendasMes} icon={<ClipboardList />} />
          <Card title="Elevadores" value={totalElevadores} icon={<BarChart2 />} inteiro />
          <Card title="Plataformas" value={totalPlataformas} icon={<BarChart2 />} inteiro />
          <Card title="Vendas Global" value={totalGlobal} icon={<Handshake />} />
          <Card title="Contratos Ativos" value={totalAtivos} icon={<FileText />} inteiro />
          <Card title="Contratos Pendentes" value={totalPendentes} icon={<FileText />} inteiro />
        </div>

        {/* Gráfico Contratos por Estado */}
        <div className="bg-gray-900 p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">Contratos por Estado</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contratosPorEstado}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="estado" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} />
              <Legend />
              <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade de Contratos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, icon, inteiro = false }) {
  return (
    <div className="bg-gray-900 p-4 rounded shadow flex items-center gap-4">
      <div className="text-blue-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-blue-400">
          {typeof value === 'number'
            ? value.toLocaleString('pt-BR', {
                minimumFractionDigits: inteiro ? 0 : 2,
                maximumFractionDigits: inteiro ? 0 : 2,
              })
            : value}
        </p>
      </div>
    </div>
  )
}
