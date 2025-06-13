import { CalendarClock, ChevronLeft, ChevronRight, LayoutDashboard, MessageCircle, ScrollText, Table, Utensils } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

// const navItems = [
// 	{ to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
// 	{ to: "/admin/mesas", label: "Mesas", icon: <Table size={20} /> },
// 	{ to: "/admin/comidas", label: "Comidas", icon: <Utensils size={20} /> },
// 	{ to: "/admin/pedidos", label: "Pedidos", icon: <ScrollText size={20} /> },
// 	{ to: "/admin/reservas", label: "Reservas", icon: <CalendarClock size={20} /> },
// 	{ to: "/admin/feedback", label: "Feedback", icon: <MessageCircle size={20} /> },
// ];

const navItems = [
	{ to: "/admin/mesas", label: "Mesas", icon: <Table size={20} /> },
	{ to: "/admin/comidas", label: "Comidas", icon: <Utensils size={20} /> },
	{ to: "/admin/pedidos", label: "Pedidos", icon: <ScrollText size={20} /> },
	{ to: "/admin/reservas", label: "Reservas", icon: <CalendarClock size={20} /> },
	{ to: "/admin/feedback", label: "Feedback", icon: <MessageCircle size={20} /> },
];

const SideBar = () => {
	const [collapsed, setCollapsed] = useState(false);

	const toggleSidebar = () => {
		setCollapsed((prev) => !prev);
	};

	// return (
	// 	<div className="flex min-h-screen bg-gray-100">
	// 		<aside className={`${collapsed ? "w-16" : "w-64"} bg-gray-800 text-white transition-all duration-300`}>
	// 			<div className="flex items-center justify-between p-4">
	// 				{collapsed ? (
	// 					<button onClick={toggleSidebar} className="text-xl focus:outline-none mx-auto">
	// 						☰
	// 					</button>
	// 				) : (
	// 					<>
	// 						<span className="text-2xl font-bold">Menus</span>
	// 						<button onClick={toggleSidebar} className="text-xl focus:outline-none">
	// 							☰
	// 						</button>
	// 					</>
	// 				)}
	// 			</div>
	// 			<nav className="flex flex-col space-y-1 px-2">
	// 				{navItems.map(({ to, label, icon }) => (
	// 					<NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition-all ${isActive ? "bg-gray-700 text-white" : "text-gray-300"}`}>
	// 						{icon}
	// 						{!collapsed && <span>{label}</span>}
	// 					</NavLink>
	// 				))}
	// 			</nav>
	// 		</aside>
	// 		<main className="flex-1">
	// 			<Outlet />
	// 		</main>
	// 	</div>
	// );
	return (
		<aside className={`${collapsed ? "w-16" : "w-64"} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out shadow-xl border-r border-gray-700 relative`}>
			{/* Header da Sidebar */}
			<div className="flex items-center justify-between p-4 border-b border-gray-700">
				{!collapsed && (
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">NB</span>
						</div>
						<span className="text-lg font-semibold text-white">Admin Panel</span>
					</div>
				)}

				{/* Botão de toggle mais elegante */}
				<button onClick={toggleSidebar} className={`p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 ${collapsed ? "mx-auto" : ""}`} title={collapsed ? "Expandir menu" : "Recolher menu"}>
					{collapsed ? <ChevronRight size={18} className="text-gray-300" /> : <ChevronLeft size={18} className="text-gray-300" />}
				</button>
			</div>

			{/* Navegação */}
			<nav className="flex flex-col space-y-1 p-4">
				{navItems.map(({ to, label, icon }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
							${isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
						}
						title={collapsed ? label : ""}>
						<div className="flex-shrink-0">{icon}</div>

						{!collapsed && <span className="font-medium text-sm">{label}</span>}

						{/* Tooltip para quando collapsed */}
						{collapsed && (
							<div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
								{label}
								<div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
							</div>
						)}
					</NavLink>
				))}
			</nav>

			{/* Footer da sidebar (opcional) */}
			{!collapsed && (
				<div className="absolute bottom-4 left-4 right-4 text-center">
					<div className="text-xs text-gray-400 border-t border-gray-700 pt-4">
						<p>Norte Bar</p>
						<p className="mt-1 opacity-75">v1.0.0</p>
					</div>
				</div>
			)}

			{/* Indicador visual quando collapsed */}
			{collapsed && (
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
					<div className="w-8 h-1 bg-blue-600 rounded-full"></div>
				</div>
			)}
		</aside>
	);
};

export default SideBar;
