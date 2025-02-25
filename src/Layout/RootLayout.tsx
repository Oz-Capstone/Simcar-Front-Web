import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  // 홈 화면에서만 사이드바 표시
  const showSidebar = location.pathname === '/';

  const handleToggleSidebar = () => {
    if (showSidebar) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar onToggleSidebar={handleToggleSidebar} showSidebarButton={showSidebar} />
      <div className='flex-1 flex mt-20'>
        {showSidebar && <Sidebar isOpen={isSidebarOpen} />}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            showSidebar && isSidebarOpen ? 'ml-80' : 'ml-0'
          }`}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
