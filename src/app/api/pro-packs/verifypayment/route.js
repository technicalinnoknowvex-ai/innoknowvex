import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(request) {
    const body = await request.json()
    const { order_id, payment_id, signature } = body

    const secretKey = process.env.RAZORPAY_KEY_SECRET

    const hmac = crypto.createHmac("sha256", secretKey)
    hmac.update(order_id + "|" + payment_id)

    const generatedSignature = hmac.digest("hex")

    if (generatedSignature === signature) {
        return NextResponse.json({ success: true, message: "payemnt verified" }, { status: 200 })
    }
    else {
        return NextResponse.json({ success: false, message: "payemnt failed" }, { status: 400 })
    }
}