import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './routes/Router.tsx'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setTokenExpiredHandler } from './lib/apiClient'
import { refreshTokenApi } from './lib/authApi'
import { useAuthStore } from './store/authStore'

setTokenExpiredHandler(async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;
  try {
    const res = await refreshTokenApi(refreshToken);
    const newAccess = (res as any)?.data?.access || (res as any)?.access;
    if (newAccess) {
      useAuthStore.setState((state) => ({ ...state, accessToken: newAccess }));
      return newAccess;
    }
    useAuthStore.getState().clearAuth();
    return null;
  } catch {
    useAuthStore.getState().clearAuth();
    return null;
  }
});

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </StrictMode>,
)
