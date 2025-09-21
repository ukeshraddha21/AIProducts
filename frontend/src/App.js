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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
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
  Clock,
  Filter,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  CheckSquare,
  Square,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Enhanced Dashboard Component with Better Design
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Dashboard...</p>
        </div>
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
    color: testTypeColors[type] || '#6B7280',
    fill: testTypeColors[type] || '#6B7280'
  }));

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'missing': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-8">
      {/* Header with Better Typography */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Comprehensive insights into your user story testing pipeline with AI-powered analysis
        </p>
      </div>

      {/* Enhanced Stats Cards with Better Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Total Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-800 mb-2">{stats?.total_stories || 0}</div>
            <p className="text-sm text-slate-500">User stories in system</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Tests Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-600 mb-2">{stats?.passed_tests || 0}</div>
            <p className="text-sm text-slate-500">Successfully executed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Tests Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 mb-2">{stats?.failed_tests || 0}</div>
            <p className="text-sm text-slate-500">Need attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Tests Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-600 mb-2">{stats?.pending_tests || 0}</div>
            <p className="text-sm text-slate-500">Awaiting execution</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">AI Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {Math.round((stats?.avg_confidence_score || 0) * 100)}%
            </div>
            <p className="text-sm text-slate-500">Story parsing quality</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Testability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {Math.round((stats?.avg_testability_score || 0) * 100)}%
            </div>
            <p className="text-sm text-slate-500">Test coverage potential</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section with Better Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-12">
        <Card className="shadow-lg bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">Test Type Distribution</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Breakdown of generated test types across all stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={testTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {testTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">Coverage Progress</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Story parsing and test coverage metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex justify-between text-base font-medium text-slate-700 mb-3">
                <span>Stories Parsed</span>
                <span>{stats?.parsed_stories || 0}/{stats?.total_stories || 0}</span>
              </div>
              <Progress 
                value={(stats?.parsed_stories || 0) / (stats?.total_stories || 1) * 100} 
                className="h-3 bg-slate-100"
              />
            </div>
            <div>
              <div className="flex justify-between text-base font-medium text-slate-700 mb-3">
                <span>Test Coverage</span>
                <span>{Math.round(stats?.coverage_percentage || 0)}%</span>
              </div>
              <Progress 
                value={stats?.coverage_percentage || 0} 
                className="h-3 bg-slate-100"
              />
            </div>
            <div>
              <div className="flex justify-between text-base font-medium text-slate-700 mb-3">
                <span>AI Confidence</span>
                <span>{Math.round((stats?.avg_confidence_score || 0) * 100)}%</span>
              </div>
              <Progress 
                value={(stats?.avg_confidence_score || 0) * 100} 
                className="h-3 bg-slate-100"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Story-Test Coverage Map - No More Cramped Scrolling */}
      <Card className="shadow-lg bg-white mb-12">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-slate-800">Story-Test Coverage Map</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Comprehensive view of test coverage by type for each story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {testMapping.slice(0, 8).map((mapping) => (
              <div key={mapping.story_id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-slate-50">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-lg text-slate-800 max-w-md">
                    {mapping.story_title}
                  </h4>
                  <div className="flex items-center gap-3">
                    <Badge variant={mapping.parsed ? "default" : "secondary"} className="text-sm px-3 py-1">
                      {mapping.parsed ? "Parsed" : "Raw"}
                    </Badge>
                    <span className="text-sm font-medium text-slate-600">
                      {mapping.coverage_percentage.toFixed(0)}% Coverage
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {Object.entries(mapping.test_types).map(([type, status]) => (
                    <Badge 
                      key={type} 
                      variant="outline" 
                      className={`text-sm px-3 py-1 font-medium ${getStatusBadgeColor(status)}`}
                    >
                      {type}: {status}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-slate-600 bg-white p-3 rounded-lg">
                  <span className="font-medium">{mapping.total_tests}</span> tests • 
                  <span className="text-emerald-600 font-medium ml-1">{mapping.passed_tests} passed</span> • 
                  <span className="text-red-600 font-medium ml-1">{mapping.failed_tests} failed</span>
                </div>
              </div>
            ))}
          </div>
          {testMapping.length > 8 && (
            <div className="text-center mt-6">
              <Button variant="outline" className="px-6 py-2">
                View All {testMapping.length} Stories
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity with Better Typography */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="shadow-lg bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-slate-800">Recent Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_stories?.slice(0, 4).map((story) => (
                <div key={story.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-slate-800 text-base leading-tight">{story.title}</p>
                    <Badge variant={story.parsed ? "default" : "secondary"} className="text-xs">
                      {story.parsed ? "Parsed" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                    {story.description.substring(0, 80)}...
                  </p>
                  {story.parsed && (
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        {Math.round((story.confidence_score || 0) * 100)}%
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        <Target className="w-3 h-3 mr-1" />
                        {Math.round((story.testability_score || 0) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-slate-800">Recent Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_tests?.slice(0, 4).map((test) => (
                <div key={test.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-slate-800 text-base">{test.test_type} Test</p>
                    <Badge className={`text-xs ${getStatusBadgeColor(test.status)}`}>
                      {test.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 leading-relaxed">{test.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {test.framework}
                    </Badge>
                    {test.last_run && (
                      <span className="text-xs text-slate-500">
                        {new Date(test.last_run).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-slate-800">Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_results?.slice(0, 4).map((result) => (
                <div key={result.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-slate-800 text-base">Test Execution</p>
                    <Badge className={`text-xs ${getStatusBadgeColor(result.status)}`}>
                      {result.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">
                      Duration: <span className="font-medium">{result.duration?.toFixed(2)}s</span>
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {result.error_message && (
                    <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded">
                      {result.error_message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Comprehensive Tabular View Component
const TabularView = () => {
  const [stories, setStories] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [testData, setTestData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);
  const [showTestDetails, setShowTestDetails] = useState(null);

  const testTypes = ['unit', 'api', 'ui', 'security', 'performance', 'manual', 'database'];

  // Create consistent priority/complexity mapping based on story ID hash
  const getPriority = (story) => {
    const priorities = ['High', 'Medium', 'Low'];
    const hash = story.id.split('-')[0];
    const index = parseInt(hash.substring(0, 2), 16) % 3;
    return priorities[index];
  };

  const getComplexity = (story) => {
    const complexities = ['Simple', 'Moderate', 'Complex'];
    const hash = story.id.split('-')[1] || story.id.split('-')[0];
    const index = parseInt(hash.substring(0, 2), 16) % 3;
    return complexities[index];
  };

  useEffect(() => {
    fetchTabularData();
  }, []);

  const fetchTabularData = async () => {
    try {
      const [storiesResponse, mappingResponse, testsResponse] = await Promise.all([
        axios.get(`${API}/stories`),
        axios.get(`${API}/story-test-mapping`),
        axios.get(`${API}/tests`)
      ]);

      setStories(storiesResponse.data);
      setAllTests(testsResponse.data);
      
      // Transform mapping data for easier access
      const testDataMap = {};
      mappingResponse.data.mapping.forEach(mapping => {
        testDataMap[mapping.story_id] = {
          ...mapping.test_types,
          total_tests: mapping.total_tests,
          passed_tests: mapping.passed_tests,
          failed_tests: mapping.failed_tests,
          coverage_percentage: mapping.coverage_percentage
        };
      });
      
      // Also add individual test details
      testsResponse.data.forEach(test => {
        if (!testDataMap[test.story_id]) {
          testDataMap[test.story_id] = {};
        }
        if (!testDataMap[test.story_id].tests) {
          testDataMap[test.story_id].tests = {};
        }
        testDataMap[test.story_id].tests[test.test_type] = test;
      });
      
      setTestData(testDataMap);
    } catch (error) {
      console.error('Error fetching tabular data:', error);
      toast.error('Failed to load tabular data');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Simple': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Moderate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Complex': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getTestStatus = (storyId, testType) => {
    const storyData = testData[storyId];
    if (!storyData) {
      return { status: 'missing', description: 'No tests', count: 0, details: null };
    }
    
    // Check if we have this test type
    if (storyData[testType]) {
      const status = storyData[testType];
      const testDetails = storyData.tests && storyData.tests[testType];
      return {
        status: status,
        description: testDetails ? testDetails.description : `${testType} test`,
        count: 1,
        details: testDetails
      };
    }
    
    return { status: 'missing', description: 'Not implemented', count: 0, details: null };
  };

  const getOverallStatus = (storyId) => {
    const storyData = testData[storyId];
    if (!storyData || !storyData.total_tests || storyData.total_tests === 0) {
      return 'no-tests';
    }
    
    if (storyData.failed_tests > 0) return 'has-failures';
    if (storyData.passed_tests === storyData.total_tests) return 'all-passed';
    return 'in-progress';
  };

  const executeTestsForStory = async (storyId) => {
    const storyData = testData[storyId];
    if (!storyData || !storyData.tests) {
      toast.error('No tests found for this story');
      return;
    }

    const testIds = Object.values(storyData.tests).map(test => test.id);
    try {
      toast.info('Executing tests...');
      await axios.post(`${API}/tests/execute`, { test_ids: testIds });
      toast.success('Tests executed successfully');
      fetchTabularData(); // Refresh data
    } catch (error) {
      console.error('Error executing tests:', error);
      toast.error('Failed to execute tests');
    }
  };

  const generateTestsForStory = async (storyId, testTypes) => {
    try {
      toast.info('Generating tests...');
      await axios.post(`${API}/stories/${storyId}/generate-tests`, {
        test_types: testTypes
      });
      toast.success('Tests generated successfully');
      fetchTabularData(); // Refresh data
    } catch (error) {
      console.error('Error generating tests:', error);
      toast.error('Failed to generate tests');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'missing': return <X className="w-4 h-4 text-slate-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'missing': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const sortedAndFilteredStories = stories
    .filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.description.toLowerCase().includes(searchTerm.toLowerCase());
      const priority = getPriority(story);
      const complexity = getComplexity(story);
      const overallStatus = getOverallStatus(story.id);
      
      const matchesPriority = filterPriority === 'all' || priority === filterPriority;
      const matchesComplexity = filterComplexity === 'all' || complexity === filterComplexity;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'passed' && overallStatus === 'all-passed') ||
        (filterStatus === 'failed' && overallStatus === 'has-failures') ||
        (filterStatus === 'pending' && overallStatus === 'in-progress') ||
        (filterStatus === 'no-tests' && overallStatus === 'no-tests');
      
      return matchesSearch && matchesPriority && matchesComplexity && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = priorityOrder[getPriority(a)];
        bValue = priorityOrder[getPriority(b)];
      } else if (sortField === 'complexity') {
        const complexityOrder = { 'Complex': 3, 'Moderate': 2, 'Simple': 1 };
        aValue = complexityOrder[getComplexity(a)];
        bValue = complexityOrder[getComplexity(b)];
      } else if (sortField === 'coverage') {
        aValue = testData[a.id]?.coverage_percentage || 0;
        bValue = testData[b.id]?.coverage_percentage || 0;
      } else if (sortField === 'tests') {
        aValue = testData[a.id]?.total_tests || 0;
        bValue = testData[b.id]?.total_tests || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Tabular View...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Test Cases Tabular View</h1>
        <p className="text-lg text-slate-600">Comprehensive overview of user stories and their test coverage</p>
      </div>

      {/* Enhanced Filters and Search */}
      <Card className="shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Filters & Search</CardTitle>
          <CardDescription>Filter and search through your user stories and test coverage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Search Stories</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Priority Filter</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Complexity Filter</label>
              <Select value={filterComplexity} onValueChange={setFilterComplexity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Complexities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Complexities</SelectItem>
                  <SelectItem value="Simple">Simple</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Test Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="passed">All Tests Passed</SelectItem>
                  <SelectItem value="failed">Has Failures</SelectItem>
                  <SelectItem value="pending">In Progress</SelectItem>
                  <SelectItem value="no-tests">No Tests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Results</label>
              <div className="flex flex-col">
                <div className="text-lg font-semibold text-slate-800">
                  {sortedAndFilteredStories.length} stories
                </div>
                <div className="text-sm text-slate-600">
                  {allTests.length} total tests
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabular View */}
      <Card className="shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Test Coverage Matrix</CardTitle>
          <CardDescription>Click column headers to sort • Hover cells for test details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead 
                    className="font-bold text-slate-800 cursor-pointer hover:bg-slate-100 sticky left-0 bg-slate-50 z-10 min-w-[250px]"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      User Story
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  {testTypes.map(type => {
                    const IconComponent = testTypeIcons[type] || Code;
                    return (
                      <TableHead key={type} className="text-center font-bold text-slate-800 min-w-[140px]">
                        <div className="flex flex-col items-center gap-1">
                          <IconComponent className="w-4 h-4 text-indigo-600" />
                          <span className="capitalize text-xs">{type}</span>
                        </div>
                      </TableHead>
                    );
                  })}
                  <TableHead 
                    className="text-center font-bold text-slate-800 cursor-pointer hover:bg-slate-100 min-w-[100px]"
                    onClick={() => handleSort('tests')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Tests
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center font-bold text-slate-800 cursor-pointer hover:bg-slate-100 min-w-[100px]"
                    onClick={() => handleSort('coverage')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Coverage
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center font-bold text-slate-800 cursor-pointer hover:bg-slate-100 min-w-[100px]"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Priority
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center font-bold text-slate-800 cursor-pointer hover:bg-slate-100 min-w-[110px]"
                    onClick={() => handleSort('complexity')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Complexity
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold text-slate-800 min-w-[120px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredStories.map((story) => {
                  const priority = getPriority(story);
                  const complexity = getComplexity(story);
                  const storyData = testData[story.id] || {};
                  const overallStatus = getOverallStatus(story.id);
                  
                  return (
                    <TableRow key={story.id} className="hover:bg-slate-50">
                      <TableCell className="sticky left-0 bg-white z-10 border-r">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-slate-800 text-sm leading-tight max-w-[220px]">
                              {story.title}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed max-w-[220px] mt-1">
                              {story.description.substring(0, 120)}...
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={story.parsed ? "default" : "secondary"} className="text-xs">
                              {story.parsed ? "Parsed" : "Raw"}
                            </Badge>
                            {story.parsed && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round((story.confidence_score || 0) * 100)}% AI
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      {testTypes.map(type => {
                        const testInfo = getTestStatus(story.id, type);
                        return (
                          <TableCell key={type} className="text-center p-3">
                            <div 
                              className="flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded transition-colors"
                              title={`${testInfo.description} - Click for details`}
                              onClick={() => testInfo.details && setShowTestDetails(testInfo.details)}
                            >
                              {getStatusIcon(testInfo.status)}
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getStatusBadgeColor(testInfo.status)}`}
                              >
                                {testInfo.status === 'missing' ? 'NA' : testInfo.status}
                              </Badge>
                              {testInfo.count > 1 && (
                                <span className="text-xs text-slate-500">{testInfo.count} tests</span>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-semibold text-slate-800">
                            {storyData.total_tests || 0}
                          </span>
                          <div className="text-xs text-slate-600">
                            <span className="text-emerald-600">{storyData.passed_tests || 0}P</span> • 
                            <span className="text-red-600 ml-1">{storyData.failed_tests || 0}F</span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-semibold text-slate-800">
                            {Math.round(storyData.coverage_percentage || 0)}%
                          </span>
                          <Progress 
                            value={storyData.coverage_percentage || 0} 
                            className="h-1 w-16"
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge className={`${getPriorityColor(priority)} font-medium`}>
                          {priority}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge className={`${getComplexityColor(complexity)} font-medium`}>
                          {complexity}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col gap-1">
                          {storyData.total_tests > 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => executeTestsForStory(story.id)}
                              className="text-xs px-2 py-1 h-6"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Run
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const missingTypes = testTypes.filter(type => !storyData[type]);
                              if (missingTypes.length > 0) {
                                generateTestsForStory(story.id, missingTypes.slice(0, 2));
                              }
                            }}
                            className="text-xs px-2 py-1 h-6"
                            disabled={!story.parsed}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Gen
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {sortedAndFilteredStories.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No stories found</h3>
              <p className="text-slate-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Stories Component with Better Design
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
      viewStoryTests(selectedStory);
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
      viewStoryTests(selectedStory);
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
      case 'passed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">User Stories</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Manage, parse, and test your user stories with AI-powered analysis
        </p>
        <Button 
          onClick={() => setShowCreateForm(true)} 
          className="px-8 py-3 text-lg font-medium bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Story
        </Button>
      </div>

      {showCreateForm && (
        <Card className="shadow-xl bg-white border-0 max-w-2xl mx-auto">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">Create New Story</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Add a new user story to your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Story Title</label>
              <Input
                placeholder="Enter a descriptive title for your user story"
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                className="text-base py-3"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Story Description</label>
              <Textarea
                placeholder="Describe the user story in detail, including the user, their goal, and the benefit"
                value={newStory.description}
                onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                rows={6}
                className="text-base"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={createStory}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700"
              >
                Create Story
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {stories.map((story) => (
          <Card key={story.id} className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-0">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-3">
                <CardTitle className="text-xl font-bold text-slate-800 leading-tight">
                  {story.title}
                </CardTitle>
                <Badge variant={story.parsed ? "default" : "secondary"} className="text-sm px-3 py-1">
                  {story.parsed ? "Parsed" : "Raw"}
                </Badge>
              </div>
              <CardDescription className="text-base text-slate-600 leading-relaxed">
                {story.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {story.parsed && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Badge variant="outline" className="text-sm px-3 py-1 font-medium">
                      <Star className="w-4 h-4 mr-1" />
                      Confidence: {Math.round((story.confidence_score || 0) * 100)}%
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1 font-medium">
                      <Target className="w-4 h-4 mr-1" />
                      Testability: {Math.round((story.testability_score || 0) * 100)}%
                    </Badge>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-sm text-slate-700 mb-2">Acceptance Criteria:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {story.acceptance_criteria?.slice(0, 2).map((criteria, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{criteria}</span>
                        </li>
                      ))}
                      {story.acceptance_criteria?.length > 2 && (
                        <li className="text-indigo-600 font-medium">
                          +{story.acceptance_criteria.length - 2} more criteria
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                {!story.parsed && (
                  <Button 
                    onClick={() => parseStory(story.id)}
                    size="sm"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Play className="w-4 h-4" />
                    Parse with AI
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => viewStoryTests(story)}
                  className="flex items-center gap-2 hover:bg-slate-50"
                >
                  <Eye className="w-4 h-4" />
                  View Tests
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/story/${story.id}`)}
                  className="hover:bg-slate-50"
                >
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced View Tests Modal */}
      <Dialog open={showTestsModal} onOpenChange={setShowTestsModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Tests for: {selectedStory?.title}
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600">
              Manage and execute tests for this user story
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Generated Tests ({storyTests.length})</h3>
              <div className="flex gap-3">
                <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="w-4 h-4" />
                      Generate More
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-slate-800">Generate More Tests</DialogTitle>
                      <DialogDescription className="text-base text-slate-600">
                        Select test types to generate for this story
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        {availableTestTypes.map((type) => {
                          const hasTest = storyTests.some(test => test.test_type === type);
                          return (
                            <div key={type} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50">
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
                              <label htmlFor={type} className={`text-base font-medium ${hasTest ? 'text-slate-400' : 'text-slate-700'}`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)} 
                                {hasTest && ' (exists)'}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={() => generateMoreTests(selectedStory?.id)}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
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
                    variant="outline"
                    onClick={() => executeTests(storyTests.map(t => t.id))}
                    className="flex items-center gap-2 hover:bg-slate-50"
                  >
                    <Play className="w-4 h-4" />
                    Run All Tests
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {storyTests.map((test) => {
                const IconComponent = testTypeIcons[test.test_type] || Code;
                return (
                  <Card key={test.id} className="border border-slate-200 shadow-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <IconComponent className="w-6 h-6 text-indigo-600" />
                          <div>
                            <CardTitle className="capitalize text-lg font-bold text-slate-800">
                              {test.test_type} Test
                            </CardTitle>
                            <CardDescription className="text-base text-slate-600 mt-1">
                              {test.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`text-sm px-3 py-1 ${getStatusBadgeColor(test.status)}`}>
                            {test.status}
                          </Badge>
                          <Badge variant="outline" className="text-sm px-3 py-1">
                            {test.framework}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => executeTests([test.id])}
                            className="hover:bg-slate-50"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {test.last_run && (
                        <div className="flex items-center gap-6 text-base text-slate-600 bg-slate-50 p-3 rounded-lg">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Last run: {new Date(test.last_run).toLocaleString()}
                          </span>
                          {test.duration && (
                            <span className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Duration: {test.duration.toFixed(2)}s
                            </span>
                          )}
                        </div>
                      )}
                      {test.error_message && (
                        <div className="text-base text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
                          <strong>Error:</strong> {test.error_message}
                        </div>
                      )}
                      <pre className="bg-slate-50 p-6 rounded-lg overflow-x-auto text-sm border border-slate-200 max-h-64">
                        <code className="text-slate-700">{test.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {storyTests.length === 0 && (
              <div className="text-center py-16">
                <TestTube className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-slate-800 mb-3">No tests generated</h3>
                <p className="text-slate-600 text-base mb-6 max-w-md mx-auto leading-relaxed">
                  {!selectedStory?.parsed 
                    ? "Parse the story first, then generate tests to see them here"
                    : "Generate tests for this story to start building your test suite"
                  }
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {stories.length === 0 && (
        <Card className="shadow-xl bg-white border-0 max-w-2xl mx-auto">
          <CardContent className="text-center py-16">
            <FileText className="w-20 h-20 text-slate-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-3">No stories yet</h3>
            <p className="text-slate-600 text-base mb-6 leading-relaxed">
              Create your first user story to get started with AI-powered test generation
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700"
            >
              Create Your First Story
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Enhanced Story Detail Component (keeping similar structure but with better styling)
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
      case 'passed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'missing': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Story Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">{story?.title}</h1>
            <div className="flex items-center gap-4">
              <Badge variant={story?.parsed ? "default" : "secondary"} className="text-base px-4 py-2">
                {story?.parsed ? "Parsed" : "Raw"}
              </Badge>
              {story?.parsed && (
                <>
                  <Badge variant="outline" className="text-base px-4 py-2">
                    <Star className="w-4 h-4 mr-2" />
                    Confidence: {Math.round((story.confidence_score || 0) * 100)}%
                  </Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">
                    <Target className="w-4 h-4 mr-2" />
                    Testability: {Math.round((story.testability_score || 0) * 100)}%
                  </Badge>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            {!story?.parsed && (
              <Button 
                onClick={parseStory} 
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700"
              >
                <Play className="w-5 h-5" />
                Parse Story
              </Button>
            )}
            {story?.parsed && (
              <Button 
                onClick={generateTests} 
                disabled={generatingTests}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700"
              >
                <TestTube className="w-5 h-5" />
                {generatingTests ? 'Generating...' : 'Generate Tests'}
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="details" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="details" className="text-base">Story Details</TabsTrigger>
            <TabsTrigger value="tests" className="text-base">Generated Tests ({tests.length})</TabsTrigger>
            <TabsTrigger value="coverage" className="text-base">Test Coverage</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-8">
            <Card className="shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-slate-700 leading-relaxed">{story?.description}</p>
              </CardContent>
            </Card>

            {story?.parsed && (
              <>
                <Card className="shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">Acceptance Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {story.acceptance_criteria?.map((criteria, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-base text-slate-700 leading-relaxed">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-slate-800">Preconditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {story.preconditions?.map((condition, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-slate-700 leading-relaxed">{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-slate-800">Expected Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {story.expected_outcomes?.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-slate-700 leading-relaxed">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {story.suggestions && story.suggestions.length > 0 && (
                  <Card className="shadow-lg bg-white">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-slate-800">AI Suggestions for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {story.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-base text-slate-700 leading-relaxed">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            {tests.length > 0 ? (
              <div className="space-y-6">
                {tests.map((test) => {
                  const IconComponent = testTypeIcons[test.test_type] || Code;
                  const isEditing = editingTest?.id === test.id;
                  
                  return (
                    <Card key={test.id} className="shadow-lg bg-white">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <IconComponent className="w-6 h-6 text-indigo-600" />
                            <div>
                              <CardTitle className="capitalize text-xl font-bold text-slate-800">
                                {test.test_type} Test
                              </CardTitle>
                              <CardDescription className="text-base text-slate-600 mt-1">
                                {test.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`text-sm px-3 py-1 ${getStatusBadgeColor(test.status)}`}>
                              {test.status}
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1">
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
                                className="hover:bg-slate-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            ) : (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => saveTestEdit(test.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setEditingTest(null);
                                    setEditCode('');
                                  }}
                                  className="hover:bg-slate-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {test.last_run && (
                          <div className="flex items-center gap-6 text-base text-slate-600 bg-slate-50 p-4 rounded-lg">
                            <span className="flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              Last run: {new Date(test.last_run).toLocaleString()}
                            </span>
                            {test.duration && (
                              <span className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Duration: {test.duration.toFixed(2)}s
                              </span>
                            )}
                          </div>
                        )}
                        {test.error_message && (
                          <div className="text-base text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
                            <strong>Error:</strong> {test.error_message}
                          </div>
                        )}
                        {isEditing ? (
                          <Textarea
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                            rows={15}
                            className="font-mono text-sm"
                          />
                        ) : (
                          <pre className="bg-slate-50 p-6 rounded-lg overflow-x-auto text-sm border border-slate-200">
                            <code className="text-slate-700">{test.code}</code>
                          </pre>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="shadow-lg bg-white">
                <CardContent className="text-center py-16">
                  <TestTube className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-slate-800 mb-3">No tests generated</h3>
                  <p className="text-slate-600 text-base mb-6 leading-relaxed max-w-md mx-auto">
                    {!story?.parsed 
                      ? "Parse the story first, then generate tests to see them here"
                      : "Generate tests for this story to start building your test suite"
                    }
                  </p>
                  {story?.parsed && (
                    <Button 
                      onClick={generateTests} 
                      disabled={generatingTests}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700"
                    >
                      {generatingTests ? 'Generating...' : 'Generate Tests'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="coverage" className="space-y-6">
            {coverage && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">Coverage Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-slate-700">Total Tests:</span>
                      <span className="font-bold text-slate-800">{coverage.total_tests}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-slate-700">Passed Tests:</span>
                      <span className="font-bold text-emerald-600">{coverage.passed_tests}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-slate-700">Failed Tests:</span>
                      <span className="font-bold text-red-600">{coverage.failed_tests}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-slate-700">Coverage:</span>
                      <span className="font-bold text-slate-800">{coverage.coverage_percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={coverage.coverage_percentage} className="h-3" />
                  </CardContent>
                </Card>

                <Card className="shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">Test Type Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(coverage.test_types).map(([type, info]) => {
                        const IconComponent = testTypeIcons[type] || Code;
                        return (
                          <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-indigo-600" />
                              <span className="capitalize text-base font-medium text-slate-800">{type}</span>
                            </div>
                            <Badge className={`text-sm px-3 py-1 ${getStatusBadgeColor(info.status)}`}>
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
    </div>
  );
};

// Enhanced Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">
            <TestTube className="w-8 h-8 text-indigo-600" />
            StoryTest Parser Pro
          </Link>
          <div className="flex space-x-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-base font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link 
              to="/stories" 
              className="flex items-center gap-2 text-base font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              <FileText className="w-5 h-5" />
              Stories
            </Link>
            <Link 
              to="/tabular" 
              className="flex items-center gap-2 text-base font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              <BarChart3 className="w-5 h-5" />
              Tabular View
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
    <div className="App min-h-screen bg-slate-50">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/tabular" element={<TabularView />} />
          <Route path="/story/:storyId" element={<StoryDetailWrapper />} />
        </Routes>
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