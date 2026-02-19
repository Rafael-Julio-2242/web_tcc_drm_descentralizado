import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseAccessToken) {
    throw new Error("Missing Supabase environment variables: SUPABASE_URL or SUPABASE_ACCESS_TOKEN");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAccessToken);
