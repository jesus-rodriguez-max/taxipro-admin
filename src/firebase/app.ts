import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  projectId: 'taxipro-chofer',
  apiKey: 'AIzaSyDVnpGERWs82_o__51-BwK7YiFld9e7tXQ',
  authDomain: 'taxipro-chofer.firebaseapp.com',
  storageBucket: 'taxipro-chofer.appspot.com',
  messagingSenderId: '569260142078',
  appId: '1:569260142078:web:placeholder',
};

export const app = initializeApp(firebaseConfig);
