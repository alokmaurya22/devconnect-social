import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg text-text-light dark:text-text-dark transition-colors duration-300">
      <Navbar />

      {/* Main content fills the space between navbar & footer */}
      <main className="flex-1 overflow-y-auto">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
};
export default App;
