import type { Employee } from '../types'

const FACTORY_NAMES: Record<number, string> = {
  1: 'Zinus Global Indonesia',
  2: 'Zinus Global Indonesia – Karawang',
  3: 'Zinus Dream Indonesia',
}

interface EmployeeCardProps {
  employee: Employee
}

const getFactoryName = (f: number | null) => f ? FACTORY_NAMES[f] ?? 'Unknown' : '-'

const ProfileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3.5" fill="#1a7a73" fillOpacity="0.2" stroke="#1a7a73" strokeWidth="1.6"/>
    <path d="M4.5 19.5C4.5 16.46 7.96 14 12 14C16.04 14 19.5 16.46 19.5 19.5" stroke="#1a7a73" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

export const EmployeeCard = ({ employee }: EmployeeCardProps) => (
  <div className="flex items-center gap-3.5 bg-white border border-[#329F96]/15 rounded-2xl px-4 py-3.5">
    <div className="w-10 h-10 rounded-xl bg-[#1a7a73]/8 flex items-center justify-center flex-shrink-0">
      <ProfileIcon />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-[13.5px] text-[#0d2220] mb-0.5">{employee.nama}</div>
      <div className="text-[12px] text-[#7a9997]">{employee.department}</div>
      <div className="text-[11.5px] text-[#99bfbd] truncate">{getFactoryName(employee.factory)}</div>
    </div>
    <div className="flex flex-col items-end flex-shrink-0">
      <span className="text-[10px] font-bold tracking-widest uppercase text-[#329F96]/60 mb-0.5">NIK</span>
      <span className="text-[13px] font-semibold text-[#1a7a73]">{employee.nik}</span>
    </div>
  </div>
)