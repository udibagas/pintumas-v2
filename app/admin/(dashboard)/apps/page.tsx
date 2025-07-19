"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppsTable } from "@/components/admin/AppsTable";
import { AppDialog } from "@/components/admin/AppDialog";
import { appsStore } from "./store";
import type { Apps } from "@prisma/client";

export default function AppsPage() {
  const {
    items: apps,
    loading,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = appsStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Apps | undefined>(undefined);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: any) => {
    await createItem(data);
    setDialogOpen(false);
  };

  const handleEdit = (app: Apps) => {
    setEditingApp(app);
    setDialogOpen(true);
  };

  const handleUpdate = async (data: any) => {
    if (editingApp) {
      await updateItem(editingApp.id, data);
      setDialogOpen(false);
      setEditingApp(undefined);
    }
  };

  const handleDelete = async (app: Apps) => {
    await deleteItem(app.id);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingApp(undefined);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 rounded-lg p-6 bg-white shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Apps</h1>
          <p className="text-muted-foreground">
            Manage application links and icons
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add App
        </Button>
      </div>

      <AppsTable
        data={apps as Apps[]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AppDialog
        app={editingApp}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={editingApp ? handleUpdate : handleCreate}
      />
    </div>
  );
}
