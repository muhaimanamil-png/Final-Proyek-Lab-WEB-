import { cookies } from "next/headers";

export async function getSession() {
  const store = await cookies();
  const id = Number(store.get("rs_user_id")?.value);
  const role = store.get("rs_role")?.value;
  if (!Number.isInteger(id) || !role) return null;
  return { id, role };
}
