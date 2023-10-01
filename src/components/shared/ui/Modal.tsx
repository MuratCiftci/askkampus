import React from "react";
import { Dialog } from "@material-tailwind/react";
import Image from "next/image";
import { Button } from "./Button";
import InfoCircle from "../icons/InfoCircle";
type ModalProps = {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  handleDelete: () => void;
};
export function Modal({
  open,
  handleClose,
  handleOpen,
  handleDelete,
}: ModalProps) {
  return (
    <>
      <Dialog open={open} size="sm" handler={handleOpen}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto rounded-lg bg-white p-12 text-center text-2xl font-bold text-gray-900 dark:text-white lg:text-2xl">
          Silmek istediğinize emin misiniz?
          <InfoCircle />
          <div className="text text-center text-lg text-gray-500 dark:text-gray-400">
            Silinen yorumlar geri alınamaz.
          </div>
        </div>

        <div className="flex h-full w-full flex-row items-center justify-center gap-4 overflow-y-auto rounded-lg bg-white pb-10 text-center text-2xl font-bold text-gray-900 dark:text-white lg:text-2xl">
          <Button
            variant="destructive"
            color="red"
            onClick={handleClose}
            className="mr-1"
          >
            <span>Hayır, İptal</span>
          </Button>
          <Button variant="success" color="green" onClick={handleDelete}>
            <span>Evet, Sil</span>
          </Button>
        </div>
      </Dialog>
    </>
  );
}
