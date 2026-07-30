const encoder = new TextEncoder();

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function createSignature(
  slug: string,
  secret: string
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(slug)
  );

  return bytesToHex(signature);
}

export async function createProductionToken(
  slug: string,
  secret: string
): Promise<string> {
  return createSignature(slug, secret);
}

export async function verifyProductionToken(
  slug: string,
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const expectedToken = await createSignature(slug, secret);

  if (token.length !== expectedToken.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < token.length; index += 1) {
    difference |=
      token.charCodeAt(index) ^
      expectedToken.charCodeAt(index);
  }

  return difference === 0;
}