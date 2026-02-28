import PocketBase from 'pocketbase';
const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE!);
import { Cookies } from '@sveltejs/kit';
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const otp = data.get('otp');
		const req = await pb.collection('users').requestOTP(email);
	},
    otpverify: async({}) => {
        
    }

};
