import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Filter,
  AlertTriangle,
  Clock,
  User,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../../types';

interface TasksViewProps {
  onOpenNewTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenNewTask }) => {
  const {
    tasks,
    projects,
    workers,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    globalSearchQuery,
  } = useApp();

  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = globalSearchQuery || localSearch;

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    const matchesProject =
      projectFilter === 'All' ? true : t.projectId === projectFilter;
    const matchesStatus =
      statusFilter === 'All' ? true : t.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'All' ? true : t.priority === priorityFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      t.projectName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      t.assignedEmployee.toLowerCase().includes(effectiveSearch.toLowerCase());

    return matchesProject && matchesStatus && matchesPriority && matchesSearch;
  });

  const overdueCount = tasks.filter((t) => t.isOverdue && t.status !== 'Completed').length;

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleAssigneeChange = (taskId: string, employeeName: string) => {
    const worker = workers.find((w) => w.name === employeeName);
    updateTask(taskId, {
      assignedEmployee: employeeName,
      assignedEmployeeRole: worker?.role || 'Crew Specialist',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner if Overdue Tasks Exist */}
      {overdueCount > 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2.5 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              Action Required: {overdueCount} critical tasks are past their deadline on site.
            </span>
          </div>
          <button
            onClick={() => {
              setStatusFilter('All');
              setPriorityFilter('All');
              setProjectFilter('All');
            }}
            className="text-[11px] underline font-bold hover:text-rose-950"
          >
            Review Urgent Tasks
          </button>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'To Do', 'In Progress', 'Waiting', 'Completed'].map((status) => {
              const count =
                status === 'All'
                  ? tasks.length
                  : tasks.filter((t) => t.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === status
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>

          {/* New Task Button */}
          <button
            onClick={onOpenNewTask}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Task</span>
          </button>
        </div>

        {/* Second Row Filters: Search, Project Filter, Priority Filter */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, project, employee..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          {/* Project Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-10">Done</th>
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Assigned Employee</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No tasks found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isDone = task.status === 'Completed';

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-amber-50/30 transition ${
                        task.isOverdue && !isDone ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Checkbox toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-amber-500 bg-white'
                          }`}
                          title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                        >
                          {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                        </button>
                      </td>

                      {/* Task Name */}
                      <td className="py-3.5 px-4">
                        <div
                          className={`font-bold text-sm ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.name}
                        </div>
                        {task.description && (
                          <div className="text-[11px] text-slate-500 mt-0.5 max-w-md truncate">
                            {task.description}
                          </div>
                        )}
                        {task.isOverdue && !isDone && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded mt-1 border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> OVERDUE
                          </span>
                        )}
                      </td>

                      {/* Project */}
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800">
                          {task.projectName}
                        </span>
                      </td>

                      {/* Assigned Employee (with quick inline re-assign select) */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                            {task.assignedEmployee
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <select
                            value={task.assignedEmployee}
                            onChange={(e) =>
                              handleAssigneeChange(task.id, e.target.value)
                            }
                            className="bg-transparent hover:bg-slate-100 rounded px-1 py-0.5 font-medium text-slate-800 focus:outline-none focus:bg-white text-xs"
                          >
                            {workers.map((w) => (
                              <option key={w.id} value={w.name}>
                                {w.name} ({w.role})
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            task.priority === 'Critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : task.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : task.priority === 'Medium'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-3 font-mono">
                        <span
                          className={
                            task.isOverdue && !isDone
                              ? 'text-rose-600 font-bold'
                              : 'text-slate-600'
                          }
                        >
                          {task.dueDate}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-3">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value as TaskStatus)
                          }
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none transition ${
                            task.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : task.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : task.status === 'Waiting'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Waiting">Waiting</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
