import React from 'react';
import { useMatch } from '../hooks/match/useMatch';

const MatchDetails = () => {
    const { matchData } = useMatch();

    // Função auxiliar para formatação de moeda
    const formatCurrency = (value) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

    if (!matchData || !matchData.allocations) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                <p>Carregando ou sem resultados...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Cabeçalho */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => window.history.back()}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
                >
                    ← Voltar
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Detalhes da Otimização</h1>
            </div>

            {/* 1. Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total de Itens', value: matchData.totalItemsCost },
                    { label: 'Total de Frete', value: matchData.totalLogisticCost },
                    { label: 'Custo Fixo', value: matchData.totalFixedCost },
                    { label: 'Custo Final', value: matchData.grandTotalCost, highlight: true }
                ].map((card, idx) => (
                    <div key={idx} className={`p-5 rounded-lg border shadow-sm ${card.highlight ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                        <p className={`text-sm ${card.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{card.label}</p>
                        <p className="text-xl font-bold">{formatCurrency(card.value)}</p>
                    </div>
                ))}
            </div>

            {/* 2. Tabela de Alocações */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Alocações de Produtos</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Produto</th>
                                <th className="px-6 py-4">Fornecedor</th>
                                <th className="px-6 py-4">Qtd</th>
                                <th className="px-6 py-4">Custo Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {matchData.allocations.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{item.productName}</td>
                                    <td className="px-6 py-4">{item.companyName}</td>
                                    <td className="px-6 py-4">{item.quantityBought}</td>
                                    <td className="px-6 py-4 font-semibold">{formatCurrency(item.finalTotalCost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Fornecedores Ativados */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fornecedores Ativados</h3>
                <div className="grid gap-3">
                    {matchData.activatedSuppliers.map((supplier) => (
                        <div key={supplier.idSupplier} className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <span className="font-medium text-gray-700">{supplier.companyName}</span>
                            <span className="text-sm text-gray-500">Frete Fixo: {formatCurrency(supplier.fixedCost)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;    