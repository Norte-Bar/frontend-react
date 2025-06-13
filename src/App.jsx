import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Sobre from "./pages/sobre";
import Reserva from "./pages/reserva";
import Login from "./pages/admin/login";
import HeaderAdmin from "./components/admin/headerAdmin";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SideBar from "./components/admin/sidebar";
import Mesas from "./pages/admin/mesas";
import Comidas from "./pages/admin/comidas";
import Pedidos from "./pages/admin/pedidos";
import Reservas from "./pages/admin/reservas";
import Feedback from "./pages/admin/feedback";
import Dashboard from "./pages/admin/dashboard";

const LoadingSpinner = () => (
	<div
		style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "100vh",
			flexDirection: "column",
		}}>
		<div
			style={{
				border: "4px solid #f3f3f3",
				borderTop: "4px solid #3498db",
				borderRadius: "50%",
				width: "40px",
				height: "40px",
				animation: "spin 2s linear infinite",
				marginBottom: "20px",
			}}></div>
		<div>Carregando...</div>
		<style>
			{`
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			`}
		</style>
	</div>
);

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/admin" replace />;
	}

	return children;
};

const LoginRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isAuthenticated) {
		return <Navigate to="/admin/mesas" replace />;
	}

	return <Login />;
};

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/admin/*" element={<PrivateRoutes />} />
					<Route path="/*" element={<PublicRoutes />} />
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

const AdminLayout = ({ children }) => {
	return (
		<div className="min-h-screen bg-gray-50">
			<HeaderAdmin />
			<div className="flex">
				<SideBar />
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
};

const PrivateRoutes = () => {
	return (
		<Routes>
			{/* Rota de login - sem header/sidebar */}
			<Route index element={<LoginRoute />} />

			{/* Todas as rotas protegidas com AdminLayout */}
			{/* <Route
				path="dashboard"
				element={
					<ProtectedRoute>
						<AdminLayout>
							
							<Dashboard />
						</AdminLayout>
					</ProtectedRoute>
				}
			/> */}

			<Route
				path="mesas"
				element={
					<ProtectedRoute>
						<AdminLayout>
							<Mesas />
						</AdminLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="comidas"
				element={
					<ProtectedRoute>
						<AdminLayout>
							<Comidas />
						</AdminLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="pedidos"
				element={
					<ProtectedRoute>
						<AdminLayout>
							<Pedidos />
						</AdminLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="reservas"
				element={
					<ProtectedRoute>
						<AdminLayout>
							{/* <div className="bg-white rounded-lg shadow-sm p-6">
								<h1 className="text-2xl font-bold text-gray-800 mb-4">Reservas</h1>
								<p className="text-gray-600">Gerencie as reservas do estabelecimento.</p>
							</div> */}
							<Reservas />
						</AdminLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="feedback"
				element={
					<ProtectedRoute>
						<AdminLayout>
							{/* <div className="bg-white rounded-lg shadow-sm p-6">
								<h1 className="text-2xl font-bold text-gray-800 mb-4">Feedbacks</h1>
								<p className="text-gray-600">Visualize os feedbacks dos clientes.</p>
							</div> */}
							<Feedback />
						</AdminLayout>
					</ProtectedRoute>
				}
			/>

			{/* Rota 404 para admin */}
			<Route
				path="*"
				element={
					<div className="min-h-screen flex items-center justify-center">
						<div className="text-center">
							<h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
							<p className="text-gray-600">Página administrativa não encontrada</p>
						</div>
					</div>
				}
			/>
		</Routes>
	);
};

export default App;
