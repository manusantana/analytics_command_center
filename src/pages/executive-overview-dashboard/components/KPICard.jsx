import React from "react";
import clsx from "clsx";

const toNum = (x, def = 0) => {
  const n = typeof x === "number" ? x : parseFloat(String(x ?? "").replace(/[, %]/g, ""));
  return Number.isFinite(n) ? n : def;
};

const fmtValue = (v, format = "number", unit = "") => {
  const n = toNum(v, 0);
  if (format === "currency") {
    return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
  }
  if (format === "percentage") {
    return `${n.toLocaleString("es-ES", { maximumFractionDigits: 2 })}%`;
  }
  if (format === "decimal") {
    return `${n.toLocaleString("es-ES", { maximumFractionDigits: 2 })}${unit || ""}`;
  }
  // "number"
  return n.toLocaleString("es-ES", { maximumFractionDigits: 0 });
};

export default function KPICard({
  title = "KPI",
  value = 0,
  previousValue = 0,
  target = null,
  format = "number",
  unit = "",
  sparklineData = [],
}) {
  const v = toNum(value, 0);
  const prev = toNum(previousValue, 0);
  const diff = prev !== 0 ? ((v - prev) / Math.abs(prev)) * 100 : 0;
  const trendClass = clsx(
    "text-sm font-medium",
    diff > 0 ? "text-success" : diff < 0 ? "text-error" : "text-muted-foreground"
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-foreground">
        {fmtValue(v, format, unit)}
      </div>
      <div className={clsx("mt-1", trendClass)}>
        {`${diff > 0 ? "+" : ""}${toNum(diff).toLocaleString("es-ES", { maximumFractionDigits: 2 })}%`}
      </div>

      {/* Opcional: evita romper si sparklineData viene mal */}
      {/* <div className="mt-3 text-xs text-muted-foreground">Mini gráfico aquí</div> */}
    </div>
  );
}
