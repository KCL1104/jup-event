// Supabase Edge Function: Save Drift History
// Appends drift operation results to user's drift_hist field

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface DriftHistoryRequest {
    wallet_address: string
    drift_result: {
        success: boolean
        timestamp: string
        shortAmount?: number
        depositAmount?: number
        error?: string
        [key: string]: unknown
    }
}

interface DriftHistoryResponse {
    success: boolean
    error?: string
}

serve(async (req) => {
    // CORS headers for all responses
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        })
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
            {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            }
        )
    }

    try {
        const body: DriftHistoryRequest = await req.json()

        // Validate request
        if (!body.wallet_address || typeof body.wallet_address !== 'string') {
            return new Response(
                JSON.stringify({ success: false, error: 'wallet_address is required' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders,
                    },
                }
            )
        }

        if (!body.drift_result || typeof body.drift_result !== 'object') {
            return new Response(
                JSON.stringify({ success: false, error: 'drift_result is required' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders,
                    },
                }
            )
        }

        // Use service_role key to bypass RLS
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

        // First, get the current drift_hist for the user
        const { data: userData, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('drift_hist')
            .eq('wallet_address', body.wallet_address.trim())
            .single()

        if (fetchError) {
            console.error('Failed to fetch user:', fetchError)
            return new Response(
                JSON.stringify({ success: false, error: `User not found: ${fetchError.message}` }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders,
                    },
                }
            )
        }

        // Append the new result to the existing history (or create new array)
        const existingHistory = userData?.drift_hist || []
        const newHistory = Array.isArray(existingHistory)
            ? [...existingHistory, body.drift_result]
            : [body.drift_result]

        // Update the user's drift_hist
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
                drift_hist: newHistory,
                last_active_at: new Date().toISOString(),
            })
            .eq('wallet_address', body.wallet_address.trim())

        if (updateError) {
            console.error('Failed to update drift_hist:', updateError)
            return new Response(
                JSON.stringify({ success: false, error: `Failed to save: ${updateError.message}` }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders,
                    },
                }
            )
        }

        console.log('Drift history saved for:', body.wallet_address)
        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                },
            }
        )
    } catch (err) {
        return new Response(
            JSON.stringify({
                success: false,
                error: `Invalid request: ${err instanceof Error ? err.message : 'Unknown error'}`
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        )
    }
})
