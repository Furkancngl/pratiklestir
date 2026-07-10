"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, XIcon } from "@/app/components/icons";
import { isAdminEmail } from "@/app/lib/admin";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  createdAtLabel: string;
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};
const PLAN_OPTIONS = ["free", "pro", "ultra"];

export default function UsersTable({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPlan, setEditPlan] = useState("free");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function startEdit(user: UserRow) {
    setEditingId(user.id);
    setEditName(user.name ?? "");
    setEditPlan(user.plan);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setError("");
  }

  async function saveEdit(id: string) {
    setPending(true);
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() || null, plan: editPlan }),
    });
    setPending(false);

    if (!res.ok) {
      setError("Güncellenemedi. Lütfen tekrar deneyin.");
      return;
    }

    setEditingId(null);
    router.refresh();
  }

  async function deleteUser(user: UserRow) {
    const confirmed = window.confirm(
      `${user.email} adresli kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
    );
    if (!confirmed) return;

    setPending(true);
    setError("");
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "DELETE",
    });
    setPending(false);

    if (!res.ok) {
      setError("Silinemedi. Lütfen tekrar deneyin.");
      return;
    }

    router.refresh();
  }

  if (users.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-black/[.08] bg-white px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        Sonuç bulunamadı.
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-black/[.08] dark:border-zinc-800">
      {error && (
        <p className="border-b border-black/[.08] bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-zinc-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      )}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/[.08] bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <th className="px-4 py-2.5 font-medium">Ad Soyad</th>
            <th className="px-4 py-2.5 font-medium">E-posta</th>
            <th className="px-4 py-2.5 font-medium">Kayıt Tarihi</th>
            <th className="px-4 py-2.5 font-medium">Plan</th>
            <th className="px-4 py-2.5 font-medium text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            const isEditing = editingId === user.id;
            const isSelf = isAdminEmail(user.email);

            return (
              <tr
                key={user.id}
                className={`bg-white transition-colors dark:bg-zinc-950 ${
                  i !== users.length - 1
                    ? "border-b border-black/[.08] dark:border-zinc-800"
                    : ""
                } ${!isEditing ? "hover:bg-zinc-50 dark:hover:bg-zinc-900" : ""}`}
              >
                <td className="px-4 py-2.5 text-black dark:text-zinc-50">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full rounded-md border border-black/[.08] bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                  ) : (
                    user.name || (
                      <span className="text-zinc-400 dark:text-zinc-600">—</span>
                    )
                  )}
                </td>
                <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </td>
                <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">
                  {user.createdAtLabel}
                </td>
                <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">
                  {isEditing ? (
                    <select
                      value={editPlan}
                      onChange={(e) => setEditPlan(e.target.value)}
                      className="rounded-md border border-black/[.08] bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                    >
                      {PLAN_OPTIONS.map((plan) => (
                        <option key={plan} value={plan}>
                          {PLAN_LABELS[plan]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    PLAN_LABELS[user.plan] ?? user.plan
                  )}
                </td>
                <td className="px-4 py-2.5">
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => saveEdit(user.id)}
                        className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-indigo-500"
                      >
                        Kaydet
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={cancelEdit}
                        className="rounded-md border border-black/[.08] px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-black/[.04] disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label="Düzenle"
                        onClick={() => startEdit(user)}
                        className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-black/[.04] hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {!isSelf && (
                        <button
                          type="button"
                          aria-label="Sil"
                          disabled={pending}
                          onClick={() => deleteUser(user)}
                          className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
