import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const [contratos, setContratos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchContratos() {
      const { data, error } = await supabase.from('contratos').select('*')
      if (!error) setContratos(data)
    }
    fetchContratos()
  }, [])

  const vendasNoAno = contratos
    .filter((c) => new Date(c.inicio).getFullYear() === new Date().getFullYear())
    .reduce((total, c) => total + Number(c.valor_global || 0), 0)

  const vendasNoMes = contratos
    .filter((c) => {
      const d = new Date(c.inicio)
      const hoje = new Date()
      return d.getFullYear() === hoje.getFullYear() && d.getMonth() === hoje.getMonth()
    })
    .reduce((total, c) => total + Number(c.valor_global || 0), 0)

  const totalElevadores = contratos.reduce((total, c) => total + Number(c.quantidadeElevador || 0), 0)
  const totalPlataformas = contratos.reduce((total, c) => total + Number(c.quantidadePlataforma || 0), 0)

  const contratosPorEstado = contratos.reduce((acc, c) => {
    acc[c.estado] = (acc[c.estado] || 0) + 1
    return acc
  }, {})

  const dadosPizza = Object.entries(contratosPorEstado).map(([estado, quantidade]) => ({ name: estado, value: quantidade }))

  const contratosPorStatus = contratos.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {})

  const dadosStatus = Object.entries(contratosPorStatus).map(([status, total]) => ({ status, total }))

  const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF6384']

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Dashboard de Contratos</h1>

        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate('/contratos')}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
          >
            Contratos
          </button>
          <button
            onClick={() => navigate('/relatorio')}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
          >
            Relatório
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-300">Vendas no Ano</h2>
            <p className="text-2xl font-bold text-blue-400">
              R$ {vendasNoAno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-300">Vendas no Mês</h2>
            <p className="text-2xl font-bold text-blue-400">
              R$ {vendasNoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-300">Elevadores</h2>
            <p className="text-2xl font-bold text-blue-400">{totalElevadores}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-300">Plataformas</h2>
            <p className="text-2xl font-bold text-blue-400">{totalPlataformas}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Contratos por Estado</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={dadosPizza} dataKey="value" nameKey="name" outerRadius={90} label>
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Contratos por Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosStatus}>
                <XAxis dataKey="status" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="total" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
