import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
	publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
	privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
	urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

const uploadImage = async (movieName, file) => {
	const result = await imagekit.files.upload({
		file: await toFile(file.buffer),
		fileName: `${movieName}_poster`,
		folder: "/movies",
	});

	return result.url;
};

export const deleteImage = async (imageUrl) => {
	if (!imageUrl) return;

	// Extract the file path from the ImageKit URL to search for it
	const urlEndpoint = process.env.IMAGE_KIT_URL_ENDPOINT.replace(/\/$/, "");
	const filePath = imageUrl.replace(urlEndpoint, "");

	const files = await imagekit.files.list({ searchQuery: `filePath = "${filePath}"` });
	if (files.length > 0) {
		await imagekit.files.deleteFile(files[0].fileId);
	}
};

export default uploadImage;
