import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 3000;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Invalid request." }),
        {
          status: 415,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await request.json();

    const {
      name,
      email,
      message,
      website,
      startedAt,
      turnstileToken,
    } = body ?? {};


    // HONEYPOT
    // 정상 사용자는 이 필드를 볼 수 없음.
    // 봇이 채우면 실제 메일을 보내지 않고 성공한 것처럼 종료.
    if (
      typeof website === "string" &&
      website.trim() !== ""
    ) {
      return new Response(
        JSON.stringify({ ok: true }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    // 너무 빠른 제출 차단
    const started = Number(startedAt);

    if (
      !Number.isFinite(started) ||
      Date.now() - started < 3000
    ) {
      return new Response(
        JSON.stringify({
          error: "Please try again.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    // 기본 입력 검증
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing fields.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();


    if (
      cleanName.length < 1 ||
      cleanName.length > MAX_NAME_LENGTH
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid name.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      cleanEmail.length < 3 ||
      cleanEmail.length > MAX_EMAIL_LENGTH ||
      !emailPattern.test(cleanEmail)
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid email.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    if (
      cleanMessage.length < 3 ||
      cleanMessage.length > MAX_MESSAGE_LENGTH
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid message.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    // CLOUDFLARE TURNSTILE 검증
    if (
      typeof turnstileToken !== "string" ||
      !turnstileToken
    ) {
      return new Response(
        JSON.stringify({
          error: "Verification failed.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const turnstileSecret =
      import.meta.env.TURNSTILE_SECRET_KEY;

    if (!turnstileSecret) {
      console.error(
        "TURNSTILE_SECRET_KEY missing"
      );

      return new Response(
        JSON.stringify({
          error: "Server configuration error.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const verifyBody = new FormData();

    verifyBody.append(
      "secret",
      turnstileSecret
    );

    verifyBody.append(
      "response",
      turnstileToken
    );

    if (clientAddress) {
      verifyBody.append(
        "remoteip",
        clientAddress
      );
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: verifyBody,
      }
    );

    const turnstileResult =
      await turnstileResponse.json();

    if (!turnstileResult.success) {
      return new Response(
        JSON.stringify({
          error: "Verification failed.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    // RESEND
    const resendKey =
      import.meta.env.RESEND_API_KEY;

    if (!resendKey) {
      console.error("RESEND_API_KEY missing");

      return new Response(
        JSON.stringify({
          error: "Server configuration error.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resend = new Resend(resendKey);


    // HTML injection 방지
    const escapeHtml = (value: string) =>
      value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const safeName =
      escapeHtml(cleanName);

    const safeEmail =
      escapeHtml(cleanEmail);

    const safeMessage =
      escapeHtml(cleanMessage)
        .replaceAll("\n", "<br />");


    const { error } =
      await resend.emails.send({
        from:
          "Juho Lee Website <message@juholee.net>",

        to: [
          "juholee.studio@gmail.com",
        ],

        replyTo: cleanEmail,

        subject:
          `Website message from ${cleanName}`,

        html: `
          <div
            style="
              font-family: Arial, Helvetica, sans-serif;
              font-size: 15px;
              line-height: 1.5;
              color: #111;
            "
          >
            <p>
              <strong>Name</strong><br />
              ${safeName}
            </p>

            <p>
              <strong>Email</strong><br />
              ${safeEmail}
            </p>

            <p>
              <strong>Message</strong><br />
              ${safeMessage}
            </p>

            <hr
              style="
                margin-top: 30px;
                border: 0;
                border-top: 1px solid #ddd;
              "
            />

            <p
              style="
                color: #777;
                font-size: 12px;
              "
            >
              Sent from juholee.net
            </p>
          </div>
        `,
      });


    if (error) {
      console.error(error);

      return new Response(
        JSON.stringify({
          error:
            "Message could not be sent.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    return new Response(
      JSON.stringify({
        ok: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {

    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Something went wrong.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};