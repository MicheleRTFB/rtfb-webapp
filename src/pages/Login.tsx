import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Scale, Timer, Footprints, Medal, Flag } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Logo className="mx-auto h-32 w-auto" />
          <p className="mt-6 text-center text-sm text-gray-600">
            Accedi al tuo account
          </p>
        </div>

        {/* Stats Widgets Grid */}
        <div className="grid grid-cols-4 gap-4">
          {/* Widget Settimana */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-6 w-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Settimana</h2>
            </div>
          </div>

          {/* Widget Km Annuali */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Km Annuali</h2>
            </div>
          </div>

          {/* Widget Peso */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-6 w-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Peso</h2>
            </div>
          </div>

          {/* Widget Gara */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-6 w-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Gara</h2>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ricordami
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Password dimenticata?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-brand-blue hover:bg-primary-700 focus:ring-primary-500">
              Accedi
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Non hai un account?{' '}
              <a href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Registrati
              </a>
            </p>
          </div>

          {/* Link temporaneo per la pagina workout */}
          <div className="text-center mt-4 space-y-2">
            <Link to="/workout" className="text-primary-600 hover:text-primary-500 block">
              Vai alla pagina Workout (link temporaneo)
            </Link>
            <Link to="/schedule" className="text-primary-600 hover:text-primary-500 block">
              Vai al Programma Settimanale (link temporaneo)
            </Link>
            <Link to="/races" className="text-primary-600 hover:text-primary-500 block">
              Calendario Gare
            </Link>
            <Link to="/my-races" className="text-primary-600 hover:text-primary-500 block">
              Le Mie Gare
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Accesso rapido
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                to="/athletes"
                className="w-full inline-flex justify-center py-2 px-4 border border-blue-500 rounded-md shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                👥 I Miei Atleti
              </Link>
              <Link
                to="/dashboard"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/calendar"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Calendario Eventi
              </Link>
              <Link
                to="/schedule"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Allenamenti
              </Link>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <button
                onClick={() => navigate('/login/google')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                <span>Accedi con Google</span>
              </button>

              <button
                onClick={() => navigate('/login/github')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GitHub logo"
                />
                <span>Accedi con GitHub</span>
              </button>
            </div>

            {/* Link al widget delle scarpe */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/shoes')}
                className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
              >
                <Footprints className="h-4 w-4 mr-1" />
                <span>Gestisci le tue scarpe da corsa</span>
              </button>
            </div>
            
            {/* Link al database delle gare personali */}
            <div className="mt-2 text-center">
              <button
                onClick={() => navigate('/my-races')}
                className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
              >
                <Medal className="h-4 w-4 mr-1" />
                <span>Gestisci le tue gare</span>
              </button>
            </div>

            {/* Link al widget delle gare */}
            <div className="mt-2 text-center">
              <button
                onClick={() => navigate('/race-widget')}
                className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
              >
                <Flag className="h-4 w-4 mr-1" />
                <span>Countdown Gare</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}; 