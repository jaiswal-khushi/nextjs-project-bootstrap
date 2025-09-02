import React, { useState } from 'react';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
}

const BalancePage: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState('');

  const findAccount = async () => {
    setError('');
    setCustomer(null);
    setBalance(null);
    if (!accountNumber) return;
    try {
      const res = await fetch(`/api/transfer/account/${accountNumber}`);
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        setCustomer({
          id: data.customer.id,
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
        });
      } else {
        setError('Account not found');
      }
    } catch {
      setError('Error fetching account');
    }
  };

  const handleCancel = () => {
    setAccountNumber('');
    setCustomer(null);
    setBalance(null);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Balance</h2>
      <div className="mb-3">
        <label className="block mb-1">Account Number</label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button onClick={findAccount} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Find
        </button>
      </div>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {customer && (
        <div className="mb-3">
          <p><strong>Customer ID:</strong> {customer.id}</p>
          <p><strong>First Name:</strong> {customer.firstName}</p>
          <p><strong>Last Name:</strong> {customer.lastName}</p>
          <p className="text-blue-700 font-bold text-lg">Balance: ${balance?.toFixed(2)}</p>
        </div>
      )}
      <button onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
        Cancel
      </button>
    </div>
  );
};

export default BalancePage;
