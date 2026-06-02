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

export const EmployeeCard = ({ employee }: EmployeeCardProps) => (
  <div className="card emp-card">
    <div className="emp-avatar">{employee.nama.charAt(0)}</div>
    <div className="emp-info">
      <div className="emp-name">{employee.nama}</div>
      <div className="emp-dept">{employee.department}</div>
      <div className="emp-factory">{getFactoryName(employee.factory)}</div>
    </div>
    <div className="emp-nik-badge">
      <div className="emp-nik-label">NIK</div>
      <div className="emp-nik-val">{employee.nik}</div>
    </div>
  </div>
)