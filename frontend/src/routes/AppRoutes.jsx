import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute";
import Partidos from "../pages/Partidos";
import Campeon from "../pages/Campeon";
import Ranking from "../pages/Ranking";
import Perfil from "../pages/Perfil";
import AdminEquipos from "../pages/AdminEquipos";
import AdminPartidos from "../pages/AdminPartidos";
import Pronosticos from "../pages/Pronosticos";

function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/partidos"
                    element={
                        <PrivateRoute>
                            <Partidos />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/pronosticos"
                    element={
                        <PrivateRoute>
                            <Pronosticos />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/campeon"
                    element={
                        <PrivateRoute>
                            <Campeon />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/ranking"
                    element={
                        <PrivateRoute>
                            <Ranking />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <PrivateRoute>
                            <Perfil />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/admin/equipos"
                    element={
                        <PrivateRoute>
                            <AdminEquipos />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/admin/partidos"
                    element={
                        <PrivateRoute>
                            <AdminPartidos />
                        </PrivateRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;