import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticlePage from './pages/ArticlePage';
import NavBar from './NavBar';
import NotFoundPage from './pages/NotFoundPage';

import { initializeApp } from 'firebase/app';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';

const firebaseConfig = {
  apiKey: 'AIzaSyA_gLEJOwxoEu4vPIxsXEwF0pfkqnl1bNQ',
  authDomain: 'my-react-blog-6b57c.firebaseapp.com',
  projectId: 'my-react-blog-6b57c',
  storageBucket: 'my-react-blog-6b57c.firebasestorage.app',
  messagingSenderId: '303293643898',
  appId: '1:303293643898:web:08673b58adcd0e1219cfc3',
};

const app = initializeApp(firebaseConfig);

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <div id="page-body">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/articles" element={<ArticlesListPage />} />
            <Route path="/articles/:articleId" element={<ArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
