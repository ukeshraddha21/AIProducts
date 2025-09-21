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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
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
  XCircle,
  Info,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Users,
  Code
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8001"}/api`;

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
          <p className="text-lg text-gray-600">Loading Test Coverage Analytics...</p>
        </div>
      </div>
    );
  }

  const riskData = [
    { name: 'High Risk', value: stats?.high_risk_count || 0, color: '#DC2626', fill: '#DC2626' },
    { name: 'Medium Risk', value: stats?.medium_risk_count || 0, color: '#D97706', fill: '#D97706' },
    { name: 'Low Risk', value: stats?.low_risk_count || 0, color: '#059669', fill: '#059669' }
  ];

  const categoryData = Object.entries(stats?.category_distribution || {}).map(([category, count]) => ({
    name: category.replace(' Tests', ''),
    value: count,
    fill: '#3B82F6'
  }));

  return (
    <TooltipProvider>
      <div className="space-y-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
              Test Coverage Analytics
            </h1>
          </div>
          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            AI-powered test case generation insights for development teams without dedicated QA resources
          </p>
        </div>

        {/* Key Metrics Cards with Tooltips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base lg:text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">{stats?.total_stories || 0}</div>
                  <p className="text-sm text-slate-500">Stories analyzed with AI</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total number of user stories processed by the AI system</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base lg:text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <TestTube className="w-5 h-5" />
                    Test Cases Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">{stats?.total_test_titles || 0}</div>
                  <p className="text-sm text-slate-500">AI-generated test cases</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total test case titles generated across all categories (minimum 10 per category)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base lg:text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    High Risk Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl lg:text-4xl font-bold text-red-600 mb-2">{stats?.high_risk_count || 0}</div>
                  <p className="text-sm text-slate-500">Critical defect risk if missed</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Test cases with high defect likelihood (≥70%) - require immediate attention</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base lg:text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Avg Defect Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                    {Math.round((stats?.average_defect_likelihood || 0) * 100)}%
                  </div>
                  <p className="text-sm text-slate-500">Average defect likelihood</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Average defect likelihood score across all generated test cases</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10 mb-12">
          <Card className="shadow-lg bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl lg:text-2xl font-bold text-slate-800">Risk Distribution</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Defect likelihood assessment across all test cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl lg:text-2xl font-bold text-slate-800">Test Category Coverage</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Distribution across Unit, API, Database, Security, Manual, and Automation tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Risk Level Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          <Card className="glass-card border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                High Risk Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-red-600 mb-2">{stats?.high_risk_count || 0}</div>
              <p className="text-sm text-slate-600 mb-4">
                Critical priority tests with ≥70% defect likelihood if missed
              </p>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Immediate attention required
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                Medium Risk Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-amber-600 mb-2">{stats?.medium_risk_count || 0}</div>
              <p className="text-sm text-slate-600 mb-4">
                Moderate priority tests with 40-69% defect likelihood
              </p>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Schedule for next iteration
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                Low Risk Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-2">{stats?.low_risk_count || 0}</div>
              <p className="text-sm text-slate-600 mb-4">
                Lower priority tests with &lt;40% defect likelihood
              </p>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <p className="text-sm text-emerald-800 font-medium flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Optional or future testing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Enhanced Test Case Generator Component with Batch Input
const TestCaseGenerator = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '' });
  const [batchStories, setBatchStories] = useState('');
  const [showBatchInput, setShowBatchInput] = useState(false);
  const [generatingFor, setGeneratingFor] = useState(new Set());

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get(`${API}/stories`);
      // Sort stories by created_at in descending order (newest first)
      const sortedStories = response.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setStories(sortedStories);
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

  const createBatchStories = async () => {
    if (!batchStories.trim()) {
      toast.error('Please enter user stories');
      return;
    }

    // Parse batch stories (expect one per line or separated by double newlines)
    const storyLines = batchStories.split('\n\n').filter(line => line.trim());
    const createdStories = [];

    try {
      for (const storyText of storyLines) {
        const lines = storyText.trim().split('\n');
        const title = lines[0] || `User Story ${Date.now()}`;
        const description = lines.slice(1).join('\n') || storyText;

        const response = await axios.post(`${API}/stories`, {
          title: title.replace(/^Title:\s*/i, '').trim(),
          description: description.replace(/^Description:\s*/i, '').trim()
        });
        createdStories.push(response.data);
      }

      toast.success(`Created ${createdStories.length} stories successfully`);
      setBatchStories('');
      setShowBatchInput(false);
      fetchStories();
    } catch (error) {
      console.error('Error creating batch stories:', error);
      toast.error('Failed to create some stories');
    }
  };

  const generateTestTitles = async (storyId) => {
    setGeneratingFor(prev => new Set([...prev, storyId]));
    try {
      toast.info('Generating comprehensive test case titles with AI...', { duration: 5000 });
      await axios.post(`${API}/stories/${storyId}/generate-test-titles`);
      toast.success('Test case titles generated successfully with risk assessment');
      fetchStories();
    } catch (error) {
      console.error('Error generating test titles:', error);
      toast.error('Failed to generate test titles');
    } finally {
      setGeneratingFor(prev => {
        const newSet = new Set(prev);
        newSet.delete(storyId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading AI StoryTest Generator...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-10 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6 lg:p-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lightbulb className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">AI StoryTest Generator</h1>
          </div>
          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Convert user stories into detailed test case enhanced with AI-driven risk evaluation
          </p>
          
          {/* User Story Format Guide */}
          <Card className="max-w-2xl mx-auto mb-8 glass-card border-blue-200/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-semibold text-blue-900 mb-2">Recommended User Story Format</h3>
                  <p className="text-blue-800 text-sm mb-2">
                    <strong>As a</strong> [role], <strong>I want</strong> [goal] <strong>so that</strong> [benefit]
                  </p>
                  <p className="text-blue-700 text-xs">
                    Example: "As a user, I want to log into the system using my email and password so that I can access my personal dashboard"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="px-6 lg:px-8 py-3 text-base lg:text-lg font-medium glass-button text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Single Story
            </Button>
            <Button 
              onClick={() => setShowBatchInput(true)} 
              variant="outline"
              className="px-6 lg:px-8 py-3 text-base lg:text-lg font-medium glass border-indigo-400 text-indigo-700"
            >
              <FileText className="w-5 h-5 mr-2" />
              Batch Input Stories
            </Button>
          </div>
        </div>

        {/* Single Story Creation Form */}
        {showCreateForm && (
          <Card className="shadow-xl bg-white border-0 max-w-3xl mx-auto">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl lg:text-2xl font-bold text-slate-800">Create New User Story</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Add a user story to generate comprehensive test case titles with risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Story Title</label>
                <Input
                  placeholder="e.g., User Login Feature, Payment Processing, etc."
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  className="text-base py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Story Description</label>
                <Textarea
                  placeholder="As a user, I want to be able to log into the system using my email and password so that I can access my personal dashboard and manage my account settings. Include acceptance criteria and any specific requirements."
                  value={newStory.description}
                  onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                  rows={6}
                  className="text-base"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={createStory}
                  className="px-6 py-2 glass-button text-white"
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

        {/* Batch Story Creation Form */}
        {showBatchInput && (
          <Card className="shadow-xl bg-white border-0 max-w-4xl mx-auto">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl lg:text-2xl font-bold text-slate-800">Batch Input User Stories</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Enter multiple user stories separated by double line breaks. Each story should start with a title on the first line.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">User Stories (separate each story with a blank line)</label>
                <Textarea
                  placeholder={`User Login Feature
As a user, I want to be able to log into the system using my email and password so that I can access my personal dashboard.

Shopping Cart Management
As a customer, I want to add items to my shopping cart so that I can purchase multiple products in a single transaction.

Password Reset Functionality
As a user, I want to reset my password when I forget it so that I can regain access to my account.`}
                  value={batchStories}
                  onChange={(e) => setBatchStories(e.target.value)}
                  rows={12}
                  className="text-base font-mono"
                />
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-800 text-sm">
                  <strong>Format:</strong> Each story should have a title on the first line, followed by the description. 
                  Separate different stories with a blank line.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={createBatchStories}
                  className="px-6 py-2 glass-button text-white"
                >
                  Create All Stories
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowBatchInput(false)}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stories List */}
        <div className="max-w-6xl mx-auto space-y-4">
          {stories.map((story, index) => (
            <Card key={story.id} className="glass-card hover:shadow-xl transition-all duration-300 border-0 group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Story Number */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 glass-button text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Story Content */}
                  <div className="flex-grow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-grow">
                        <h3 className="text-lg lg:text-xl font-bold text-slate-800 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">
                          {story.title}
                        </h3>
                        <p className="text-base text-slate-600 leading-relaxed mb-4">
                          {story.description}
                        </p>
                        
                        {generatingFor.has(story.id) && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                            <div className="flex items-center gap-2 text-blue-800 text-sm">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span>AI is generating 60+ test cases across 6 categories...</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 flex-shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              onClick={() => generateTestTitles(story.id)}
                              disabled={generatingFor.has(story.id)}
                              className="flex items-center gap-2 glass-button text-white"
                            >
                              <TestTube className="w-4 h-4" />
                              {generatingFor.has(story.id) ? 'Generating...' : 'Generate Test Cases'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate 60+ test case titles across 6 categories with risk assessment</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              onClick={() => window.location.href = `/test-results/${story.id}`}
                              className="flex items-center gap-2 glass hover:glass-hover"
                            >
                              <Eye className="w-4 h-4" />
                              View Results
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Test Cases with Risk Assessment</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
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
                Create your first user story to start generating comprehensive test case titles with AI-powered risk assessment
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="px-8 py-3 glass-button text-white"
                >
                  Create Your First Story
                </Button>
                <Button 
                  onClick={() => setShowBatchInput(true)}
                  variant="outline"
                  className="px-8 py-3"
                >
                  Or Batch Import
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

// Enhanced Test Results View Component with Expandable Rows
const TestResults = ({ storyId }) => {
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [testTitles, setTestTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('test_category');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

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
      link.setAttribute('download', `test_case_titles_${story?.title?.replace(/[^a-z0-9]/gi, '_')}.${format}`);
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

  const getRiskLabel = (color) => {
    switch (color) {
      case 'Red': return 'High Risk';
      case 'Yellow': return 'Medium Risk';
      case 'Green': return 'Low Risk';
      default: return 'Unknown Risk';
    }
  };

  const toggleRowExpansion = (testId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
      }
      return newSet;
    });
  };

  const sortedAndFilteredTitles = testTitles
    .filter(title => {
      const matchesSearch = title.test_case_title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || title.test_category === filterCategory;
      const matchesRisk = filterRisk === 'all' || title.defect_likelihood_color.toLowerCase() === filterRisk;
      const matchesPriority = filterPriority === 'all' || title.priority === filterPriority;
      
      return matchesSearch && matchesCategory && matchesRisk && matchesPriority;
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
    <TooltipProvider>
      <div className="space-y-8 p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/generator')} 
            variant="outline" 
            className="flex items-center gap-2 glass hover:glass-hover"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Generator
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">{story?.title}</h1>
          <p className="text-base lg:text-lg text-slate-600 mb-6 max-w-4xl mx-auto leading-relaxed">{story?.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => exportData('csv')} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download test cases as CSV for spreadsheet tools</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => exportData('json')} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export JSON
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download test cases as JSON for integration with test management tools</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Enhanced Filters */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl font-bold text-slate-800 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
            <CardDescription>
              Filter and search through {testTitles.length} generated test case titles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <label className="text-sm font-medium text-slate-700">Category</label>
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
                <label className="text-sm font-medium text-slate-700">Risk Level</label>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Risk Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="red">High Risk (≥70%)</SelectItem>
                    <SelectItem value="yellow">Medium Risk (40-69%)</SelectItem>
                    <SelectItem value="green">Low Risk (&lt;40%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Priority</label>
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
                <label className="text-sm font-medium text-slate-700">Results</label>
                <div className="text-lg font-semibold text-slate-800 py-2 px-3 bg-slate-50 rounded-md">
                  {sortedAndFilteredTitles.length} test cases
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Test Cases Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl font-bold text-slate-800">Test Case Titles with Risk Assessment</CardTitle>
            <CardDescription>
              Click column headers to sort • Click expand icon to view details • Minimum 10 test cases per category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="glass-table">
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-16 text-center font-bold text-slate-800">#</TableHead>
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
                      onClick={() => handleSort('defect_likelihood_score')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Defect Likelihood
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
                      onClick={() => handleSort('complexity')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Complexity
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredTitles.map((title, index) => (
                    <React.Fragment key={title.id}>
                      <TableRow className="hover:glass-hover"
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(title.id)}
                            className="p-1"
                          >
                            {expandedRows.has(title.id) ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                          </Button>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-slate-700">
                          {index + 1}
                        </TableCell>
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
                          <div className="flex flex-col items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={`${getRiskBadgeColor(title.defect_likelihood_color)} font-medium cursor-help`}>
                                  {getRiskLabel(title.defect_likelihood_color)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Risk of production defect if this test is missed</p>
                              </TooltipContent>
                            </Tooltip>
                            <span className="text-xs text-slate-600 font-medium">
                              {Math.round(title.defect_likelihood_score * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                className={`cursor-help ${
                                  title.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' :
                                  title.severity === 'Major' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  'bg-emerald-100 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {title.severity}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{title.severity} severity if defect occurs</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                className={`cursor-help ${
                                  title.complexity === 'Complex' ? 'bg-red-100 text-red-800 border-red-200' :
                                  title.complexity === 'Moderate' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  'bg-emerald-100 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {title.complexity}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{title.complexity} implementation complexity</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                className={`cursor-help ${
                                  title.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                                  title.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  'bg-emerald-100 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {title.priority}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{title.priority} priority test case</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expandable Row Details */}
                      {expandedRows.has(title.id) && (
                        <TableRow className="bg-slate-50">
                          <TableCell colSpan={8}>
                            <div className="py-4 px-6 space-y-4">
                              <h4 className="font-semibold text-slate-800 mb-3">Test Case Details</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700">Risk Assessment</label>
                                  <div className="p-3 bg-white rounded border">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className={getRiskBadgeColor(title.defect_likelihood_color)}>
                                        {getRiskLabel(title.defect_likelihood_color)}
                                      </Badge>
                                      <span className="text-sm font-medium">
                                        {Math.round(title.defect_likelihood_score * 100)}% likelihood
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600">
                                      Calculated based on Priority ({title.priority}), 
                                      Complexity ({title.complexity}), and 
                                      Severity ({title.severity})
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700">Test Attributes</label>
                                  <div className="p-3 bg-white rounded border space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-slate-600">Priority:</span>
                                      <Badge variant="outline">{title.priority}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-slate-600">Complexity:</span>
                                      <Badge variant="outline">{title.complexity}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-slate-600">Severity:</span>
                                      <Badge variant="outline">{title.severity}</Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700">Test Category</label>
                                  <div className="p-3 bg-white rounded border">
                                    <Badge variant="outline" className="mb-2">{title.test_category}</Badge>
                                    <p className="text-xs text-slate-600">
                                      {title.test_category === 'Unit Tests' && 'Tests individual functions and components in isolation'}
                                      {title.test_category === 'API Tests' && 'Tests REST endpoints, request/response validation'}
                                      {title.test_category === 'Database Tests' && 'Tests data persistence, queries, and constraints'}
                                      {title.test_category === 'Security Tests' && 'Tests authentication, authorization, and vulnerabilities'}
                                      {title.test_category === 'Manual Tests' && 'Tests user workflows and exploratory scenarios'}
                                      {title.test_category === 'Automation Tests' && 'Tests automated workflows and regression scenarios'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h5 className="font-medium text-slate-800 mb-2">Implementation Guidance</h5>
                                <p className="text-sm text-slate-700">
                                  This test case should be implemented as a {title.test_category.toLowerCase().replace(' tests', '')} test 
                                  with {title.priority.toLowerCase()} priority. Expected implementation complexity is {title.complexity.toLowerCase()}.
                                  {title.defect_likelihood_color === 'Red' && ' This is a high-risk test - implement immediately.'}
                                  {title.defect_likelihood_color === 'Yellow' && ' This is a medium-risk test - schedule for next iteration.'}
                                  {title.defect_likelihood_color === 'Green' && ' This is a low-risk test - can be implemented later or as optional.'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
    </TooltipProvider>
  );
};

// Enhanced Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 lg:px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8 lg:space-x-10">
          <Link to="/" className="flex items-center gap-3 text-xl lg:text-2xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">
            <Target className="w-7 h-7 lg:w-8 lg:h-8 text-indigo-600" />
            <span className="hidden sm:block">AI StoryTest Generator</span>
            <span className="sm:hidden">AI StoryTest</span>
          </Link>
          <div className="flex space-x-6 lg:space-x-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm lg:text-base font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg glass hover:glass-hover"
            >
              <Home className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:block">Dashboard</span>
            </Link>
            <Link 
              to="/generator" 
              className="flex items-center gap-2 text-sm lg:text-base font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg glass hover:glass-hover"
            >
              <TestTube className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:block">Generator</span>
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
          <Code className="w-4 h-4" />
          <span>For development teams without dedicated QA</span>
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