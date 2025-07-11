import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';


export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      setErrorMsg('Please enter your first name');
      return;
    }

    if (!formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5050/api/register', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });

     setSuccessMsg('Registered successfully! Please login.');
     setTimeout(() => navigate('/login'), 2000); // Navigate after 2 seconds
    } catch (err) {
      console.error('Registration failed:', err.response?.data?.msg || err.message);
      setErrorMsg(err.response?.data?.msg || 'Something went wrong');
    }

    setIsLoading(false);
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 25, text: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, text: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 75, text: 'Good', color: 'bg-blue-500' };
    return { strength: 100, text: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply opacity-20 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply opacity-20 animate-pulse animation-delay-6000"></div>
      </div>

     
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white opacity-20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          ></div>
        ))}
      </div>

      
      <div className="relative z-10 w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">AA</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 inline-block border-b-4 border-pink-400 pb-1">
              Join Our Community
            </h1>
            <p className="text-gray-300">Create your account and start coding</p>
          </div>

          
          {errorMsg && (
            <div className="mb-4 text-red-400 bg-white/10 border border-red-500 rounded-md px-4 py-2 text-sm text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
              <div className="mb-4 text-green-400 bg-white/10 border border-green-500 rounded-md px-4 py-2 text-sm text-center">
               {successMsg}
             </div>
          )}


          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
                />
              </div>
            </div>

            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
              />
            </div>

            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? '🔐' : '🔓'}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-white/10 h-1.5 rounded-full">
                    <div className={`h-1.5 rounded-full ${passwordStrength.color}`} style={{ width: `${passwordStrength.strength}%` }}></div>
                  </div>
                  <p className={`text-xs mt-1 ${
                    passwordStrength.color === 'bg-green-500' ? 'text-green-400' :
                    passwordStrength.color === 'bg-blue-500' ? 'text-blue-400' :
                    passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {passwordStrength.text}
                  </p>
                </div>
              )}
            </div>

            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    formData.password !== formData.confirmPassword && formData.confirmPassword
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-white/20 focus:ring-purple-400/20'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? '🔐' : '🔓'}
                </button>
              </div>
            </div>

            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 bg-white/10 border border-white/20 rounded"
              />
              <label className="text-sm text-gray-300 leading-relaxed">
                I agree to the <span className="text-purple-400 underline">Terms</span> and <span className="text-purple-400 underline">Privacy Policy</span>
              </label>
            </div>

            
            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        </div>

        
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>&copy; 2025 OJ Platform. Secure coding environment.</p>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}
