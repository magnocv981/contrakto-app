import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Formulario from './Formulario'
import { useNavigate } from 'react-router-dom'

export default function Contratos() {
  const [contratos, setContratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editarContratoId, setEditarContratoId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchContratos()
  }, [])

  async function fetchContratos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .order('inicio', { ascending: false })
    if (error) {
      alert('Erro ao carregar contratos: ' + error.message)
    } else {
      setContratos(data)
    }
    setLoading(false)
  }

  function abrirFormulario(novo = false, id = null) {
    if (novo) {
      setEditarContratoId(null)
    } else if (id) {
      setEditarContratoId(id)
    }
    setMostrarFormulario(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function fecharFormulario() {
    setMostrarFormulario(false)
    setEditarContratoId(null)
  }

  function handleSalvou() {
    fetchContratos()
    fecharFormulario()
  }

  function formatDate(dataISO) {
    if (!dataISO) return ''
    const d = new Date(dataISO)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-400">Gestão de Contratos</h1>

          <div className="flex flex-wrap gap-4">
            {!mostrarFormulario && (
              <button
                onClick={() => abrirFormulario(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                + Novo Contrato
              </button>
            )}

            {mostrarFormulario && (
              <button
                onClick={fecharFormulario}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                ← Voltar à Lista
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              ← Voltar à Dashboard
            </button>
          </div>
        </div>

        {mostrarFormulario ? (
          <div className="mb-6 border border-blue-700 p-4 rounded bg-gray-900">
            <Formulario
              key={editarContratoId || 'novo'}
              id={editarContratoId}
              onSalvou={handleSalvou}
            />
          </div>
        ) : loading ? (
          <p>Carregando contratos...</p>
        ) : contratos.length === 0 ? (
          <p>Nenhum contrato cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-4 py-2 text-left">Cliente</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Estado</th>
                  <th className="border border-gray-700 px-4 py-2 text-right">Valor Global</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Início</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Encerramento</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-800 cursor-pointer"
                    onClick={() => abrirFormulario(false, c.id)}
                  >
                    <td className="border border-gray-700 px-4 py-2 text-blue-400 underline">
                      {c.cliente}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">{c.estado}</td>
                    <td className="border border-gray-700 px-4 py-2 text-right">
                      R${Number(c.valor_global).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">{formatDate(c.inicio)}</td>
                    <td className="border border-gray-700 px-4 py-2">{formatDate(c.encerramento)}</td>
                    <td className="border border-gray-700 px-4 py-2">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
