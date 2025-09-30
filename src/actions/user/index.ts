"use server";

import prisma from "@/lib/prisma";
import { getSession } from "../session";
import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
      isActive: true,
    },
  });
}

export async function updateUser(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const username = formData.get("username") as string;
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!username) {
      return {
        error: "Username harus diisi",
      };
    }

    const session = await getSession();
    const user = await getUser(session!.userId);

    if (!user) {
      return {
        error: "User tidak ditemukan",
      };
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: username,
        isActive: true,
      },
    });

    if (existingUsername && existingUsername.id !== session!.userId) {
      return {
        error: "Username sudah digunakan",
      };
    }

    if (/\s/.test(username.toString())) {
      return {
        error: "Username tidak boleh mengandung spasi",
      };
    }

    let currentPassword = user.password;

    if (oldPassword && newPassword && confirmPassword) {
      const passwordMatch = await compare(oldPassword, currentPassword);

      if (!passwordMatch) {
        return {
          error: "Password lama salah",
        };
      }

      if (newPassword.length < 6) {
        return {
          error: "Password minimal 6 karakter",
        };
      }

      if (newPassword !== confirmPassword) {
        return {
          error: "Password dan Konfirmasi Password harus sama",
        };
      }

      currentPassword = await hash(newPassword, 10);
    }

    await prisma.user.update({
      where: {
        id: session!.userId,
      },
      data: {
        username,
        password: currentPassword,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Terjadi kesalahan",
    };
  }

  revalidatePath("/settings");
  redirect("/settings");
}
