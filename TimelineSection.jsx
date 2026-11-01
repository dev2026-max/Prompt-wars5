import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TimelineSection({ timelineData }) {
  const [completedTasks, setCompletedTasks] = useState({});
  const [customTasks, setCustomTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  if (!timelineData || timelineData.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-purple-500/20">
        <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white">No Timeline Generated</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
          Generate an event plan to receive structured milestone roadmaps and checklist duties.
        </p>
      </div>
    );
  }

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      if (next[taskId]) {
        toast.success("Task completed! 🎉", { icon: "✅" });
      }
      return next;
    });
  };

  // Calculate completion percentage
  let totalTasks = 0;
  let completedCount = 0;

  timelineData.forEach((milestone, mIdx) => {
    milestone.tasks.forEach((_, tIdx) => {
      totalTasks++;
      if (completedTasks[`${mIdx}-${tIdx}`]) completedCount++;
    });
  });

  customTasks.forEach((_, cIdx) => {
    totalTasks++;
    if (completedTasks[`custom-${cIdx}`]) completedCount++;
  });

  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setCustomTasks(prev => [...prev, { text: newTaskText.trim(), milestoneIdx: selectedMilestone }]);
    setNewTaskText('');
    toast.success("Task added to timeline!");
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-400" />
              <span>Milestone Roadmap & Task Checklist</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Phased countdown from preparation to celebration day. Check off items as you complete them!
            </p>
          </div>
          <div className="text-right sm:flex-shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Readiness</span>
            <div className="text-2xl font-extrabold text-amber-400 font-['Outfit']">
              {progressPercent}% Complete
            </div>
            <span className="text-[11px] text-gray-400">
              {completedCount} of {totalTasks} actions done
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Custom Task Form */}
      <form onSubmit={handleAddCustomTask} className="glass-card rounded-xl p-3 border border-white/10 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a custom to-do item (e.g. Call bakery for gluten-free cupcakes)..."
          className="flex-1 px-3.5 py-2 rounded-lg glass-input text-xs"
        />
        <select
          value={selectedMilestone}
          onChange={(e) => setSelectedMilestone(Number(e.target.value))}
          className="px-3 py-2 rounded-lg glass-input text-xs bg-gray-900"
        >
          {timelineData.map((m, idx) => (
            <option key={idx} value={idx}>{m.period}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg gradient-btn text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Timeline Milestones */}
      <div className="space-y-4">
        {timelineData.map((milestone, mIdx) => {
          const milestoneCustomTasks = customTasks.filter(ct => ct.milestoneIdx === mIdx);
          const isHighPriority = milestone.priority === 'high';

          return (
            <div
              key={mIdx}
              className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs font-['Outfit']">
                    {mIdx + 1}
                  </div>
                  <h3 className="text-base font-bold text-white font-['Outfit']">
                    {milestone.period}
                  </h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isHighPriority 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {milestone.priority || 'standard'} Priority
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2">
                {milestone.tasks.map((task, tIdx) => {
                  const taskId = `${mIdx}-${tIdx}`;
                  const isDone = Boolean(completedTasks[taskId]);

                  return (
                    <div
                      key={tIdx}
                      onClick={() => toggleTask(taskId)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                        isDone
                          ? 'bg-purple-950/30 text-gray-400 line-through'
                          : 'bg-white/5 hover:bg-white/10 text-gray-200'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-xs font-medium leading-relaxed">{task}</span>
                    </div>
                  );
                })}

                {/* Render any added custom tasks for this milestone */}
                {milestoneCustomTasks.map((ct, cIdx) => {
                  const taskId = `custom-${cIdx}`;
                  const isDone = Boolean(completedTasks[taskId]);

                  return (
                    <div
                      key={`custom-${cIdx}`}
                      onClick={() => toggleTask(taskId)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all border border-purple-500/30 ${
                        isDone
                          ? 'bg-purple-950/30 text-gray-400 line-through'
                          : 'bg-purple-900/20 hover:bg-purple-900/30 text-purple-100'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs font-medium leading-relaxed flex items-center gap-2">
                        <span>{ct.text}</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded font-semibold">User Added</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
