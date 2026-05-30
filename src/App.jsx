import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthScreen from "./screens/AuthScreen";
import DashboardScreen from "./screens/DashboardScreen";


export default function App() {
  return (
    <BrowserRouter>


      <Routes>

        {/* Logi Screen */}
        <Route path="/" element={<AuthScreen />} />
        <Route path="/auth" element={<AuthScreen />} />

        <Route path="/dashboard" element={<DashboardScreen />} />


      </Routes>
    </BrowserRouter>
  );
}