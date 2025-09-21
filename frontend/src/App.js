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
  AlertTriangle,
  Shield,
  Zap,
  Database,
  Monitor,
  ClipboardList,
  Home,
  Eye,
  Download,
  Filter,
  Search,
  ArrowUpDown,
  Target,
  TrendingUp,
  AlertCircle,
  CheckSquare,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Risk Assessment Dashboard Component
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Risk Assessment Dashboard...</p>
        </div>
      </div>
    );
  }

  const riskData = [
    { name: 'High Risk', value: stats?.high_risk_count || 0, color: '#EF4444', fill: '#EF4444' },
    { name: 'Medium Risk', value: stats?.medium_risk_count || 0, color: '#F59E0B', fill: '#F59E0B' },
    { name: 'Low Risk', value: stats?.low_risk_count || 0, color: '#10B981', fill: '#10B981' }
  ];

  const categoryData = Object.entries(stats?.category_distribution || {}).map(([category, count]) => ({
    name: category,
    value: count
  }));

  return (
    <div className="space-y-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">
          Risk Assessment Dashboard
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          StoryTest Parser MVP - Test Case Title Generation with Defect Likelihood Analysis
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Total Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-800 mb-2">{stats?.total_stories || 0}</div>
            <p className="text-sm text-slate-500">User stories analyzed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Test Case Titles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600 mb-2">{stats?.total_test_titles || 0}</div>
            <p className="text-sm text-slate-500">Generated test cases</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">High Risk Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 mb-2">{stats?.high_risk_count || 0}</div>
            <p className="text-sm text-slate-500">Critical defect risk</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Avg Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {Math.round((stats?.average_defect_likelihood || 0) * 100)}%
            </div>
            <p className="text-sm text-slate-500">Average defect likelihood</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-12">
        <Card className="shadow-lg bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">Risk Distribution</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Defect likelihood assessment across all test cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
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
            <CardTitle className="text-2xl font-bold text-slate-800">Test Category Distribution</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Test case titles by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="shadow-lg bg-white border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              High Risk Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">{stats?.high_risk_count || 0}</div>
            <p className="text-sm text-slate-600 mb-4">
              Critical priority tests that pose high defect risk if missed
            </p>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800 font-medium">
                Immediate attention required
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              Medium Risk Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 mb-2">{stats?.medium_risk_count || 0}</div>
            <p className="text-sm text-slate-600 mb-4">
              Moderate priority tests with medium defect likelihood
            </p>
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">
                Schedule for next iteration
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              Low Risk Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 mb-2">{stats?.low_risk_count || 0}</div>
            <p className="text-sm text-slate-600 mb-4">
              Low priority tests with minimal defect risk
            </p>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-sm text-emerald-800 font-medium">
                Optional or future testing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">Recent Test Case Titles</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Latest generated test cases with risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recent_titles?.slice(0, 8).map((title) => (
              <div key={title.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-1">{title.test_case_title}</h4>
                    <p className="text-sm text-slate-600 mb-2">{title.test_category}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {title.priority} Priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {title.complexity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {title.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={`text-sm px-3 py-1 ${
                        title.defect_likelihood_color === 'Red' ? 'bg-red-100 text-red-800 border-red-200' :
                        title.defect_likelihood_color === 'Yellow' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {title.defect_likelihood_color} Risk
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">
                      {Math.round(title.defect_likelihood_score * 100)}% likelihood
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Test Case Title Generator Component
const TestCaseGenerator = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '' });
  const [generatingFor, setGeneratingFor] = useState(null);

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

  const generateTestTitles = async (storyId) => {
    setGeneratingFor(storyId);
    try {
      toast.info('Generating test case titles with AI...');
      await axios.post(`${API}/stories/${storyId}/generate-test-titles`);
      toast.success('Test case titles generated successfully');
      fetchStories();
    } catch (error) {
      console.error('Error generating test titles:', error);
      toast.error('Failed to generate test titles');
    } finally {
      setGeneratingFor(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Test Case Generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">Test Case Generator</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Generate comprehensive test case titles with risk assessment for your user stories
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
            <CardTitle className="text-2xl font-bold text-slate-800">Create New User Story</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Add a user story to generate comprehensive test case titles
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
                placeholder="Describe the user story in detail, including user goals and acceptance criteria"
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
              <CardTitle className="text-xl font-bold text-slate-800 leading-tight mb-3">
                {story.title}
              </CardTitle>
              <CardDescription className="text-base text-slate-600 leading-relaxed">
                {story.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <Button 
                  onClick={() => generateTestTitles(story.id)}
                  disabled={generatingFor === story.id}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  <TestTube className="w-4 h-4" />
                  {generatingFor === story.id ? 'Generating...' : 'Generate Test Titles'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = `/test-results/${story.id}`}
                  className="flex items-center gap-2 hover:bg-slate-50"
                >
                  <Eye className="w-4 h-4" />
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stories.length === 0 && (
        <Card className="shadow-xl bg-white border-0 max-w-2xl mx-auto">
          <CardContent className="text-center py-16">
            <FileText className="w-20 h-20 text-slate-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-3">No stories yet</h3>
            <p className="text-slate-600 text-base mb-6 leading-relaxed">
              Create your first user story to start generating test case titles with risk assessment
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

// Test Results View Component
const TestResults = ({ storyId }) => {
  const [story, setStory] = useState(null);
  const [testTitles, setTestTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('test_category');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Unit Tests', 'API Tests', 'Database Tests', 'Security Tests', 'Manual Tests', 'Automation Tests'];

  useEffect(() => {
    fetchTestResults();
  }, [storyId]);

  const fetchTestResults = async () => {
    try {
      const [storyResponse, titlesResponse] = await Promise.all([
        axios.get(`${API}/stories/${storyId}`),
        axios.get(`${API}/stories/${storyId}/test-titles`)
      ]);

      setStory(storyResponse.data);
      setTestTitles(titlesResponse.data);
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast.error('Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      const response = await axios.get(`${API}/test-titles/export/${format}?story_id=${storyId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `test_case_titles.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const getRiskBadgeColor = (color) => {
    switch (color) {
      case 'Red': return 'bg-red-100 text-red-800 border-red-200';
      case 'Yellow': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Green': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const sortedAndFilteredTitles = testTitles
    .filter(title => {
      const matchesSearch = title.test_case_title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || title.test_category === filterCategory;
      const matchesRisk = filterRisk === 'all' || title.defect_likelihood_color.toLowerCase() === filterRisk;
      
      return matchesSearch && matchesCategory && matchesRisk;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'defect_likelihood_score') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
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
          <p className="text-lg text-gray-600">Loading Test Case Results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">{story?.title}</h1>
        <p className="text-lg text-slate-600 mb-4">{story?.description}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => exportData('csv')} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={() => exportData('json')} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Search Test Cases</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search test case titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category Filter</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Risk Filter</label>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger>
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="red">High Risk</SelectItem>
                  <SelectItem value="yellow">Medium Risk</SelectItem>
                  <SelectItem value="green">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Results</label>
              <div className="text-lg font-semibold text-slate-800 py-2">
                {sortedAndFilteredTitles.length} test cases
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Table */}
      <Card className="shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Test Case Titles with Risk Assessment</CardTitle>
          <CardDescription>Click column headers to sort • Minimum 10 test cases per category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead 
                    className="font-bold text-slate-800 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('test_category')}
                  >
                    <div className="flex items-center gap-2">
                      Test Category
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-bold text-slate-800 cursor-pointer hover:bg-slate-100 min-w-[300px]"
                    onClick={() => handleSort('test_case_title')}
                  >
                    <div className="flex items-center gap-2">
                      Test Case Title
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center font-bold text-slate-800 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Priority
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center font-bold text-slate-800 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('complexity')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Complexity
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center font-bold text-slate-800 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('severity')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Severity
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center font-bold text-slate-800 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('defect_likelihood_score')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Defect Likelihood
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredTitles.map((title) => (
                  <TableRow key={title.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {title.test_category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="font-medium text-slate-800 leading-tight">
                        {title.test_case_title}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={`${
                          title.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                          title.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {title.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={`${
                          title.complexity === 'Complex' ? 'bg-red-100 text-red-800 border-red-200' :
                          title.complexity === 'Moderate' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {title.complexity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={`${
                          title.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
                          title.severity === 'Major' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {title.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge className={`${getRiskBadgeColor(title.defect_likelihood_color)} font-medium`}>
                          {title.defect_likelihood_color} Risk
                        </Badge>
                        <span className="text-xs text-slate-600">
                          {Math.round(title.defect_likelihood_score * 100)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {sortedAndFilteredTitles.length === 0 && (
            <div className="text-center py-12">
              <TestTube className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No test cases found</h3>
              <p className="text-slate-600">Try adjusting your filters or generate test cases first</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">
            <Target className="w-8 h-8 text-indigo-600" />
            StoryTest Parser
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
              to="/generator" 
              className="flex items-center gap-2 text-base font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              <TestTube className="w-5 h-5" />
              Generator
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
          <Route path="/generator" element={<TestCaseGenerator />} />
          <Route path="/test-results/:storyId" element={<TestResultsWrapper />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

// Wrapper component to extract storyId from params
const TestResultsWrapper = () => {
  const { storyId } = useParams();
  return <TestResults storyId={storyId} />;
};

export default App;