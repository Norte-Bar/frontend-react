import { Link, useNavigate } from "react-router-dom";

function Sobre() {

    const navigate = useNavigate();

    const irParaReserva = () => {
        navigate("/reserva");
    }

  return (
    <>
      <h1>Sobre</h1>
      <button onClick={irParaReserva}>Reserva</button>
    </>
  )
}

export default Sobre;
