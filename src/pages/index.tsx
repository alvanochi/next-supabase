import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
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

  console.log(menus)
  

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}