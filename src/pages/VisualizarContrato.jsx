import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function VisualizarContrato() {
  const { id } = useParams();
  const [contrato, setContrato] = useState(null);

  useEffect(() => {
    buscarContrato();
  }, [id]);

  async function buscarContrato() {
    const { data, error } = await supabase
      .from('contratos')
      .select(`
        *,
        contatos:contatoid ( nome, email, telefone )
      `)
      .eq('id', id)
      .single();

    if (error) {
      alert('Erro ao carregar contrato: ' + error.message);
    } else {
      setContrato(data);
    }
  }

  if (!contrato) return <p className="p-4">Carregando contrato...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Contrato</h1>
      <div className="bg-gray-900 p-6 rounded-lg shadow space-y-4">
        <p><strong>Cliente:</strong> {contrato.cliente}</p>
        <p><strong>Estado:</strong> {contrato.estado}</p>
        <p><strong>Status:</strong> {contrato.status}</p>
        <p><strong>Valor Global:</strong> R$ {parseFloat(contrato.valor_global).toFixed(2)}</p>
        <p><strong>Comissão:</strong> R$ {parseFloat(contrato.comissao).toFixed(2)}</p>
        <p><strong>Início:</strong> {contrato.inicio?.slice(0, 10) || '-'}</p>
        <p><strong>Encerramento:</strong> {contrato.encerramento?.slice(0, 10) || '-'}</p>

        <h2 className="text-xl font-semibold mt-6">Contato Vinculado</h2>
        <p><strong>Nome:</strong> {contrato.contatoNome}</p>
        <p><strong>Email:</strong> {contrato.contatoEmail}</p>
        <p><strong>Telefone:</strong> {contrato.contatoTelefone}</p>

        <div className="mt-6">
          <Link
            to={`/contrato/${contrato.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Editar Contrato
          </Link>
        </div>
      </div>
    </div>
  );
}

