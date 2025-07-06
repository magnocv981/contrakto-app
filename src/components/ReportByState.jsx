import React from 'react';
import dayjs from 'dayjs';

const currencyBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const statusBadge = (status) => {
  const base = 'px-2 py-1 text-xs font-medium rounded-full';
  switch ((status || '').toLowerCase()) {
    case 'ativo':
      return <span className={`${base} bg-green-100 text-green-800`}>Ativo</span>;
    case 'pendente':
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pendente</span>;
    case 'encerrado':
      return <span className={`${base} bg-red-100 text-red-800`}>Encerrado</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-800`}>{status || '—'}</span>;
  }
};

export default function ReportByState({ contratos }) {
  const grupos = contratos.reduce((acc, c) => {
    const estado = c.estado || '—';
    if (!acc[estado]) acc[estado] = [];
    acc[estado].push(c);
    return acc;
  }, {});

  const estados = Object.keys(grupos).sort();

  return (
    <div id="report-by-state-container" className="p-6 bg-white text-black max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Relatório de Contratos por Estado</h1>

      {estados.map((estado) => {
        const lista = grupos[estado];
        const total = lista.reduce((sum, c) => sum + parseFloat(c.valor_global || 0), 0);

        return (
          <div key={estado} className="bg-white rounded-lg shadow mb-8 p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{estado}</h2>
              <span className="text-lg font-bold text-blue-600">{currencyBRL.format(total)}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Cliente</th>
                    <th className="px-4 py-2 text-right">Valor</th>
                    <th className="px-4 py-2 text-center">Início</th>
                    <th className="px-4 py-2 text-center">Encerramento</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((c, idx) => (
                    <tr
                      key={c.id}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-2">{c.cliente}</td>
                      <td className="px-4 py-2 text-right">
                        {currencyBRL.format(parseFloat(c.valor_global || 0))}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {c.inicio ? dayjs(c.inicio).format('YYYY-MM-DD') : '—'}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {c.encerramento ? dayjs(c.encerramento).format('YYYY-MM-DD') : '—'}
                      </td>
                      <td className="px-4 py-2">{statusBadge(c.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
