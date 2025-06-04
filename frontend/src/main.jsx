import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import TaskManagementApp from './TaskManagementApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TaskManagementApp />
  </StrictMode>,
)
