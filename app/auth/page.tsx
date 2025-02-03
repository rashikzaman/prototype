'use client'

import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  UserPlus, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';

// Mock user database (would be backend in real app)
const mockUsers = [
  {
    email: "volunteer@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Doe",
    skills: ["Communication", "Teaching"]
  }
];

interface User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }

const AuthContext = React.createContext({
  user: User | undefined, 
  login: () => {},
  logout: () => {},
  signup: (email: string, password: string, firstName: string, lastName: string) => {}
});

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = React.useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to ActLocal
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="flex items-center bg-red-100 p-3 rounded text-red-700">
              <AlertTriangle className="mr-2" />
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={onSwitch}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const Signup = ({ onSwitch }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = React.useContext(AuthContext);

  const handleSignup = (e) => {
    e.preventDefault();
    const success = signup(email, password, firstName, lastName);
    if (!success) {
      setError('Email already exists');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your ActLocal Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="flex items-center bg-red-100 p-3 rounded text-red-700">
              <AlertTriangle className="mr-2" />
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex space-x-4">
              <div className="relative w-1/2">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="appearance-none rounded-md block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First Name"
                />
              </div>
              <div className="relative w-1/2">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="appearance-none rounded-md block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
              <UserPlus className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={onSwitch}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const ApplyNow = ({ opportunity }) => {
  const { user } = React.useContext(AuthContext);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const availableSkills = [
    "Communication", "Teaching", "Physical Labor", 
    "Animal Handling", "Environmental Awareness", "Patience"
  ];

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to backend
    setApplicationSubmitted(true);
  };

  if (!user) {
    return (
      <div className="text-center p-10 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p>You must be logged in to apply for a volunteer opportunity.</p>
      </div>
    );
  }

  if (applicationSubmitted) {
    return (
      <div className="text-center p-10 bg-green-100">
        <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
        <p>Thank you for your interest in volunteering.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Apply for {opportunity.title}
        </h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Opportunity Details</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            <p><strong>Organization:</strong> {opportunity.organization}</p>
            <p><strong>Location:</strong> {opportunity.location}</p>
            <p><strong>Category:</strong> {opportunity.category}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              Select Skills You Can Contribute
            </label>
            <div className="flex flex-wrap gap-3">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label 
              htmlFor="availability" 
              className="block text-gray-700 font-bold mb-2"
            >
              Additional Information
            </label>
            <textarea
              id="availability"
              placeholder="Share your availability, motivation, and any additional details"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [authMode, setAuthMode] = useState('login');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const { user } = React.useContext(AuthContext);

  // If you want to use the existing VolunteerConnect component, you'd modify it to:
  // - Use the AuthContext
  // - Add onClick handler to "Apply Now" that sets selectedOpportunity

  if (selectedOpportunity) {
    return <ApplyNow opportunity={selectedOpportunity} />;
  }

  if (!user) {
    return authMode === 'login' 
      ? <Login onSwitch={() => setAuthMode('signup')} /> 
      : <Signup onSwitch={() => setAuthMode('login')} />;
  }

  // Placeholder for main app view (you'd return VolunteerConnect here)
  return (
    <div className="p-4">
      <h1>Welcome, {user.firstName}!</h1>
      {/* Your main app content */}
    </div>
  );
};

export default App