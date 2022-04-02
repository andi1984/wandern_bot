import { createClient as _createClient } from "@supabase/supabase-js";

const createClient = () => {
    // Create a single supabase client for interacting with your database
    return _createClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_KEY as string
    );
}

export default createClient;