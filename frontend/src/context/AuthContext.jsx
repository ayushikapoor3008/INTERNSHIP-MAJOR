import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  clinician: {
    email: 'dr.jenkins@metrohealth.org',
    name: 'Dr. Sarah Jenkins',
    role: 'Clinician',
    department: 'Cardiology & ICU',
    avatar: 'SJ',
    allowedViews: ['dashboard', 'patient-risk', 'patient-details', 'bed-forecast', 'reports', 'settings']
  },
  executive: {
    email: 'coo@metrohealth.org',
    name: 'Marcus Vance (COO)',
    role: 'Executive',
    department: 'Hospital Administration',
    avatar: 'MV',
    allowedViews: ['dashboard', 'bed-forecast', 'reports', 'audit-logs', 'settings']
  },
  data_scientist: {
    email: 'ds.lead@metrohealth.org',
    name: 'Dr. Alex Rivera',
    role: 'Data Scientist',
    department: 'AI & Analytics Lab',
    avatar: 'AR',
    allowedViews: ['dashboard', 'patient-risk', 'patient-details', 'bed-forecast', 'statistical-analysis', 'model-performance', 'data-quality', 'data-pipeline', 'audit-logs', 'reports', 'settings']
  }
};

export const AuthProvider = ({ children }) => {
  // Default to Clinician for demo ease
  const [user, setUser] = useState(DEMO_USERS.clinician);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState('P-1048');

  const loginAs = (roleKey) => {
    const selected = DEMO_USERS[roleKey];
    if (selected) {
      setUser(selected);
      setActiveTab('dashboard');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const navigateTo = (tab, patientId = null) => {
    if (patientId) {
      setSelectedPatientId(patientId);
    }
    setActiveTab(tab);
  };

  return (
    <AuthContext.Provider value={{ user, loginAs, logout, activeTab, navigateTo, selectedPatientId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
