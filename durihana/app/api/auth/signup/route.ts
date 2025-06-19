import { UserValidator } from "@/lib/validator";
import { NextRequest, NextResponse } from "next/server";

export async function POST( request: NextRequest) {
    try {
        const body = await request.json();
        const validator = UserValidator.safeParse(body);

        if(!validator.success) {
            return NextResponse.json (
                { error: validator.error.errors[0].message },
                { status: 400 }
            );
        }

        const {name, email, password, phone, marriageDate } = validator.data;

        
    }
}