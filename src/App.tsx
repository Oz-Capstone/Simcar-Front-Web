import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RootLayout from './Layout/RootLayout';
import Home from './pages/home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import MyPage from './pages/MyPage';
import Search from './pages/Search';
import SellCar from './pages/SellCar';
import CarDetail from './pages/CarDetail';
import CarQuiz from './pages/CarQuiz';
import { RootState } from './store';
import { setUser } from './store/authSlice';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return <RootLayout>{children}</RootLayout>;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      try {
        dispatch(setUser(JSON.parse(savedUser)));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <RootLayout>
              <Home />
            </RootLayout>
          }
        />
        <Route
          path='/search'
          element={
            <RootLayout>
              <Search />
            </RootLayout>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route
          path='/mypage'
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/sell'
          element={
            <PrivateRoute>
              <SellCar />
            </PrivateRoute>
          }
        />
        <Route
          path='/quiz'
          element={
            <RootLayout>
              <CarQuiz />
            </RootLayout>
          }
        />
        <Route
          path='/cars/:id'
          element={
            <RootLayout>
              <CarDetail />
            </RootLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
