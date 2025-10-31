"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Building, ChevronLeft, ChevronRight } from "lucide-react";
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

export default function AfdelingMasterPage() {
  const { canWrite } = useAuth();
  const [data, setData] = useState<MasterDataItem[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [editItem, setEditItem] = useState<MasterDataItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{ name: string; description?: string }>({ name: "", description: "" });

 const fetchData = async (page?: number, limit?: number) => {
    setLoading(true);
    try {
      const currentPage = page || 1;
      const currentLimit = limit || pageSize;
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentLimit.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/master/afdelings?${params}`);

      if (response.ok) {
        const result: PaginatedResponse = await response.json();
        if (result.pagination) {
          setData(result.data);
          setPagination(result.pagination);
          setCurrentPage(result.pagination.page);
          setPageSize(result.pagination.limit);
        } else {
          toast.error("Failed to fetch data: pagination info missing");
        }
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editItem ? "PUT" : "POST";
    const url = editItem
      ? `/api/master/afdelings/${editItem.id}`
      : `/api/master/afdelings`;

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
        setFormData({ name: "", description: "" });
        fetchData();
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
    setFormData({ name: item.name, description: item.description || "" });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: MasterDataItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/master/afdelings/${item.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Data deleted successfully");
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete data");
      }
    } catch (error) {
      toast.error("Error deleting data");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setPageSize(newLimit);
    setCurrentPage(1);
    fetchData(1, newLimit);
  };

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Master Data Afdeling</h1>
        <p className="text-muted-foreground">
          Manage afdeling data for the application
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <CardTitle>Afdeling</CardTitle>
            </div>
            {canWrite && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditItem(null); setFormData({ name: "", description: "" }); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editItem ? "Edit Afdeling" : "Add New Afdeling"}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the information below.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nama Afdeling</Label>
                        <Input
                          id="name"
                          value={formData.name || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                          id="description"
                          value={formData.description || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
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
              placeholder="Search afdelings..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Afdeling</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Created</TableHead>
                  {canWrite && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canWrite ? 4 : 3} className="text-center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
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
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </p>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSize} />
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
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center text-sm font-medium w-8">
                  {currentPage}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
