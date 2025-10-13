import RoomBookingPage from './components/RoomBookingPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RoomBookingPage />
      </div>
    </AuthProvider>
  );
}

export default App;
