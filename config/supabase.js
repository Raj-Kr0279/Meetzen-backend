const { createClient } = require("@supabase/supabase-js");

exports.supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

