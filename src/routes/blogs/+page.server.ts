import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE!);

export const load = async () => {
	try {
		const posts = await pb.collection('posts').getFullList({ sort: '-created' });
		return { posts };
	} catch {
		return { posts: [] };
	}
};
