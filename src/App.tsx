import buffer from 'buffer';
globalThis.Buffer = buffer.Buffer;

import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'tw-elements';
import { Layout } from './components/Layout';
import { queryClient } from './client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css';

import ErrorPage from './pages/ErrorPage';
import { HomePage, loader as homeLoader } from './pages/HomePage';
import { NftsPage, loader as nftsLoader } from './pages/NftsPage';
import { ProjectPage, loader as projectLoader } from './pages/project';
import RankingPage from './pages/RankingPage';

declare global {
  interface Window {
    xnft: any;
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
            loader: () => homeLoader(queryClient),
          },
          {
            path: 'NFTs',
            element: <NftsPage />,
            loader: () => nftsLoader(queryClient),
          },
          {
            path: 'project/:id',
            element: <ProjectPage />,
            loader: ({ params }) => projectLoader(queryClient, { params }),
          },
          {
            path: 'Ranking',
            element: <RankingPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ConnectionProvider endpoint={import.meta.env.VITE_HELIUS_RPC_PROXY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ConnectionProvider>
  );
}

export default App;
