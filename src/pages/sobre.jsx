import { Link } from "react-router-dom";
import logo1 from '../assets/images/logo_1.svg'
import logo2 from '../assets/images/logo_2.svg'
import '../main.css';

function Sobre() {

  return (
    <main class="mais__hugo">
      <div class="container">
        <section class="container__sobre">
            <div class="paragrafo__ppp">
              <h2 class="title__sobre">NORTE BAR</h2>
              <p class="paragrafo__sobre">O Norte Bar é um restaurante que une sabor e tecnologia para oferecer uma experiencia única. Com um sistema moderno de reservas online, cardápio digital e atendimento otimizado, garantimos mais praticidade, conforto e agílidade para nossos clientes. Aqui, cada detalhe é pensando para que sua visita seja inesquecivel</p>
            </div>
            <div class="position__img">
              <img src={logo2} alt="logo" />
              <img src={logo1} alt="logo" /> 
            </div>      
        </section>
      </div>
    </main>
  )
}
export default Sobre;