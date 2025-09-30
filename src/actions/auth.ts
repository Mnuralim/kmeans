"use server";

import prisma from "@/lib/prisma";
import type { ROLE } from "@prisma/client";
import { compare } from "bcryptjs";
import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";

export async function login(
  prevState: FormState,
  formDate: FormData
): Promise<FormState> {
  const username = formDate.get("username") as string;
  const password = formDate.get("password") as string;
  const role = formDate.get("role") as ROLE;

  if (!username || !password) {
    return {
      error: "Username dan password harus diisi",
    };
  }

  if (role !== "ADMIN" && role !== "HEAD_MASTER") {
    return {
      error: "Role tidak valid",
    };
  }

  let existingUser = null;

  if (role === "HEAD_MASTER") {
    existingUser = await prisma.user.findFirst({
      where: {
        username,
        role: "HEAD_MASTER",
      },
    });
  } else {
    existingUser = await prisma.user.findFirst({
      where: {
        username,
        role: "ADMIN",
      },
    });
  }

  if (!existingUser) {
    return {
      error: "User tidak ditemukan",
    };
  }

  const matchPassword = await compare(password, existingUser.password);

  if (!matchPassword) {
    return {
      error: "Password salah",
    };
  }

  await createSession(existingUser.id, username, role);
  return {
    error: null,
  };
}

export async function logOut() {
  await deleteSession();
  redirect("/login");
}
