import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const estadosBR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cliente: '',
    estado: '',
    valor_global: '',
    status: '',
    objetoContrato: '',
    contatoNome: '',
    contatoEmail: '',
    contatoTelefone: '',
    quantidadeElevador: 0,
    quantidadePlataforma: 0,
    inicio: '',
    encerramento: '',
    arquivoPdf: null,
  });

  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (id) carregarContrato();
  }, [id]);

  async function carregarContrato() {
    const { data, error } = await supabase.from('contratos').select('*').eq('id', id).single();
    if (!error && data) {
      setForm({ ...data, arquivoPdf: null });

      // Verifica se o PDF existe
      const { data: lista, error: errList } = await supabase.storage
        .from('documentos')
        .list(`contratos`);

      if (!errList && lista.some(f => f.name === `${data.id}.pdf`)) {
        const { data: pdf } = supabase.storage
          .from('documentos')
          .getPublicUrl(`contratos/${data.id}.pdf`);
        setPdfUrl(pdf.publicUrl);
      } else {
        setPdfUrl(null);
      }
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'arquivoPdf') {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function salvar() {
    const novo = {
      ...form,
      valor_global: parseFloat(form.valor_global || 0),
      quantidadeElevador: parseInt(form.quantidadeElevador || 0),
      quantidadePlataforma: parseInt(form.quantidadePlataforma || 0),
      valor_comissao: parseFloat(form.valor_global || 0) * 0.04,
    };

    delete novo.arquivoPdf;

    let result;
    if (id) {
      result = await supabase.from('contratos').update(novo).eq('id', id).select().single();
    } else {
      result = await supabase.from('contratos').insert(novo).select().single();
    }

    if (result.error) {
      alert('Erro ao salvar: ' + result.error.message);
      return;
    }

    if (form.arquivoPdf) {
      const contratoId = result.data.id;
      const { error: uploadErr } = await supabase.storage
        .from('documentos')
        .upload(`contratos/${contratoId}.pdf`, form.arquivoPdf, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadErr) {
        alert('Contrato salvo, mas erro ao enviar PDF: ' + uploadErr.message);
      } else {
        const { data: pdf } = supabase.storage
          .from('documentos')
          .getPublicUrl(`contratos/${contratoId}.pdf`);
        setPdfUrl(pdf.publicUrl);
      }
    }

    navigate('/');
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 text-white">
      <h1 className="text-2xl font-bold">{id ? 'Editar' : 'Novo'} Contrato</h1>

      <label className="block">
        Cliente:
        <input
          name="cliente"
          value={form.cliente}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 mt-1"
        />
      </label>

      <label className="block">
        Estado:
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white mt-1"
        >
          <option value="">Selecione o estado</option>
          {estadosBR.map((uf) => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>
      </label>

      <label className="block">
        Valor Global:
        <input
          name="valor_global"
          type="number"
          value={form.valor_global}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 mt-1"
        />
      </label>

      <label className="block">
        Valor da Comissão (4%):
        <input
          name="valor_comissao"
          value={(parseFloat(form.valor_global || 0) * 0.04).toFixed(2)}
          readOnly
          className="w-full p-2 rounded bg-gray-700 text-white mt-1 cursor-not-allowed"
        />
      </label>

      <label className="block">
        Status:
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white mt-1"
        >
          <option value="">Selecione o status</option>
          <option value="Ativo">Ativo</option>
          <option value="Pendente">Pendente</option>
          <option value="Encerrado">Encerrado</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          Qtde Elevadores:
          <input
            name="quantidadeElevador"
            type="number"
            value={form.quantidadeElevador}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 mt-1"
          />
        </label>

        <label className="block">
          Qtde Plataformas:
          <input
            name="quantidadePlataforma"
            type="number"
            value={form.quantidadePlataforma}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 mt-1"
          />
        </label>
      </div>

      <label className="block">
        Objeto do Contrato:
        <textarea
          name="objetoContrato"
          value={form.objetoContrato}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 mt-1"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          Contato - Nome:
          <input
            name="contatoNome"
            value={form.contatoNome}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 mt-1"
          />
        </label>

        <label className="block">
          Contato - Email:
          <input
            name="contatoEmail"
            value={form.contatoEmail}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 mt-1"
          />
        </label>
      </div>

      <label className="block">
        Contato - Telefone:
        <input
          name="contatoTelefone"
          value={form.contatoTelefone}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 mt-1"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          Início:
          <input
            name="inicio"
            type="date"
            value={form.inicio}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 mt-1"
          />
        </label>

        <label className="block">
          Encerramento:
          <input
            name="encerramento"
            type="date"
            value={form.encerramento}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 mt-1"
          />
        </label>
      </div>

      <label className="block">
        Anexar Documento (PDF):
        <input
          name="arquivoPdf"
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="mt-2"
        />
      </label>

      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-400 hover:underline"
        >
          📄 Ver PDF do Contrato
        </a>
      )}

      <button
        onClick={salvar}
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        Salvar
      </button>
    </div>
  );
}
