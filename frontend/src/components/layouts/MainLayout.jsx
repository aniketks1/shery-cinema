import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import { FavoritesProvider } from "../../store/FavoritesContext";

const MainLayout = () => {
	return (
		<FavoritesProvider>
			<div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
				{/* Sidebar - fixed on left for desktop */}
				<Sidebar />

				{/* Main Content Area */}
				<div className="md:ml-64 relative min-h-screen flex flex-col">
					{/* Navbar - fixed on top relative to main area */}
					<Navbar />

					{/* Page Content */}
					<main className="flex-1 pt-20 px-4 md:px-8 pb-12 w-full overflow-x-hidden">
						<Outlet />
					</main>
				</div>
			</div>
		</FavoritesProvider>
	);
};

export default MainLayout;
