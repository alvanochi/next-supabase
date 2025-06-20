import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AdminPage() {

    const [menus, setMenus] = useState<IMenu[]>([]);

    useEffect(() => {
        const fetchMenus = async () => {
        const { data, error } = await supabase.from("menus").select("*");
        if(error) console.log(error);
        else setMenus(data);
        }

        fetchMenus();
        
    }, [supabase])


    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 flex justify-between w-full">
                <h1 className="text-3xl font-bold">Menu</h1>
                <Button>Add Menu</Button>

            </div>
            <div className="">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-neutral-700 font-bold">Product</TableHead>
                            <TableHead className="text-neutral-700 font-bold">Description</TableHead>
                            <TableHead className="text-neutral-700 font-bold">Category</TableHead>
                            <TableHead className="text-neutral-700 font-bold">Price</TableHead>
                            <TableHead className="text-neutral-700 font-bold"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menus.map((menu) => (
                            <TableRow key={menu.id}>
                                <TableCell className="flex gap-2 items-center">
                                    <Image src={menu.image} alt={menu.name} width={50} height={50} className="aspect-square object-cover rounded-lg" />
                                    {menu.name}
                                </TableCell>
                                <TableCell>{menu.description.split(' ').slice(0, 5).join(' ')}</TableCell>
                                <TableCell>{menu.category}</TableCell>
                                <TableCell>Rp {menu.price?.toLocaleString("id-ID")}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="cursor-pointer">
                                            <MoreVertical className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-20 mx-auto">
                                            <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>Update</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500">Remove</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>

    );
}