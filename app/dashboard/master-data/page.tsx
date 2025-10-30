"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, Truck, Building, Factory, Users, DollarSign, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface MasterDataItem {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

const masterDataTypes = [
  {
    key: "vehicles",
    label: "Kendaraan",
    icon: Truck,
    apiPath: "vehicles",
    fields: [
      { name: "noPol", label: "Nomor Polisi", type: "text", required: true },
    ],
  },
  {
    key: "afdelings",
    label: "Afdeling",
    icon: Building,
    apiPath: "afdelings",
    fields: [
      { name: "name", label: "Nama Afdeling", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea" },
    ],
  },
  {
    key: "pks",
    label: "PKS",
    icon: Factory,
    apiPath: "pks",
    fields: [
      { name: "name", label: "Nama PKS", type: "text", required: true },
      { name: "address", label: "Alamat", type: "text" },
      { name: "phone", label: "Telepon", type: "text" },
    ],
  },
  {
    key: "employee-departments",
    label: "Departemen Karyawan",
    icon: Users,
    apiPath: "employee-departments",
    fields: [
      { name: "name", label: "Nama Departemen", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea" },
    ],
  },
  {
    key: "employee-positions",
    label: "Jabatan Karyawan",
    icon: Users,
    apiPath: "employee-positions",
    fields: [
      { name: "name", label: "Nama Jabatan", type: "text", required: true },
      { name: "level", label: "Level", type: "text" },
    ],
  },
  {
    key: "employee-groups",
    label: "Golongan Karyawan",
    icon: Users,
    apiPath: "employee-groups",
    fields: [
      { name: "name", label: "Nama Golongan", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea" },
    ],
  },
  {
    key: "debt-types",
    label: "Jenis Hutang",
    icon: CreditCard,
    apiPath: "debt-types",
    fields: [
      { name: "name", label: "Jenis Hutang", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea" },
    ],
  },
  {
    key: "bkk-expense-categories",
    label: "Kategori Pengeluaran BKK",
    icon: DollarSign,
    apiPath: "bkk-expense-categories",
    fields: [
      { name: "name", label: "Nama Kategori", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea" },
    ],
  },
];

export default function MasterDataPage() {
  const { canWrite } = useAuth();
  const [activeTab, setActiveTab] = useState("vehicles");
  const [data, setData] = useState<Record<string, MasterDataItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<Record<string, string>>({});
  const [editItem, setEditItem] = useState<MasterDataItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const currentType = masterDataTypes.find(t => t.key === activeTab)!;

  const fetchData = async (type: string) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const typeConfig = masterDataTypes.find(t => t.key === type);
      const searchQuery = searchTerm[type] ? `?search=${encodeURIComponent(searchTerm[type])}` : '';
      const response = await fetch(`/api/master/${typeConfig!.apiPath}${searchQuery}`);

      if (response.ok) {
        const result = await response.json();
        setData(prev => ({ ...prev, [type]: result }));
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editItem ? "PUT" : "POST";
    const url = editItem
      ? `/api/master/${currentType.apiPath}/${editItem.id}`
      : `/api/master/${currentType.apiPath}`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editItem ? "Data updated successfully" : "Data added successfully");
        setIsDialogOpen(false);
        setEditItem(null);
        setFormData({});
        fetchData(activeTab);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save data");
      }
    } catch (error) {
      toast.error("Error saving data");
    }
  };

  const handleEdit = (item: MasterDataItem) => {
    setEditItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: MasterDataItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/master/${currentType.apiPath}/${item.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Data deleted successfully");
        fetchData(activeTab);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete data");
      }
    } catch (error) {
      toast.error("Error deleting data");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(prev => ({ ...prev, [activeTab]: value }));
    setTimeout(() => fetchData(activeTab), 300);
  };

  // Fetch initial data when tab changes
  React.useEffect(() => {
    if (!data[activeTab]) {
      fetchData(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Master Data Management</h1>
        <p className="text-muted-foreground">
          Manage all master data for the application
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {masterDataTypes.map((type) => (
            <TabsTrigger key={type.key} value={type.key} className="text-xs">
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {masterDataTypes.map((type) => (
          <TabsContent key={type.key} value={type.key} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <type.icon className="h-5 w-5" />
                    <CardTitle>{type.label}</CardTitle>
                  </div>
                  {canWrite && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditItem(null); setFormData({}); }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editItem ? `Edit ${type.label}` : `Add New ${type.label}`}
                          </DialogTitle>
                          <DialogDescription>
                            Fill in the information below.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            {type.fields.map((field) => (
                              <div key={field.name}>
                                <Label htmlFor={field.name}>{field.label}</Label>
                                {field.type === "textarea" ? (
                                  <Textarea
                                    id={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                    required={field.required}
                                  />
                                ) : (
                                  <Input
                                    id={field.name}
                                    type={field.type}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                    required={field.required}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <DialogFooter className="mt-6">
                            <Button type="submit">
                              {editItem ? "Update" : "Create"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search ${type.label.toLowerCase()}...`}
                    value={searchTerm[type.key] || ""}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {loading[type.key] ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        {type.fields.some(f => f.name === "noPol") && <TableHead>License Plate</TableHead>}
                        {type.fields.some(f => f.name === "level") && <TableHead>Level</TableHead>}
                        <TableHead>Description</TableHead>
                        <TableHead>Created</TableHead>
                        {canWrite && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(data[type.key] || []).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={canWrite ? 5 : 4} className="text-center">
                            No data found
                          </TableCell>
                        </TableRow>
                      ) : (
                        (data[type.key] || []).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            {item.noPol && <TableCell>{item.noPol}</TableCell>}
                            {item.level && <TableCell>{item.level}</TableCell>}
                            <TableCell>{item.description || "-"}</TableCell>
                            <TableCell>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </TableCell>
                            {canWrite && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(item)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}