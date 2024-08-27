'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiggyBank, ShoppingCart, Gift, Plus, PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { useSession } from "next-auth/react"; // Add this import

// Add this near the top of your file, after imports
const MOCK_USER_ID = "mock-user-id-123";

// Mock allowances data
const mockAllowances = {
  savings: { amount: 5, type: 'weekly', color: 'bg-blue-100 text-blue-800', icon: PiggyBank },
  spending: { amount: 10, type: 'weekly', color: 'bg-green-100 text-green-800', icon: ShoppingCart },
  giving: { amount: 15, type: 'percent', color: 'bg-purple-100 text-purple-800', icon: Gift },
};

const transactionSchema = z.object({
  category: z.enum(["savings", "spending", "giving"]),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().min(0.01),
  description: z.string().min(1),
});

function AddTransactionForm({ onAddTransaction, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      category: "savings",
      type: "income",
      amount: "",
      description: "",
    },
  });

  function onSubmit(data) {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount)
      };

      console.log('Submitting transaction:', formattedData);
      onAddTransaction(formattedData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="spending">Spending</SelectItem>
                  <SelectItem value="giving">Giving</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Transaction</Button>
        </div>
      </form>
    </Form>
  );
}

// Update the transaction type
type Transaction = {
  id: string;
  date: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
};

export default function Dashboard() {
  const [allowances, setAllowances] = useState(mockAllowances);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const dataFetchedRef = useRef(false);
  const { data: session } = useSession(); // Add this line to get the session

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    console.log('Dashboard useEffect running');
    async function fetchData() {
      setIsLoading(true);
      try {
        console.log('Fetching transactions...');
        const transactionsResponse = await fetch('/api/transactions');
        if (!transactionsResponse.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const transactionsData = await transactionsResponse.json();
        console.log('Transactions fetched:', transactionsData);
        setTransactions(transactionsData);

        // For now, we'll use mock allowances data
        setAllowances(mockAllowances);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      let userId;

      if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
        userId = MOCK_USER_ID;
      } else if (session?.user?.id) {
        userId = session.user.id;
      } else {
        throw new Error('User not authenticated');
      }

      const transactionWithUserId = {
        ...newTransaction,
        userId: userId,
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionWithUserId),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const addedTransaction: Transaction = await response.json();
      console.log('Transaction added:', addedTransaction);
      
      setTransactions(prevTransactions => [addedTransaction, ...prevTransactions]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const calculateTotalByCategory = (category) => {
    return transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
  };

  // Wrap the console.log in useEffect to avoid double logging
  useEffect(() => {
    console.log('Rendering Dashboard. isLoading:', isLoading, 'transactions:', transactions);
  }, [isLoading, transactions]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(allowances).map(([category, { amount, type, color, icon: Icon }]) => (
          <Card key={category} className={`${color} border-none`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="capitalize text-lg font-medium">{category}</CardTitle>
              <Icon className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${calculateTotalByCategory(category).toFixed(2)}
              </p>
              <p className="text-sm mt-1">
                Allowance: {type === 'weekly' ? `$${amount}/week` : `${amount}%/year`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Transactions</h2>
          <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setIsAddingTransaction(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <AddTransactionForm 
                onAddTransaction={(newTransaction) => {
                  handleAddTransaction(newTransaction);
                  setIsAddingTransaction(false);
                }}
                onClose={() => setIsAddingTransaction(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="savings" className="text-blue-600">Savings</TabsTrigger>
            <TabsTrigger value="spending" className="text-green-600">Spending</TabsTrigger>
            <TabsTrigger value="giving" className="text-purple-600">Giving</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TransactionTable transactions={transactions} />
          </TabsContent>
          <TabsContent value="savings">
            <TransactionTable transactions={transactions.filter(t => t.category === 'savings')} />
          </TabsContent>
          <TabsContent value="spending">
            <TransactionTable transactions={transactions.filter(t => t.category === 'spending')} />
          </TabsContent>
          <TabsContent value="giving">
            <TransactionTable transactions={transactions.filter(t => t.category === 'giving')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Update the TransactionTable component prop type
function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy h:mm a')}</TableCell>
            <TableCell className="capitalize">{transaction.category}</TableCell>
            <TableCell>
              {transaction.type === 'income' ? (
                <span className="flex items-center text-green-600">
                  <PlusCircle className="h-4 w-4 mr-1" /> Income
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <MinusCircle className="h-4 w-4 mr-1" /> Expense
                </span>
              )}
            </TableCell>
            <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
              ${transaction.amount.toFixed(2)}
            </TableCell>
            <TableCell>{transaction.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}