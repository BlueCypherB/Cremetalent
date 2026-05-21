import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ClientAccount } from '@/lib/database.types';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Globe, Phone, ToggleLeft, ToggleRight } from 'lucide-react';

const ClientsAdmin = () => {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['client_accounts', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ClientAccount[];
    },
    staleTime: 30_000,
  });

  const toggleM = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('client_accounts')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { is_active }) => {
      queryClient.invalidateQueries({ queryKey: ['client_accounts'] });
      toast({ title: is_active ? "Client account activated" : "Client account deactivated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center">
        <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 text-sm font-medium">No client accounts yet</p>
        <p className="text-slate-400 text-xs mt-1">Use "Invite to platform" on an inquiry to create one</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 font-medium">{clients.length} client account{clients.length !== 1 ? 's' : ''}</p>
      {clients.map(client => (
        <div key={client.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-slate-900 text-sm">{client.company_name}</h3>
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                  client.is_active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {client.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-slate-600">{client.full_name} &middot; {client.email}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                {client.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone}</span>}
                {client.website && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{client.website}</span>}
                {client.industry && <span>{client.industry}</span>}
                <span>Joined {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs gap-1.5 flex-shrink-0 text-slate-500"
              onClick={() => toggleM.mutate({ id: client.id, is_active: !client.is_active })}
              disabled={toggleM.isPending}
            >
              {client.is_active
                ? <><ToggleRight className="h-4 w-4 text-emerald-600" />Deactivate</>
                : <><ToggleLeft className="h-4 w-4" />Activate</>
              }
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsAdmin;
