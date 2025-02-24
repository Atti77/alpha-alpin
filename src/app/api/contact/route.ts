import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Hiányzó adatok, adja meg az összes kötelező adatot" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Alpha Alpin <onboarding@resend.dev>',
      to: process.env.TO_EMAIL!,
      subject: 'Új kapcsolatfelvételi űrlap kitöltés',
      html: `
        <h2>Új üzenet érkezett a weboldalról</h2>
        <p><strong>Név:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || "Nem adott meg"}</p>
        <p><strong>Üzenet:</strong> ${message || "Nem adott meg"}</p>
      `
    });

    return NextResponse.json(
      { message: "Sikeresen elküldve!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API hiba:", error);
    return NextResponse.json(
      { error: "Hiba az adatok beküldése közben" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}