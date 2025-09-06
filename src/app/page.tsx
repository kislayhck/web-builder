import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default  async function Home() {
  return (
    <div>
      <div className="font-bold text-rose-500">
        Welcome to Web Builder!
      </div>
      <Button variant="default">Hello World</Button>
    </div>
  );
}
