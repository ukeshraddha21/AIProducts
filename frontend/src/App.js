import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Progress } from "./components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Checkbox } from "./components/ui/checkbox";
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
  Home,
  Eye,
  Settings,
  RefreshCw,
  Edit,
  Save,
  X,
  ChevronRight,
  Star,
  Target,
  TrendingUp,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Enhanced Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [testMapping, setTestMapping] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchTestMapping();
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

  const fetchTestMapping = async () => {
    try {
      const response = await axios.get(`${API}/story-test-mapping`);
      setTestMapping(response.data.mapping || []);
    } catch (error) {
      console.error('Error fetching test mapping:', error);
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'missing': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Enhanced Dashboard</h1>
        <p className="text-lg text-gray-600">Advanced User Story to Test Case Parser Analytics</p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
            <CardTitle className="text-sm font-medium text-gray-600">Tests Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.passed_tests || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tests Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.failed_tests || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tests Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.pending_tests || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Confidence Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((stats?.avg_confidence_score || 0) * 100)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Testability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((stats?.avg_testability_score || 0) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Story Test Mapping */}
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
            <CardTitle>Story-Test Coverage Map</CardTitle>
            <CardDescription>Coverage by test type per story</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <div className="space-y-3">
              {testMapping.slice(0, 5).map((mapping) => (
                <div key={mapping.story_id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{mapping.story_title}</h4>
                    <Badge variant={mapping.parsed ? "default" : "secondary"}>
                      {mapping.parsed ? "Parsed" : "Raw"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(mapping.test_types).map(([type, status]) => (
                      <Badge 
                        key={type} 
                        variant="outline" 
                        className={`text-xs ${getStatusBadgeColor(status)}`}
                      >
                        {type}: {status}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {mapping.total_tests} tests • {mapping.passed_tests} passed • {mapping.failed_tests} failed
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity with Enhanced Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <p className="text-sm text-gray-500">{story.description.substring(0, 50)}...</p>
                    {story.parsed && (
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-purple-600">
                          Confidence: {Math.round((story.confidence_score || 0) * 100)}%
                        </span>
                        <span className="text-xs text-orange-600">
                          Testability: {Math.round((story.testability_score || 0) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <Badge variant={story.parsed ? "default" : "secondary"}>
                    {story.parsed ? "Parsed" : "Pending"}
                  </Badge>
                </div>
              ))}
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
                    {test.last_run && (
                      <p className="text-xs text-gray-400">
                        Last run: {new Date(test.last_run).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={getStatusBadgeColor(test.status)}>
                      {test.status}
                    </Badge>
                    <Badge variant="outline" style={{ backgroundColor: testTypeColors[test.test_type] || '#6B7280', color: 'white' }}>
                      {test.framework}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recent_results?.slice(0, 5).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Test Execution</p>
                    <p className="text-sm text-gray-500">Duration: {result.duration?.toFixed(2)}s</p>
                    {result.error_message && (
                      <p className="text-xs text-red-600">{result.error_message}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={getStatusBadgeColor(result.status)}>
                      {result.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Stories Component
const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '' });
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyTests, setStoryTests] = useState([]);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [availableTestTypes] = useState(["unit", "api", "ui", "security", "performance", "manual", "database"]);
  const [selectedTestTypes, setSelectedTestTypes] = useState([]);
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

  const viewStoryTests = async (story) => {
    try {
      const response = await axios.get(`${API}/stories/${story.id}/tests`);
      setStoryTests(response.data);
      setSelectedStory(story);
      setShowTestsModal(true);
    } catch (error) {
      console.error('Error fetching story tests:', error);
      toast.error('Failed to load tests');
    }
  };

  const generateMoreTests = async (storyId) => {
    if (selectedTestTypes.length === 0) {
      toast.error('Please select at least one test type');
      return;
    }

    try {
      toast.info('Generating tests with AI...');
      await axios.post(`${API}/stories/${storyId}/generate-tests`, {
        test_types: selectedTestTypes
      });
      toast.success('Tests generated successfully');
      setShowGenerateModal(false);
      setSelectedTestTypes([]);
      viewStoryTests(selectedStory); // Refresh tests
    } catch (error) {
      console.error('Error generating tests:', error);
      toast.error('Failed to generate tests');
    }
  };

  const executeTests = async (testIds) => {
    try {
      toast.info('Executing tests...');
      await axios.post(`${API}/tests/execute`, { test_ids: testIds });
      toast.success('Tests executed successfully');
      viewStoryTests(selectedStory); // Refresh tests
    } catch (error) {
      console.error('Error executing tests:', error);
      toast.error('Failed to execute tests');
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Enhanced User Stories</h1>
          <p className="text-gray-600">Manage, parse, and test your user stories</p>
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
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Confidence: {Math.round((story.confidence_score || 0) * 100)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      Testability: {Math.round((story.testability_score || 0) * 100)}%
                    </Badge>
                  </div>
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
              <div className="flex gap-2 flex-wrap">
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
                  onClick={() => viewStoryTests(story)}
                  className="flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  View Tests
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/story/${story.id}`)}
                >
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Tests Modal */}
      <Dialog open={showTestsModal} onOpenChange={setShowTestsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tests for: {selectedStory?.title}</DialogTitle>
            <DialogDescription>
              Manage and execute tests for this user story
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Tests ({storyTests.length})</h3>
              <div className="flex gap-2">
                <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      Generate More
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate More Tests</DialogTitle>
                      <DialogDescription>
                        Select test types to generate for this story
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {availableTestTypes.map((type) => {
                          const hasTest = storyTests.some(test => test.test_type === type);
                          return (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={selectedTestTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTestTypes([...selectedTestTypes, type]);
                                  } else {
                                    setSelectedTestTypes(selectedTestTypes.filter(t => t !== type));
                                  }
                                }}
                                disabled={hasTest}
                              />
                              <label htmlFor={type} className={`text-sm ${hasTest ? 'text-gray-400' : ''}`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)} 
                                {hasTest && ' (exists)'}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => generateMoreTests(selectedStory?.id)}>
                          Generate Tests
                        </Button>
                        <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {storyTests.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => executeTests(storyTests.map(t => t.id))}
                    className="flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    Run All Tests
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {storyTests.map((test) => {
                const IconComponent = testTypeIcons[test.test_type] || Code;
                return (
                  <Card key={test.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                          <div>
                            <CardTitle className="capitalize text-lg">{test.test_type} Test</CardTitle>
                            <CardDescription>{test.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusBadgeColor(test.status)}>
                            {test.status}
                          </Badge>
                          <Badge variant="outline">
                            {test.framework}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => executeTests([test.id])}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {test.last_run && (
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Last run: {new Date(test.last_run).toLocaleString()}</span>
                            {test.duration && <span>Duration: {test.duration.toFixed(2)}s</span>}
                          </div>
                        )}
                        {test.error_message && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            Error: {test.error_message}
                          </div>
                        )}
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm max-h-40">
                          <code>{test.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {storyTests.length === 0 && (
              <div className="text-center py-12">
                <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tests generated</h3>
                <p className="text-gray-600 mb-4">
                  {!selectedStory?.parsed 
                    ? "Parse the story first, then generate tests"
                    : "Generate tests for this story to see them here"
                  }
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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

// Enhanced Story Detail Component
const StoryDetail = ({ storyId }) => {
  const [story, setStory] = useState(null);
  const [tests, setTests] = useState([]);
  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingTests, setGeneratingTests] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [editCode, setEditCode] = useState('');

  useEffect(() => {
    fetchStoryDetails();
    fetchStoryTests();
    fetchStoryCoverage();
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

  const fetchStoryCoverage = async () => {
    try {
      const response = await axios.get(`${API}/stories/${storyId}/coverage`);
      setCoverage(response.data);
    } catch (error) {
      console.error('Error fetching coverage:', error);
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
      fetchStoryCoverage();
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

  const saveTestEdit = async (testId) => {
    try {
      await axios.put(`${API}/tests/${testId}`, {
        code: editCode,
        description: editingTest.description
      });
      toast.success('Test updated successfully');
      setEditingTest(null);
      setEditCode('');
      fetchStoryTests();
    } catch (error) {
      console.error('Error updating test:', error);
      toast.error('Failed to update test');
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'missing': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{story?.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={story?.parsed ? "default" : "secondary"}>
              {story?.parsed ? "Parsed" : "Raw"}
            </Badge>
            {story?.parsed && (
              <>
                <Badge variant="outline" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Confidence: {Math.round((story.confidence_score || 0) * 100)}%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  Testability: {Math.round((story.testability_score || 0) * 100)}%
                </Badge>
              </>
            )}
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
          <TabsTrigger value="coverage">Test Coverage</TabsTrigger>
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

              {story.suggestions && story.suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Suggestions for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {story.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {tests.length > 0 ? (
            <div className="space-y-4">
              {tests.map((test) => {
                const IconComponent = testTypeIcons[test.test_type] || Code;
                const isEditing = editingTest?.id === test.id;
                
                return (
                  <Card key={test.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                          <div>
                            <CardTitle className="capitalize">{test.test_type} Test</CardTitle>
                            <CardDescription>{test.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusBadgeColor(test.status)}>
                            {test.status}
                          </Badge>
                          <Badge variant="outline">
                            {test.framework}
                          </Badge>
                          {!isEditing ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setEditingTest(test);
                                setEditCode(test.code);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          ) : (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                onClick={() => saveTestEdit(test.id)}
                              >
                                <Save className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditingTest(null);
                                  setEditCode('');
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {test.last_run && (
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span><Clock className="w-4 h-4 inline mr-1" />Last run: {new Date(test.last_run).toLocaleString()}</span>
                            {test.duration && <span>Duration: {test.duration.toFixed(2)}s</span>}
                          </div>
                        )}
                        {test.error_message && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            Error: {test.error_message}
                          </div>
                        )}
                        {isEditing ? (
                          <Textarea
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                            rows={10}
                            className="font-mono text-sm"
                          />
                        ) : (
                          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{test.code}</code>
                          </pre>
                        )}
                      </div>
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

        <TabsContent value="coverage" className="space-y-4">
          {coverage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Tests:</span>
                    <span className="font-bold">{coverage.total_tests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passed Tests:</span>
                    <span className="font-bold text-green-600">{coverage.passed_tests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed Tests:</span>
                    <span className="font-bold text-red-600">{coverage.failed_tests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coverage:</span>
                    <span className="font-bold">{coverage.coverage_percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={coverage.coverage_percentage} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Type Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(coverage.test_types).map(([type, info]) => {
                      const IconComponent = testTypeIcons[type] || Code;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-blue-600" />
                            <span className="capitalize">{type}</span>
                          </div>
                          <Badge className={getStatusBadgeColor(info.status)}>
                            {info.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
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
            Enhanced StoryTest Parser
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
  const { storyId } = useParams();
  return <StoryDetail storyId={storyId} />;
};

export default App;