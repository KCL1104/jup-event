import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface UseSupabaseSyncReturn {
    syncUser: (walletAddress: string) => Promise<void>
    isLoading: boolean
    error: string | null
}

export function useSupabaseSync(): UseSupabaseSyncReturn {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const syncUser = useCallback(async (walletAddress: string) => {
        if (!supabase) {
            console.warn('Supabase not configured, skipping user sync')
            return
        }

        if (!walletAddress) {
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // First verify wallet address using edge function
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-wallet', {
                body: { wallet_address: walletAddress },
            })

            if (verifyError) {
                console.error('Wallet verification failed:', verifyError)
                setError(verifyError.message)
                return
            }

            if (!verifyData?.valid) {
                console.error('Invalid wallet address:', verifyData?.error)
                setError(verifyData?.error || 'Invalid wallet address')
                return
            }

            console.log('Wallet address verified:', walletAddress)

            // Upsert user after verification
            const { error: upsertError } = await supabase
                .from('users')
                .upsert(
                    {
                        wallet_address: walletAddress,
                        catpurr: true,
                        last_active_at: new Date().toISOString(),
                    },
                    {
                        onConflict: 'wallet_address',
                    }
                )

            if (upsertError) {
                console.error('Failed to sync user to Supabase:', upsertError)
                setError(upsertError.message)
            } else {
                console.log('User synced to Supabase:', walletAddress)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            console.error('Supabase sync error:', errorMessage)
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        syncUser,
        isLoading,
        error,
    }
}
