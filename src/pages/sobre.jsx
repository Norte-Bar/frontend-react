import { Link } from "react-router-dom";
import logo_2 from '../assets/images/logo_2.svg';
import camarao from '../assets/images/camarao_img.jpg';
import logo_3 from '../assets/images/logo__sobremesas.svg';
import petit from '../assets/images/petit__img.jpg';
import agua from '../assets/images/drinks_codes.webp';
import logo_4 from '../assets/images/logo_bebidas.svg';
import logo_5 from '../assets/images/logo__tchau.svg'
import '../main.css';


function Sobre() {

  return (
    <main>
      <section class="mais__hugo">
        <div class="container">
          <section class="container__sobre">
            <div class="paragrafo__ppp">
              <h2 class="title__sobre">Somos o Norte Bar</h2>
              <p class="paragrafo__sobre">Nos Somos o Norte Bar, unimos tecnologia, inovação para criar uma experiência gastronômica unica. Aqui, tradição e modernidade caminham juntas para oferecer praticidade e conforto em cada detalhe. Nosso sistema inteligente de atendimento permite que você reserve mesas com facilidade e acompanhe em tempo real o status da sua reserva — tudo direto do seu celular. Enquanto isso, você aproveita um cardápio completo com entradas deliciosas, pratos principais marcantes, sobremesas irresistíveis e bebidas para todos os gostos.
                Mais do que um bar, somos um ponto de encontro para quem busca boa comida, agilidade no atendimento e um ambiente que valoriza o essencial.
                </p>
              <p class="paragrafo__qualquerppr">Seja bem-vindo ao norte da sua melhor experiência.</p>
            </div>
            <section class="position__img">
              <div class="decoretion__img">
                <img src={logo_2} alt="logo" class="imagen1"/>
                <img src={camarao} alt="comida" class="imagen2" />
              </div>
              <div class="decoretion__img">
                <img src={petit} alt="logo" class="imagen2"/>
                <img src={logo_3} alt="logo" class="imagen1ok" />
              </div>
              <div class="decoretion__img">
                <img src={logo_4} alt="logo" class="imagen1"/>
                <img src={agua} alt="comida" class="imagen2" />
              </div> 
            </section>      
          </section>
        </div>
      </section>
      <div class="mais__hugo"> 
        <section class="container__local ">
          <div class="container__sobre">
            <div class="paragrafo__ppp">
              <h2 class="title__local">Onde Estamos</h2>
              <iframe class="local"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.9657448796956!2d-60.01610812498152!3d-3.1037567968718203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926c05508ab9dd0d%3A0x8fc22fca10b18f9e!2sManauara%20Shopping!5e0!3m2!1spt-BR!2sbr!4v1749818763726!5m2!1spt-BR!2sbr" width="200" 
              height="250" 
              style={{border:0}}  
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <p class="paragrafo__local">Está no ponto certo para quem busca praticidade, boa comida e um ambiente moderno. Venha nos visitar e viva a experiência de um bar que une tecnologia, agilidade e sabor em cada detalhe.</p>
            </div>
          </div>
        </section>
        <section class="container__local container__sila">
          <div class="container__sobre ">
            <div class="paragrafo__ppp">
              <h2 class="title__local">Fale com a gente</h2>
                <p class="paragrafo__local">Estamos sempre prontos para te ouvir. Entre em contato para dúvidas, sugestões ou reservas.</p>
                <img src={logo_5} alt="tchauzinho" class="img__okok"/>
                <address className="paragrafo__local add">
                  <p>Av. da Liberdade, 1001 – Manaus/AM</p>
                  <p>Tel.: (92) 99999-9999</p>
                  <p>E-mail: contato@nortebar.com</p>
                </address>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
export default Sobre;