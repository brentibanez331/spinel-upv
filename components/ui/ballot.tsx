"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoonLoader } from "react-spinners";

interface Card {
  id: string;
  imgUrl: string;
  displayName: string;
  politicalParty: string;
}
import { createClient } from "@/utils/supabase/client";
import { set } from "date-fns";

export const BallotTable = ({ candidates }: { candidates: Card[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const supabase = createClient();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [user, setUser] = useState<any>(null);

  const columns: ColumnDef<Card>[] = [
    {
      id: "select",

      header: ({ table }) => <div> Like </div>,
      cell: ({ row }) => {
        const rowId = row.original.id;
        const [isLiked, setIsLiked] = useState(false);
        // console.log("CANDIDATE CARDS:", candidates);
        // console.log("CANDIDATE ID", rowId);
        // console.log("CURRENT USER: ", user.id);
        const handleCandidateSelection = async (checked: boolean) => {
          setIsLiked(checked);

          if (checked) {
            const { data, error } = await supabase.from("ballot").insert([
              {
                user_id: user.id,
                candidate_id: rowId,
              },
            ]);
            console.log("DATA INSERTED");
            window.location.reload();

            if (error) {
              console.error("Error saving candidate action:", error);
            }
          }
          //   else if (!checked && user) {
          //     const { data, error } = await supabase
          //       .from("ballot")
          //       .delete()
          //       .eq("user_id", user.id)
          //       .eq("candidate_id", rowId);
          //     console.log("DATA DELETED");
          //     // window.location.reload();
          //     if (error) {
          //       console.error("Error deleting candidate action:", error);
          //     }
          //   }
        };

        return (
          <div>
            <Checkbox
              checked={isLiked}
              onCheckedChange={handleCandidateSelection}
              aria-label="Liked"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "displayName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("displayName")}</div>,
    },

    {
      accessorKey: "politicalParty",
      header: "Political Party",
      cell: ({ row }) => <div>{row.getValue("politicalParty")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const card = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(card.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View candidate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: candidates,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("ERROR!", error.message);
      }
      setUser(data.user);
      console.log("User Data:", data.user);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full p-4">
      <div className="flex items-center py-4 ">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("displayName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("displayName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-18 text-center"
                >
                  <div className="h-screen flex items-center justify-center">
                    {/* <MoonLoader color="#000000" /> */}
                    <p className=" text-lg">No candidates found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BallotTable;
