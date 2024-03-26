/**
 * Fetches a chunk of data from the server using the provided chunkId.
 * @param {string} chunkId - The identifier of the chunk to fetch.
 * @returns {Promise<any>} - A promise that resolves with the fetched data.
 * @throws {Error} - If the fetch operation fails or returns an error response.
 */
export async function fetchChunk(chunkId: string): Promise<any> {
  try {
    // Check if chunkId is provided
    if (!chunkId || typeof chunkId !== 'string') {
      throw new Error('Invalid chunkId provided');
    }

    const response = await fetch(
      `http://localhost:3000?chunkId=${encodeURIComponent(chunkId)}`,
    );

    // Check if the response status is not OK
    if (!response.ok) {
      throw new Error(`Failed to fetch chunk with ID ${chunkId}`);
    }

    return response.json();
  } catch (error: any) {
    // Handle any errors during fetch operation
    throw new Error(`Failed to fetch chunk: ${error.message}`);
  }
}