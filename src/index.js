import React from 'react';
import ReactDOM from 'react-dom/client';
import Weather from './Weather/Weather';
import './index.scss'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='container'>
      <Weather/>
    </div>
  </React.StrictMode>
);

