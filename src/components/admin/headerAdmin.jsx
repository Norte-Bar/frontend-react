import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User } from "lucide-react";

function HeaderAdmin() {
	const { token, logout, user } = useAuth();
	const navigate = useNavigate();

	const deslogar = () => {
		logout();
		navigate("/admin");
	};

	return (
		<header className={`bg-gradient-to-r from-blue-950 to-blue-800 p-4 px-6 flex ${token ? "justify-between" : "justify-center"} items-center shadow-lg border-b border-blue-700`}>
			<div className="flex items-center space-x-3">
				<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
					<span className="text-blue-950 font-bold text-sm">NB</span>
				</div>
				<h1 className="text-2xl font-bold text-white tracking-wide">NORTE BAR</h1>
			</div>
			
			{token && (
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2 text-white/80">
						<User size={18} />
						<span className="text-sm font-medium">
							{user?.name || "Administrador"}
						</span>
					</div>
					<button
						onClick={deslogar}
						className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 
								 text-white px-4 py-2 rounded-lg transition-all duration-200 
								 hover:shadow-md active:scale-95 font-medium">
						<LogOut size={16} />
						<span>Sair</span>
					</button>
				</div>
			)}
		</header>
	);
}

export default HeaderAdmin;