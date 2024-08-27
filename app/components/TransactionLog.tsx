import { Plus } from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

function TransactionLog({ transactions }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Transaction Log</h2>
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center">
          <Plus size={16} className="mr-1" /> Add Transaction
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-gray-200">
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex items-center">
                  {getCategoryIcon(transaction.category)}
                  <span className="ml-2">{transaction.category}</span>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{transaction.type}</td>
              <td className="px-4 py-2 whitespace-nowrap">${transaction.amount.toFixed(2)}</td>
              <td className="px-4 py-2 whitespace-nowrap">{transaction.description}</td>
              <td className="px-4 py-2 whitespace-nowrap">{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionLog;