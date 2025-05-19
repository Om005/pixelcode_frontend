import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'  
import { AppContextProvider } from './context/AppContex.jsx'
import { store } from './app/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  
  <StrictMode>
    <AppContextProvider>

    <App />
    </AppContextProvider>
  </StrictMode>,
  </Provider>
)
