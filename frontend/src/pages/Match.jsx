import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; 
import { useBidding } from '../hooks/bidding/useBidding'; 
import { useMatch } from '../hooks/match/useMatch';   

const Match = () => {
  const { biddings, loading: biddingsLoading, error: biddingsError } = useBidding();
  
  // Agora usamos matchData em vez de matches
  const { matchData, loading: matchesLoading, error: matchesError, fetchMatch } = useMatch();

  const [selectedBiddingId, setSelectedBiddingId] = useState('');
  const navigate = useNavigate();

  const handleBiddingSelect = (event) => {
    setSelectedBiddingId(event.target.value);
  };

  useEffect(() => {
    if (selectedBiddingId) {
      fetchMatch(selectedBiddingId);
    }
  }, [selectedBiddingId, fetchMatch]);

  const handleCardClick = (productId, supplierId) => {
    navigate(`/match/${productId}/${supplierId}`);
  };

  if (biddingsLoading) return <div className="text-center p-10 text-gray-600">Carregando Licitações...</div>;
  if (biddingsError) return <div className="text-red-600 text-center p-10">Erro Carregando Licitações: {biddingsError}</div>;

  const selectedBidding = biddings.find(b => b.idBidding === selectedBiddingId);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#CBCBCB]">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Encontrar Match</h1>
      </div>

      <div className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <label htmlFor="biddingSelect" className="block text-lg font-semibold text-gray-800 mb-3">Selecione uma Licitação</label>
        <select
          id="biddingSelect"
          value={selectedBiddingId}
          onChange={handleBiddingSelect}
          className="block w-full max-w-lg px-4 py-3 border border-[#CBCBCB] rounded-md shadow-sm bg-white"
        >
          <option value="">Selecionar Licitação</option>
          {biddings.map(bidding => (
            <option key={bidding.idBidding} value={bidding.idBidding}>
              {bidding.name} (Produto: {bidding.productBidding})
            </option>
          ))}
        </select>
      </div>

      {selectedBiddingId && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Resultado da Otimização</h2>
          {matchesLoading && <div className="text-center p-10 text-gray-600">Processando solver...</div>}
          {matchesError && <div className="bg-red-100 text-red-700 p-6 rounded-md">{matchesError}</div>}

          {!matchesLoading && !matchesError && matchData && (
            <>
              {/* Verifica se a lista de alocações está vazia */}
              {(!matchData.allocations || matchData.allocations.length === 0) ? (
                <div className="bg-white shadow-md rounded-lg p-10 text-center text-gray-500">
                  <h3 className="text-lg font-medium">Nenhum Match Encontrado</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {matchData.allocations.map((match, index) => (
                    <div
                      key={`${match.idProduct}-${index}`}
                      className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-5"
                      onClick={() => handleCardClick(match.idProduct, match.idSupplier)}
                    >
                      <h3 className="text-xl font-bold text-gray-900">{match.productName}</h3>
                      <p className="text-sm text-gray-500">Fornecedor: {match.companyName}</p>
                      <div className="mt-4">
                        <p>Qtd: {match.quantityBought}</p>
                        <p className="text-2xl font-bold">R$ {match.finalTotalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Match;	