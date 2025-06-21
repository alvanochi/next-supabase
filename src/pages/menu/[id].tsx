import { Button } from "@/components/ui/button";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetailMenu() {
    const router = useRouter();

    const [menu, setMenu] = useState<IMenu | null>(null);

    useEffect(() => {
        if(router.query.id) {
            const fetchMenu = async () => {
                const { data, error } = await supabase.from("menus").select("*").eq("id", router.query.id).single();
                if(error) console.log(error);
                else setMenu(data);
            }
            fetchMenu()
        }
    }, [router.query.id])
    

    return(
        <div className="container mx-auto py-8">
            <div className="flex-gap-16">
                {menu && (
                    <div className="flex gap-16 items-center w-full">
                        <div className="w-1/2">
                            <Image src={menu.image} alt={menu.name} width={1080} height={1080} className="w-full object-cover rounded-2xl h-[70vh]" />
                        </div>
                        <div className="w-1/2">
                            <h1 className="text-5xl font-bold mb-4">{menu.name}</h1>
                            <p className="text-xl mb-4 text-neutral-500">{menu.description}</p>
                            <div className="flex justify-between gap-4 items-center">
                                <p className="text-4xl font-bold">Rp {menu.price.toLocaleString('id-ID')}</p>
                                <Button className="text-lg font-bold py-6" size={"lg"}>Beli Sekarang</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}