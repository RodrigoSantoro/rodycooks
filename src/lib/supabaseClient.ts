import { createClient } from '@supabase/supabase-js'
import { Database } from '@src/types/supabase'

export const supabase = createClient<Database>(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SECRET_KEY || ''
)
