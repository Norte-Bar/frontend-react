import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header"
import Sidebar from "./components/sidebar"
import Sobre from "./pages/sobre";
import Reserva from "./pages/reserva";
import Cadarpio from "./pages/cadarpio"
function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Sobre />
            <Reserva /> 
            <Cadarpio/>
          </>
        } />
        <Route path="/reserva" element={<Reserva />}></Route>
        <Route path="/cadarpio" element={<Cadarpio />}></Route>
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
