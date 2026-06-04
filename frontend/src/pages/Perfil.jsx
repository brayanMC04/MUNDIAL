import Navbar from "../components/Navbar";

function Perfil() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Mi Perfil</h2>

                <div className="card">

                    <div className="card-body">

                        <p>
                            <strong>Nombre:</strong>{" "}
                            {usuario?.nombre}
                        </p>

                        <p>
                            <strong>Cédula:</strong>{" "}
                            {usuario?.cedula}
                        </p>

                        <p>
                            <strong>Rol:</strong>{" "}
                            {usuario?.rol}
                        </p>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Perfil;