import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Contatos() {
  const [contatos, setContatos] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: '',
    email: '',
    telefone: '',
  });

  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    carregarContatos();
  }, []);

  async function carregarContatos() {
    const { data, error } = await supabase.from('contatos').select('*').order('nome');
    if (error) {
      alert('Erro ao carregar contatos');
    } else {
      setContatos(data);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nome || !form.email) {
      alert('Preencha nome e email');
      return;
    }

    const contato = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
    };

    let res;
    if (modoEdicao && form.id) {
      res = await supabase.from('contatos').update(contato).eq('id', form.id);
    } else {
      res = await supabase.from('contatos').insert(contato);
    }

    if (res.error) {
      alert('Erro ao salvar: ' + res.error.message);
    } else {
      setForm({ id: null, nome: '', email: '', telefone: '' });
      setModoEdicao(false);
      carregarContatos();
    }
  }

  function editarContato(contato) {
    setForm(contato);
    setModoEdicao(true);
  }

  async function excluirContato(id) {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return;
    const { error } = await supabase.from('contatos').delete().eq('id', id);
    if (error) alert('Erro ao excluir');
    else carregarContatos();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contatos</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow mb-6">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required className="w-full p-2 bg-gray-800 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full p-2 bg-gray-800 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Telefone</label>
          <input type="text" name="telefone" value={form.telefone} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
          {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Contato'}
        </button>
      </form>

      {contatos.length === 0 ? (
        <p>Nenhum contato cadastrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left bg-gray-900 rounded border-collapse">
            <thead>
              <tr>
                <th className="border-b p-3">Nome</th>
                <th className="border-b p-3">Email</th>
                <th className="border-b p-3">Telefone</th>
                <th className="border-b p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contatos.map((c) => (
                <tr key={c.id} className="hover:bg-gray-800">
                  <td className="border-b p-3">{c.nome}</td>
                  <td className="border-b p-3">{c.email}</td>
                  <td className="border-b p-3">{c.telefone}</td>
                  <td className="border-b p-3 space-x-2">
                    <button
                      onClick={() => editarContato(c)}
                      className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirContato(c.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
