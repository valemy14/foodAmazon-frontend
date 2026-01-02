import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const orders = [
  { id: "#248759", date: "12-10-2020", product: "Organic Almond Delight", location: "Ibeju-Lekki", status: "Pending" },
  { id: "#248759", date: "12-10-2020", product: "Organic Almond Delight", location: "Ibeju-Lekki", status: "Pending" },
  { id: "#248759", date: "12-10-2020", product: "Organic Almond Delight", location: "Ibeju-Lekki", status: "Pending" },
  { id: "#248759", date: "12-10-2020", product: "Organic Almond Delight", location: "Ibadan", status: "Pending" },
  { id: "#248759", date: "12-10-2020", product: "Organic Almond Delight", location: "Ibadan", status: "Pending" },
  { id: "#248759", date: "12-10-2020", product: "Organic Almond Delight", location: "Ibadan", status: "Pending" },
  { id: "#248759", date: "12-10-2020", product: "Organic Almond Delight", location: "Maryland", status: "Pending" },
  { id: "#248759", date: "12-10-2020", product: "Organic Almond Delight", location: "Ibadan", status: "Pending" }
];

// Updated with styling & responsive media queries
export default function OrdersPage() {
  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <Card className="rounded-2xl shadow-sm p-4">
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="flex space-x-6 border-b pb-2">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending Orders</TabsTrigger>
              <TabsTrigger value="delivered">Delivered Orders</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Ordered Date</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">Showing 1 to 10 items</p>
                <div className="flex space-x-2">
                  <Button variant="outline" className="rounded-xl px-4">1</Button>
                  <Button variant="ghost" className="rounded-xl px-4">2</Button>
                  <Button variant="ghost" className="rounded-xl px-4">3</Button>
                  <Button variant="ghost" className="rounded-xl px-4">4</Button>
                  <Button variant="ghost" className="rounded-xl px-4">5</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
