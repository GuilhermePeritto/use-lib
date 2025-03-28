import { CardContent } from "./ui/card"
import UseCard from "./UseCard"

export const WithoutPermission = () => {
    return (
        <div className="container mx-auto py-8 px-4">
        <UseCard>
          <CardContent className="p-2">
            <p className="text-center text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </UseCard>
      </div>
    )
}