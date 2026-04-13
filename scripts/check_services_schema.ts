import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Parse .env.local manually
const envContent = fs.readFileSync(".env.local", "utf8");
const env: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].replace(/^"|"$/g, "").trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from("services").select("*").limit(1);
  console.log("Services schema sample:", data?.[0] || error);
}

check();
