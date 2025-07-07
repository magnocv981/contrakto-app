import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Bar, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [contratos, setContratos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchContratos()
  }, [])

  async function fetchContratos() {
    const { data, error } = await supabase.from('contratos').select('*')
    if (error) {
      alert('Erro ao carregar contratos: ' + error.message)
    } else {
      setContratos(data)
    }
  }

  // Agrupar por estado
  const contratosPorEstado = contratos.reduce((acc, contrato) => {
    const estado = contrato.estado || 'Não informado'
    acc[estado] = (acc[estado] || 0) + 1
    return acc
  }, {})

  const chartDataEstado = Object.entries(contratosPorEstado).map(([estado, total]) => ({
    name: estado,
    value: total,
  }))

  // Corrigir status duplicados por espaços/letras
  const statusCounts = contratos.reduce((acc, contrato) => {
    const status = (contrato.status || 'Indefinido').trim()
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }))

  // Valores e totais
  const vendasAno = contratos.reduce((acc, c) => acc + (parseFloat(c.valor_global) || 0), 0)
  const vendasMes = contratos
    .filter((c) => {
      const data = new Date(c.inicio)
      const hoje = new Date()
      return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()
    })
    .reduce((acc, c) => acc + (parseFloat(c.valor_global) || 0), 0)

  const totalElevadores = contratos.reduce((acc, c) => acc + (parseInt(c.quantidadeElevador) || 0), 0)
  const totalPlataformas = contratos.reduce((acc, c) => acc + (parseInt(c.quantidadePlataforma) || 0), 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* MENU RESPONSIVO */}
      <div className="bg-gray-900 p-4 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-white">Contrakto</h1>
        <div className="flex gap-4 text-sm sm:text-base">
          <button onClick={() => navigate('/')} className="text-white hover:text-blue-400">
            Dashboard
          </button>
          <button onClick={() => navigate('/contratos')} className="text-white hover:text-blue-400">
            Contratos
          </button>
          <button onClick={() => navigate('/relatorio')} className="text-white hover:text-blue-400">
            Relatório
          </button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-700 p-4 rounded shadow text-white">
            <h2 className="text-sm">Vendas no Ano</h2>
            <p className="text-xl font-bold">
              R${vendasAno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-blue-600 p-4 rounded shadow text-white">
            <h2 className="text-sm">Vendas no Mês</h2>
            <p className="text-xl font-bold">
              R${vendasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-blue-500 p-4 rounded shadow text-white">
            <h2 className="text-sm">Elevadores</h2>
            <p className="text-xl font-bold">{totalElevadores}</p>
          </div>
          <div className="bg-blue-400 p-4 rounded shadow text-white">
            <h2 className="text-sm">Plataformas</h2>
            <p className="text-xl font-bold">{totalPlataformas}</p>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gráfico por estado (pizza) */}
          <div className="bg-gray-900 p-4 rounded shadow">
            <h3 className="text-lg mb-2 font-bold">Contratos por Estado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartDataEstado} dataKey="value" nameKey="name" outerRadius={100}>
                  {chartDataEstado.map((entry, index) => (
                    <Cell key={index} fill={`hsl(${(index * 50) % 360}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico por status (barras) */}
          <div className="bg-gray-900 p-4 rounded shadow">
            <h3 className="text-lg mb-2 font-bold">Contratos por Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusChartData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

