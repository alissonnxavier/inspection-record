import { Check, BookUser, Ban } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { format } from "date-fns"


type CardProps = React.ComponentProps<typeof Card>

export function SerigraphyDescription(data: any) {

  return (
    <Card className='shadow-lg w-80'>
      <CardHeader>
        <CardTitle>
          <Badge variant='outline' className="flex justify-center m-auto text-4xl p-2 w-full overflow-hidden">
            {data?.data[0]?.item}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div>
          <div
            className="flex justify-between  pt-4 pb-4 last:mb-0 last:pb-0"
          >

            <div className="space-y-1">
              <p className="flex justify-center text-sm font-medium leading-none">
                Revisão
              </p>
              <p className="flex justify-center text-sm text-muted-foreground">
                {data?.data[0]?.version}
              </p>
            </div>
            <Separator orientation="vertical" />
            <div className="space-y-1">
              <p className="flex justify-center text-sm font-medium leading-none">
                ODF
              </p>
              <p className="flex justify-center text-sm text-muted-foreground">
                {data?.data[0]?.odf}
              </p>
            </div>
            <Separator orientation="vertical" />
            <div className="space-y-1">
              <p className=" text-sm font-medium leading-none">
                Quantidade
              </p>
              <p className="flex justify-center text-sm text-muted-foreground">
                {data?.data[0]?.amount}
              </p>
            </div>
          </div>
          <Separator />

          <div
            className="flex justify-between p-4 last:mb-0 last:pb-0"
          >
            <div className="space-y-1">
              <p className="flex justify-center text-sm font-medium leading-none">
                Inspecionado
              </p>
              <p className="flex justify-center text-sm text-muted-foreground">
                {data?.data[0]?.inspected}
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex justify-center text-sm font-medium leading-none">
                Resultado
              </p>
              <p className="flex justify-center text-sm text-muted-foreground">
                {data?.data[0]?.result}
              </p>
            </div>
          </div>
          <Separator />
          <div
            className="flex justify-between pt-4 pb-4 last:mb-0 last:pb-0"
          >
            <Badge variant='secondary' className="m-auto p-2">
              <div className="space-y-1">
                <p className="flex justify-center text-sm font-medium leading-none">
                  Data
                </p>
                <p className="flex justify-center text-sm text-muted-foreground">
                  {format(new Date(data?.data[0]?.createdAt), "dd/MM/yyyy HH:mm")}
                  
                </p>
              </div>
            </Badge>           
          </div>
          <Separator />
          <div className="flex m-auto items-center justify-center pt-8 gap-2">
            <BookUser size={29} />
            <div className="">
              <p className="flex justify-center m-auto text-sm font-medium leading-none">
                Inspetor
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.data[0]?.inspector}
              </p>
            </div>
          </div>




        </div>
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  )
}
