import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Database, Users, Truck, Factory, Building, DollarSign } from "lucide-react";

export default function AgroPalmaPage() {
  const completedTasks = [
    { name: "Next.js 15 Project Setup", icon: CheckCircle2, status: "completed" },
    { name: "PostgreSQL Database", icon: CheckCircle2, status: "completed" },
    { name: "Database Schema", icon: CheckCircle2, status: "completed" },
    { name: "Authentication System", icon: CheckCircle2, status: "completed" },
    { name: "Master Data API", icon: CheckCircle2, status: "completed" },
  ];

  const inProgressTasks = [
    { name: "Production Data Module", icon: Circle, status: "in-progress" },
    { name: "Sales Data Module", icon: Circle, status: "pending" },
    { name: "Employee Management", icon: Circle, status: "pending" },
    { name: "Financial Module (KP)", icon: Circle, status: "pending" },
    { name: "Financial Module (BKK)", icon: Circle, status: "pending" },
    { name: "Debt Management", icon: Circle, status: "pending" },
    { name: "Dashboard Analytics", icon: Circle, status: "pending" },
  ];

  const modules = [
    {
      title: "Data Produksi",
      description: "Manajemen data produksi TBS dan KG",
      icon: Truck,
      status: "in-progress",
      color: "text-orange-600",
    },
    {
      title: "Data Penjualan",
      description: "Manajemen penjualan dengan fitur pajak",
      icon: DollarSign,
      status: "pending",
      color: "text-green-600",
    },
    {
      title: "Data Karyawan",
      description: "Manajemen data karyawan dan gaji",
      icon: Users,
      status: "pending",
      color: "text-blue-600",
    },
    {
      title: "Keuangan Perusahaan",
      description: "Manajemen keuangan perusahaan (KP)",
      icon: Building,
      status: "pending",
      color: "text-purple-600",
    },
    {
      title: "Buku Kas Kebun",
      description: "Manajemen kas kebun (BKK)",
      icon: Database,
      status: "pending",
      color: "text-cyan-600",
    },
    {
      title: "Data Hutang",
      description: "Manajemen hutang dan pelunasan",
      icon: DollarSign,
      status: "pending",
      color: "text-red-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agro Palma Data Management Dashboard</h1>
        <p className="text-muted-foreground">
          Sistem manajemen data terpadu untuk perkebunan kelapa sawit
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              21 tables created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Endpoints</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Master data APIs ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Total modules to implement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25%</div>
            <p className="text-xs text-muted-foreground">
              Foundation completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Module Status */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Module Status</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <module.icon className={`h-5 w-5 ${module.color}`} />
                  {module.title}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    module.status === "completed"
                      ? "default"
                      : module.status === "in-progress"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {module.status === "completed"
                    ? "Selesai"
                    : module.status === "in-progress"
                    ? "Dalam Pengerjaan"
                    : "Belum Dimulai"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Task Progress */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Completed Tasks</CardTitle>
            <CardDescription>Foundation components that are ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task.name} className="flex items-center gap-2">
                <task.icon className="h-4 w-4 text-green-600" />
                <span className="text-sm">{task.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Upcoming Tasks</CardTitle>
            <CardDescription>Modules to be implemented</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressTasks.map((task) => (
              <div key={task.name} className="flex items-center gap-2">
                <task.icon className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{task.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Test the implemented features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">/api/master/vehicles</Badge>
            <Badge variant="outline">/api/master/afdelings</Badge>
            <Badge variant="outline">/api/master/pks</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use tools like Postman or curl to test the API endpoints
          </p>
        </CardContent>
      </Card>
    </div>
  );
}