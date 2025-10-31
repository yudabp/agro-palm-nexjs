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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Truck, Building, Factory, Users, DollarSign, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
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

interface PaginatedResponse {
  data: MasterDataItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  const [pagination, setPagination] = useState<Record<string, PaginatedResponse['pagination']>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [pageSize, setPageSize] = useState<Record<string, number>>({});
  const [editItem, setEditItem] = useState<MasterDataItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const currentType = masterDataTypes.find(t => t.key === activeTab)!;

  const fetchData = async (type: string, page?: number, limit?: number) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const typeConfig = masterDataTypes.find(t => t.key === type);
      const currentPage = page || 1;
      const currentLimit = limit || pageSize[type] || 10;
      const search = searchTerm[type] || '';

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentLimit.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/master/${typeConfig!.apiPath}?${params}`);

      if (response.ok) {
        const result: PaginatedResponse = await response.json();
        if (result.pagination) {
          setData(prev => ({ ...prev, [type]: result.data }));
          setPagination(prev => ({ ...prev, [type]: result.pagination }));
          setCurrentPage(prev => ({ ...prev, [type]: result.pagination.page }));
          setPageSize(prev => ({ ...prev, [type]: result.pagination.limit }));
        } else {
          // Handle case where pagination is not provided
          toast.error("Failed to fetch data: pagination info missing");
        }
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
    setCurrentPage(prev => ({ ...prev, [activeTab]: 1 }));
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm[activeTab] !== undefined) {
        fetchData(activeTab, 1);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeTab]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(prev => ({ ...prev, [activeTab]: newPage }));
    fetchData(activeTab, newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setPageSize(prev => ({ ...prev, [activeTab]: newLimit }));
    setCurrentPage(prev => ({ ...prev, [activeTab]: 1 }));
    fetchData(activeTab, 1, newLimit);
  };

  // Fetch initial data when tab changes
  React.useEffect(() => {
    if (!data[activeTab]) {
      fetchData(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="p-6 space-y-6">
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

                {/* Pagination Controls */}
                {pagination[type.key] && pagination[type.key].totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 py-4">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        Showing {((pagination[type.key].page - 1) * pagination[type.key].limit) + 1} to{' '}
                        {Math.min(pagination[type.key].page * pagination[type.key].limit, pagination[type.key].total)} of{' '}
                        {pagination[type.key].total} results
                      </p>
                      <Select
                        value={pageSize[type.key]?.toString() || '10'}
                        onValueChange={(value) => handlePageSizeChange(Number(value))}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={pageSize[type.key] || 10} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[5, 10, 20, 50].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={pagination[type.key].page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <ChevronLeft className="h-4 w-4 -ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination[type.key].page - 1)}
                        disabled={pagination[type.key].page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center justify-center text-sm font-medium w-8">
                        {pagination[type.key].page}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination[type.key].page + 1)}
                        disabled={pagination[type.key].page === pagination[type.key].totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination[type.key].totalPages)}
                        disabled={pagination[type.key].page === pagination[type.key].totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <ChevronRight className="h-4 w-4 -ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
