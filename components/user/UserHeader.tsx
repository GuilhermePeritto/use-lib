import { useRouter } from "next/navigation";

interface UserHeaderProps {
  title: string;
  description: string;
}

export function UserHeader({ title, description }: UserHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}