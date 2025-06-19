import { createAction, emailCrossCheck } from "@/lib/actions/CreateActions";
import { UserValidator } from "@/lib/validator";
import { NextRequest, NextResponse } from "next/server";

export async function POST( request: NextRequest) {
    try {
        const body = await request.json();
        const validator = UserValidator.safeParse(body);

        if(!validator.success) {
            return NextResponse.json (
                { error: validator.error.errors[0].message },
                { status: 400 },
            );
            console.log("validator failed");
        }

        const {name, email, password, phone, marriageDate } = validator.data;

        const emailExists = await emailCrossCheck(email);
        if(emailExists) {
            return NextResponse.json(
                { error: '이미 사용중인 이메일입니다.'},
                { status: 400},
            )
        }

        const user = await createAction(name, email, password, phone, marriageDate);

        return NextResponse.json({
            message: '회원가입이 완료되었습니다.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                marriageDate: user.marriage_date
            },
        }, {status: 201});
    } catch (error) {
        console.log("🚀 ~ POST ~ error:", error)
        return NextResponse.json(
            {error: '회원가입 중 오류가 발생했습니다.'},
            {status: 500},
        )
    }
}