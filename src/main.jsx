import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home.jsx'
import Detalhes from './pages/Detalhes.jsx'
import Favoritos from './pages/Favoritos.jsx'

import './index.css' 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/detalhes/:bookId", 
    element: <Detalhes />,
  },
  {
    path: "/favoritos", 
    element: <Favoritos />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)