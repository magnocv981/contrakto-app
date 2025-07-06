import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

      // Armazena os dados do usuário localmente
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      alert('Erro ao fazer login: ' + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Entrar no Contrakto</h2>

        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 mb-4"
          placeholder="seu@email.com"
          required
        />

        <label className="block mb-1 font-medium">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 mb-6"
          placeholder="Digite sua senha"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

