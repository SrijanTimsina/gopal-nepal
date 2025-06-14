export async function revalidateEntireSite() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    return { success: true, message: 'Site Revalidated Successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error while revalidating' };
  }
}
