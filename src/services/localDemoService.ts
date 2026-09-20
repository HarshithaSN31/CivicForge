import { Issue, CivicTask, VolunteerApplication } from '../types';

const REAL_ISSUES_KEY = 'civicforge_real_issues';
const REAL_TASKS_KEY = 'civicforge_real_tasks';
const REAL_APPLICATIONS_KEY = 'civicforge_real_applications';

export const localDemoService = {
  getIssues(): Issue[] {
    try {
      const saved = localStorage.getItem(REAL_ISSUES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveIssues(issues: Issue[]): void {
    localStorage.setItem(REAL_ISSUES_KEY, JSON.stringify(issues));
  },

  getTasks(): CivicTask[] {
    try {
      const saved = localStorage.getItem(REAL_TASKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveTasks(tasks: CivicTask[]): void {
    localStorage.setItem(REAL_TASKS_KEY, JSON.stringify(tasks));
  },

  getApplications(): VolunteerApplication[] {
    try {
      const saved = localStorage.getItem(REAL_APPLICATIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveApplications(apps: VolunteerApplication[]): void {
    localStorage.setItem(REAL_APPLICATIONS_KEY, JSON.stringify(apps));
  },

  /**
   * Helper to register a volunteer for a task / issue locally
   */
  joinTaskLocally(
    taskId: string,
    userId: string,
    userName: string,
    userEmail: string
  ): { task: CivicTask; application: VolunteerApplication } {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found.');

    const task = tasks[taskIndex];
    const apps = this.getApplications();

    const existingApp = apps.find(
      (a) => a.taskId === taskId && a.userId === userId && a.status !== 'CANCELLED' && a.status !== 'DECLINED'
    );
    if (existingApp) {
      throw new Error('You have already joined this volunteer task.');
    }

    if (task.enrolledVolunteersCount >= task.volunteersNeeded) {
      throw new Error('Volunteer spots are full for this task.');
    }

    const newApp: VolunteerApplication = {
      id: `app-${Date.now()}`,
      userId,
      userName,
      userEmail,
      taskId,
      taskTitle: task.title,
      incidentId: task.incidentId,
      appliedTimestamp: new Date().toISOString(),
      status: 'ACCEPTED',
    };

    const newCount = task.enrolledVolunteersCount + 1;
    const isFull = newCount >= task.volunteersNeeded;

    const updatedTask: CivicTask = {
      ...task,
      enrolledVolunteersCount: newCount,
      status: isFull ? 'FULL' as any : task.status,
    };

    tasks[taskIndex] = updatedTask;
    apps.unshift(newApp);

    this.saveTasks(tasks);
    this.saveApplications(apps);

    // Also update matching issue if exists
    const issues = this.getIssues();
    const issueIndex = issues.findIndex((i) => `task-issue-${i.id}` === taskId || i.id === taskId);
    if (issueIndex !== -1) {
      const issue = issues[issueIndex];
      const joinedIds = issue.joinedVolunteerIds || [];
      if (!joinedIds.includes(userId)) {
        issues[issueIndex] = {
          ...issue,
          volunteersJoined: (issue.volunteersJoined || 0) + 1,
          joinedVolunteerIds: [...joinedIds, userId],
        };
        this.saveIssues(issues);
      }
    }

    return { task: updatedTask, application: newApp };
  }
};
