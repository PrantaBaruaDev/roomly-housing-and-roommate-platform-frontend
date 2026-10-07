"use client";

import { ShieldCheck, Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const properties = [
  { id: "1", title: "Birchwood House", ownerName: "Elena Fischer", city: "Austin", roomCount: 12, availableRoomCount: 3, isVerified: true },
  { id: "2", title: "Elm Street Flats", ownerName: "Jonas Reyes", city: "Austin", roomCount: 8, availableRoomCount: 1, isVerified: false },
  { id: "3", title: "Riverside Cottages", ownerName: "Sana Malik", city: "Denver", roomCount: 5, availableRoomCount: 5, isVerified: false },
  { id: "4", title: "Maple Court", ownerName: "Elena Fischer", city: "Denver", roomCount: 10, availableRoomCount: 0, isVerified: true },
];

export default function AdminPropertiesPage() {
  return (
    <div>
      <PageHeader title="Properties" description="Every listing across all owners, with verification status." />

      {properties.length === 0 ? (
        <EmptyState icon={Building2} title="No properties yet" description="Properties created by owners will appear here for review." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">{p.ownerName}</TableCell>
                  <TableCell className="text-muted-foreground">{p.city}</TableCell>
                  <TableCell>{p.roomCount}</TableCell>
                  <TableCell>{p.availableRoomCount}</TableCell>
                  <TableCell>
                    {p.isVerified ? (
                      <Badge variant="outline" className="border-moss/30 bg-moss/10 text-moss">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber/30 bg-amber/10 text-amber">
                        Unverified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!p.isVerified && (
                      <Button size="sm" variant="outline">
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
