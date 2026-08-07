export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    // PRODUCTION: Verify signature with Razorpay SDK server-side
    if (!razorpay_payment_id || !razorpay_signature) {
      return Response.json({ verified: false }, { status: 400 });
    }

    // Simulated server verification success
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const token = `premium-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return Response.json({
      verified: true,
      token,
      expiresAt,
      message: "Premium unlocked for 24 hours",
    });
  } catch (e) {
    return Response.json({ verified: false, error: "Server error" }, { status: 500 });
  }
}
