import React from 'react';

const Home = () => {
	return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-600">
        Bem-vindo ao ProjectNI
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        Esta é a página inicial de teste do sistema de consulta médica particular.
        Aqui você verá um resumo rápido dos módulos:
      </p>

      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
        <li><strong>Licitações</strong> – módulo para gestão e visualização de licitações.</li>
        <li><strong>Fornecedores</strong> – cadastro e consulta de fornecedores.</li>
        <li><strong>Produtos</strong> – gestão de produtos vinculados ao sistema.</li>
        <li><strong>Match</strong> – módulo de correspondência entre itens/usuários ou critérios.</li>
      </ul>

      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <p className="text-gray-800 dark:text-gray-200">
          Usuário logado: <strong>{/* Aqui podes exibir userName se estiver logado */}</strong>
        </p>
      </div>
    </div>
  );
};

export default Home;