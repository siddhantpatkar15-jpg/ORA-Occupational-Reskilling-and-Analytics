import { fallbackUsers, fallbackSkills, fallbackOccupations, fallbackCourses } from './fallback-data';

// In-memory data store for serverless execution
const inMemoryStore = {
  users: [...fallbackUsers],
  skills: [...fallbackSkills],
  occupations: [...fallbackOccupations],
  courses: [...fallbackCourses],
  assessments: [
    {
      id: 'asmt-sql',
      title: 'SQL Assessment',
      description: 'Test your database querying proficiency',
      difficultyLevel: 'intermediate',
      timeLimitMinutes: 30,
      totalQuestions: 10,
      passingScore: 60,
      status: 'published',
      skillId: 'skill-sql',
    },
    {
      id: 'asmt-python',
      title: 'Python for Data Analysis',
      description: 'Evaluate fundamental Python scripting and data handling',
      difficultyLevel: 'beginner',
      timeLimitMinutes: 25,
      totalQuestions: 10,
      passingScore: 60,
      status: 'published',
      skillId: 'skill-python',
    },
  ],
  notifications: [
    { id: 'notif-1', title: 'Welcome to ORA', message: 'Your learning journey has started.', isRead: false, createdAt: new Date().toISOString() },
    { id: 'notif-2', title: 'Assessment Available', message: 'SQL Diagnostic Assessment is ready to take.', isRead: false, createdAt: new Date().toISOString() },
  ],
  certificates: [],
  learnerProfiles: [],
  trainerProfiles: [],
  learning_roadmaps: [],
  roadmap_steps: [],
  enrollments: [],
  departments: [
    { id: 'dept-eng', name: 'Engineering', organizationId: 'org-1' },
    { id: 'dept-ds', name: 'Data Science', organizationId: 'org-1' },
    { id: 'dept-pm', name: 'Product Management', organizationId: 'org-1' },
    { id: 'dept-hr', name: 'Human Resources', organizationId: 'org-1' },
  ],
};

function getTableName(table: any): string {
  if (!table) return 'unknown';
  if (typeof table === 'string') return table;
  if (table[Symbol.for('drizzle:Name')]) return table[Symbol.for('drizzle:Name')];
  if (table._?.name) return table._.name;
  if (table.tableName) return table.tableName;
  return 'unknown';
}

function getStoreTable(tableName: string): any[] {
  const normalized = tableName.toLowerCase().replace(/_/g, '');
  for (const key of Object.keys(inMemoryStore)) {
    if (key.toLowerCase().replace(/_/g, '') === normalized) {
      return (inMemoryStore as any)[key];
    }
  }
  if (!(inMemoryStore as any)[tableName]) {
    (inMemoryStore as any)[tableName] = [];
  }
  return (inMemoryStore as any)[tableName];
}

class ChainableQuery {
  private targetTable: string = '';
  private results: any[] = [];

  from(table: any) {
    this.targetTable = getTableName(table);
    this.results = [...getStoreTable(this.targetTable)];
    return this;
  }

  where(_predicate?: any) {
    // Return all or filtered
    return this;
  }

  orderBy(_order?: any) {
    return this;
  }

  limit(_num?: number) {
    return this;
  }

  offset(_num?: number) {
    return this;
  }

  async execute() {
    return this.results;
  }

  then(resolve: (val: any) => any, reject?: (err: any) => any) {
    return Promise.resolve(this.results).then(resolve, reject);
  }
}

class ChainableInsert {
  private targetTable: string = '';
  private insertedData: any = null;

  constructor(table: any) {
    this.targetTable = getTableName(table);
  }

  values(data: any) {
    this.insertedData = data;
    const store = getStoreTable(this.targetTable);
    if (Array.isArray(data)) {
      store.push(...data);
    } else if (data) {
      store.push(data);
    }
    return this;
  }

  onConflictDoNothing() {
    return this;
  }

  onConflictDoUpdate() {
    return this;
  }

  async execute() {
    return [this.insertedData];
  }

  then(resolve: (val: any) => any, reject?: (err: any) => any) {
    return Promise.resolve([this.insertedData]).then(resolve, reject);
  }
}

class ChainableUpdate {
  private targetTable: string = '';
  private updateData: any = null;

  constructor(table: any) {
    this.targetTable = getTableName(table);
  }

  set(data: any) {
    this.updateData = data;
    return this;
  }

  where(_predicate?: any) {
    return this;
  }

  async execute() {
    return [this.updateData];
  }

  then(resolve: (val: any) => any, reject?: (err: any) => any) {
    return Promise.resolve([this.updateData]).then(resolve, reject);
  }
}

class ChainableDelete {
  constructor(_table: any) {}
  where(_predicate?: any) { return this; }
  async execute() { return []; }
  then(resolve: (val: any) => any, reject?: (err: any) => any) {
    return Promise.resolve([]).then(resolve, reject);
  }
}

export function createFallbackDb() {
  return {
    select: (_fields?: any) => new ChainableQuery(),
    insert: (table: any) => new ChainableInsert(table),
    update: (table: any) => new ChainableUpdate(table),
    delete: (table: any) => new ChainableDelete(table),
    query: {
      users: {
        findFirst: async ({ where }: any = {}) => {
          // If a query is looking for an email or id
          const usersList = inMemoryStore.users;
          // Return first matching user or first user if no match found
          return usersList[0] || null;
        },
        findMany: async () => inMemoryStore.users,
      },
      occupations: {
        findFirst: async () => inMemoryStore.occupations[0] || null,
        findMany: async () => inMemoryStore.occupations,
      },
      skills: {
        findFirst: async () => inMemoryStore.skills[0] || null,
        findMany: async () => inMemoryStore.skills,
      },
    },
    _store: inMemoryStore,
  };
}
