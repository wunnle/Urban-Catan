import { NextRequest, NextResponse } from "next/server";
import { checkDuplicate, addRegistration } from "@/lib/google-sheets";
import { RegistrationData, RegistrationResponse } from "@/types/registration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, website } = body as RegistrationData & { website?: string };

    // Honeypot check - if filled, silently reject (likely a bot)
    if (website) {
      // Return success to not alert the bot, but don't actually register
      return NextResponse.json<RegistrationResponse>(
        { success: true, message: "Turnuvaya başarıyla kaydoldunuz!" },
        { status: 201 }
      );
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json<RegistrationResponse>(
        { success: false, message: "İsim gerekli" },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json<RegistrationResponse>(
        { success: false, message: "Telefon numarası gerekli" },
        { status: 400 }
      );
    }

    // Validate Turkish phone number format
    const cleaned = phone.replace(/[\s\-]/g, "");
    const turkishMobileRegex = /^(\+90|0090|0)?5[0-9]{9}$/;
    if (!turkishMobileRegex.test(cleaned)) {
      return NextResponse.json<RegistrationResponse>(
        { success: false, message: "Geçerli bir telefon numarası girin" },
        { status: 400 }
      );
    }

    // Check for duplicate registration
    const isDuplicate = await checkDuplicate(phone.trim());

    if (isDuplicate) {
      return NextResponse.json<RegistrationResponse>(
        {
          success: false,
          message: "Bu telefon numarası zaten turnuvaya kayıtlı",
        },
        { status: 409 }
      );
    }

    // Add the registration
    await addRegistration(name.trim(), phone.trim());

    return NextResponse.json<RegistrationResponse>(
      {
        success: true,
        message: "Turnuvaya başarıyla kaydoldunuz!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json<RegistrationResponse>(
      {
        success: false,
        message: "Bir hata oluştu. Lütfen tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}
