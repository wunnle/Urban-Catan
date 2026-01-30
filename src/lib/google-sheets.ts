import { google } from "googleapis";
import { SheetRow } from "@/types/registration";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    throw new Error("Missing Google credentials in environment variables");
  }

  // Handle different formats of the private key
  // If the key is wrapped in quotes, remove them first
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }
  
  // Replace literal \n with actual newlines
  privateKey = privateKey.replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: SCOPES,
  });
}

function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

function getSheetId() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID in environment variables");
  }
  return sheetId;
}

// Normalize phone number to 10 digits (5XXXXXXXXX format)
function normalizePhone(phone: string): string {
  // Remove spaces, dashes, and parentheses
  let cleaned = phone.replace(/[\s\-()]/g, "");
  
  // Remove +90, 0090, or leading 0
  if (cleaned.startsWith("+90")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("0090")) {
    cleaned = cleaned.slice(4);
  } else if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }
  
  return cleaned;
}

export async function checkDuplicate(phone: string): Promise<boolean> {
  const sheets = getSheets();
  const sheetId = getSheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!B:B", // Phone numbers are in column B
  });

  const rows = response.data.values || [];
  const normalizedPhone = normalizePhone(phone);

  // Check if phone exists (skip header row)
  return rows.slice(1).some((row) => {
    const existingPhone = normalizePhone(row[0] || "");
    return existingPhone === normalizedPhone;
  });
}

export async function addRegistration(
  name: string,
  phone: string
): Promise<SheetRow> {
  const sheets = getSheets();
  const sheetId = getSheetId();
  const registeredAt = new Date().toISOString();
  const normalizedPhone = normalizePhone(phone);

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A:C",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[name, normalizedPhone, registeredAt]],
    },
  });

  return { name, phone: normalizedPhone, registeredAt };
}

export async function getAllRegistrations(): Promise<SheetRow[]> {
  const sheets = getSheets();
  const sheetId = getSheetId();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A:C",
  });

  const rows = response.data.values || [];

  // Skip header row and map to objects
  return rows.slice(1).map((row) => ({
    name: row[0] || "",
    phone: row[1] || "",
    registeredAt: row[2] || "",
  }));
}
