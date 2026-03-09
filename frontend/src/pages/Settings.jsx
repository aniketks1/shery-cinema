import { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../services/api";
import { Film, Users, Plus, Trash2, Loader2, ChevronLeft, ChevronRight, Search, X, Shield, ShieldOff, Ban, CheckCircle, UserCog } from "lucide-react";

// ─── Tab Button ─────────────────────────────────────────────
const TabButton = ({ active, icon: Icon, label, onClick }) => (
	<button
		onClick={onClick}
		className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
			active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-white hover:bg-white/5"
		}`}>
		<Icon className="w-4 h-4" />
		{label}
	</button>
);

// ─── Pagination ─────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => {
	if (totalPages <= 1) return null;
	return (
		<div className="flex items-center justify-center gap-3 mt-6">
			<button
				disabled={page <= 1}
				onClick={() => onPageChange(page - 1)}
				className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
				<ChevronLeft className="w-4 h-4" />
			</button>
			<span className="text-sm text-muted-foreground">
				Page {page} of {totalPages}
			</span>
			<button
				disabled={page >= totalPages}
				onClick={() => onPageChange(page + 1)}
				className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
				<ChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
};

// ─── Create Movie Form ─────────────────────────────────────
const CreateMovieForm = ({ onCreated }) => {
	const [form, setForm] = useState({
		tmdbId: "",
		title: "",
		description: "",
		category: "movie",
		youTubeTrailerUrl: "",
		genres: "",
		releaseDate: "",
	});
	const [poster, setPoster] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		if (!poster) {
			setError("Poster image is required");
			return;
		}
		setLoading(true);
		try {
			const formData = new FormData();
			Object.entries(form).forEach(([key, val]) => formData.append(key, val));
			formData.append("poster", poster);
			await adminAPI.createMovie(formData);
			setSuccess("Movie created successfully!");
			setForm({ tmdbId: "", title: "", description: "", category: "movie", youTubeTrailerUrl: "", genres: "", releaseDate: "" });
			setPoster(null);
			onCreated?.();
		} catch (err) {
			setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to create movie");
		} finally {
			setLoading(false);
		}
	};

	const inputClass =
		"w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm";

	return (
		<form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
			<h3 className="text-lg font-semibold text-white flex items-center gap-2">
				<Plus className="w-5 h-5 text-primary" />
				Add New Movie
			</h3>

			{error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-xl">{error}</p>}
			{success && <p className="text-sm text-green-400 bg-green-500/10 px-4 py-2 rounded-xl">{success}</p>}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<input name="tmdbId" value={form.tmdbId} onChange={handleChange} placeholder="TMDB ID" className={inputClass} required />
				<input name="title" value={form.title} onChange={handleChange} placeholder="Title" className={inputClass} required />
				<select name="category" value={form.category} onChange={handleChange} className={inputClass}>
					<option value="movie">Movie</option>
					<option value="tv-show">TV Show</option>
				</select>
				<input name="genres" value={form.genres} onChange={handleChange} placeholder="Genres (comma-separated)" className={inputClass} required />
				<input name="releaseDate" value={form.releaseDate} onChange={handleChange} type="date" className={inputClass} required />
				<input
					name="youTubeTrailerUrl"
					value={form.youTubeTrailerUrl}
					onChange={handleChange}
					placeholder="YouTube Trailer URL"
					className={inputClass}
					required
				/>
			</div>

			<textarea
				name="description"
				value={form.description}
				onChange={handleChange}
				placeholder="Description"
				rows={3}
				className={inputClass + " resize-none"}
				required
			/>

			<div>
				<label className="block text-sm text-muted-foreground mb-1.5">Poster Image</label>
				<input
					type="file"
					accept="image/*"
					onChange={(e) => setPoster(e.target.files[0])}
					className="text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/20 file:text-primary file:font-medium file:cursor-pointer hover:file:bg-primary/30 transition-all"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="w-full md:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
				{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
				{loading ? "Creating..." : "Create Movie"}
			</button>
		</form>
	);
};

// ─── Movies Tab ─────────────────────────────────────────────
const MoviesTab = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [deletingId, setDeletingId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchMovies = useCallback(async (p = 1) => {
		setLoading(true);
		try {
			const res = await adminAPI.getMovies(p, 10);
			setMovies(res.data.movies);
			setTotalPages(res.data.totalPages);
			setPage(res.data.page);
		} catch {
			setMovies([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchMovies();
	}, [fetchMovies]);

	const handleDelete = async (movieId) => {
		if (!window.confirm("Are you sure you want to delete this movie?")) return;
		setDeletingId(movieId);
		try {
			await adminAPI.deleteMovie(movieId);
			fetchMovies(page);
		} catch {
			// silently ignore
		} finally {
			setDeletingId(null);
		}
	};

	const filtered = movies.filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="space-y-6">
			<CreateMovieForm onCreated={() => fetchMovies(1)} />

			<div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
					<h3 className="text-lg font-semibold text-white flex items-center gap-2">
						<Film className="w-5 h-5 text-primary" />
						Movie Library
					</h3>
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
						<input
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Filter movies..."
							className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
						/>
						{searchTerm && (
							<button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-white">
								<X className="w-4 h-4" />
							</button>
						)}
					</div>
				</div>

				{loading ? (
					<div className="flex justify-center py-12">
						<Loader2 className="w-8 h-8 text-primary animate-spin" />
					</div>
				) : filtered.length === 0 ? (
					<p className="text-center text-muted-foreground py-12">No movies found.</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-white/10 text-left text-muted-foreground">
									<th className="pb-3 font-medium">Title</th>
									<th className="pb-3 font-medium hidden sm:table-cell">Category</th>
									<th className="pb-3 font-medium hidden md:table-cell">Genres</th>
									<th className="pb-3 font-medium hidden lg:table-cell">Release Date</th>
									<th className="pb-3 font-medium text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{filtered.map((movie) => (
									<tr key={movie._id} className="hover:bg-white/[0.02] transition-colors">
										<td className="py-3 pr-4">
											<div className="flex items-center gap-3">
												<img src={movie.posterUrl} alt={movie.title} className="w-10 h-14 rounded-lg object-cover border border-white/10" />
												<div>
													<p className="text-white font-medium line-clamp-1">{movie.title}</p>
													<p className="text-xs text-muted-foreground">ID: {movie.tmdbId}</p>
												</div>
											</div>
										</td>
										<td className="py-3 hidden sm:table-cell">
											<span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs font-medium text-muted-foreground capitalize">{movie.category}</span>
										</td>
										<td className="py-3 hidden md:table-cell">
											<p className="text-muted-foreground text-xs line-clamp-1">{movie.genres?.join(", ")}</p>
										</td>
										<td className="py-3 hidden lg:table-cell text-muted-foreground text-xs">{new Date(movie.releaseDate).toLocaleDateString()}</td>
										<td className="py-3 text-right">
											<button
												onClick={() => handleDelete(movie._id)}
												disabled={deletingId === movie._id}
												className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-all"
												title="Delete movie">
												{deletingId === movie._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchMovies(p)} />
			</div>
		</div>
	);
};

// ─── Users Tab ──────────────────────────────────────────────
const UsersTab = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [actionLoading, setActionLoading] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchUsers = useCallback(async (p = 1) => {
		setLoading(true);
		try {
			const res = await adminAPI.getUsers(p, 10);
			setUsers(res.data.users);
			setTotalPages(res.data.totalPages);
			setPage(res.data.page);
		} catch {
			setUsers([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const handleToggleBan = async (userId, currentBanned) => {
		setActionLoading(userId);
		try {
			await adminAPI.updateUser(userId, { isBanned: !currentBanned });
			fetchUsers(page);
		} catch {
			// silently ignore
		} finally {
			setActionLoading(null);
		}
	};

	const handleToggleRole = async (userId, currentRole) => {
		const newRole = currentRole === "admin" ? "user" : "admin";
		setActionLoading(userId);
		try {
			await adminAPI.updateUser(userId, { role: newRole });
			fetchUsers(page);
		} catch {
			// silently ignore
		} finally {
			setActionLoading(null);
		}
	};

	const handleToggleVerify = async (userId, currentVerified) => {
		setActionLoading(userId);
		try {
			await adminAPI.updateUser(userId, { isVerified: !currentVerified });
			fetchUsers(page);
		} catch {
			// silently ignore
		} finally {
			setActionLoading(null);
		}
	};

	const handleDelete = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
		setActionLoading(userId);
		try {
			await adminAPI.deleteUser(userId);
			fetchUsers(page);
		} catch {
			// silently ignore
		} finally {
			setActionLoading(null);
		}
	};

	const filtered = users.filter(
		(u) => u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
				<h3 className="text-lg font-semibold text-white flex items-center gap-2">
					<Users className="w-5 h-5 text-primary" />
					User Management
				</h3>
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
					<input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Filter users..."
						className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
					/>
					{searchTerm && (
						<button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-white">
							<X className="w-4 h-4" />
						</button>
					)}
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center py-12">
					<Loader2 className="w-8 h-8 text-primary animate-spin" />
				</div>
			) : filtered.length === 0 ? (
				<p className="text-center text-muted-foreground py-12">No users found.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-white/10 text-left text-muted-foreground">
								<th className="pb-3 font-medium">User</th>
								<th className="pb-3 font-medium hidden sm:table-cell">Role</th>
								<th className="pb-3 font-medium hidden md:table-cell">Status</th>
								<th className="pb-3 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/5">
							{filtered.map((user) => (
								<tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
									<td className="py-3 pr-4">
										<p className="text-white font-medium">{user.fullName}</p>
										<p className="text-xs text-muted-foreground">{user.email}</p>
										<p className="text-xs text-muted-foreground">@{user.username}</p>
									</td>
									<td className="py-3 hidden sm:table-cell">
										<span
											className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
												user.role === "admin" ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
											}`}>
											{user.role}
										</span>
									</td>
									<td className="py-3 hidden md:table-cell">
										<div className="flex flex-col gap-1">
											<span className={`inline-flex items-center gap-1 text-xs ${user.isVerified ? "text-green-400" : "text-yellow-400"}`}>
												<CheckCircle className="w-3 h-3" />
												{user.isVerified ? "Verified" : "Unverified"}
											</span>
											{user.isBanned && (
												<span className="inline-flex items-center gap-1 text-xs text-destructive">
													<Ban className="w-3 h-3" />
													Banned
												</span>
											)}
										</div>
									</td>
									<td className="py-3 text-right">
										<div className="flex items-center justify-end gap-1">
											{actionLoading === user._id ? (
												<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
											) : (
												<>
													<button
														onClick={() => handleToggleRole(user._id, user.role)}
														className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
														title={user.role === "admin" ? "Demote to user" : "Promote to admin"}>
														{user.role === "admin" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
													</button>
													<button
														onClick={() => handleToggleBan(user._id, user.isBanned)}
														className={`p-2 rounded-lg transition-all ${
															user.isBanned
																? "text-green-400 hover:bg-green-500/10"
																: "text-muted-foreground hover:text-yellow-400 hover:bg-yellow-500/10"
														}`}
														title={user.isBanned ? "Unban user" : "Ban user"}>
														<Ban className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleToggleVerify(user._id, user.isVerified)}
														className={`p-2 rounded-lg transition-all ${
															user.isVerified
																? "text-muted-foreground hover:text-yellow-400 hover:bg-yellow-500/10"
																: "text-green-400 hover:bg-green-500/10"
														}`}
														title={user.isVerified ? "Unverify user" : "Verify user"}>
														<CheckCircle className="w-4 h-4" />
													</button>
													<button
														onClick={() => handleDelete(user._id)}
														className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
														title="Delete user">
														<Trash2 className="w-4 h-4" />
													</button>
												</>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchUsers(p)} />
		</div>
	);
};

// ─── Settings Page ──────────────────────────────────────────
const Settings = () => {
	const [activeTab, setActiveTab] = useState("movies");

	return (
		<div className="p-6 max-w-6xl mx-auto space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-white flex items-center gap-3">
					<UserCog className="w-7 h-7 text-primary" />
					Admin Settings
				</h1>
				<p className="text-muted-foreground mt-1">Manage movies and users from here.</p>
			</div>

			<div className="flex gap-2 bg-white/[0.02] border border-white/10 rounded-2xl p-1.5 w-fit">
				<TabButton active={activeTab === "movies"} icon={Film} label="Movies" onClick={() => setActiveTab("movies")} />
				<TabButton active={activeTab === "users"} icon={Users} label="Users" onClick={() => setActiveTab("users")} />
			</div>

			{activeTab === "movies" ? <MoviesTab /> : <UsersTab />}
		</div>
	);
};

export default Settings;
