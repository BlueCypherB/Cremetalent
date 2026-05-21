import { supabase } from '@/lib/supabase'
import type { JobListing, JobListingInsert, JobListingUpdate } from '@/lib/database.types'

export async function getClientJobs(clientId: string): Promise<JobListing[]> {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getOpenJobs(): Promise<(JobListing & { client_accounts: { company_name: string } | null })[]> {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*, client_accounts(company_name)')
    .eq('status', 'open')
    .order('published_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as (JobListing & { client_accounts: { company_name: string } | null })[]
}

export async function getJobById(id: string): Promise<(JobListing & { client_accounts: { company_name: string; website: string | null } | null }) | null> {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*, client_accounts(company_name, website)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as unknown as (JobListing & { client_accounts: { company_name: string; website: string | null } | null }) | null
}

export async function createJob(payload: Omit<JobListingInsert, 'client_id'>, clientId: string): Promise<JobListing> {
  const { data, error } = await supabase
    .from('job_listings')
    .insert({ ...payload, client_id: clientId, status: 'draft' })
    .select()
    .single()
  if (error) throw error
  return data as JobListing
}

export async function updateJob(id: string, payload: JobListingUpdate): Promise<JobListing> {
  const { data, error } = await supabase
    .from('job_listings')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as JobListing
}

export async function publishJob(id: string): Promise<void> {
  const { error } = await supabase
    .from('job_listings')
    .update({ status: 'open', published_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function closeJob(id: string): Promise<void> {
  const { error } = await supabase
    .from('job_listings')
    .update({ status: 'closed' })
    .eq('id', id)
  if (error) throw error
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase
    .from('job_listings')
    .delete()
    .eq('id', id)
  if (error) throw error
}
