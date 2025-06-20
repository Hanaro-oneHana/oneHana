import { signInValidator, UserValidator } from "@/lib/validator";
import { describe, expect, it } from "vitest";

describe('signIn', () => {
    it('pass', () => {
        const sampleData = { email: 'test@gmail.com', password: '12345678'};
        const result = signInValidator.safeParse(sampleData);
        expect(result.success).toBe(true);
    });

    it('reject email', () => {
        const sampleData = { email: 'test@gma', password: '12345678'};
        const result = signInValidator.safeParse(sampleData);
        expect(result.success).toBe(false);
    });

    it('reject password', () => {
        const sampleData = { email: 'test@gmail.com', password: '1234'};
        const result = signInValidator.safeParse(sampleData);
        expect(result.success).toBe(false);
    });
});

describe('signup', () => {
    const valid = {
        name: '홍길동',
        email: 'test@gmail.com',
        password: '12345678',
        phone: '010-1234-1234',
        marriageDate: '2026-01-01',
    };

    it('pass', () => {
        const result = UserValidator.safeParse(valid);
        expect(result.success).toBe(true);
    });

    for(const fails of ['name', 'email', 'password', 'phone', 'marriageDate'] as const) {
        it(`reject ${fails}`, () =>{
            const rejectInput = {...valid, [fails] : ''};
            const result = UserValidator.safeParse(rejectInput);
            expect(result.success).toBe(false);
            expect(result.error?.formErrors.fieldErrors[fails]).toBeDefined();
        });
    }
});