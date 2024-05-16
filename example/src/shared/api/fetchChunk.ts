/**
 * Fetches a chunk of data from the server using the provided chunkId.
 * @param {string} chunkId - The identifier of the chunk to fetch.
 * @returns {Promise<any>} - A promise that resolves with the fetched data.
 * @throws {Error} - If the fetch operation fails or returns an error response.
 */
export async function fetchChunk(chunkId: string): Promise<any> {
  try {
    await new Promise(res => setTimeout(res, 3000));
    // Check if chunkId is provided
    if (!chunkId || typeof chunkId !== 'string') {
      throw new Error('Invalid chunkId provided');
    }

    const response = await fetch(
      `${process.env.RECHUNK_HOST}/chunk/${chunkId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.RECHUNK_PROJECT}:${process.env.RECHUNK_READ_KEY}`,
          )}`,
        },
      },
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
