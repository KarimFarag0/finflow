import { useState, useEffect } from 'react';
import axios from 'axios';

import { ReactComponent as SavingsIllustration } from '../Images/Savings-cuate.svg';
import { ReactComponent as WavingHands } from '../Images/waving-hand.svg';

import SpendingChart from '../Components/SpendingChart';



import dogImage from '../Images/Hobbies - Dog.png';

export default function DashboardPage({ user, onLogout }) {
  // ============ STATE ============
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category_id: '',
    type: 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // ============ FETCH DATA ============
  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCategories(response.data.categories);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
      setLoading(false);
    }
  };

  // ============ CALCULATIONS ============
  const calculateTotalBalance = () => {
    let total = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        total += parseFloat(t.amount);
      } else if (t.type === 'expense') {
        total -= parseFloat(t.amount);
      }
    });
    return total;
  };

  const calculateTotalIncome = () => {
    let income = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        income += parseFloat(t.amount);
      }
    });
    return income;
  };

  const calculateTotalExpenses = () => {
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'expense') {
        expenses += parseFloat(t.amount);
      }
    });
    return expenses;
  };

  const calculateMonthBalance = () => {
    const today = new Date();
    let monthTotal = 0;
    transactions.forEach(t => {
      const transactionDate = new Date(t.date);
      if (transactionDate.getMonth() === today.getMonth() && 
          transactionDate.getFullYear() === today.getFullYear()) {
        if (t.type === 'income') {
          monthTotal += parseFloat(t.amount);
        } else if (t.type === 'expense') {
          monthTotal -= parseFloat(t.amount);
        }
      }
    });
    return monthTotal;
  };

  // ============ FORM HANDLERS ============
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type: type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title && !formData.description || !formData.amount || !formData.category_id || !formData.date) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/transactions', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setSuccessMessage('✓ Transaction added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      setFormData({
        title: '',
        amount: '',
        category_id: '',
        type: 'expense',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      setShowModal(false);
      fetchTransactions();
    } catch (err) {
      alert('Failed to add transaction');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Other';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#7BAE6E';
  };

  const handleDeleteTransaction = async (transactionId) => {
    if(!window.confirm('Delete this transaction?')) return;

    try{
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3001/api/transactions/${transactionId}`, {
            headers: {'Authorization': `Bearer ${token}`}
        });

        setSuccessMessage('Transaction deleted');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchTransactions();
    }catch(err) {
        alert('Failed to delete');
        console.error(err);
    }
  };

  // ============ SVG ILLUSTRATIONS ============
  
  // Hand-drawn piggy bank
  const PiggyBankSVG = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="18" r="12" stroke="#7BAE6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="29" cy="20" r="3.5" stroke="#7BAE6E" strokeWidth="2.5" fill="white"/>
      <path d="M 32 18 L 36 16" stroke="#7BAE6E" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 32 22 L 36 24" stroke="#7BAE6E" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="20" cy="32" rx="8" ry="3.5" stroke="#7BAE6E" strokeWidth="2.5" fill="white"/>
      <rect x="16" y="27" width="8" height="2.5" fill="#7BAE6E" rx="1"/>
    </svg>
  );

  // Hand-drawn income arrow
  const IncomeArrowSVG = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20 28 Q 20 20 20 12" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 12 20 Q 20 12 28 20" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="20" r="14" stroke="#4CAF50" strokeWidth="2" fill="none" opacity="0.3"/>
    </svg>
  );

  // Hand-drawn expense arrow
  const ExpenseArrowSVG = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20 12 Q 20 20 20 28" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 12 20 Q 20 28 28 20" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="20" r="14" stroke="#F4A261" strokeWidth="2" fill="none" opacity="0.3"/>
    </svg>
  );

  // Hand-drawn calendar
  const CalendarSVG = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="14" width="20" height="16" rx="2" stroke="#F4A261" strokeWidth="2.5" fill="white"/>
      <path d="M 13 14 L 13 10" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 27 14 L 27 10" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="10" y1="19" x2="30" y2="19" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="15" cy="24" r="1.5" fill="#F4A261"/>
      <circle cx="20" cy="24" r="1.5" fill="#F4A261"/>
      <circle cx="25" cy="24" r="1.5" fill="#F4A261"/>
    </svg>
  );

  // Decorative leaf (background)
  const LeafSVG = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.15">
      <path d="M 30 10 Q 40 20 35 40 Q 30 50 20 45 Q 15 30 30 10" stroke="#7BAE6E" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 22 25 Q 28 28 30 35" stroke="#7BAE6E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 28 20 Q 32 28 30 35" stroke="#7BAE6E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );

  // Decorative coins
  const CoinStackSVG = () => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.12">
      <ellipse cx="25" cy="15" rx="10" ry="5" stroke="#F4A261" strokeWidth="2" fill="white"/>
      <rect x="15" y="15" width="20" height="8" stroke="#F4A261" strokeWidth="2" fill="white"/>
      <ellipse cx="25" cy="23" rx="10" ry="5" stroke="#F4A261" strokeWidth="2" fill="white"/>
      <rect x="15" y="23" width="20" height="8" stroke="#F4A261" strokeWidth="2" fill="white"/>
      <ellipse cx="25" cy="31" rx="10" ry="5" stroke="#F4A261" strokeWidth="2" fill="white"/>
    </svg>
  );

  // ============ RENDER ============
  return (
    <div className='min-h-screen bg-[#FDF6EC] relative overflow-hidden'>
      {/* Decorative elements - background */}
      <div className='fixed top-20 right-10 opacity-10 pointer-events-none'>
        <LeafSVG />
      </div>
      <div className='fixed bottom-40 left-5 opacity-10 pointer-events-none'>
        <CoinStackSVG />
      </div>

      {/* Header */}
      <div className='bg-white/70 backdrop-blur-md border-b-2 border-[#7BAE6E] sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 py-6 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Bottom coin */}
              <circle cx="20" cy="26" r="8" stroke="#7BAE6E" strokeWidth="2.5" fill="none"/>
              <line x1="12" y1="26" x2="28" y2="26" stroke="#7BAE6E" strokeWidth="1.5"/>
              
              {/* Middle coin */}
              <circle cx="24" cy="18" r="8" stroke="#7BAE6E" strokeWidth="2.5" fill="#E8F5E9"/>
              <line x1="16" y1="18" x2="32" y2="18" stroke="#7BAE6E" strokeWidth="1.5"/>
              <text x="24" y="21" textAnchor="middle" fontSize="10" fill="#7BAE6E" fontWeight="bold">$</text>
              
              {/* Top coin */}
              <circle cx="16" cy="10" r="8" stroke="#7BAE6E" strokeWidth="2.5" fill="#C8E6C9"/>
              <line x1="8" y1="10" x2="24" y2="10" stroke="#7BAE6E" strokeWidth="1.5"/>
              <text x="16" y="13" textAnchor="middle" fontSize="10" fill="#7BAE6E" fontWeight="bold">$</text>
            </svg>
            <h1 className='text-3xl font-bold font-display text-[#3D3227]'>FinFlow</h1>
          </div>
          <button
            onClick={onLogout}
            className='bg-[#F4A261] hover:bg-orange-500 text-black px-6 py-2 font-display font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-8 relative z-10'>

        {/* Welcome Section */}
        <div className='mb-16 flex items-center justify-between relative rounded-3xl py-8 px-4 gap-12'>

            {/* Background blobs - decorative */}
            <div className='absolute -left-32 -top-20 opacity-40 pointer-events-none'>
                <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100,40 Q140,30 160,70 Q170,100 160,140 Q140,170 100,180 Q60,170 40,140 Q30,100 40,60 Q60,30 100,40 Z" 
                    fill="#7BAE6E" opacity="0.30"/>
                </svg>
            </div>

            <div className='absolute -right-40 top-20 opacity-30 pointer-events-none'>
                <svg width="350" height="350" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100,50 Q150,40 170,90 Q180,120 170,150 Q150,180 100,190 Q50,180 30,150 Q20,120 30,80 Q50,40 100,50 Z" 
                    fill="#F4A261" opacity="0.30"/>
                </svg>
            </div>

            <div className='absolute -bottom-10 left-1/4 opacity-25 pointer-events-none'>
                <svg width="250" height="250" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60,20 Q90,15 105,45 Q110,65 105,85 Q90,110 60,115 Q30,110 15,85 Q10,65 15,40 Q30,15 60,20 Z" 
                    fill="#4CAF50" opacity="0.30"/>
                </svg>
            </div>

            {/* Text on the left */}
            <div className='flex-1'>
            <div className='flex items-center gap-3 mb-6'>
                <h2 className='text-6xl font-bold font-display text-[#3D3227] leading-tight'>
                Welcome back, {user?.first_name}!
                </h2>
                {/* SVG Illustration */}
                <WavingHands 
                className='w-[90px] h-[90px] opacity-100 drop-shadow-2xl flex-shrink-0'
                />
            </div>
            
            <p className='text-xl text-[#8C7E72] font-sans'>Here's your financial overview</p>
            </div>
            {/* BIG illustration on right - main element */}
            <div className='flex-1 flex justify-center'>
                <div className='hover: -translate-y-2 transition-transform duration-300'>
                    {/* SVG Illustration */}
                    <SavingsIllustration 
                        className='w-[600px] h-[600px] opacity-80 drop-shadow-2xl'
                    />
                </div>
            </div>
        </div>

        {/* Stats Cards Grid */}
        <div className='grid grid-cols-1 mb-[8rem] md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {/* Total Balance Card */}
          <div className='bg-white rounded-2xl p-6 shadow-md border-2 border-[#A5D6A7] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group'>
            <div className='absolute top-0 right-0 opacity-0 group-hover:opacity-20 transition-opacity'>
              <LeafSVG />
            </div>
            <div className='flex items-center gap-3 mb-4 relative z-10'>
              <div className='w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center'>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Bottom coin */}
              <circle cx="20" cy="26" r="8" stroke="#7BAE6E" strokeWidth="2.5" fill="none"/>
              <line x1="12" y1="26" x2="28" y2="26" stroke="#7BAE6E" strokeWidth="1.5"/>
              
              {/* Middle coin */}
              <circle cx="24" cy="18" r="8" stroke="#7BAE6E" strokeWidth="2.5" fill="#E8F5E9"/>
              <line x1="16" y1="18" x2="32" y2="18" stroke="#7BAE6E" strokeWidth="1.5"/>
              <text x="24" y="21" textAnchor="middle" fontSize="10" fill="#7BAE6E" fontWeight="bold">$</text>
              
              {/* Top coin */}
              <circle cx="16" cy="10" r="8" stroke="#7BAE6E" strokeWidth="2.5" fill="#C8E6C9"/>
              <line x1="8" y1="10" x2="24" y2="10" stroke="#7BAE6E" strokeWidth="1.5"/>
              <text x="16" y="13" textAnchor="middle" fontSize="10" fill="#7BAE6E" fontWeight="bold">$</text>
            </svg>
              </div>
              <span className='text-sm font-semibold text-[#8C7E72] font-sans'>Total Balance</span>
            </div>
            <p className='text-3xl font-bold text-[#7BAE6E] mb-1 relative z-10'>
              ${calculateTotalBalance().toFixed(2)}
            </p>
            <p className='text-sm text-[#8C7E72] relative z-10'>All time balance</p>
          </div>

          {/* Income Card */}
          <div className='bg-white rounded-2xl p-6 shadow-md border-2 border-[#81C784] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden'>
            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity'>
              <LeafSVG />
            </div>
            <div className='flex items-center gap-3 mb-4 relative z-10'>
              <div className='w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center'>
                <IncomeArrowSVG />
              </div>
              <span className='text-sm font-semibold text-[#8C7E72] font-sans'>Total Income</span>
            </div>
            <p className='text-3xl font-bold text-[#4CAF50] mb-1 relative z-10'>
              ${calculateTotalIncome().toFixed(2)}
            </p>
            <p className='text-sm text-[#8C7E72] relative z-10'>Money coming in</p>
          </div>

          {/* Expenses Card */}
          <div className='bg-white rounded-2xl p-6 shadow-md border-2 border-[#FFB3A0] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden'>
            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity'>
              <CoinStackSVG />
            </div>
            <div className='flex items-center gap-3 mb-4 relative z-10'>
              <div className='w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center'>
                <ExpenseArrowSVG />
              </div>
              <span className='text-sm font-semibold text-[#8C7E72] font-sans'>Total Expenses</span>
            </div>
            <p className='text-3xl font-bold text-[#F4A261] mb-1 relative z-10'>
              ${calculateTotalExpenses().toFixed(2)}
            </p>
            <p className='text-sm text-[#8C7E72] relative z-10'>Money going out</p>
          </div>

          {/* This Month Card */}
          <div className='bg-white rounded-2xl p-6 shadow-md border-2 border-[#FDD835] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden'>
            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-opacity'>
              <LeafSVG />
            </div>
            <div className='flex items-center gap-3 mb-4 relative z-10'>
              <div className='w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center'>
                <CalendarSVG />
              </div>
              <span className='text-sm font-semibold text-[#8C7E72] font-sans'>This Month</span>
            </div>
            <p className={`text-3xl font-bold mb-1 relative z-10 ${calculateMonthBalance() >= 0 ? 'text-[#4CAF50]' : 'text-[#F4A261]'}`}>
              ${calculateMonthBalance().toFixed(2)}
            </p>
            <p className='text-sm text-[#8C7E72] relative z-10'>
              {calculateMonthBalance() >= 0 ? 'Positive' : 'Negative'} balance
            </p>
          </div>
        </div>

        {/* Add Transaction Button */}
        <div className='flex flex-row gap-6 items-center '>
            <button
                onClick={() => setShowModal(true)}
                className='flex items-center gap-2 bg-[#7BAE6E] hover:bg-[#6b9c5f] text-white px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 font-sans'
                >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Transaction
            </button>

            <img src={dogImage} alt="Hobs" className='w-20 h-20' />

        </div>
        

        {/* Success Message */}
        {successMessage && (
          <div className='bg-[#C8E6C9] text-[#2E7D32] px-4 py-3 rounded-lg font-semibold mb-6 font-sans'>
            {successMessage}
          </div>
        )}

        {/* Transactions List */}
        <div className='bg-white rounded-2xl p-6 shadow-md'>
          <h3 className='text-xl font-bold font-display text-[#3D3227] mb-4'>
            Recent Transactions
          </h3>

          {transactions.length === 0 ? (
            <div className='text-center py-10'>
              <svg width="80" height="80" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx-auto mb-4 opacity-40'>
                <path d="M 30 10 Q 40 20 35 40 Q 30 50 20 45 Q 15 30 30 10" stroke="#7BAE6E" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M 22 25 Q 28 28 30 35" stroke="#7BAE6E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M 28 20 Q 32 28 30 35" stroke="#7BAE6E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
              <p className='text-[#B5A99A] font-sans'>
                🌿 No transactions yet. Click "Add Transaction" to get started!
              </p>
            </div>
          ) : (
            <div className='space-y-2'>
              {[...transactions].reverse().map(t => (
                <div
                  key={t.id}
                  className='flex items-center justify-between p-3 rounded-lg bg-[#F5F0EA] hover:bg-[#EDEAE5] transition-colors font-sans'
                >
                  <div className='flex items-center gap-3 flex-1'>
                    <div
                      className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'
                      style={{ backgroundColor: getCategoryColor(t.category_id) + '20' }}
                    >
                      <span className='text-lg'>
                        {t.type === 'income' ? '📥' : '📤'}
                      </span>
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-[#3D3227]'>
                        {t.description || 'Transaction'}
                      </p>
                      <p className='text-xs text-[#8C7E72]'>
                        {getCategoryName(t.category_id)} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span
                    className='text-sm font-bold flex-shrink-0'
                    style={{ color: t.type === 'income' ? '#4CAF50' : '#F4A261' }}
                  >
                    {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                  </span>

                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => handleDeleteTransaction(t.id)}
                    className='opacity-0 group-hover: opacity-100 transition-opacity text-red-500 hover:text-red-700 text-lg'
                    title='Delete'
                  >
                    🗑️

                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <SpendingChart transactions={transactions} categories={categories} />
      </div>

      {/* Modal */}
        {showModal && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 font-sans'>
            <div className='bg-gradient-to-br from-white to-[#FDF6EC] rounded-3xl p-8 w-full max-w-md shadow-2xl relative border-2 border-[#7BAE6E]'>
            {/* Decorative elements in modal */}
            <div className='absolute top-0 right-0 opacity-20 pointer-events-none'>
                <LeafSVG />
            </div>
            <div className='absolute -bottom-10 -left-10 opacity-15 pointer-events-none'>
                <svg width="150" height="150" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60,20 Q90,15 105,45 Q110,65 105,85 Q90,110 60,115 Q30,110 15,85 Q10,65 15,40 Q30,15 60,20 Z" 
                    fill="#F4A261" opacity="0.5"/>
                </svg>
            </div>
            
            <div className='flex justify-between items-center mb-8 relative z-10'>
                <h2 className='text-3xl font-bold font-display text-[#3D3227]'>
                Add Transaction ✨
                </h2>
                <button
                onClick={() => setShowModal(false)}
                className='text-[#8C7E72] hover:text-[#3D3227] text-3xl font-light hover:scale-110 transition-transform'
                >
                ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5 relative z-10'>
                {/* Type Buttons */}
                <div className='flex gap-3'>
                <button
                    type="button"
                    onClick={() => handleTypeChange('income')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all transform ${
                    formData.type === 'income'
                        ? 'bg-[#4CAF50] text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-[#3D3227] hover:bg-gray-200'
                    }`}
                >
                    📥 Income
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeChange('expense')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all transform ${
                    formData.type === 'expense'
                        ? 'bg-[#F4A261] text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-[#3D3227] hover:bg-gray-200'
                    }`}
                >
                    📤 Expense
                </button>
                </div>

                {/* Title Input */}
                <div>
                <label className='text-sm font-semibold text-[#3D3227] block mb-2'>
                    What's this transaction?
                </label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g. Grocery shopping"
                    className='w-full px-4 py-3 border-2 border-[#E0D7D0] rounded-xl text-sm focus:outline-none focus:border-[#7BAE6E] focus:bg-[#FFFEF5] transition-all'
                />
                </div>

                {/* Amount Input */}
                <div>
                <label className='text-sm font-semibold text-[#3D3227] block mb-2'>
                    Amount
                </label>
                <div className='relative'>
                    <span className='absolute left-4 top-3 text-lg text-[#7BAE6E]'>$</span>
                    <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                    className='w-full pl-8 pr-4 py-3 border-2 border-[#E0D7D0] rounded-xl text-sm focus:outline-none focus:border-[#7BAE6E] focus:bg-[#FFFEF5] transition-all'
                    />
                </div>
                </div>

                {/* Category Select */}
                <div>
                <label className='text-sm font-semibold text-[#3D3227] block mb-2'>
                    Category
                </label>
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 border-2 border-[#E0D7D0] rounded-xl text-sm focus:outline-none focus:border-[#7BAE6E] focus:bg-[#FFFEF5] transition-all bg-white'
                >
                    <option value="">Select a category...</option>
                    {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* Date Input */}
                <div>
                <label className='text-sm font-semibold text-[#3D3227] block mb-2'>
                    Date
                </label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 border-2 border-[#E0D7D0] rounded-xl text-sm focus:outline-none focus:border-[#7BAE6E] focus:bg-[#FFFEF5] transition-all bg-white'
                />
                </div>

                {/* Submit Button */}
                <button
                type="submit"
                disabled={submitting}
                className='w-full py-4 mt-4 bg-gradient-to-r from-[#7BAE6E] to-[#6b9c5f] hover:from-[#6b9c5f] hover:to-[#5a8b4e] disabled:opacity-60 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 transform'
                >
                {submitting ? '⏳ Adding...' : '✨ Add Transaction'}
                </button>
            </form>
            </div>
        </div>
        )}
    </div>
  );
}