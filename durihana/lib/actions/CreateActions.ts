"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import prisma from "../db";

export async function createAction(formData: FormData) {

  // 1) 폼데이터에서 값 꺼내기
  const name = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const phone = formData.get("phone")?.toString() ?? "";
  const marriageDate = formData.get("marriageDate")?.toString() ?? "";

  // 2) 비밀번호 해시
  const hashed = await bcrypt.hash(password, 10);

  // 4) DB에 직접 INSERT
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      phone,
      marriage_date: marriageDate,
    },
  });

  // 5) (선택) 가입 후 관련 페이지 캐시 무효화
  revalidatePath("/auth/signin");
}
