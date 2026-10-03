import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import { logoutUserAPI } from './authSlice';

function ProblemPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Submission tab
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Chat AI
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Result panel
  const [showPanel, setShowPanel] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [result, setResult] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);

  // Editor
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('cpp');
  const [activeTab, setActiveTab] = useState('description');

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  const getStartCode = (lang) => {
    const code = problem?.startCode?.find(item => item.language === lang);
    return code?.initialCode || '// Start coding here...';
  };

  const handleLogout = () => {
    dispatch(logoutUserAPI());
    navigate('/');
  };

  // ── Fetch Submissions ──
  const fetchSubmissions = async () => {
    setSubmissionsLoading(true);
    try {
      const { data } = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
      setSubmissions(data);
    } catch (err) {
      console.log("Submissions fetch error:", err.message);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // ── Tab click ──
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'submissions') fetchSubmissions();
    if (tabId === 'chatai' && messages.length === 0) {
      // Initial greeting from AI
      setMessages([{
        role: 'ai',
        text: `Hi! I'm your AI assistant for **${problem?.title}**. How can I help you? 😊`
      }]);
    }
  };

  // ── Chat Send ──
  const handleChatSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const { data } = await axiosClient.post('/chat/ai', {
        message: trimmed,
        problemTitle: problem?.title,
        problemDescription: problem?.description,
      });
      console.log(data); 
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠ Something went wrong. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Run ──
  const handleRunProblem = async () => {
    setResultLoading(true);
    setShowPanel(true);
    setPanelType('run');
    setResult(null);
    try {
      const code = editorRef.current.getValue();
      const { data } = await axiosClient.post(`/submission/run/${problem._id}`, { code, language });
      setResult(data);
    } catch (err) {
      setResult({ summary: { allPassed: false }, errorMessage: err.response?.data?.message || err.message });
    } finally {
      setResultLoading(false);
    }
  };

  // ── Submit ──
  const handleSubmitProblem = async () => {
    setResultLoading(true);
    setShowPanel(true);
    setPanelType('submit');
    setResult(null);
    try {
      const code = editorRef.current.getValue();
      const { data } = await axiosClient.post(`/submission/submit/${problem._id}`, { code, language });
      setResult(data);
    } catch (err) {
      setResult({ accepted: false, errorMessage: err.response?.data?.message || err.message });
    } finally {
      setResultLoading(false);
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load problem");
      } finally {
        setLoading(false);
      }
    };
    if (problemId) fetchProblem();
  }, [problemId]);

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":   return "bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]";
      case "Medium": return "bg-[#ff9f0a1a] text-[#ff9f0a] border border-[#ff9f0a30]";
      case "Hard":   return "bg-[#ff453a1a] text-[#ff453a] border border-[#ff453a30]";
      default:       return "bg-[#1c1c1e] text-[#98989d] border border-[#ffffff10]";
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#ffffff10] border-t-[#98989d] animate-spin"></div>
        <p className="text-[12px] text-[#48484a]">Loading problem...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div className="bg-[#111111] border border-[#ffffff0f] rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="text-3xl mb-4">⚠️</div>
        <p className="text-[14px] text-white font-medium mb-1">Failed to load problem</p>
        <p className="text-[12px] text-[#48484a] mb-6">{error}</p>
        <button onClick={() => navigate('/home')} className="px-5 py-2 bg-white text-black text-[12px] font-semibold rounded-[9px] hover:bg-[#f0f0f0] transition-colors">Go Home</button>
      </div>
    </div>
  );

  if (!problem) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <p className="text-[13px] text-[#48484a]">No problem found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col"
      style={{ WebkitFontSmoothing: 'antialiased', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* ══ TOP NAVBAR ══ */}
      <nav className="sticky top-0 z-50 border-b border-[#ffffff0f]"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}>
        <div className="max-w-full px-7 h-[52px] flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/home')}>
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>&lt;/&gt;</div>
            <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[13px] text-[#48484a]">←</span>
            <span className="text-[13px] font-medium text-[#98989d] truncate max-w-[300px]">{problem.title}</span>
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
          </div>
          <div className="flex items-center gap-2.5">
            {user?.role === "Admin" && (
              <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1c1e] border border-[#ffffff18] text-[11px] font-medium text-[#98989d] hover:text-white hover:border-[#ffffff30] hover:bg-[#2a2a2e] transition-all duration-200">
                <span className="text-[10px]">⚙️</span> Admin Panel
              </button>
            )}
            <button onClick={() => navigate('/profile')} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1c1e] border border-[#ffffff18] text-[11px] font-medium text-[#98989d] hover:text-white hover:border-[#ffffff30] hover:bg-[#2a2a2e] transition-all duration-200">
              <span className="text-[10px]">👤</span> Profile
            </button>
            <button onClick={handleLogout} title="Logout" className="relative w-[30px] h-[30px] rounded-full bg-[#1c1c1e] border border-[#ffffff1a] flex items-center justify-center text-[12px] font-semibold text-[#98989d] transition-all duration-200 hover:border-[#ff453a55] hover:bg-[#ff453a14] focus:outline-none overflow-hidden group">
              <span className="group-hover:opacity-0 transition-opacity duration-200">{userInitial}</span>
              <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[13px]">↩</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ══ SECOND NAVBAR ══ */}
      <div className="border-b border-[#ffffff0a]"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex justify-between items-center h-[42px]">
          <div className="flex items-center h-full">
            {[
              { id: 'description', label: 'Description' },
              { id: 'tutorial',    label: 'Tutorial' },
              { id: 'chatai',      label: '✦ Chat AI' },
              { id: 'submissions', label: 'Submissions' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`h-full px-5 text-[12px] font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? tab.id === 'chatai'
                      ? 'border-[#32d74b] text-[#32d74b]'
                      : 'border-white text-white'
                    : 'border-transparent text-[#48484a] hover:text-[#98989d]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pr-4">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#1c1c1e] border border-[#ffffff10] text-[#98989d] text-[11px] font-medium rounded-[7px] px-3 py-1.5 outline-none cursor-pointer hover:border-[#ffffff20] transition-colors duration-200"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
            <button onClick={handleRunProblem} disabled={resultLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] bg-[#1c1c1e] border border-[#ffffff10] text-[11px] font-medium text-[#98989d] hover:text-white hover:border-[#ffffff25] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
              {resultLoading && panelType === 'run'
                ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-[#ffffff20] border-t-[#98989d] animate-spin inline-block"></span>Running...</span>
                : '▷ Run'}
            </button>
            <button onClick={handleSubmitProblem} disabled={resultLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] bg-white text-black text-[11px] font-semibold hover:bg-[#f0f0f0] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
              {resultLoading && panelType === 'submit' ? '...' : '✓ Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 136px)' }}>

        {/* LEFT */}
        <div className={`w-[42%] border-r border-[#ffffff08] flex flex-col ${activeTab === 'chatai' ? '' : 'overflow-y-auto'}`}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#1c1c1e transparent' }}>

          {/* ── Description ── */}
          {activeTab === 'description' && (
            <div className="p-6">
              <div className="mb-5">
                <h1 className="text-[18px] font-semibold text-white tracking-tight mb-2">{problem.title}</h1>
                <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
              </div>
              <div className="h-px bg-[#ffffff08] mb-5"></div>
              <div className="mb-6">
                <p className="text-[13px] text-[#98989d] leading-relaxed whitespace-pre-wrap">{problem.description}</p>
              </div>
              {Array.isArray(problem.visibleTestCases) && problem.visibleTestCases.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-3">Examples</h3>
                  <div className="space-y-3">
                    {problem.visibleTestCases.slice(0, 2).map((tc, i) => (
                      <div key={i} className="bg-[#111111] border border-[#ffffff08] rounded-[10px] overflow-hidden">
                        <div className="px-4 py-2 border-b border-[#ffffff08]">
                          <span className="text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Example {i + 1}</span>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                          <div>
                            <span className="text-[10px] font-medium text-[#48484a] uppercase tracking-wider">Input</span>
                            <pre className="mt-1 text-[12px] text-[#f5f5f7] font-mono bg-[#1c1c1e] rounded-[6px] px-3 py-2 overflow-x-auto">{tc.input}</pre>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-[#48484a] uppercase tracking-wider">Output</span>
                            <pre className="mt-1 text-[12px] text-[#f5f5f7] font-mono bg-[#1c1c1e] rounded-[6px] px-3 py-2 overflow-x-auto">{tc.output}</pre>
                          </div>
                          {tc.explanation && (
                            <div>
                              <span className="text-[10px] font-medium text-[#48484a] uppercase tracking-wider">Explanation</span>
                              <p className="mt-1 text-[11px] text-[#98989d] leading-relaxed">{tc.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Tutorial ── */}
          {activeTab === 'tutorial' && (
            <div className="p-6">
              <h3 className="text-[13px] font-semibold text-white mb-4">Tutorial</h3>
              <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-5 py-8 text-center">
                <div className="text-2xl mb-3">📖</div>
                <p className="text-[12px] text-[#48484a]">No tutorial available for this problem yet.</p>
              </div>
            </div>
          )}

          {/* ── Chat AI ── */}
          {activeTab === 'chatai' && (
            <div className="flex flex-col h-full">

              {/* Chat header */}
              <div className="px-5 py-3 border-b border-[#ffffff08] flex items-center gap-2.5 shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#32d74b15] border border-[#32d74b30] flex items-center justify-center text-[11px]">✦</div>
                <div>
                  <p className="text-[12px] font-semibold text-white">AI Assistant</p>
                  <p className="text-[10px] text-[#48484a]">Ask hints, clarify doubts</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b] inline-block"></span>
                  <span className="text-[10px] text-[#32d74b]">Online</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#1c1c1e transparent' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-[#32d74b15] border border-[#32d74b30] flex items-center justify-center text-[10px] mr-2 mt-0.5 shrink-0">✦</div>
                    )}
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-[12px] text-[12px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white text-black rounded-tr-[4px]'
                        : 'bg-[#1c1c1e] border border-[#ffffff0a] text-[#f5f5f7] rounded-tl-[4px]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* AI typing indicator */}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-[#32d74b15] border border-[#32d74b30] flex items-center justify-center text-[10px] mr-2 mt-0.5 shrink-0">✦</div>
                    <div className="bg-[#1c1c1e] border border-[#ffffff0a] rounded-[12px] rounded-tl-[4px] px-4 py-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#48484a] animate-bounce inline-block" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#48484a] animate-bounce inline-block" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#48484a] animate-bounce inline-block" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-[#ffffff08] shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChatSend()}
                    placeholder="Ask a hint or question..."
                    className="flex-1 bg-[#1c1c1e] border border-[#ffffff10] rounded-[10px] px-4 py-2 text-[12px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff20] transition-colors duration-200"
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-3.5 py-2 bg-[#32d74b] text-black text-[11px] font-semibold rounded-[10px] hover:bg-[#2bc740] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ↑
                  </button>
                </div>
                <p className="text-[10px] text-[#2a2a2e] mt-1.5 text-center">AI gives hints only — not direct solutions</p>
              </div>

            </div>
          )}

          {/* ── Submissions ── */}
          {activeTab === 'submissions' && (
            <div className="p-6">
              <h3 className="text-[13px] font-semibold text-white mb-4">Submission History</h3>
              {submissionsLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 rounded-full border-2 border-[#ffffff10] border-t-[#98989d] animate-spin"></div>
                </div>
              )}
              {!submissionsLoading && submissions.length === 0 && (
                <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-5 py-8 text-center">
                  <div className="text-2xl mb-3">📋</div>
                  <p className="text-[12px] text-[#48484a]">No submissions yet.</p>
                </div>
              )}
              {!submissionsLoading && submissions.length > 0 && (
                <div className="space-y-2">
                  {submissions.map((sub, i) => (
                    <div key={i} className="bg-[#111111] border border-[#ffffff08] rounded-[10px] overflow-hidden">
                      <div className="px-4 py-3 flex items-center justify-between border-b border-[#ffffff06]">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sub.status === 'accepted'
                              ? 'bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]'
                              : 'bg-[#ff453a1a] text-[#ff453a] border border-[#ff453a30]'
                          }`}>
                            {sub.status === 'accepted' ? 'Accepted' : 'Wrong Answer'}
                          </span>
                          <span className="text-[10px] text-[#48484a] font-mono uppercase">{sub.language}</span>
                        </div>
                        <span className="text-[10px] text-[#2a2a2e]">
                          {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="px-4 py-3 grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[10px] text-[#48484a] uppercase tracking-wider mb-0.5">Test Cases</p>
                          <p className="text-[12px] font-medium text-white">{sub.testCasesPassed} / {sub.testCasesTotal}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#48484a] uppercase tracking-wider mb-0.5">Runtime</p>
                          <p className="text-[12px] font-medium text-white">{sub.runtime ? `${parseFloat(sub.runtime).toFixed(3)} ms` : '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#48484a] uppercase tracking-wider mb-0.5">Memory</p>
                          <p className="text-[12px] font-medium text-white">{sub.memory ? `${sub.memory} KB` : '—'}</p>
                        </div>
                      </div>
                      {sub.errorMessage && (
                        <div className="px-4 pb-3">
                          <pre className="text-[10px] text-[#ff453a] font-mono bg-[#ff453a08] border border-[#ff453a15] rounded-[6px] px-3 py-2 whitespace-pre-wrap">{sub.errorMessage}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT — Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={getStartCode(language)}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              padding: { top: 16, bottom: 16 },
              tabSize: 2,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              contextmenu: false,
              scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
            }}
          />
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-[#ffffff0a] py-2.5" style={{ background: 'rgba(0,0,0,0.8)' }}>
        <div className="max-w-full px-7">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-white text-black flex items-center justify-center text-[8px] font-medium rounded-[4px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>&lt;/&gt;</div>
                <span className="text-[12px] font-medium text-[#48484a]">CodeIt</span>
              </div>
              <span className="text-[#2a2a2e] text-[11px] hidden md:block">|</span>
              <span className="text-[11px] text-[#2a2a2e] hidden md:block">Production-grade competitive coding platform</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1c1c1e] border border-[#ff9f0a20] rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] inline-block"></span>
              <span className="text-[11px] text-[#ff9f0a] font-medium">Unlock Premium — starting at ₹199/mo</span>
            </div>
            <div className="flex gap-5 text-[11px] text-[#48484a]">
              <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Contact</a>
              <span className="text-[#2a2a2e]">© 2026 CodeIt</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* ══ RUN PANEL ══ */}
      {showPanel && panelType === 'run' && (
        <div className="fixed bottom-0 left-0 right-0 z-50"
          style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)', animation: 'slideUp 0.25s ease' }}>
          <div className="px-7 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">Run Result</span>
                {resultLoading && <div className="w-3.5 h-3.5 rounded-full border-2 border-[#ffffff10] border-t-[#98989d] animate-spin"></div>}
                {!resultLoading && result && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    result.summary?.allPassed ? 'bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]' : 'bg-[#ff453a1a] text-[#ff453a] border border-[#ff453a30]'
                  }`}>
                    {result.summary?.allPassed ? 'All Passed' : 'Failed'}
                  </span>
                )}
              </div>
              <button onClick={() => setShowPanel(false)} className="w-6 h-6 rounded-full bg-[#1c1c1e] border border-[#ffffff0f] flex items-center justify-center text-[#48484a] hover:text-white text-[10px] transition-colors">✕</button>
            </div>
            {resultLoading && <p className="text-[12px] text-[#48484a] pb-2">Running your code, please wait...</p>}
            {!resultLoading && result && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#48484a] uppercase tracking-wider font-medium mb-1">Status</p>
                    <p className={`text-[13px] font-semibold ${result.summary?.allPassed ? 'text-[#32d74b]' : 'text-[#ff453a]'}`}>{result.summary?.allPassed ? 'All Passed' : 'Failed'}</p>
                  </div>
                  <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#48484a] uppercase tracking-wider font-medium mb-1">Test Cases</p>
                    <p className="text-[13px] font-semibold text-white">{result.summary?.passedTests ?? '—'} / {result.summary?.totalTests ?? '—'}</p>
                  </div>
                  <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#48484a] uppercase tracking-wider font-medium mb-1">Runtime</p>
                    <p className="text-[13px] font-semibold text-white">{result.summary?.totalRuntime ? `${parseFloat(result.summary.totalRuntime).toFixed(3)} ms` : '—'}</p>
                  </div>
                  <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#48484a] uppercase tracking-wider font-medium mb-1">Memory</p>
                    <p className="text-[13px] font-semibold text-white">{result.summary?.maxMemory ? `${result.summary.maxMemory} KB` : '—'}</p>
                  </div>
                </div>
                {!result.summary?.allPassed && result.results?.some(r => !r.passed) && (
                  <div className="mt-3 bg-[#ff453a08] border border-[#ff453a20] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#ff453a] uppercase tracking-wider font-medium mb-2">First Failed Test</p>
                    {result.results?.filter(r => !r.passed).slice(0, 1).map((r, i) => (
                      <div key={i} className="space-y-1.5">
                        <p className="text-[11px] font-mono"><span className="text-[#48484a]">Input: </span><span className="text-white">{r.input}</span></p>
                        <p className="text-[11px] font-mono"><span className="text-[#48484a]">Expected: </span><span className="text-[#32d74b]">{r.expectedOutput}</span></p>
                        <p className="text-[11px] font-mono"><span className="text-[#48484a]">Got: </span><span className="text-[#ff453a]">{r.actualOutput}</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ SUBMIT PANEL ══ */}
      {showPanel && panelType === 'submit' && (
        <div className="fixed bottom-0 left-0 right-0 z-50"
          style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)', animation: 'slideUp 0.25s ease' }}>
          <div className="px-7 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">Submit Result</span>
                {resultLoading && <div className="w-3.5 h-3.5 rounded-full border-2 border-[#ffffff10] border-t-[#98989d] animate-spin"></div>}
                {!resultLoading && result && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    result.accepted ? 'bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]' : 'bg-[#ff453a1a] text-[#ff453a] border border-[#ff453a30]'
                  }`}>
                    {result.accepted ? 'Accepted' : 'Wrong Answer'}
                  </span>
                )}
              </div>
              <button onClick={() => setShowPanel(false)} className="w-6 h-6 rounded-full bg-[#1c1c1e] border border-[#ffffff0f] flex items-center justify-center text-[#48484a] hover:text-white text-[10px] transition-colors">✕</button>
            </div>
            {resultLoading && <p className="text-[12px] text-[#48484a] pb-2">Submitting your code, please wait...</p>}
            {!resultLoading && result && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#48484a] uppercase tracking-wider font-medium mb-1">Status</p>
                    <p className={`text-[13px] font-semibold ${result.accepted ? 'text-[#32d74b]' : 'text-[#ff453a]'}`}>{result.accepted ? 'Accepted' : 'Wrong Answer'}</p>
                  </div>
                  <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#48484a] uppercase tracking-wider font-medium mb-1">Test Cases</p>
                    <p className="text-[13px] font-semibold text-white">{result.passedTestCases ?? '—'} / {result.totalTestCases ?? '—'}</p>
                  </div>
                  <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#48484a] uppercase tracking-wider font-medium mb-1">Runtime</p>
                    <p className="text-[13px] font-semibold text-white">{result.runtime ? `${parseFloat(result.runtime).toFixed(3)} ms` : '—'}</p>
                  </div>
                  <div className="bg-[#111111] border border-[#ffffff08] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#48484a] uppercase tracking-wider font-medium mb-1">Memory</p>
                    <p className="text-[13px] font-semibold text-white">{result.memory ? `${result.memory} KB` : '—'}</p>
                  </div>
                </div>
                {result.errorMessage && (
                  <div className="mt-3 bg-[#ff453a08] border border-[#ff453a20] rounded-[10px] px-4 py-3">
                    <p className="text-[10px] text-[#ff453a] uppercase tracking-wider font-medium mb-1.5">Error</p>
                    <pre className="text-[11px] text-[#ff453a] font-mono whitespace-pre-wrap leading-relaxed">{result.errorMessage}</pre>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProblemPage;