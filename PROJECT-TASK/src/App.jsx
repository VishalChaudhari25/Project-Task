import { useState, useEffect } from 'react';
import { Mail, KeyRound, User, ChevronLeft, RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/auth';

/**
 * A reusable message box component to display success or error messages.
 * @param {string} message The message to display.
 * @param {string} type The type of message ('success' or 'error').
 */
const MessageBox = ({ message, type }) => {
  if (!message) return null;

  const colorClasses = type === 'success'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  return (
    <div className={`p-4 rounded-lg text-sm text-center ${colorClasses}`}>
      {message}
    </div>
  );
};

/**
 * The login form component.
 * @param {function} setView A function to change the main app view.
 * @param {function} showMessage A function to display a message in the message box.
 */
const LoginForm = ({ setView, showMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      localStorage.setItem('jwt_token', data.token);
      showMessage('Login successful! Token saved to local storage.', 'success');

    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 text-center">Log In</h2>
      <div className="space-y-2">
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView('forgot-password')}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Forgot Password?
        </button>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Logging In...' : 'Log In'}
      </button>
      <p className="text-center text-sm text-gray-600">
        Don't have an account? <button type="button" onClick={() => setView('signup')} className="font-medium text-blue-600 hover:text-blue-500">Sign up</button>
      </p>
    </form>
  );
};

/**
 * The signup form component.
 * @param {function} setView A function to change the main app view.
 * @param {function} showMessage A function to display a message in the message box.
 */
const SignupForm = ({ setView, showMessage }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, dob, username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed.');
      }

      showMessage('Signup successful! You can now log in.', 'success');
      setTimeout(() => setView('login'), 2000);

    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <button type="button" onClick={() => setView('login')} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-700">Sign Up</h2>
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-firstname" className="block text-sm font-medium text-gray-700">First Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            id="signup-firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            id="signup-lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <div className="relative">
          <input
            type="date"
            id="signup-dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700">Username</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            id="signup-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </button>
      <p className="text-center text-sm text-gray-600">
        Already have an account? <button type="button" onClick={() => setView('login')} className="font-medium text-blue-600 hover:text-blue-500">Log in</button>
      </p>
    </form>
  );
};

/**
 * The forgot password form component.
 * @param {function} setView A function to change the main app view.
 * @param {function} showMessage A function to display a message in the message box.
 */
const ForgotPasswordForm = ({ setView, showMessage }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed.');
      }

      showMessage('If the email is valid, a reset link has been sent. Check your server logs for the URL.', 'success');

    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <button type="button" onClick={() => setView('login')} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-700">Forgot Password</h2>
      </div>
      <p className="text-sm text-gray-500 text-center">Enter your email and we'll send you a password reset link.</p>
      <div className="space-y-2">
        <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            id="forgot-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
};


/**
 * The reset password form component.
 * It appears when a reset token is present in the URL.
 * @param {string} token The password reset token from the URL.
 * @param {function} setView A function to change the main app view.
 * @param {function} showMessage A function to display a message in the message box.
 */
const ResetPasswordForm = ({ token, setView, showMessage }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log('Submitting token:', token, 'newPassword:', newPassword);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showMessage('');

    if (newPassword !== confirmPassword) {
      showMessage('Passwords do not match.', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Use the token from the URL to make the API call
      const response = await fetch(`${API_BASE_URL}/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed.');
      }

      showMessage('Password has been reset successfully. Please log in with your new password.', 'success');
      // After a successful reset, redirect to the login page
      setTimeout(() => setView('login'), 3000);

    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <button type="button" onClick={() => setView('login')} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-700">Reset Password</h2>
      </div>
      <p className="text-sm text-gray-500 text-center">Enter your new password below.</p>
      <div className="space-y-2">
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
        <div className="relative">
          <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};


// The main application component
const App = () => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot-password', or 'reset-password'
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const location = useLocation();

  // Check the URL for a password reset token on initial load
  useEffect(() => {
    // This hook reads the token from the URL query parameters.
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');
    console.log('Extracted token from URL:', urlToken);
    if (urlToken) {
      setToken(urlToken);
      setView('reset-password');
    }
  }, [location]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const renderForm = () => {
    switch (view) {
      case 'signup':
        return <SignupForm setView={setView} showMessage={showMessage} />;
      case 'forgot-password':
        return <ForgotPasswordForm setView={setView} showMessage={showMessage} />;
      case 'reset-password':
        // The token from the URL is passed to the new component.
        return <ResetPasswordForm token={token} setView={setView} showMessage={showMessage} />;
      case 'login':
      default:
        return <LoginForm setView={setView} showMessage={showMessage} />;
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <div className="container bg-white shadow-xl rounded-2xl p-6 md:p-8 space-y-6 max-w-md w-full">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
        </header>
        <div id="form-container" className="space-y-6">
          {renderForm()}
        </div>
        <MessageBox message={message} type={messageType} />
      </div>
    </div>
  );
};

export default App;
