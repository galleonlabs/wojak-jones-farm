import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { Arbitrum, DAppProvider, Goerli, Mainnet, Optimism, Polygon } from '@usedapp/core';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DAppProvider config={{
      readOnlyChainId: Mainnet.chainId,
      readOnlyUrls: {
        [Mainnet.chainId]: "https://mainnet.infura.io/v3/fa8028219cfa4f9aaad2b0cb420d4c90",
        [Arbitrum.chainId]: "https://arbitrum-mainnet.infura.io/v3/fa8028219cfa4f9aaad2b0cb420d4c90",
        [Optimism.chainId]: "https://optimism-mainnet.infura.io/v3/fa8028219cfa4f9aaad2b0cb420d4c90",
        [Polygon.chainId]: "https://polygon-mainnet.infura.io/v3/fa8028219cfa4f9aaad2b0cb420d4c90",
        [Goerli.chainId]: "https://goerli.infura.io/v3/fa8028219cfa4f9aaad2b0cb420d4c90"
      },
    }}>
      <RouterProvider router={router} />
    </DAppProvider>
  </React.StrictMode>,
)

export const db = getFirestore(app);
export const analytics = getAnalytics(app);