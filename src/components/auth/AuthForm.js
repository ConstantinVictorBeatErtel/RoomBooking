import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input } from '../ui';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const AuthForm = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setError('Check your email for the confirmation link!');
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isLogin ? 'Sign In' : 'Sign Up'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@berkeley.edu"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      {error && (
        <div
          className={clsx(
            'mt-4 p-4 rounded-md flex items-center border',
            error.includes('email') && !error.includes('invalid')
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-red-50 border-red-300 text-red-700'
          )}
        >
          <AlertCircle className="mr-2 h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="text-brand-blue hover:underline text-sm"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
