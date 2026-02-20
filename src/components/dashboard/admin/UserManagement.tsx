'use client';

import { motion } from 'framer-motion';
import { Users, UserPlus, Edit2, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const users: { id: number; name: string; email: string; role: string; status: string; joined: string }[] = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">User Management</h2>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Role</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-lg font-medium">No users yet</p>
                  <p className="text-sm mt-1">Users will appear here once they register.</p>
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                >
                  <td className="py-3 px-4 text-gray-200 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400 transition" aria-label={`Edit user ${user.name}`}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition" aria-label={`Delete user ${user.name}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
