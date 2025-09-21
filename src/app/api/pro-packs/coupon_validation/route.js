// src/app/api/apply-coupon/route.js
import { NextResponse } from "next/server";
import { google } from "googleapis";

// Initialize Google Sheets client
const getSheetsClient = async () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    throw new Error("Missing Google Sheets configuration in environment variables");
  }

  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64;

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  await auth.authorize();

  return google.sheets({ version: "v4", auth });
};

// Helper: check if coupon is valid now
const isValidDate = (start, end) => {
  const now = new Date();
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;
  return true;
};

// Helper: check if coupon applies to course
const isApplicableCourse = (courses, courseId) => {
  if (!courses || courses.toLowerCase() === "all") return true;
  const list = courses.split(",").map(c => c.trim().toLowerCase());
  return list.includes(courseId?.toLowerCase());
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { couponCode, price, courseId } = body;

    if (!couponCode || !price) {
      return NextResponse.json({ success: false, message: "couponCode and price are required" }, { status: 400 });
    }

    const sheets = await getSheetsClient();
    const sheetName = "Coupons"; // or you can make it dynamic
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A:H`,
    });

    const rows = response.data.values || [];

    if (rows.length < 2) {
      return NextResponse.json({ success: false, message: "No coupons found" }, { status: 404 });
    }

    const header = rows[0].map(h => h.toLowerCase().trim());
    const dataRows = rows.slice(1);

    // Find coupon
    let matchingCoupon = null;
    for (const row of dataRows) {
      const rowData = {};
      header.forEach((h, i) => {
        rowData[h] = row[i] ? row[i].toString().trim() : "";
      });

      if (rowData["coupon"]?.toUpperCase() === couponCode.toUpperCase()) {
        matchingCoupon = rowData;
        break;
      }
    }

    if (!matchingCoupon) {
      return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 404 });
    }

    // Validate dates
    if (!isValidDate(matchingCoupon["start date"], matchingCoupon["end date"])) {
      return NextResponse.json({ success: false, message: "Coupon not valid at this time" }, { status: 400 });
    }

    // Check minimum and maximum order
    const minOrder = parseFloat(matchingCoupon["min order"] || 0);
    const maxOrder = parseFloat(matchingCoupon["maximum order"] || Infinity);
    if (price < minOrder || price > maxOrder) {
      return NextResponse.json({ success: false, message: `Coupon applies for orders between ₹${minOrder} and ₹${maxOrder}` }, { status: 400 });
    }

    // Check course applicability
    if (!isApplicableCourse(matchingCoupon["courses"], courseId)) {
      return NextResponse.json({ success: false, message: "Coupon not applicable for this course" }, { status: 400 });
    }

    // Calculate discount
    const discountType = matchingCoupon["discount type"]?.toLowerCase();
    const discountValue = parseFloat(matchingCoupon["discount"] || 0);
    let finalPrice = price;

    if (discountType === "percentage") {
      finalPrice = price - (price * discountValue) / 100;
    } else if (discountType === "fixed") {
      finalPrice = price - discountValue;
    }

    if (finalPrice < 0) finalPrice = 0;

    return NextResponse.json({
      success: true,
      originalPrice: price,
      finalPrice: Math.round(finalPrice),
      discountApplied: discountValue,
      discountType,
      coupon: matchingCoupon["coupon"]
    });

  } catch (err) {
    console.error("Error applying coupon:", err.message);
    return NextResponse.json({ success: false, message: "Server error", error: err.message }, { status: 500 });
  }
}
