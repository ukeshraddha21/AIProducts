import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Progress } from "./components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  FileText, 
  TestTube, 
  BarChart3, 
  Plus, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Code,
  Shield,
  Zap,
  Database,
  Monitor,
  ClipboardList,
  Home
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const testTypeColors = {
    unit: '#3B82F6',
    api: '#10B981',
    ui: '#F59E0B',
    security: '#EF4444',
    performance: '#8B5CF6',
    manual: '#6B7280',
    database: '#06B6D4'
  };

  const testTypeData = Object.entries(stats?.test_types || {}).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    color: testTypeColors[type] || '#6B7280'
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">User Story to Test Case Parser Analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_stories || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Generated Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_tests || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Parsed Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.parsed_stories || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(stats?.coverage_percentage || 0)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Type Distribution</CardTitle>
            <CardDescription>Breakdown of generated test types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={testTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {testTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coverage Progress</CardTitle>
            <CardDescription>Story parsing and test coverage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Stories Parsed</span>
                <span>{stats?.parsed_stories || 0}/{stats?.total_stories || 0}</span>
              </div>
              <Progress 
                value={(stats?.parsed_stories || 0) / (stats?.total_stories || 1) * 100} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Test Coverage</span>
                <span>{Math.round(stats?.coverage_percentage || 0)}%</span>
              </div>
              <Progress 
                value={stats?.coverage_percentage || 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recent_stories?.slice(0, 5).map((story) => (
                <div key={story.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{story.title}</p>
                    <p className="text-sm text-gray-500">{story.description.substring(0, 60)}...</p>
                  </div>
                  <Badge variant={story.parsed ? "default" : "secondary"}>
                    {story.parsed ? "Parsed" : "Pending"}
                  </Badge>
                </div>
              ))}
              {(!stats?.recent_stories || stats.recent_stories.length === 0) && (
                <p className="text-gray-500 text-center py-4">No stories yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recent_tests?.slice(0, 5).map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{test.test_type} Test</p>
                    <p className="text-sm text-gray-500">{test.description}</p>
                  </div>
                  <Badge style={{ backgroundColor: testTypeColors[test.test_type] || '#6B7280' }}>
                    {test.framework}
                  </Badge>
                </div>
              ))}
              {(!stats?.recent_tests || stats.recent_tests.length === 0) && (
                <p className="text-gray-500 text-center py-4">No tests generated yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Stories Component
const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get(`${API}/stories`);
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const createStory = async () => {
    if (!newStory.title || !newStory.description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await axios.post(`${API}/stories`, newStory);
      toast.success('Story created successfully');
      setNewStory({ title: '', description: '' });
      setShowCreateForm(false);
      fetchStories();
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story');
    }
  };

  const parseStory = async (storyId) => {
    try {
      toast.info('Parsing story with AI...');
      await axios.post(`${API}/stories/${storyId}/parse`);
      toast.success('Story parsed successfully');
      fetchStories();
    } catch (error) {
      console.error('Error parsing story:', error);
      toast.error('Failed to parse story');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Stories</h1>
          <p className="text-gray-600">Manage and parse your user stories</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Story
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Story title"
              value={newStory.title}
              onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
            />
            <Textarea
              placeholder="Story description"
              value={newStory.description}
              onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={createStory}>Create Story</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{story.title}</CardTitle>
                <Badge variant={story.parsed ? "default" : "secondary"}>
                  {story.parsed ? "Parsed" : "Raw"}
                </Badge>
              </div>
              <CardDescription>{story.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {story.parsed && (
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="font-medium text-sm text-gray-700">Acceptance Criteria:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {story.acceptance_criteria?.slice(0, 2).map((criteria, idx) => (
                        <li key={idx}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {!story.parsed && (
                  <Button 
                    onClick={() => parseStory(story.id)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    Parse
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/story/${story.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-600 mb-4">Create your first user story to get started</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Story
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Story Detail Component
const StoryDetail = ({ storyId }) => {
  const [story, setStory] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingTests, setGeneratingTests] = useState(false);

  useEffect(() => {
    fetchStoryDetails();
    fetchStoryTests();
  }, [storyId]);

  const fetchStoryDetails = async () => {
    try {
      const response = await axios.get(`${API}/stories/${storyId}`);
      setStory(response.data);
    } catch (error) {
      console.error('Error fetching story:', error);
      toast.error('Failed to load story details');
    }
  };

  const fetchStoryTests = async () => {
    try {
      const response = await axios.get(`${API}/stories/${storyId}/tests`);
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTests = async () => {
    if (!story?.parsed) {
      toast.error('Please parse the story first');
      return;
    }

    setGeneratingTests(true);
    try {
      await axios.post(`${API}/stories/${storyId}/generate-tests`);
      toast.success('Tests generated successfully');
      fetchStoryTests();
    } catch (error) {
      console.error('Error generating tests:', error);
      toast.error('Failed to generate tests');
    } finally {
      setGeneratingTests(false);
    }
  };

  const parseStory = async () => {
    try {
      toast.info('Parsing story with AI...');
      const response = await axios.post(`${API}/stories/${storyId}/parse`);
      setStory(response.data);
      toast.success('Story parsed successfully');
    } catch (error) {
      console.error('Error parsing story:', error);
      toast.error('Failed to parse story');
    }
  };

  const testTypeIcons = {
    unit: Code,
    api: Zap,
    ui: Monitor,
    security: Shield,
    performance: BarChart3,
    manual: ClipboardList,
    database: Database
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{story?.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={story?.parsed ? "default" : "secondary"}>
              {story?.parsed ? "Parsed" : "Raw"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {!story?.parsed && (
            <Button onClick={parseStory} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Parse Story
            </Button>
          )}
          {story?.parsed && (
            <Button 
              onClick={generateTests} 
              disabled={generatingTests}
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              {generatingTests ? 'Generating...' : 'Generate Tests'}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Story Details</TabsTrigger>
          <TabsTrigger value="tests">Generated Tests ({tests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{story?.description}</p>
            </CardContent>
          </Card>

          {story?.parsed && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Acceptance Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {story.acceptance_criteria?.map((criteria, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preconditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {story.preconditions?.map((condition, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expected Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {story.expected_outcomes?.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {tests.length > 0 ? (
            <div className="space-y-4">
              {tests.map((test) => {
                const IconComponent = testTypeIcons[test.test_type] || Code;
                return (
                  <Card key={test.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <div>
                          <CardTitle className="capitalize">{test.test_type} Test</CardTitle>
                          <CardDescription>{test.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {test.framework}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{test.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tests generated</h3>
                <p className="text-gray-600 mb-4">
                  {!story?.parsed 
                    ? "Parse the story first, then generate tests"
                    : "Generate tests for this story to see them here"
                  }
                </p>
                {story?.parsed && (
                  <Button onClick={generateTests} disabled={generatingTests}>
                    {generatingTests ? 'Generating...' : 'Generate Tests'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <TestTube className="w-6 h-6 text-indigo-600" />
            StoryTest Parser
          </Link>
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              to="/stories" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Stories
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <BrowserRouter>
        <Navigation />
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/story/:storyId" element={<StoryDetailWrapper />} />
          </Routes>
        </main>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

// Wrapper component to extract storyId from params
const StoryDetailWrapper = () => {
  const { storyId } = require('react-router-dom').useParams();
  return <StoryDetail storyId={storyId} />;
};

export default App;