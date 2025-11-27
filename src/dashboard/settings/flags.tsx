import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firestore';

interface FeatureFlags {
  bottomCarouselEnabled?: boolean;
  drawerEnabled?: boolean;
  offlineRequestsEnabled?: boolean;
  shieldEnabled?: boolean;
}

export default function FeatureFlagsScreen() {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'config', 'featureFlags');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFlags(docSnap.data() as FeatureFlags);
      }
    } catch (error) {
      console.error('Error loading flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (flagName: keyof FeatureFlags) => {
    setSaving(true);
    try {
      const newValue = !flags[flagName];
      const docRef = doc(db, 'config', 'featureFlags');
      await updateDoc(docRef, { [flagName]: newValue });
      setFlags((prev) => ({ ...prev, [flagName]: newValue }));
    } catch (error) {
      console.error('Error updating flag:', error);
      alert('Error al actualizar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">Cargando configuración...</div>
      </div>
    );
  }

  const flagsList = [
    { key: 'bottomCarouselEnabled' as keyof FeatureFlags, label: 'Carrusel Inferior', description: 'Habilitar carrusel de navegación inferior' },
    { key: 'drawerEnabled' as keyof FeatureFlags, label: 'Drawer', description: 'Habilitar menú lateral' },
    { key: 'offlineRequestsEnabled' as keyof FeatureFlags, label: 'Solicitudes Offline', description: 'Habilitar solicitudes por SMS sin internet' },
    { key: 'shieldEnabled' as keyof FeatureFlags, label: 'Escudo TaxiPro', description: 'Habilitar módulo de seguridad' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Feature Flags</h1>

      <div className="bg-white rounded-lg shadow">
        {flagsList.map((flag, index) => (
          <div
            key={flag.key}
            className={`p-6 flex items-center justify-between ${
              index !== flagsList.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold">{flag.label}</h3>
              <p className="text-sm text-gray-500">{flag.description}</p>
            </div>
            <button
              onClick={() => toggleFlag(flag.key)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                flags[flag.key] ? 'bg-blue-600' : 'bg-gray-200'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  flags[flag.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
