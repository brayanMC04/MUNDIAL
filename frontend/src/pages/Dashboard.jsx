import Navbar from "../components/Navbar";

function Dashboard() {

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h1>Dashboard</h1>

                <div className="row">

                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                Mis puntos
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                Posición
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                Pronósticos
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                Campeón
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}

export default Dashboard;