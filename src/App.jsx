import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Sobre from "./pages/sobre";
import Reserva from "./pages/reserva";
import Login from "./pages/admin/login";
import HeaderAdmin from "./components/admin/headerAdmin";
import { AuthProvider } from "./context/AuthContext";
import SideBar from "./components/admin/sidebar";
import Mesas from "./pages/admin/mesas";
import Comidas from "./pages/admin/comidas";
import Pedidos from "./pages/admin/pedidos";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/admin/*" element={<PrivateRoutes />}></Route>
					<Route path="/*" element={<PublicRoutes />}></Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

const PublicLayout = ({ children }) => {
	return (
		<>
			<Header />
			{children}
		</>
	);
};

const PublicRoutes = () => {
	return (
		<PublicLayout>
			<Routes>
				<Route
					path="/"
					element={
						<>
							<Sobre />
							<Reserva />
						</>
					}
				/>
				<Route path="/reserva" element={<Reserva />} />
				<Route path="*" element={<h1>404 - Página não encontrada</h1>} />
			</Routes>
		</PublicLayout>
	);
};

const PrivateLayout = ({ children }) => {
	return (
		<>
			<HeaderAdmin></HeaderAdmin>
			{children}
		</>
	);
};

const PrivateRoutes = () => {
	return (
		<PrivateLayout>
			<Routes>
				<Route index element={<Login />} />
				<Route element={<SideBar />}>
					<Route path="dashboard" element={<h1>Esse é o dashboard</h1>}></Route>
					<Route path="mesas" element={<Mesas />}></Route>
					<Route path="comidas" element={<Comidas />}></Route>
					<Route path="pedidos" element={<Pedidos />}></Route>
					<Route path="reservas" element={<h1>Essas são as reservas</h1>}></Route>
					<Route path="feedback" element={<h1>Esses são os feedbacks</h1>}></Route>
				</Route>
			</Routes>
		</PrivateLayout>
	);
};

export default App;
