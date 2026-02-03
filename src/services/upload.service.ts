export interface UploadResponse {
    url: string;
    fileId: string;
    type: string;
    format: string;
    size: string;
    createdAt: string;
}

export class UploadService {
    static #baseUrl = "https://enderchest.vercel.app/api/v1/assets";

    static async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(this.#baseUrl, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to upload file");
            }

            return await response.json();
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    }
}
