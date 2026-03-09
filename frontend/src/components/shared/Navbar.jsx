import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Menu, Clapperboard, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/authSlice";

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();

	// Initialize search query from URL if it exists (e.g., if user refreshes on explore page)
	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Sync input with URL specifically when URL changes externally
	useEffect(() => {
		const q = searchParams.get("q");
		if (q !== null) {
			setSearchQuery(q);
		} else {
			// Keep current searchQuery if navigating to explore without 'q',
			// but if navigating to HOME, maybe clear it? For now, we only sync if q exists or changes.
			if (window.location.pathname !== "/explore") {
				setSearchQuery("");
			}
		}
	}, [searchParams]);

	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);

		if (query.trim() !== "") {
			// Navigate to explore page with the query parameter
			const isExplore = window.location.pathname === "/explore";
			navigate(`/explore?q=${encodeURIComponent(query)}`, { replace: isExplore });
		} else if (window.location.pathname === "/explore") {
			// If they clear the search while on explore page, remove the param
			navigate(`/explore`, { replace: true });
		}
	};

	const handleClearSearch = () => {
		setSearchQuery("");
		setShowMobileSearch(false);
		if (window.location.pathname === "/explore") {
			navigate(`/explore`, { replace: true });
		}
	};

	const handleLogout = () => {
		setIsMobileMenuOpen(false);
		dispatch(logoutUser());
	};

	const renderSearchInput = (isMobile = false) => (
		<div className={`relative group w-full`}>
			<Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
			<input
				type="text"
				value={searchQuery}
				onChange={handleSearchChange}
				placeholder="Search movies, TV shows..."
				className="w-full bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-black/60 transition-all duration-300"
				autoFocus={isMobile}
			/>
			{searchQuery && (
				<button onClick={handleClearSearch} className="absolute right-3 top-2.5 text-muted-foreground hover:text-white">
					<X className="w-4 h-4" />
				</button>
			)}
		</div>
	);

	return (
		<>
			<nav
				className={`fixed top-0 right-0 left-0 md:left-64 z-30 transition-all duration-300 ${
					isScrolled || showMobileSearch ? "bg-background/95 backdrop-blur-md border-b border-white/10 shadow-sm" : "bg-transparent"
				}`}>
				<div className="flex items-center justify-between px-6 py-4">
					{/* Left Area: Mobile Menu Trigger & Logo */}
					<div className={`flex items-center gap-4 ${showMobileSearch ? "hidden" : "flex"}`}>
						<button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden">
							<Menu className="w-6 h-6 text-white" />
						</button>
						<Link to="/home" className="flex md:hidden items-center gap-2">
							<Clapperboard className="w-6 h-6 text-primary" />
							<h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">SheryCinema</h1>
						</Link>
					</div>

					{/* Search Bar - Desktop */}
					<div className="hidden md:flex flex-1 max-w-lg mx-auto px-4">{renderSearchInput(false)}</div>

					{/* Search Bar - Mobile Active State */}
					{showMobileSearch && (
						<div className="flex-1 flex items-center md:hidden gap-2 w-full animate-in fade-in slide-in-from-top-2">
							<button onClick={() => setShowMobileSearch(false)} className="p-2 -ml-2 text-muted-foreground hover:text-white">
								<X className="w-5 h-5" />
							</button>
							{renderSearchInput(true)}
						</div>
					)}

					{/* Right Area (Desktop right, mobile right flex) */}
					<div className={`flex items-center gap-4 ${showMobileSearch ? "hidden md:flex" : ""}`}>
						{/* Mobile Search Toggle */}
						<button className="md:hidden p-2 text-muted-foreground hover:text-white transition-colors" onClick={() => setShowMobileSearch(true)}>
							<Search className="w-5 h-5" />
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
						/>
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-background/95 border-r border-border/40 z-50 p-6 md:hidden flex flex-col">
							<div className="flex items-center justify-between mb-8">
								<div className="flex items-center gap-3">
									<div className="bg-primary/20 p-2 rounded-xl">
										<Clapperboard className="w-6 h-6 text-primary" />
									</div>
									<h1 className="text-xl font-bold tracking-tight text-white">SheryCinema</h1>
								</div>
								<button onClick={() => setIsMobileMenuOpen(false)}>
									<X className="w-6 h-6 text-muted-foreground" />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto flex flex-col gap-4">
								<Link onClick={() => setIsMobileMenuOpen(false)} to="/home" className="text-lg font-medium py-2 text-white border-b border-white/10">
									Home
								</Link>
								<Link
									onClick={() => setIsMobileMenuOpen(false)}
									to="/explore"
									className="text-lg font-medium py-2 text-white border-b border-white/10">
									Explore
								</Link>
								<Link
									onClick={() => setIsMobileMenuOpen(false)}
									to="/movies"
									className="text-lg font-medium py-2 text-white border-b border-white/10">
									Movies
								</Link>
								<Link onClick={() => setIsMobileMenuOpen(false)} to="/tv" className="text-lg font-medium py-2 text-white border-b border-white/10">
									TV Shows
								</Link>
								<Link
									onClick={() => setIsMobileMenuOpen(false)}
									to="/favorites"
									className="text-lg font-medium py-2 text-white border-b border-white/10">
									Favorites
								</Link>
							</div>

							<div className="mt-auto pt-4 border-t border-white/10">
								<button
									onClick={handleLogout}
									className="flex items-center gap-3 text-lg font-medium py-2 text-destructive hover:text-red-400 w-full">
									<LogOut className="w-5 h-5" />
									Log out
								</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
