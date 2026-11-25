import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import ScheduleManager from "@/components/ScheduleManager";

export default async function SchedulePage() {
  const session=await getSession();
  const {rows:schedules}=await pool.query("SELECT id,day_of_week,start_time,duration_minutes FROM jadwal WHERE doctor_id=$1 ORDER BY id",[session?.id]);
  return <ScheduleManager initialSchedules={schedules} />;
}