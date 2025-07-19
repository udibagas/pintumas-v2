"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useState } from "react";
import Image from "next/image";
import type { Apps } from "@prisma/client";

interface AppsTableProps {
  data: Apps[];
  onEdit: (app: Apps) => void;
  onDelete: (app: Apps) => void;
}

export function AppsTable({ data, onEdit, onDelete }: AppsTableProps) {
  const [deleteApp, setDeleteApp] = useState<Apps | null>(null);

  const columns: ColumnDef<Apps>[] = [
    {
      accessorKey: "name",
      header: "App Name",
      cell: ({ row }) => {
        const app = row.original;
        return (
          <div className="flex items-center gap-3">
            {app.iconUrl && (
              <Image
                src={app.iconUrl}
                alt={app.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded object-cover"
              />
            )}
            <span className="font-medium">{app.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }) => {
        const link = row.original.link;
        return link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <span className="max-w-[200px] truncate">{link}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-gray-500">-</span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const app = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(app)}>
                Edit app
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteApp(app)}
                className="text-red-600"
              >
                Delete app
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data} />

      <ConfirmDialog
        isOpen={!!deleteApp}
        onOpenChange={(open) => !open && setDeleteApp(null)}
        title="Delete App"
        description={
          deleteApp
            ? `Are you sure you want to delete "${deleteApp.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={() => {
          if (deleteApp) {
            onDelete(deleteApp);
            setDeleteApp(null);
          }
        }}
      />
    </>
  );
}
