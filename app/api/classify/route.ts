import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Since we don't have a Gemini API key (as per our plan), 
    // we are going to return a simulated classification response.
    // In production, this route would convert the File to base64 and send to Gemini Vision.

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const categories = ['pothole', 'garbage', 'streetlight', 'water_leak'];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const randomSev = Math.floor(Math.random() * 8) + 2; // 2 to 9

    return NextResponse.json({
      success: true,
      data: {
        category: randomCat,
        severity: randomSev,
        confidence: 0.94,
        description: `Simulated analysis of image: ${image.name}`
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
