import React, { useState } from 'react';
import { 
  Building2, MapPin, Wallet, Calendar, 
  Maximize, Paperclip, FileText, User,
  Save, AlertCircle, Clock
} from 'lucide-react';
import { type Project, useStudio } from '../StudioContext';
import { cn } from '../../../../../lib/utils';

export function ProjectOverview({ project }: { project: Project }) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateProject } = useStudio();
  const [formData, setFormData] = useState<Partial<Project>>({
    name: project.name || '',
    code: project.code || '',
    clientName: project.clientName || '',
    type: project.type || '',
    status: project.status || 'Active',
    priority: project.priority || 'Medium',
    address: project.address || '',
    city: project.city || '',
    state: project.state || '',
    pincode: project.pincode || '',
    mapLocation: project.mapLocation || '',
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    estimatedBudget: project.estimatedBudget || 0,
    approvedBudget: project.approvedBudget || 0,
    currentCost: project.currentCost || 0,
    totalArea: project.totalArea || 0,
    carpetArea: project.carpetArea || 0,
    unitType: project.unitType || '',
    roomsCount: project.roomsCount || 0,
    notes: project.notes || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (isEditing) {
      try {
        setIsSaving(true);
        await updateProject(project.id, formData);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update project", error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Project Information</h3>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2",
            isEditing ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm hover:shadow-md",
            isSaving && "opacity-50 cursor-not-allowed"
          )}
        >
          {isEditing ? <><Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}</> : 'Edit Details'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Core Metadata */}
        <div className="col-span-2 space-y-6">
          <Section card title="Basic Details" icon={Building2}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoField label="Project Name" value={formData.name} isEditing={isEditing} onChange={(v) => handleChange('name', v)} />
              <InfoField label="Project Code" value={formData.code} isEditing={isEditing} onChange={(v) => handleChange('code', v)} />
              <InfoField label="Client Name" value={formData.clientName} isEditing={isEditing} onChange={(v) => handleChange('clientName', v)} />
              <InfoField label="Project Type" value={formData.type} isEditing={isEditing} onChange={(v) => handleChange('type', v)} type="select" options={['Residential', 'Commercial', 'Hospitality', 'Retail', 'Other']} />
              <InfoField label="Status" value={formData.status} isEditing={isEditing} onChange={(v) => handleChange('status', v)} type="select" options={['Active', 'Completed', 'On Hold', 'Cancelled']} badge color="orange" />
              <InfoField label="Priority" value={formData.priority} isEditing={isEditing} onChange={(v) => handleChange('priority', v)} type="select" options={['Low', 'Medium', 'High', 'Critical']} badge color="red" />
            </div>
          </Section>

          <Section card title="Location" icon={MapPin}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="col-span-2">
                <InfoField label="Address" value={formData.address} isEditing={isEditing} onChange={(v) => handleChange('address', v)} />
              </div>
              <InfoField label="City" value={formData.city} isEditing={isEditing} onChange={(v) => handleChange('city', v)} />
              <InfoField label="State" value={formData.state} isEditing={isEditing} onChange={(v) => handleChange('state', v)} />
              <InfoField label="Pincode" value={formData.pincode} isEditing={isEditing} onChange={(v) => handleChange('pincode', v)} />
              <InfoField label="Map Location" value={formData.mapLocation} isEditing={isEditing} onChange={(v) => handleChange('mapLocation', v)} />
            </div>
          </Section>

          <Section card title="Timeline & Progress" icon={Calendar}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoField label="Start Date" value={formData.startDate} isEditing={isEditing} onChange={(v) => handleChange('startDate', v)} type="date" />
              <InfoField label="End Date" value={formData.endDate} isEditing={isEditing} onChange={(v) => handleChange('endDate', v)} type="date" />
              <div className="col-span-2 space-y-2 pt-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Project Progress</span>
                  <span>0%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-0 transition-all duration-1000" />
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Financials & Area */}
        <div className="space-y-6">
          <Section card title="Budget Summary" icon={Wallet}>
            <div className="space-y-4">
              <MetricItem label="Estimated Budget" value={formData.estimatedBudget || 0} isEditing={isEditing} onChange={(v) => handleChange('estimatedBudget', v)} icon={AlertCircle} />
              <MetricItem label="Approved Budget" value={formData.approvedBudget || 0} isEditing={isEditing} onChange={(v) => handleChange('approvedBudget', v)} primary />
              <MetricItem label="Current Cost" value={formData.currentCost || 0} isEditing={isEditing} onChange={(v) => handleChange('currentCost', v)} icon={Clock} />
            </div>
          </Section>

          <Section card title="Area Details" icon={Maximize}>
            <div className="space-y-4">
              <MetricItem label="Total Area" value={formData.totalArea || 0} isEditing={isEditing} onChange={(v) => handleChange('totalArea', v)} unit="sq. ft." />
              <MetricItem label="Carpet Area" value={formData.carpetArea || 0} isEditing={isEditing} onChange={(v) => handleChange('carpetArea', v)} unit="sq. ft." />
              <InfoField label="Unit Type" value={formData.unitType} isEditing={isEditing} onChange={(v) => handleChange('unitType', v)} />
              <InfoField label="Total Rooms" value={formData.roomsCount} isEditing={isEditing} onChange={(v) => handleChange('roomsCount', parseInt(v) || 0)} type="number" />
            </div>
          </Section>

          <Section card title="Notes" icon={FileText}>
            {isEditing ? (
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white min-h-[100px]"
                placeholder="Enter project notes..."
              />
            ) : (
             <p className="text-xs text-slate-500 leading-relaxed min-h-[100px] whitespace-pre-wrap">
               {formData.notes || 'No notes available for this project.'}
             </p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ children, title, icon: Icon, card }: { children: React.ReactNode, title: string, icon: any, card?: boolean }) {
  return (
    <div className={cn(
      "space-y-4",
      card && "bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 rounded-2xl p-6"
    )}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
          <Icon className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h4>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}

function InfoField({ label, value, badge, color, isEditing, onChange, type = "text", options }: { label: string, value: any, badge?: boolean, color?: string, isEditing?: boolean, onChange?: (val: any) => void, type?: string, options?: string[] }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
      {isEditing ? (
        type === 'select' && options ? (
          <select
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white"
          >
            <option value="" disabled>Select {label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )
      ) : badge ? (
        <span className={cn(
          "inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest mt-1",
          color === 'orange' ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500" : color === 'red' ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        )}>
          {value || 'Not specified'}
        </span>
      ) : (
        <p className="text-sm font-black text-slate-900 dark:text-slate-200">{value || '-'}</p>
      )}
    </div>
  );
}

function MetricItem({ label, value, icon: Icon, primary, unit = "₹", isEditing, onChange }: { label: string, value: number, icon?: any, primary?: boolean, unit?: string, isEditing?: boolean, onChange?: (val: number) => void }) {
  return (
    <div className={cn(
      "p-4 rounded-xl space-y-1 transition-all shadow-sm",
      primary ? "bg-orange-500 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
    )}>
      <div className="flex items-center justify-between">
        <span className={cn("text-[10px] font-black uppercase tracking-widest", primary ? "text-orange-100" : "text-slate-400 dark:text-slate-500")}>
          {label}
        </span>
        {Icon && <Icon className={cn("w-3 h-3", primary ? "text-orange-100" : "text-slate-400 dark:text-slate-500")} />}
      </div>
      {isEditing ? (
        <div className="flex items-center gap-2 mt-1">
          {unit === "₹" && <span className={cn("text-xs font-bold", primary ? "text-orange-200" : "text-slate-400")}>₹</span>}
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange?.(Number(e.target.value) || 0)}
            className={cn(
              "w-full bg-transparent border-b outline-none text-xl font-black tabular-nums transition-colors",
              primary 
                ? "border-orange-400 text-white placeholder-orange-300 focus:border-white" 
                : "border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 focus:border-orange-500"
            )}
            placeholder="0"
          />
          {unit !== "₹" && <span className={cn("text-xs font-bold shrink-0", primary ? "text-orange-200" : "text-slate-400")}>{unit}</span>}
        </div>
      ) : (
        <p className={cn("text-xl font-black tabular-nums", primary ? "text-white" : "text-slate-900 dark:text-slate-200")}>
          {unit === "₹" ? `₹${value.toLocaleString()}` : `${value} ${unit}`}
        </p>
      )}
    </div>
  );
}
