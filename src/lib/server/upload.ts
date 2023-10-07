import type { SupabaseClient } from '@supabase/supabase-js';

export async function upload(
	supabase: SupabaseClient,
	file: File | ArrayBuffer,
	bucket: string,
	path: string
) {
	return supabase.storage.from(bucket).upload(path, file, {
		cacheControl: '3600',
		upsert: true
	});
}

export async function file_exists(
	supabase: SupabaseClient,
	bucket: string,
	path: string
): Promise<string | false> {
	const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
	if (error || !data) {
		console.log(error);
		return false;
	}
	return data?.signedUrl;
}

export async function delete_file(supabase: SupabaseClient, bucket: string, path: string) {
	// delete file from supabase
	return supabase.storage.from(bucket).remove([path]);
}
