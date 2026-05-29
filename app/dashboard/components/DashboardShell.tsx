import Home from "../shellammo/Home";
import InventoryManager from "../shellammo/InventoryManager";
//
import ITEMS from '../JSONs/INVENTORY15%15.json'
import ORDERS from '../JSONs/ORDERS.json'
//
import OrderManager from "../shellammo/OrderManager";
type DashboardShellProps = {
  activeTab: string;
};

export default function DashboardShell({ activeTab }: DashboardShellProps) {
  return (
    <section className="w-full">
      {/* Conditional rendering for later sections */}    
      {activeTab === "home" && (
        <Home />
      )}
      
      {activeTab === "inventory" && (
       <InventoryManager items={ITEMS}/>
      )}

      {activeTab === "orders" && (
        <OrderManager />
      )}

       

      {activeTab === "register" && (
        <div>register Section Placeholder</div>
      )}

      {activeTab === "reports" && (
        <div>reports Section Placeholder</div>
      )}
    </section>
  );
}
