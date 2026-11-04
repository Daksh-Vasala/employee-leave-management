import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { getDashboardStats } from "../services/dashboard.service";
import type { DashboardStats } from "../types";
import { CheckCircle, Clock, Users } from "lucide-react";

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await getDashboardStats();
        setStats(res.data);
        console.log(stats);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCard = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      iconColor: "text-blue-600",
      iconBackground: "bg-blue-100",
    },
    {
      title: "Pending leaves",
      value: stats.pending,
      icon: Clock,
      iconColor: "text-amber-600",
      iconBackground: "bg-amber-100",
    },
    {
      title: "Approved leaves",
      value: stats.approved,
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBackground: "bg-green-100",
    },
    {
      title: "Rejected leaves",
      value: stats.rejected,
      icon: Users,
      iconColor: "text-red-600",
      iconBackground: "bg-red-100",
    },
  ];
  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-600">Overview</h2>

        {isLoading ? (
          <p className="text-center text-slate-400 w-full">
            Loading Dashboard...
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statsCard.map((card) => (
              <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-800">
                      {card.value}
                    </h3>
                  </div>

                  <div className={`rounded-lg p-3 ${card.iconBackground}`}>
                    <card.icon size={22} className={card.iconColor} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DashboardPage;
