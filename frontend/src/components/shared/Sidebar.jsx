import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass, Film, Tv, Heart, Clock, Settings, LogOut, Clapperboard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice";

const Sidebar = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const isAdmin = user?.role === "admin";

	const handleLogout = () => {
		dispatch(logoutUser());
	};

	const navLinks = [
		{ name: "Home", path: "/home", icon: Home },
		{ name: "Explore", path: "/explore", icon: Compass },
		{ name: "Movies", path: "/movies", icon: Film },
		{ name: "TV Shows", path: "/tv", icon: Tv },
	];

	const libraryLinks = [
		{ name: "Favorites", path: "/favorites", icon: Heart },
		{ name: "Recent", path: "/recent", icon: Clock },
	];

	const renderLinks = (links) => (
		<ul className="space-y-2">
			{links.map((link) => {
				const isActive = location.pathname.startsWith(link.path);
				const Icon = link.icon;
				return (
					<li key={link.name}>
						<Link
							to={link.path}
							className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
								isActive ? "text-white font-medium bg-primary/20" : "text-muted-foreground hover:text-white hover:bg-white/5"
							}`}>
							<Icon className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`} />
							<span className="relative z-10">{link.name}</span>
							{isActive && (
								<motion.div
									layoutId="activeTab"
									className="absolute inset-0 bg-primary/10 border-l-4 border-primary"
									initial={false}
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>
							)}
						</Link>
					</li>
				);
			})}
		</ul>
	);

	return (
		<div className="w-64 h-screen border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col fixed left-0 top-0 z-40 hidden md:flex">
			{/* Logo */}
			<Link to="/home" className="p-6 flex items-center gap-3 w-fit transition-opacity hover:opacity-80">
				<div className="bg-primary/20 p-2 rounded-xl">
					<Clapperboard className="w-6 h-6 text-primary" />
				</div>
				<h1 className="text-xl font-bold tracking-tight text-white">SheryCinema</h1>
			</Link>

			{/* Navigation Links */}
			<div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar flex flex-col gap-6">
				<div>
					<p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
					{renderLinks(navLinks)}
				</div>

				<div>
					<p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Library</p>
					{renderLinks(libraryLinks)}
				</div>
			</div>

			{/* Bottom Area */}
			<div className="p-4 border-t border-border/40">
				<ul className="space-y-2">
					{isAdmin && (
						<li>
							<Link
								to="/settings"
								className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all">
								<Settings className="w-5 h-5 group-hover:text-primary transition-colors" />
								<span>Settings</span>
							</Link>
						</li>
					)}
					<li>
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-medium">
							<LogOut className="w-5 h-5" />
							<span>Log out</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
