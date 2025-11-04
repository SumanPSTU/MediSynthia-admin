import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminNavbar from "./components/Navbar.jsx";
import AdminFooter from "./components/Footer.jsx";
import AdminAppRoutes from "./routes/AdminAppRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        <AdminNavbar />
        <main className="flex-grow pt-[64px] px-4 sm:px-6">
          <AdminAppRoutes />
        </main>
        <AdminFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
