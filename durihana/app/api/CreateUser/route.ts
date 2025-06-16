import prisma from '@/lib/db'
import { NextResponse } from 'next/server'


export async function POST(request: Request) {
    const { name, email, password, phone, marriageDate } = await request.json()

    if (!email || !password || !phone) {
        return NextResponse.json(
            { success: false, error: '필수 필드가 누락되었습니다.' },
            { status: 400 }
        )
    }

    try {
        const user = await prisma.user.create({
        data: { name, email, password, phone, marriage_date: marriageDate },
    })
    return NextResponse.json({ success: true, userId: user.id })
    } 
    catch (err: any) {
        console.error('CreateUser API Error:', err)
        return NextResponse.json(
            { success: false, error: err.message || '서버 오류' },
            { status: 500 }
        )
    }
}
