import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return new Response(JSON.stringify({ error: "No reference provided" }), { status: 400 });
  }

  try {
    const { data } = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
