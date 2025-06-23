import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminPage() {

    const [menus, setMenus] = useState<IMenu[]>([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<{
        menu: IMenu;
        action: "edit" | "delete";
    } | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
        const { data, error } = await supabase.from("menus").select("*");
        if(error) console.log(error);
        else setMenus(data);
        }

        fetchMenus();
        
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        console.log(formData)

        try {
            const { data, error } = await supabase.from("menus").insert(Object.fromEntries(formData)).select()
            if(error) console.log(error);
            else {
                if(data) {
                    setMenus((prev) => [...prev, ...data]);
                }

                toast.success("Menu berhasil ditambahkan");
                setCreateDialog(false);
            }
        } catch(err) {
            console.error(err)
        }
    }


    const handleDeleteMenu = async () => {

        try {
            const { data, error } = await supabase.from("menus").delete().eq("id", selectedMenu?.menu.id)
            if(error) console.log(error);
            else {
                if(data) {
                    setMenus((prev) => prev.filter((menu) => menu.id !== selectedMenu?.menu.id));
                }

                toast.success("Menu berhasil dihapus");
                setSelectedMenu(null);
            }
        } catch(err) {
            console.error(err)
        }
    }

    


    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 flex justify-between w-full">
                <h1 className="text-3xl font-bold">Menu</h1>
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                    <DialogTrigger asChild>
                        <Button>Tambah Menu</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Tambah Menu</DialogTitle>
                                <DialogDescription>
                                    Tambah menu baru dengan menambah data di sini.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid w-full gap-4 my-4">
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        name="name"
                                        id="name"
                                        type="text"
                                        placeholder="Nama Menu"
                                    />
                                </div>
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="price">Harga</Label>
                                    <Input
                                        name="price"
                                        id="price"
                                        type="number"
                                        placeholder="Harga Menu"
                                    />
                                </div>
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="image">Gambar</Label>
                                    <Input
                                        name="image"
                                        id="image"
                                        type="text"
                                        placeholder="Masukkan Link Gambar"
                                    />
                                </div>
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="category">Ketegori</Label>
                                    <Select required name="category"> 
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Kategori</SelectLabel>
                                                <SelectItem value="Food">Food</SelectItem>
                                                <SelectItem value="Dessert">Dessert</SelectItem>
                                                <SelectItem value="Coffee">Coffee</SelectItem>
                                                <SelectItem value="Non Coffee">Non Coffee</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="grid w-full gap-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        name="description"
                                        id="description"
                                        className="resize-none h-32"
                                        placeholder="Deskripsi menu"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose className="cursor-pointer mr-4" type="button">Batal</DialogClose>
                                <Button className="cursor-pointer" type="submit">Tambah</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
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
                                                <DropdownMenuItem className="cursor-pointer">Update</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setSelectedMenu({ menu, action: "delete" })} className="cursor-pointer text-red-500">Delete</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

                <Dialog open={selectedMenu !== null && selectedMenu.action === "delete"} onOpenChange={(open) => open !== true && setSelectedMenu(null)}>
                    <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Hapus Menu</DialogTitle>
                                <DialogDescription>
                                    Apakah anda yakin ingin hapus menu {selectedMenu?.menu.name}?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose className="cursor-pointer mr-4" type="button">Batal</DialogClose>
                                <Button className="cursor-pointer" onClick={handleDeleteMenu} variant="destructive" type="button">Hapus</Button>
                            </DialogFooter>
                    </DialogContent>
                </Dialog>
        </div>

    );
}