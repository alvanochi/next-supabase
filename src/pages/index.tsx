import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
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
      <h1 className="text-3xl font-bold mb-4">Menu</h1>
      <div className="grid-cols-1 lg:grid-cols-3 gap-4 grid">
        {menus.map((menu) => (
          <Card key={menu.id}>
            <CardContent>
              <Image
                src={menu.image}
                alt={menu.name}
                width={500}
                height={500}
              />
              <div className="mt-4 flex justify-between">
                <div className="">
                  <h4 className="font-semibold text-xl">{menu.name}</h4>
                  <p>{menu.category}</p>
                </div>
                  <p className="font-semibold text-xl">Rp{menu.price?.toLocaleString("id-ID")}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/menu/${menu.id}`}>
                <Button className="w-full font-bold cursor-pointer" size={"lg"}>Detail Menu</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}