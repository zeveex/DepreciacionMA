import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Vehiculos from "./pages/Vehiculos";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Dashboard />} />
                <Route path="/vehiculos" element={<Vehiculos />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;