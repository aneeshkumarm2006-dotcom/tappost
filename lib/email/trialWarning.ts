// lib/email/trialWarning.ts
// ─── Trial Warning Email ────────────────────────────────────────────────────
// ⚠️  DEFERRED TO PHASE C — requires RESEND_API_KEY
// Code is fully written and ready to activate. See Stage 16 and 3.6 in TODO.md.
//
// This utility:
//   1. Accepts a bar document (or minimal data shape)
//   2. Sends a day-6 trial expiry warning via Resend
//
// How to activate:
//   1. Add RESEND_API_KEY to .env.local
//   2. Uncomment the Resend import and usage below
//   3. Set up the cron route at /api/cron/trial-warning (see Stage 16.2)

// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrialWarningInput {
  barName: string;
  ownerEmail: string;
  trialEndsAt: Date;
  upgradeUrl?: string;
}

// ─── Email Template ───────────────────────────────────────────────────────────

function buildTrialWarningHtml(input: TrialWarningInput): string {
  const { barName, trialEndsAt, upgradeUrl = 'https://tappost.io/pricing' } = input;
  const expiryDateStr = trialEndsAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your TapPost trial ends tomorrow</title>
  <style>
    body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; padding: 40px; border: 2px solid rgba(255,255,255,0.1); background: #111; }
    .logo { font-family: sans-serif; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; margin-bottom: 32px; }
    .logo-post { color: #B5FF4D; }
    .headline { font-family: sans-serif; font-size: 40px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; line-height: 0.9; margin-bottom: 24px; }
    .body { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 32px; }
    .expiry { color: #FF9F0A; font-weight: bold; }
    .cta { display: inline-block; background: #B5FF4D; color: #000; font-family: sans-serif; font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; padding: 16px 32px; text-decoration: none; }
    .footer { margin-top: 40px; font-size: 11px; color: rgba(255,255,255,0.2); border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">TAP<span class="logo-post">POST</span>&#9632;</div>
    <div class="headline">YOUR TRIAL<br/>ENDS TOMORROW.</div>
    <p class="body">
      Hey ${barName},<br/><br/>
      Your 7-day free trial expires on <span class="expiry">${expiryDateStr}</span>.<br/><br/>
      Upgrade now to keep generating AI posters and captions for your specials — 
      and keep filling seats.
    </p>
    <a href="${upgradeUrl}" class="cta">UPGRADE NOW →</a>
    <div class="footer">
      You're receiving this because you signed up for a TapPost trial.<br/>
      TapPost · tappost.io
    </div>
  </div>
</body>
</html>`;
}

// ─── Send Function ────────────────────────────────────────────────────────────

export async function sendTrialWarningEmail(input: TrialWarningInput): Promise<void> {
  const { ownerEmail, barName } = input;

  if (!process.env.RESEND_API_KEY) {
    // Phase A/B: log stub instead of sending
    console.log(`[STUB] Trial warning email would be sent to: ${ownerEmail} for bar: ${barName}`);
    return;
  }

  // Phase C: Uncomment when RESEND_API_KEY is set
  // const { data, error } = await resend.emails.send({
  //   from: 'TapPost <noreply@tappost.io>',
  //   to: [ownerEmail],
  //   subject: `⚠️ ${barName} — your TapPost trial ends tomorrow`,
  //   html: buildTrialWarningHtml(input),
  // });
  //
  // if (error) {
  //   console.error('[sendTrialWarningEmail] Resend error:', error);
  //   throw new Error(`Failed to send trial warning email: ${error.message}`);
  // }
  //
  // console.log('[sendTrialWarningEmail] Sent:', data?.id);

  // Fallback stub until Phase C
  console.log(`[STUB] Trial warning email would be sent to: ${ownerEmail} for bar: ${barName}`);
  console.log('[STUB] HTML preview:', buildTrialWarningHtml(input).substring(0, 100) + '...');
}

// ─── Export html builder for testing ─────────────────────────────────────────
export { buildTrialWarningHtml };
