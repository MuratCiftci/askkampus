/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { GoogleIcon } from "~/components/shared/icons/Google";
import { Button } from "~/components/shared/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/shared/ui/Dialog";
import { signIn } from "next-auth/react";


export const Login = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Giriş Yap</DialogTitle>
          <DialogDescription>
            Giriş yapıp gönderileri beğenebilir, yorum yapabilir ve insanlarla iletişime geçebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 items-center">
          <div className="grid grid-cols-4 items-center gap-4">
            
            <Button variant="outline" className="flex items-center justify-start col-span-3" onClick={ () => signIn() }> 
              <GoogleIcon />
               <span className="ml-3">Google ile giriş yap</span>
            </Button>
          </div>
         
        </div>
         
      </DialogContent>
    </Dialog>
  );
};
