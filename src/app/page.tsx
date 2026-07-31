import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import OperationsCard from "@/components/OperationsCard";
import DataTransferCard from "@/components/DataTransferCard";
import PromoCard from "@/components/PromoCard";
import StatisticsCard from "@/components/StatisticsCard";
import ResourcePanel from "@/components/ResourcePanel";

export default function Home() {
  return (
    <div className="flex h-full p-4">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-y-auto pl-8">
        <Header />
        <Tabs />

        <div className="flex flex-1 space-x-8">
          <div className="flex flex-1 flex-col space-y-6">
            <div className="flex space-x-6">
              <OperationsCard />
              <DataTransferCard />
              <PromoCard />
            </div>
            <StatisticsCard />
          </div>

          <ResourcePanel />
        </div>
      </main>
    </div>
  );
}
