import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
	const { user } = useSelector((state) => state.auth);

	if (user?.role !== "admin") {
		return <Navigate to="/home" replace />;
	}

	return children;
};

export default AdminRoute;
