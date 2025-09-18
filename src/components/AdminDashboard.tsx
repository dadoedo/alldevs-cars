'use client';

import { useState, useEffect } from 'react';
import { 
  Car, 
  Settings, 
  BarChart3, 
  Users, 
  Mail,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface SyncLog {
  id: number;
  sync_type: 'manual' | 'cron';
  status: 'success' | 'error' | 'partial';
  message?: string;
  cars_added: number;
  cars_updated: number;
  cars_deleted: number;
  cars_skipped: number;
  errors_count: number;
  execution_time_seconds?: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchSyncLogs();
  }, []);

  const fetchSyncLogs = async () => {
    try {
      const response = await fetch('/api/admin/sync-logs');
      const data = await response.json();
      setSyncLogs(data);
    } catch (error) {
      console.error('Error fetching sync logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync-cars?key=your-sync-secret-key-here&type=manual', {
        method: 'GET'
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Synchronizácia dokončená: ${result.added} pridaných, ${result.updated} aktualizovaných, ${result.deleted} zmazaných`);
        fetchSyncLogs();
      } else {
        alert('Chyba pri synchronizácii');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Chyba pri synchronizácii');
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Úspešné';
      case 'error':
        return 'Chyba';
      case 'partial':
        return 'Čiastočné';
      default:
        return 'Neznámy';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Administračné rozhranie</h1>
          <p className="text-lg text-gray-600">Správa autobazáru a synchronizácia dát</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Vozidlá</h3>
                <p className="text-gray-600">Správa vozidiel</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Nastavenia</h3>
                <p className="text-gray-600">Konfigurácia webu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Štatistiky</h3>
                <p className="text-gray-600">Prehľad dát</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Kontakty</h3>
                <p className="text-gray-600">Správa kontaktov</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <RefreshCw className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Synchronizácia dát</h2>
            </div>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Synchronizujem...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Spustiť synchronizáciu
                </>
              )}
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            Synchronizácia stiahne najnovšie dáta z XML feedu a aktualizuje databázu.
          </p>
        </div>

        {/* Sync Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Mail className="h-6 w-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">História synchronizácie</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Načítavam...</p>
            </div>
          ) : syncLogs.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Žiadne záznamy synchronizácie</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dátum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Typ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Výsledky
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Čas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {syncLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.created_at).toLocaleString('sk-SK')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.sync_type === 'manual' ? 'Manuálna' : 'Automatická'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(log.status)}
                          <span className="ml-2">{getStatusText(log.status)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>Pridané: {log.cars_added}</div>
                          <div>Aktualizované: {log.cars_updated}</div>
                          <div>Zmazané: {log.cars_deleted}</div>
                          {log.errors_count > 0 && (
                            <div className="text-red-600">Chyby: {log.errors_count}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.execution_time_seconds ? `${log.execution_time_seconds}s` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
