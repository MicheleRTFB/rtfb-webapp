import React, { useState } from 'react';
import { Button } from '../components/Button';

interface AthleteData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  sportType: string;
  experience: string;
  goals: string;
}

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [athleteData, setAthleteData] = useState<AthleteData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    sportType: '',
    experience: '',
    goals: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAthleteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement data submission
    console.log('Athlete data:', athleteData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informazioni Personali</h3>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="input mt-1"
                value={athleteData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Cognome
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="input mt-1"
                value={athleteData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Data di Nascita
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="input mt-1"
                value={athleteData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Genere
              </label>
              <select
                id="gender"
                name="gender"
                className="input mt-1"
                value={athleteData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleziona</option>
                <option value="male">Maschio</option>
                <option value="female">Femmina</option>
                <option value="other">Altro</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informazioni Sportive</h3>
            <div>
              <label htmlFor="sportType" className="block text-sm font-medium text-gray-700">
                Tipo di Sport
              </label>
              <select
                id="sportType"
                name="sportType"
                className="input mt-1"
                value={athleteData.sportType}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleziona</option>
                <option value="running">Corsa</option>
                <option value="cycling">Ciclismo</option>
                <option value="triathlon">Triathlon</option>
                <option value="swimming">Nuoto</option>
              </select>
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Esperienza
              </label>
              <select
                id="experience"
                name="experience"
                className="input mt-1"
                value={athleteData.experience}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleziona</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzato</option>
                <option value="professional">Professionista</option>
              </select>
            </div>
            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
                Obiettivi
              </label>
              <textarea
                id="goals"
                name="goals"
                rows={4}
                className="input mt-1"
                value={athleteData.goals}
                onChange={handleInputChange}
                required
                placeholder="Descrivi i tuoi obiettivi sportivi..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Benvenuto in Run To Feel Better
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Step {step} di 2
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {renderStep()}

          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Indietro
              </Button>
            )}
            {step < 2 ? (
              <Button
                type="button"
                className="ml-auto"
                onClick={() => setStep((prev) => prev + 1)}
              >
                Avanti
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Completa
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}; 