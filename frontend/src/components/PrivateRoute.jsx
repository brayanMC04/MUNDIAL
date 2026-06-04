import { Navigate } from "react-router-dom";

function PrivateRoute({ children, adminOnly = false }) {

    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const validToken = token && token !== "null" && token !== "undefined";

    if (!validToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        return <Navigate to="/" />;
    }

    if (adminOnly && usuario?.rol !== "admin") {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default PrivateRoute;