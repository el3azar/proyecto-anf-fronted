import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import styles from "../styles/MainLayout.module.css";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Llama una vez al inicio
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.layoutRoot}>
      <SideBar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <main className={styles.mainContent} aria-label="Contenido principal">
        <div className={styles.viewWrapper}>
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;