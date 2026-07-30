"use client";

import { useEffect, useRef, useState } from "react";

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

export default function SignClient({ token }: { token: string }) {
  const [waiver, setWaiver] = useState<WaiverInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [typedName, setTypedName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasSignature = useRef(false);

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

  // --- Signature pad drawing logic (works with mouse and touch) ---
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing.current = true;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#12201A";
    ctx.lineTo(x, y);
    ctx.stroke();
    hasSignature.current = true;
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature.current = false;
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (!typedName.trim()) {
      setSubmitError("Please type your full name to confirm your signature.");
      return;
    }
    if (!agreed) {
      setSubmitError("Please check the box confirming you agree to the terms.");
      return;
    }
    if (!hasSignature.current) {
      setSubmitError("Please draw your signature in the box above.");
      return;
    }

    setSubmitting(true);
    try {
      const signatureDataUrl = canvasRef.current!.toDataURL("image/png");
      const res = await fetch(`${SUPABASE_URL}/functions/v1/complete-waiver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ token, signatureDataUrl, typedName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit signature");
      setDone(true);
    } catch (e: any) {
      setSubmitError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (waiver?.status === "Signed" || done) {
    return (
      <Centered>
        <h2>✓ Signed</h2>
        <p>
          {done
            ? "Your waiver has been signed. Thank you!"
            : "This waiver has already been signed."}
        </p>
        <p>You're all set for your rental. We'll see you soon!</p>
      </Centered>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>
          Midwest Golf Car — Rental Waiver
        </h1>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>
          Dear {waiver?.customerName}, please review your rental waiver below
          and sign to confirm your reservation.
        </p>

        {waiver?.startDate && waiver?.endDate && (
          <div style={detailsBoxStyle}>
            <div>
              <strong>Rental period:</strong>{" "}
              {new Date(waiver.startDate).toLocaleDateString()} –{" "}
              {new Date(waiver.endDate).toLocaleDateString()}
            </div>
            {waiver.total != null && (
              <div>
                <strong>Total:</strong> ${waiver.total}
              </div>
            )}
          </div>
        )}

        {waiver?.pdfUrl && (
          <a
            href={waiver.pdfUrl}
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            View full waiver document (PDF) →
          </a>
        )}

        <label style={labelStyle}>Type your full legal name</label>
        <input
          type="text"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          placeholder="Jane Smith"
          style={inputStyle}
        />

        <label style={labelStyle}>Draw your signature below</label>
        <canvas
          ref={canvasRef}
          width={500}
          height={150}
          style={canvasStyle}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
        <button onClick={clearSignature} style={clearButtonStyle} type="button">
          Clear
        </button>

        <label style={checkboxRowStyle}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            I have reviewed the waiver above and agree that my typed name and
            drawn signature constitute my legal signature on this document.
          </span>
        </label>

        {submitError && <p style={errorStyle}>{submitError}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={submitButtonStyle}
        >
          {submitting ? "Submitting…" : "Sign & Submit Waiver"}
        </button>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...pageStyle, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={cardStyle}>{children}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  padding: "2rem 1rem",
  background: "#EFE9D8",
  fontFamily: "Karla, sans-serif",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "8px",
  padding: "2rem",
  maxWidth: "560px",
  width: "100%",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};

const detailsBoxStyle: React.CSSProperties = {
  background: "#f5f3ea",
  borderRadius: "6px",
  padding: "1rem",
  marginBottom: "1.25rem",
  fontSize: "0.95rem",
  lineHeight: 1.6,
};

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  marginBottom: "1.5rem",
  color: "#1F3D2B",
  fontWeight: 600,
  textDecoration: "underline",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginTop: "1.25rem",
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "1rem",
};

const canvasStyle: React.CSSProperties = {
  width: "100%",
  height: "150px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  touchAction: "none",
  cursor: "crosshair",
  background: "#fafafa",
};

const clearButtonStyle: React.CSSProperties = {
  marginTop: "0.5rem",
  background: "none",
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "0.3rem 0.8rem",
  fontSize: "0.85rem",
  cursor: "pointer",
};

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "0.6rem",
  marginTop: "1.5rem",
  fontSize: "0.85rem",
  lineHeight: 1.5,
};

const errorStyle: React.CSSProperties = {
  color: "#c0392b",
  fontSize: "0.9rem",
  marginTop: "1rem",
};

const submitButtonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "1.5rem",
  padding: "0.9rem",
  background: "#E2921A",
  color: "#12201A",
  border: "none",
  borderRadius: "4px",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};