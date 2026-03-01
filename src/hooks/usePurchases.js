import { useState, useEffect } from 'react';

export const usePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load purchases from localStorage
  useEffect(() => {
    const storedPurchases = localStorage.getItem('purchases');
    if (storedPurchases) {
      setPurchases(JSON.parse(storedPurchases));
    } else {
      // Sample data
      const samplePurchases = [
        {
          id: 'P001',
          studentId: 'STU0001',
          studentName: 'Oluwaseun Okonkwo',
          items: [{ id: 1, name: 'School Uniform', price: 15000, quantity: 1 }],
          totalAmount: 15000,
          date: '2024-02-28',
          paymentMethod: 'cash',
          status: 'completed'
        },
        {
          id: 'P002',
          studentId: 'STU0003',
          studentName: 'Emeka Bello',
          items: [
            { id: 2, name: 'Mathematics Textbook', price: 8500, quantity: 1 },
            { id: 3, name: 'English Textbook', price: 7500, quantity: 1 }
          ],
          totalAmount: 16000,
          date: '2024-02-27',
          paymentMethod: 'transfer',
          status: 'completed'
        }
      ];
      setPurchases(samplePurchases);
      localStorage.setItem('purchases', JSON.stringify(samplePurchases));
    }
  }, []);

  // Filter and sort purchases
  useEffect(() => {
    let filtered = [...purchases];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    const today = new Date();
    const thisWeek = new Date(today.setDate(today.getDate() - 7));
    const thisMonth = new Date(today.setMonth(today.getMonth() - 1));

    if (dateFilter === 'week') {
      filtered = filtered.filter(p => new Date(p.date) >= thisWeek);
    } else if (dateFilter === 'month') {
      filtered = filtered.filter(p => new Date(p.date) >= thisMonth);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'highest') return b.totalAmount - a.totalAmount;
      if (sortBy === 'lowest') return a.totalAmount - b.totalAmount;
      return 0;
    });

    setFilteredPurchases(filtered);
  }, [purchases, searchTerm, dateFilter, sortBy]);

  const addPurchase = (newPurchase) => {
    const purchase = {
      id: `P${String(purchases.length + 1).padStart(3, '0')}`,
      ...newPurchase,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    const updatedPurchases = [purchase, ...purchases];
    setPurchases(updatedPurchases);
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
    return purchase;
  };

  const getStats = () => {
    const totalSpending = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const thisMonthSpending = purchases
      .filter(p => {
        const purchaseDate = new Date(p.date);
        const now = new Date();
        return purchaseDate.getMonth() === now.getMonth() && 
               purchaseDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + p.totalAmount, 0);
    
    const averagePerPurchase = purchases.length > 0 
      ? Math.round(totalSpending / purchases.length) 
      : 0;

    return {
      totalSpending,
      thisMonthSpending,
      totalPurchases: purchases.length,
      averagePerPurchase
    };
  };

  return {
    purchases: filteredPurchases,
    allPurchases: purchases,
    stats: getStats(),
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    addPurchase
  };
};