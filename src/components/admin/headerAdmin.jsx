import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function HeaderAdmin() {
	const { token, logout } = useAuth();
	const navigate = useNavigate();

	const deslogar = () => {
		logout();
		navigate("/admin");
	};

	return (
		<header className={`bg-blue-950 p-4 px-6 flex ${token ? "justify-between" : "justify-center"} items-center shadow-md`}>
			<h1 className="text-2xl font-semibold text-white">NORTE BAR</h1>
			{token && (
				<button
					onClick={deslogar}
					className="text-white hover:text-blue-200
                            transition-colors font-medium
                            underline underline-offset-4
                            cursor-pointer">
					Sair
				</button>
			)}
		</header>
	);
}

export default HeaderAdmin;
