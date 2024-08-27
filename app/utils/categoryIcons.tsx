import { PiggyBank, ShoppingCart, Gift } from 'lucide-react';

export function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case 'savings':
      return <PiggyBank className="text-blue-500" />;
    case 'spending':
      return <ShoppingCart className="text-green-500" />;
    case 'giving':
      return <Gift className="text-purple-500" />;
    default:
      return null;
  }
}