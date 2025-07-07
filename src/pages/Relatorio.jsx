import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Relatorio() {
  const [contratos, setContratos] = useState([])

  useEffect(() => {
    fetchContratos()
  }, [])

  async function fetchContratos() {
    const { data, error } = await supabase.from('contratos').select('*')
    if (!error) {
      setContratos(data)
    }
  }

  const contratosPorEstado = contratos.reduce((acc, contrato) => {
    const estado = contrato.estado
    if (!acc[estado]) acc[estado] = []
    acc[estado].push(contrato)
    return acc
  }, {})

  const formatarData = (dataISO) => {
    const d = new Date(dataISO)
    return d.toLocaleDateString('pt-BR')
  }

  const gerarPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('Relatório de Contratos por Estado', 14, 16)
    let y = 24

    Object.entries(contratosPorEstado).forEach(([estado, contratos]) => {
      const total = contratos.reduce((soma, c) => soma + (parseFloat(c.valor_global) || 0), 0)
      doc.setFont(undefined, 'bold')
      doc.text(`${estado} - Total: R$ ${total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`, 14, y)
      y += 6
      doc.setFont(undefined, 'normal')

      const rows = contratos.map(c => [
        c.cliente,
        `R$ ${Number(c.valor_global).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        formatarData(c.inicio),
        formatarData(c.encerramento),
        c.status
      ])

      autoTable(doc, {
        startY: y,
        head: [['Cliente', 'Valor', 'Início', 'Encerramento', 'Status']],
        body: rows,
        theme: 'grid',
        styles: { fontSize: 10 }
      })

      y = doc.lastAutoTable.finalY + 10
    })

    doc.save('relatorio-por-estado.pdf')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-400">Relatório de Contratos por Estado</h1>
          <a href="/" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            ← Voltar à Dashboard
          </a>
        </div>

        <div className="mb-4">
          <button onClick={gerarPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Exportar PDF
          </button>
        </div>

        {Object.entries(contratosPorEstado).map(([estado, lista]) => {
          const total = lista.reduce((soma, c) => soma + (parseFloat(c.valor_global) || 0), 0)
          return (
            <div key={estado} className="mb-6">
              <h2 className="text-lg font-semibold text-blue-300">
                {estado} - Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full mt-2 table-auto border-collapse border border-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="border border-gray-700 px-4 py-2 text-left">Cliente</th>
                      <th className="border border-gray-700 px-4 py-2 text-right">Valor</th>
                      <th className="border border-gray-700 px-4 py-2">Início</th>
                      <th className="border border-gray-700 px-4 py-2">Encerramento</th>
                      <th className="border border-gray-700 px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-800">
                        <td className="border border-gray-700 px-4 py-2 text-blue-400">{c.cliente}</td>
                        <td className="border border-gray-700 px-4 py-2 text-right">
                          R${Number(c.valor_global).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border border-gray-700 px-4 py-2">{formatarData(c.inicio)}</td>
                        <td className="border border-gray-700 px-4 py-2">{formatarData(c.encerramento)}</td>
                        <td className="border border-gray-700 px-4 py-2">{c.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

