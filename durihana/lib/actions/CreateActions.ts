"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import prisma from "../db";
import { redirect } from "next/navigation";

export async function createAction(formData: FormData) {

    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const phone = formData.get("phone")?.toString() ?? "";
    const marriageDate = formData.get("marriageDate")?.toString() ?? "";

    // encode passwords
    const hashed = await bcrypt.hash(password, 10);

    
    await prisma.user.create({
        data: {
        name,
        email,
        password: hashed,
        phone,
        marriage_date: marriageDate,
        },
    });

    revalidatePath("/auth/signin");
    redirect("/auth/signin");
}
