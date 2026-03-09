import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AuthLayout from "./components/layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import NotFound from "./pages/NotFound";
import MediaDetails from "./pages/MediaDetails";
import CategoryView from "./pages/CategoryView";
import Favorites from "./pages/Favorites";
import WatchHistory from "./pages/WatchHistory";
import ScrollToTop from "./components/shared/ScrollToTop";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AdminRoute from "./components/shared/AdminRoute";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import Settings from "./pages/Settings";

function App() {
	return (
		<Provider store={store}>
			<Router>
				<ScrollToTop />
				<Routes>
					<Route element={<AuthLayout />}>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/resend-verification" element={<ResendVerification />} />
					</Route>

					{/* Verification happens outside layout protections */}
					<Route path="/verify-email" element={<VerifyEmail />} />

					<Route
						element={
							<ProtectedRoute>
								<MainLayout />
							</ProtectedRoute>
						}>
						<Route path="/home" element={<Home />} />
						<Route path="/explore" element={<Explore />} />
						<Route path="/movies" element={<Movies />} />
						<Route path="/tv" element={<TvShows />} />
						<Route path="/category" element={<CategoryView />} />
						<Route path="/:mediaType/:id" element={<MediaDetails />} />
						<Route path="/favorites" element={<Favorites />} />
						<Route path="/recent" element={<WatchHistory />} />
						<Route
							path="/settings"
							element={
								<AdminRoute>
									<Settings />
								</AdminRoute>
							}
						/>
					</Route>

					<Route path="/" element={<Navigate to="/home" replace />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</Provider>
	);
}

export default App;
