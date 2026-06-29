import React, { useState, useCallback, useMemo } from 'react';
import { MatchContext } from './MatchContext';
import api from '../../api/axios';

const MatchProvider = ({ children }) => {
    const [matchData, setMatchData] = useState({
        status: '',
        allocations: [],
        activatedSuppliers: [],
        totalItemsCost: 0,
        totalLogisticCost: 0,
        totalFixedCost: 0,
        grandTotalCost: 0
    });
    const [loading, setLoading] = useState(false);

    const fetchMatch = useCallback(async (biddingId) => {
        setLoading(true);
        try {
            const response = await api.get(`/match/${biddingId}`);
            setMatchData(response.data);
        } catch (error) {
            console.error("Erro ao buscar otimização:", error);
        } finally {
            setLoading(false);
        }
    }, []); 

    const value = useMemo(() => ({ 
        matchData, 
        fetchMatch, 
        loading 
    }), [matchData, fetchMatch, loading]);

    return (
        <MatchContext.Provider value={value}>
            {children}
        </MatchContext.Provider>
    );
};

export default MatchProvider;