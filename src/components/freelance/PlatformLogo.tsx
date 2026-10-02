"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./directory.module.css";

export function PlatformLogo({ name, logo, large = false }: { name: string; logo?: { path: string }; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <span className={`${styles.logo} ${large ? styles.logoLarge : ""}`} aria-hidden="true">
    {logo && !failed ? <Image src={logo.path} alt="" width={32} height={32} unoptimized onError={() => setFailed(true)} /> : <span>{name.split(" ").map(w => w[0]).join("").slice(0, 3)}</span>}
  </span>;
}
