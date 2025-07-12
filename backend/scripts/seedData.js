const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding...');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Sample users data
const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    reputation: 1250,
    bio: 'Full-stack developer with 5 years of experience in React and Node.js',
  },
  {
    username: 'sarah_dev',
    email: 'sarah@example.com',
    password: 'password123',
    reputation: 2840,
    bio: 'Senior frontend developer specializing in React and TypeScript',
  },
  {
    username: 'mike_ts',
    email: 'mike@example.com',
    password: 'password123',
    reputation: 890,
    bio: 'TypeScript enthusiast and React developer',
  },
  {
    username: 'performance_guru',
    email: 'performance@example.com',
    password: 'password123',
    reputation: 1560,
    bio: 'Performance optimization specialist',
  },
  {
    username: 'css_master',
    email: 'css@example.com',
    password: 'password123',
    reputation: 2100,
    bio: 'CSS expert and UI/UX designer',
  },
];

// Sample questions data
const sampleQuestions = [
  {
    title: "How to implement proper error handling in React components?",
    content: `I'm working on a React application and want to implement comprehensive error handling. I've heard about Error Boundaries but I'm not sure how to use them effectively.

Here's what I have so far:

\`\`\`javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
\`\`\`

What are the best practices for error handling in React? Should I use multiple Error Boundaries? How do I handle async errors in useEffect?`,
    tags: ['react', 'javascript', 'error-handling'],
  },
  {
    title: "Best practices for API integration with React hooks",
    content: `What are the recommended patterns for handling API calls in React using hooks? I'm currently using useEffect with useState, but I'm running into issues with race conditions and loading states.

Here's my current approach:

\`\`\`javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
\`\`\`

Should I use a custom hook? What about error boundaries? How do I handle caching and refetching?`,
    tags: ['react', 'hooks', 'api', 'javascript'],
  },
  {
    title: "TypeScript generic constraints with React components",
    content: `I'm struggling with TypeScript generic constraints when creating reusable components. I want to create a generic component that can work with different data types while maintaining type safety.

Here's what I'm trying to achieve:

\`\`\`typescript
interface BaseItem {
  id: string;
  name: string;
}

interface User extends BaseItem {
  email: string;
  role: string;
}

interface Product extends BaseItem {
  price: number;
  category: string;
}

// How do I create a generic component that works with both User and Product?
\`\`\`

How do I properly type generic components? What are the best practices for TypeScript with React?`,
    tags: ['typescript', 'react', 'generics'],
  },
  {
    title: "Optimizing React performance with large datasets",
    content: `My React application becomes slow when rendering large lists. What optimization techniques should I use? I'm currently rendering 1000+ items and the performance is terrible.

Current implementation:

\`\`\`javascript
const ItemList = ({ items }) => {
  return (
    <div>
      {items.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
};
\`\`\`

Should I use React.memo? What about virtualization? How do I implement infinite scrolling? What are the best libraries for this?`,
    tags: ['react', 'performance', 'optimization'],
  },
  {
    title: "CSS-in-JS vs traditional CSS: pros and cons",
    content: `What are the advantages and disadvantages of using CSS-in-JS libraries compared to traditional CSS? I'm starting a new project and can't decide between styled-components and regular CSS modules.

I'm considering:
- styled-components
- emotion
- CSS modules
- Tailwind CSS

What are the performance implications? How do they affect bundle size? What about developer experience?`,
    tags: ['css', 'css-in-js', 'styling'],
  },
  {
    title: "How to implement authentication with JWT in Express.js?",
    content: `I'm building a REST API with Express.js and need to implement JWT authentication. I've set up the basic structure but I'm not sure about the best practices for token management and security.

Current setup:
\`\`\`javascript
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  // How do I properly validate credentials?
  // How do I generate and send tokens?
  // What about refresh tokens?
});
\`\`\`

How do I handle token expiration? What about refresh tokens? How do I secure the endpoints?`,
    tags: ['node.js', 'express', 'jwt', 'authentication'],
  },
  {
    title: "MongoDB aggregation pipeline for complex queries",
    content: `I need to create complex queries in MongoDB using aggregation pipelines. I want to group data, calculate averages, and join collections efficiently.

Example scenario:
- Users can post questions
- Questions can have multiple answers
- Answers can be upvoted/downvoted
- I want to find the most active users

How do I structure the aggregation pipeline? What are the performance considerations?`,
    tags: ['mongodb', 'aggregation', 'database'],
  },
  {
    title: "Testing React components with Jest and React Testing Library",
    content: `I'm setting up testing for my React application using Jest and React Testing Library. I want to test user interactions, async operations, and component rendering.

What are the best practices for:
- Testing user interactions (clicks, form submissions)
- Testing async operations (API calls)
- Testing error states
- Mocking external dependencies

How do I test custom hooks? What about testing with TypeScript?`,
    tags: ['react', 'testing', 'jest', 'typescript'],
  },
  {
    title: "Deploying React app to production with Docker",
    content: `I want to deploy my React application using Docker. I need to set up a multi-stage build process and configure environment variables properly.

Current Dockerfile:
\`\`\`dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
\`\`\`

How do I optimize the build process? What about environment variables? How do I handle different environments (dev/staging/prod)?`,
    tags: ['react', 'docker', 'deployment', 'devops'],
  },
  {
    title: "State management with Redux Toolkit vs Zustand",
    content: `I'm choosing between Redux Toolkit and Zustand for state management in my React application. Both seem good, but I'm not sure which one fits my use case better.

My requirements:
- Simple state management
- Good TypeScript support
- Minimal boilerplate
- Good developer experience

What are the pros and cons of each? When should I use one over the other?`,
    tags: ['react', 'redux', 'zustand', 'state-management'],
  },
];

// Sample answers data
const sampleAnswers = [
  {
    content: `Great question! Error Boundaries are indeed the way to go for catching JavaScript errors in React components. Here's a comprehensive approach:

## 1. Strategic Error Boundary Placement

Place Error Boundaries at different levels of your component tree:

\`\`\`javascript
// App-level boundary
<ErrorBoundary fallback={<AppErrorFallback />}>
  <App />
</ErrorBoundary>

// Feature-level boundaries
<ErrorBoundary fallback={<FeatureErrorFallback />}>
  <UserProfile />
</ErrorBoundary>
\`\`\`

## 2. Enhanced Error Boundary

\`\`\`javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}
\`\`\`

This approach gives you granular control over error handling at different levels of your application.`,
  },
  {
    content: `I'd recommend using a custom hook for API calls. Here's a pattern that handles loading states, errors, and race conditions:

\`\`\`javascript
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
\`\`\`

For more complex scenarios, consider using React Query or SWR.`,
  },
  {
    content: `Here's how to create a generic component with proper TypeScript constraints:

\`\`\`typescript
interface BaseItem {
  id: string;
  name: string;
}

interface User extends BaseItem {
  email: string;
  role: string;
}

interface Product extends BaseItem {
  price: number;
  category: string;
}

// Generic component with constraints
function ItemList<T extends BaseItem>({ 
  items, 
  renderItem 
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

// Usage
const UserList = () => (
  <ItemList
    items={users}
    renderItem={(user) => (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    )}
  />
);
\`\`\`

This approach maintains type safety while allowing flexibility.`,
  },
  {
    content: `For large datasets, you should definitely use virtualization. Here's a solution using react-window:

\`\`\`javascript
import { FixedSizeList as List } from 'react-window';

const ItemList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <Item item={items[index]} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};
\`\`\`

Also consider:
- React.memo for preventing unnecessary re-renders
- useMemo for expensive calculations
- useCallback for stable function references`,
  },
  {
    content: `Here's my comparison based on experience:

## CSS-in-JS Pros:
- Scoped styles
- Dynamic styling
- Better developer experience
- TypeScript support

## CSS-in-JS Cons:
- Runtime overhead
- Larger bundle size
- Learning curve

## Traditional CSS Pros:
- Better performance
- Smaller bundle size
- Familiar syntax
- Better browser dev tools

## Traditional CSS Cons:
- Global scope issues
- Less dynamic
- Harder to maintain

**Recommendation**: Use CSS Modules or Tailwind CSS for most projects. CSS-in-JS is great for highly dynamic applications.`,
  },
];

// Seed function
const seedData = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.username}`);
    }

    // Create questions
    console.log('❓ Creating questions...');
    const createdQuestions = [];
    for (let i = 0; i < sampleQuestions.length; i++) {
      const questionData = sampleQuestions[i];
      const author = createdUsers[i % createdUsers.length]; // Distribute authors
      
      const question = await Question.create({
        ...questionData,
        author: author._id,
        views: Math.floor(Math.random() * 1000) + 50,
        upvotes: createdUsers.slice(0, Math.floor(Math.random() * 5) + 1).map(u => u._id),
        downvotes: createdUsers.slice(0, Math.floor(Math.random() * 2)).map(u => u._id),
      });
      
      createdQuestions.push(question);
      console.log(`✅ Created question: ${question.title}`);
    }

    // Create answers
    console.log('💬 Creating answers...');
    for (let i = 0; i < sampleAnswers.length; i++) {
      const answerData = sampleAnswers[i];
      const question = createdQuestions[i];
      const author = createdUsers[(i + 1) % createdUsers.length]; // Different author
      
      const answer = await Answer.create({
        ...answerData,
        author: author._id,
        question: question._id,
        upvotes: createdUsers.slice(0, Math.floor(Math.random() * 8) + 2).map(u => u._id),
        downvotes: createdUsers.slice(0, Math.floor(Math.random() * 2)).map(u => u._id),
        isAccepted: i === 0, // First answer is accepted
      });
      
      console.log(`✅ Created answer for: ${question.title}`);
    }

    // Update questions with answer counts and accepted answers
    console.log('🔄 Updating questions...');
    for (let i = 0; i < createdQuestions.length; i++) {
      const question = createdQuestions[i];
      const answers = await Answer.find({ question: question._id });
      
      if (answers.length > 0) {
        const acceptedAnswer = answers.find(a => a.isAccepted);
        await Question.findByIdAndUpdate(question._id, {
          isAnswered: true,
          acceptedAnswer: acceptedAnswer?._id,
        });
      }
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Created ${createdUsers.length} users`);
    console.log(`📊 Created ${createdQuestions.length} questions`);
    console.log(`📊 Created ${sampleAnswers.length} answers`);
    
    // Verify data was created
    const userCount = await User.countDocuments();
    const questionCount = await Question.countDocuments();
    const answerCount = await Answer.countDocuments();
    
    console.log('\n📈 Verification:');
    console.log(`Users in database: ${userCount}`);
    console.log(`Questions in database: ${questionCount}`);
    console.log(`Answers in database: ${answerCount}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder
connectDB().then(() => {
  seedData();
}); 