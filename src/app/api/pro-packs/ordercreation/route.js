import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const body = await request.json()
        const { price, id } = body

        if (!price || !id) {
            return NextResponse.json(
                { message: "Price and ID are required" },
                { status: 400 }
            );
        }

        const options = {
            amount: price * 100,
            currency: "INR",
            receipt: id,
        }

        const order = await razorpay.orders.create(options);

        if (!order || !order.id) {
            return NextResponse.json(
                { message: "Order creation failed" },
                { status: 500 }
            );
        }

        return NextResponse.json(order, { status: 200 });
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: "something went wrong while creating order" }, { status: 500 })
    }
}