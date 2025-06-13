import Comidas from "./comidas";
import Mesas from "./mesas";
import Pedidos from "./pedidos";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="grid grid-cols-2">
                <Mesas />
                <Pedidos />
                <Comidas />
            </div>
        </div>
    )
}