import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password: senha });
    setLoading(false);
    if (error) alert('Erro: ' + error.message);
    else {
      alert('Usuário criado com sucesso! Verifique seu e-mail.');
      navigate('/login');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-900 text-white rounded-md">
      <h2 className="text-2xl mb-6">Cadastro</h2>
      <form onSubmit={handleCadastro} className="space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}
