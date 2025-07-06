// src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import ReportByState from '../components/ReportByState';

const STATE_COLORS = ['#3b82f6', '#facc15', '#ef4444', '#10b981', '#f59e0b'];
const currencyBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function Dashboard() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState({
    vendasAno: 0,
    vendasMes: 0,
    totalElevadores: 0,
    totalPlataformas: 0,
  });
  const [pieData, setPieData] = useState([]);
  const reportRef = useRef();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    const { data, error } = await supabase.from('contratos').select('*');
    setLoading(false);
    if (error) {
      alert('Erro ao carregar contratos: ' + error.message);
      return;
    }
    setContratos(data);

    const now = dayjs();
    const vendasAno = data
      .filter((c) => c.inicio && dayjs(c.inicio).year() === now.year())
      .reduce((sum, c) => sum + parseFloat(c.valor_global || 0), 0);
    const vendasMes = data
      .filter(
        (c) =>
          c.inicio &&
          dayjs(c.inicio).year() === now.year() &&
          dayjs(c.inicio).month() === now.month()
      )
      .reduce((sum, c) => sum + parseFloat(c.valor_global || 0), 0);
    const totalElevadores = data.reduce(
      (sum, c) => sum + (c.quantidadeElevador || 0),
      0
    );
    const totalPlataformas = data.reduce(
      (sum, c) => sum + (c.quantidadePlataforma || 0),
      0
    );
    setCards({ vendasAno, vendasMes, totalElevadores, totalPlataformas });

    const countByState = {};
    data.forEach((c) => {
      const st = c.estado || '—';
      countByState[st] = (countByState[st] || 0) + 1;
    });
    setPieData(
      Object.entries(countByState).map(([estado, value]) => ({
        name: estado,
        value,
      }))
    );
  }

  async function exportarPDF() {
    const element = reportRef.current;
    if (!element) {
      alert('Relatório não encontrado.');
      return;
    }
    const canvas = await html2canvas(element, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait' });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 10, w, h);
    pdf.save('relatorio-contratos-estado.pdf');
  }

  return (
    <div className="p-6 space-y-8">
      {/* Título */}
      <h1 className="text-4xl font-bold text-white">Gestão de Contratos</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Vendas no Ano</p>
          <p className="text-2xl font-semibold">
            {currencyBRL.format(cards.vendasAno)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Vendas no Mês</p>
          <p className="text-2xl font-semibold">
            {currencyBRL.format(cards.vendasMes)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Elevadores</p>
          <p className="text-2xl font-semibold">{cards.totalElevadores}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Plataformas</p>
          <p className="text-2xl font-semibold">{cards.totalPlataformas}</p>
        </div>
      </div>

      {/* Relatório por Estado (oculto) */}
      <div
        ref={reportRef}
        style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}
      >
        <ReportByState contratos={contratos} />
      </div>

      {/* Botão Exportar */}
      <div className="flex items-center gap-4">
        <button
          onClick={exportarPDF}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Exportar Relatório por Estado (PDF)
        </button>
      </div>

      {/* Gráfico de Pizza por Estado */}
      <div className="bg-gray-800 p-4 rounded shadow max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2 text-white">
          Contratos por Estado
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={STATE_COLORS[idx % STATE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Lista de Contratos */}
      <div className="overflow-auto bg-gray-900 rounded shadow">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3">Cliente</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Valor R$</th>
              <th className="p-3">Elevadores</th>
              <th className="p-3">Plataformas</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  Carregando…
                </td>
              </tr>
            ) : (
              contratos.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-800 hover:bg-gray-800"
                >
                  <td className="p-3">
                    <Link
                      to={`/contrato/${c.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {c.cliente}
                    </Link>
                  </td>
                  <td className="p-3">{c.estado}</td>
                  <td className="p-3">
                    {currencyBRL.format(parseFloat(c.valor_global))}
                  </td>
                  <td className="p-3">{c.quantidadeElevador || 0}</td>
                  <td className="p-3">{c.quantidadePlataforma || 0}</td>
                  <td className="p-3 capitalize">{c.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
