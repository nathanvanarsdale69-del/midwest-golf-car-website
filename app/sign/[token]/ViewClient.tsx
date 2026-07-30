"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type WaiverInfo = {
  status: string;
  customerName: string;
  startDate: string | null;
  endDate: string | null;
  total: number | null;
  pdfUrl: string | null;
};

export default function ViewClient({ token }: { token: string }) {
  const [waiver, setWaiver] = useState<WaiverInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadWaiver() {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/get-waiver`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Waiver not found");
        setWaiver(data);
      } catch (e: any) {
        setLoadError(e.message || "Could not load this waiver");
      } finally {
        setLoading(false);
      }
    }
    loadWaiver();
  }, [token]);

  if (loading) {
    return (
      <Centered>
        <p>Loading your waiver…</p>
      </Centered>
    );
  }

  if (loadError) {
    return (
      <Centered>
        <h2>Waiver not found</h2>
        <p>{loadError}</p>
        <p>Please contact Midwest Golf Car at (618) 797-2278 for help.</p>
      </Centered>
    );
  }

  if (waiver?.status === "Signed") {
    return (
      <Centered>
        <h2>✓ Already Signed</h2>
        <p>This waiver has already been signed. You're all set!</p>
      </Centered>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={pageInnerStyle}>
        <div style={headerBarStyle}>
          <h1 style={{ fontSize: "1.3rem", margin: 0 }}>
            Midwest Golf Car — Rental Waiver
          </h1>
          <p style={{ color: "#555", margin: "0.35rem 0 0", fontSize: "0.95rem" }}>
            Dear {waiver?.customerName}, please review the full document
            below. When you're ready, continue to sign.
          </p>
          {waiver?.startDate && waiver?.endDate && (
            <div style={detailsRowStyle}>
              <span>
                <strong>Rental:</strong>{" "}
                {new Date(waiver.startDate).toLocaleDateString()} –{" "}
                {new Date(waiver.endDate).toLocaleDateString()}
              </span>
              {waiver.total != null && (
                <span>
                  <strong>Total:</strong> ${waiver.total}
                </span>
              )}
            </div>
          )}
        </div>

        {waiver?.pdfUrl && (
          <iframe
            src={waiver.pdfUrl}
            title="Rental Waiver Document"
            style={pdfEmbedStyle}
          />
        )}

        <div style={signBarStyle}>
          <Link href={`/sign/${token}/complete`} style={continueButtonStyle}>
            Continue to Sign →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...pageStyle, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ ...pageInnerStyle, background: "#fff", borderRadius: "8px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        {children}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  padding: "1.5rem 1rem",
  background: "#EFE9D8",
  fontFamily: "Karla, sans-serif",
};

const pageInnerStyle: React.CSSProperties = {
  maxWidth: "780px",
  width: "100%",
};

const headerBarStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "8px 8px 0 0",
  padding: "1.25rem 1.5rem",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};

const detailsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.5rem",
  marginTop: "0.75rem",
  fontSize: "0.9rem",
  flexWrap: "wrap",
};

const pdfEmbedStyle: React.CSSProperties = {
  width: "100%",
  height: "65vh",
  minHeight: "400px",
  border: "1px solid #ddd",
  borderLeft: "none",
  borderRight: "none",
  display: "block",
  background: "#525659",
};

const signBarStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "0 0 8px 8px",
  padding: "1.25rem 1.5rem",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "center",
};

const continueButtonStyle: React.CSSProperties = {
  padding: "0.9rem 2.5rem",
  background: "#E2921A",
  color: "#12201A",
  border: "none",
  borderRadius: "4px",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
};
