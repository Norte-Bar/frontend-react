import { Link, useNavigate } from "react-router-dom";

function Reserva() {
    const navigate = useNavigate();

    const irParaSobre = () => {
        navigate("/");
    }

  return (
    <>
      <h1> Estou na pagina Reserva</h1>
      <button onClick={irParaSobre}>Sobre</button>
    </>
  )
}

export default Reserva;
