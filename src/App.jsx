import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importa seus componentes globais
import Header from "./components/Header";
import Sidebar from "./components/sidebar"; // Se você estiver usando um Sidebar global

// Importa suas páginas
import Sobre from "./pages/sobre";
import Reserva from "./pages/reserva";
import Cardapio from './pages/cadarpio'; // Importa a página do cardápio

function App() {
  return (
    <BrowserRouter>
      {/*
        Header e Sidebar geralmente ficam fora do <Routes> se eles aparecem
        em todas ou na maioria das páginas. Eles serão persistentes enquanto
        as rotas dentro de <Routes> mudam.
      */}
      <Header />
      {/* Se o Sidebar for global e deve estar presente em todas as páginas, mantenha-o aqui */}
      {/* <Sidebar /> */}

      {/* Define as rotas da sua aplicação */}
      <Routes>
        {/*
          Rota para a página inicial ('/')
          Aqui, você está renderizando Sobre e Reserva na mesma página.
          Se Sobre e Reserva são seções da Home, isso está correto.
          Se são páginas separadas, você pode querer criar uma HomePage.jsx
          e ter <Route path="/" element={<HomePage />} />
        */}
        <Route path="/" element={
          <>
            <Sobre />
            <Reserva />
          </>
        } />

        {/* Rota para a página de Reserva */}
        <Route path="/reserva" element={<Reserva />} />

        {/*
          *** Rota para a página do Cardápio ***
          Quando o usuário navegar para '/cardapio' (clicando no link no Header),
          o componente CardapioPage será renderizado.
        */}
        <Route path="/cardapio" element={<Cardapio/>} />

        {/*
          Rota para lidar com qualquer URL que não corresponda às rotas acima.
          É a sua página 404.
        */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;