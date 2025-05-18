'use client';

import { useState } from 'react';

export default function DeleteAccount() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Your account has been deleted successfully.' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete account.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Delete Your Account</h1>
        <p className="text-center mb-6 text-gray-600 leading-relaxed">
          Enter your email to request account deletion. This action is permanent and cannot be undone.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg text-white font-semibold transition duration-200 ${
              isLoading
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            }`}
          >
            {isLoading ? 'Processing...' : 'Delete Account'}
          </button>
        </form>
        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}