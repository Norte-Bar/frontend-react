import { CalendarClock, LayoutDashboard, MessageCircle, ScrollText, Table, Utensils } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
	{ to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
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

	return (
		<div className="flex min-h-screen bg-gray-100">
			<aside className={`${collapsed ? "w-16" : "w-64"} bg-gray-800 text-white transition-all duration-300`}>
				<div className="flex items-center justify-between p-4">
					{collapsed ? (
						<button onClick={toggleSidebar} className="text-xl focus:outline-none mx-auto">
							☰
						</button>
					) : (
						<>
							<span className="text-2xl font-bold">Menus</span>
							<button onClick={toggleSidebar} className="text-xl focus:outline-none">
								☰
							</button>
						</>
					)}
				</div>
				<nav className="flex flex-col space-y-1 px-2">
					{navItems.map(({ to, label, icon }) => (
						<NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition-all ${isActive ? "bg-gray-700 text-white" : "text-gray-300"}`}>
							{icon}
							{!collapsed && <span>{label}</span>}
						</NavLink>
					))}
				</nav>
			</aside>
			<main className="flex-1 p-6">
				<Outlet />
			</main>
		</div>
	);
};

export default SideBar;
