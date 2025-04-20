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


type CardProps = React.ComponentProps<typeof Card>

export function PlateDescription(data: any) {

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
              <p className="text-sm font-medium leading-none">
                Fornecedor
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.data[0]?.supplier}
              </p>
            </div>
            <Separator orientation="vertical" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Lote
              </p>
              <p className="flex justify-center text-sm text-muted-foreground">
                {data?.data[0]?.lot}
              </p>
            </div>
            <Separator orientation="vertical" />
            <div className="space-y-1">
              <p className=" text-sm font-medium leading-none">
                Nota Fiscal
              </p>
              <p className="flex justify-center text-sm text-muted-foreground">
                {data?.data[0]?.invoice}
              </p>
            </div>
          </div>
          <Separator />

          <div
            className="flex justify-center pt-4 pb-4 last:mb-0 last:pb-0"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                RIR
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.data[0]?.rir}
              </p>
            </div>
          </div>
          <Separator />
          <div
            className="flex justify-between pt-4 pb-4 last:mb-0 last:pb-0"
          >
            <Badge variant='secondary' className="p-2">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  HB 1
                </p>
                <p className="text-sm text-muted-foreground">
                  {data?.data[0]?.hbOne}
                </p>
              </div>
            </Badge>
            <Badge variant='secondary' className="p-2">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  HB 2
                </p>
                <p className="text-sm text-muted-foreground">
                  {data?.data[0]?.hbTwo}
                </p>
              </div>
            </Badge>
            <Badge variant='secondary' className="p-2">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  HB 3
                </p>
                <p className="text-sm text-muted-foreground">
                  {data?.data[0]?.hbThree}
                </p>
              </div>
            </Badge>
          </div>
          <Separator />
          <div className="flex m-auto items-center justify-center pt-8 gap-2">
          <BookUser size={29}/>
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
