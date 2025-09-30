"use server";

import prisma from "@/lib/prisma";
import { setToStartOfDay } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPayment(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id") as string;
  const nis = formData.get("nis") as string;
  const paymentDate = formData.get("paymentDate") as string;

  try {
    if (!id || !nis || !paymentDate) {
      throw new Error("Data tidak lengkap");
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!existingPayment) {
      throw new Error("Pembayaran tidak ditemukan");
    }

    if (existingPayment.status === "LUNAS") {
      throw new Error("Pembayaran sudah dibayar");
    }

    const baseDate = new Date(paymentDate);
    const standardizedDate = setToStartOfDay(baseDate);

    await prisma.payment.update({
      where: {
        id,
      },
      data: {
        status: "LUNAS",
        paymentDate: standardizedDate,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "Terjadi kesalahan saat membuat pembayaran",
      };
    }
  }

  revalidatePath("/payments", "layout");
  revalidatePath("/reports");
  redirect(`/payments/${nis}?success=1&message=Pembayaran berhasil dibuat`);
}
