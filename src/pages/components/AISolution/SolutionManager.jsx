import React, { useState, useEffect } from 'react';
import {
  exportFormats
} from '../../../mock/aisolutionData';

const SolutionManager = ({ onBack, solutionData, updateSolutionData }) => {
  const [solutions, setSolutions] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'detail'
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    schoolType: 'all',
    status: 'all',
    budgetRange: 'all'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('ppt');
  const [shareLink, setShareLink] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);
  const [editingVersion, setEditingVersion] = useState(null);
  const [newSolutionName, setNewSolutionName] = useState('');
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // 初始化加载保存的方案
  useEffect(() => {
    loadSolutions();
    
    // 设置自动保存定时器
    const timer = setInterval(() => {
      if (selectedSolution && currentView === 'detail') {
        handleAutoSave();
      }
    }, 300000); // 5分钟自动保存一次
    
    setAutoSaveTimer(timer);
    
    return () => clearInterval(timer);
  }, [selectedSolution, currentView]);

  // 加载保存的方案
  const loadSolutions = () => {
    // 从localStorage加载，如果没有则使用mock数据
    const savedSolutions = JSON.parse(localStorage.getItem('aisolutions')) || mockSavedSolutions;
    setSolutions(savedSolutions);
  };

  // 保存方案到localStorage
  const saveSolutionsToStorage = (updatedSolutions) => {
    localStorage.setItem('aisolutions', JSON.stringify(updatedSolutions));
  };

  // 搜索和筛选方案
  const filteredSolutions = solutions.filter(solution => {
    // 搜索名称和摘要
    const matchesSearch = solution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (solution.summary && solution.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // 筛选学校类型
    const matchesSchoolType = filterOptions.schoolType === 'all' || solution.schoolType === filterOptions.schoolType;
    
    // 筛选状态
    const matchesStatus = filterOptions.status === 'all' || solution.status === filterOptions.status;
    
    // 筛选预算范围
    const matchesBudget = filterOptions.budgetRange === 'all' ||
                         (solution.budget >= budgetRanges[filterOptions.budgetRange].min &&
                          solution.budget <= budgetRanges[filterOptions.budgetRange].max);
    
    return matchesSearch && matchesSchoolType && matchesStatus && matchesBudget;
  });

  // 预算范围定义
  const budgetRanges = {
    '10-20': { min: 100000, max: 200000 },
    '20-30': { min: 200000, max: 300000 },
    '30-50': { min: 300000, max: 500000 },
    '50+': { min: 500000, max: Infinity }
  };

  // 查看方案详情
  const handleViewSolution = (solution) => {
    setSelectedSolution(solution);
    loadVersionHistory(solution.id);
    setCurrentView('detail');
  };

  // 返回方案列表
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSolution(null);
    setVersionHistory([]);
  };

  // 加载版本历史
  const loadVersionHistory = (solutionId) => {
    // 模拟加载版本历史
    const solution = solutions.find(s => s.id === solutionId);
    if (solution && solution.versions) {
      setVersionHistory(solution.versions);
    } else {
      // 如果没有版本历史，创建一个默认版本
      const defaultVersion = {
        id: `${solutionId}-v1`,
        version: 'v1.0',
        created_at: solution.created_at,
        modified_at: solution.updated_at,
        description: '初始版本'
      };
      setVersionHistory([defaultVersion]);
    }
  };

  // 自动保存
  const handleAutoSave = () => {
    const updatedSolutions = solutions.map(solution => {
      if (solution.id === selectedSolution.id) {
        const newVersion = {
          id: `${solution.id}-v${Date.now()}`,
          version: `v${(parseFloat(solution.version.split('.')[0].replace('v', '')) + 0.1).toFixed(1)}`,
          created_at: new Date().toLocaleString(),
          modified_at: new Date().toLocaleString(),
          description: '自动保存版本'
        };
        
        const updatedSolution = {
          ...solution,
          updated_at: new Date().toLocaleString(),
          version: newVersion.version,
          versions: [...(solution.versions || []), newVersion]
        };
        
        setSelectedSolution(updatedSolution);
        setVersionHistory([...(solution.versions || []), newVersion]);
        
        return updatedSolution;
      }
      return solution;
    });
    
    setSolutions(updatedSolutions);
    saveSolutionsToStorage(updatedSolutions);
    console.log('方案已自动保存');
  };

  // 手动保存方案
  const handleManualSave = () => {
    const updatedSolutions = solutions.map(solution => {
      if (solution.id === selectedSolution.id) {
        const newVersion = {
          id: `${solution.id}-v${Date.now()}`,
          version: `v${(parseFloat(solution.version.split('.')[0].replace('v', '')) + 0.1).toFixed(1)}`,
          created_at: new Date().toLocaleString(),
          modified_at: new Date().toLocaleString(),
          description: '手动保存版本'
        };
        
        const updatedSolution = {
          ...solution,
          updated_at: new Date().toLocaleString(),
          version: newVersion.version,
          versions: [...(solution.versions || []), newVersion]
        };
        
        setSelectedSolution(updatedSolution);
        setVersionHistory([...(solution.versions || []), newVersion]);
        
        return updatedSolution;
      }
      return solution;
    });
    
    setSolutions(updatedSolutions);
    saveSolutionsToStorage(updatedSolutions);
    alert('方案已成功保存！');
  };

  // 恢复到指定版本
  const handleRestoreVersion = (version) => {
    if (window.confirm(`确定要恢复到版本 ${version.version} 吗？`)) {
      const updatedSolutions = solutions.map(solution => {
        if (solution.id === selectedSolution.id) {
          return {
            ...solution,
            current_version: version.id,
            updated_at: new Date().toLocaleString()
          };
        }
        return solution;
      });
      
      setSolutions(updatedSolutions);
      saveSolutionsToStorage(updatedSolutions);
      alert(`已恢复到版本 ${version.version}！`);
    }
  };

  // 导出方案
  const handleExportSolution = () => {
    setIsExporting(true);
    
    // 模拟导出过程
    setTimeout(() => {
      setIsExporting(false);
      const formatInfo = exportFormats.find(f => f.value === exportFormat);
      alert(`方案 "${selectedSolution.name}" 已成功导出为 ${formatInfo?.label} 格式！`);
    }, 2000);
  };

  // 生成分享链接
  const handleGenerateShareLink = () => {
    const timestamp = Date.now();
    const newShareLink = `https://example.com/share/${selectedSolution.id}?t=${timestamp}`;
    setShareLink(newShareLink);
    
    // 复制到剪贴板
    navigator.clipboard.writeText(newShareLink).then(() => {
      alert('分享链接已复制到剪贴板！');
    });
  };

  // 删除方案
  const handleDeleteSolution = (solutionId) => {
    if (window.confirm('确定要删除这个方案吗？此操作不可恢复。')) {
      const updatedSolutions = solutions.filter(solution => solution.id !== solutionId);
      setSolutions(updatedSolutions);
      saveSolutionsToStorage(updatedSolutions);
      
      if (selectedSolution && selectedSolution.id === solutionId) {
        handleBackToList();
      }
      
      alert('方案已成功删除！');
    }
  };

  // 创建新方案
  const handleCreateNewSolution = () => {
    if (!newSolutionName.trim()) {
      alert('请输入方案名称');
      return;
    }
    
    const newSolution = {
      id: `solution-${Date.now()}`,
      name: newSolutionName.trim(),
      summary: '新建方案',
      status: 'draft',
      schoolType: solutionData?.schoolType || '',
      spaceArea: solutionData?.spaceArea || '',
      budget: solutionData?.budget || 0,
      created_at: new Date().toLocaleString(),
      updated_at: new Date().toLocaleString(),
      version: 'v1.0',
      thumbnail: '/placeholder-thumbnail.png',
      created_by: 'current-user',
      versions: [{
        id: `solution-${Date.now()}-v1`,
        version: 'v1.0',
        created_at: new Date().toLocaleString(),
        modified_at: new Date().toLocaleString(),
        description: '初始版本'
      }],
      content: solutionData || {}
    };
    
    const updatedSolutions = [newSolution, ...solutions];
    setSolutions(updatedSolutions);
    saveSolutionsToStorage(updatedSolutions);
    
    setNewSolutionName('');
    alert('新方案创建成功！');
  };

  // 批量删除方案
  const handleBatchDelete = (selectedIds) => {
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 个方案吗？`)) {
      const updatedSolutions = solutions.filter(solution => !selectedIds.includes(solution.id));
      setSolutions(updatedSolutions);
      saveSolutionsToStorage(updatedSolutions);
      alert('选中的方案已成功删除！');
    }
  };

  // 渲染方案列表视图
  const renderListView = () => {
    return (
      <div className="solution-list-view">
        {/* 顶部操作栏 */}
        <div className="list-header">
          <h3>我的方案列表</h3>
          <button onClick={() => setCurrentView('new')} className="new-solution-button">
            新建方案
          </button>
        </div>

        {/* 搜索和筛选 */}
        <div className="search-filter-section">
          <input 
            type="text" 
            placeholder="搜索方案名称或摘要..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-options">
            <select 
              value={filterOptions.schoolType}
              onChange={(e) => setFilterOptions({...filterOptions, schoolType: e.target.value})}
              className="filter-select"
            >
              <option value="all">所有学校类型</option>
              <option value="primary">小学</option>
              <option value="middle">初中</option>
              <option value="high">高中</option>
              <option value="vocational">职校</option>
              <option value="university">大学</option>
            </select>
            <select 
              value={filterOptions.status}
              onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
              className="filter-select"
            >
              <option value="all">所有状态</option>
              <option value="draft">草稿</option>
              <option value="completed">已完成</option>
              <option value="exported">已导出</option>
            </select>
            <select 
              value={filterOptions.budgetRange}
              onChange={(e) => setFilterOptions({...filterOptions, budgetRange: e.target.value})}
              className="filter-select"
            >
              <option value="all">所有预算范围</option>
              <option value="10-20">10-20万</option>
              <option value="20-30">20-30万</option>
              <option value="30-50">30-50万</option>
              <option value="50+">50万以上</option>
            </select>
          </div>
        </div>

        {/* 方案列表 */}
        <div className="solutions-grid">
          {filteredSolutions.length === 0 ? (
            <div className="no-solutions">
              <p>暂无符合条件的方案</p>
              <button onClick={() => setCurrentView('new')} className="create-button">
                创建新方案
              </button>
            </div>
          ) : (
            filteredSolutions.map(solution => (
              <div key={solution.id} className="solution-card">
                <div className="card-header">
                  <div className={`status-badge ${solution.status}`}>
                    {getStatusText(solution.status)}
                  </div>
                  <button 
                    onClick={() => handleDeleteSolution(solution.id)}
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
                <div className="card-content"
                  onClick={() => handleViewSolution(solution)}
                >
                  <div className="solution-thumbnail">
                    <img src={solution.thumbnail || '/placeholder-thumbnail.png'} alt="方案缩略图" />
                  </div>
                  <h4 className="solution-name">{solution.name}</h4>
                  <p className="solution-meta">
                    学校类型：{getSchoolTypeText(solution.schoolType)}
                  </p>
                  <p className="solution-meta">
                    预算：{formatBudget(solution.budget)} | 版本：{solution.version}
                  </p>
                  <p className="solution-meta">
                    更新时间：{solution.updated_at}
                  </p>
                  {solution.summary && (
                    <p className="solution-summary">{solution.summary}</p>
                  )}
                </div>
                <div className="card-actions">
                  <button onClick={() => handleViewSolution(solution)} className="view-button">
                    查看详情
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // 渲染方案详情视图
  const renderDetailView = () => {
    if (!selectedSolution) return null;

    return (
      <div className="solution-detail-view">
        {/* 顶部导航 */}
        <div className="detail-header">
          <button onClick={handleBackToList} className="back-button">
            ← 返回列表
          </button>
          <h3>方案详情 - {selectedSolution.name}</h3>
          <div className="header-actions">
            <button onClick={handleManualSave} className="save-button">
              保存方案
            </button>
            <button onClick={() => setShareModalOpen(true)} className="share-button">
              分享方案
            </button>
          </div>
        </div>

        {/* 方案基本信息 */}
        <div className="solution-info-section">
          <div className="info-grid">
            <div className="info-item">
              <span className="label">方案编号：</span>
              <span>{selectedSolution.id}</span>
            </div>
            <div className="info-item">
              <span className="label">创建时间：</span>
              <span>{selectedSolution.created_at}</span>
            </div>
            <div className="info-item">
              <span className="label">最后修改：</span>
              <span>{selectedSolution.updated_at}</span>
            </div>
            <div className="info-item">
              <span className="label">当前版本：</span>
              <span>{selectedSolution.version}</span>
            </div>
            <div className="info-item">
              <span className="label">方案状态：</span>
              <span className={`status-tag ${selectedSolution.status}`}>
                {getStatusText(selectedSolution.status)}
              </span>
            </div>
            <div className="info-item">
              <span className="label">创建者：</span>
              <span>{selectedSolution.created_by || '当前用户'}</span>
            </div>
          </div>
        </div>

        {/* 方案内容预览 */}
        <div className="solution-content-section">
          <h4>方案内容预览</h4>
          <div className="content-preview">
            {selectedSolution.content?.detailedProposal && (
              <div className="proposal-preview">
                <h5>{selectedSolution.content.detailedProposal.title}</h5>
                <p>共{selectedSolution.content.detailedProposal.pages?.length || 0}页方案文档</p>
                <div className="pages-preview">
                  {selectedSolution.content.detailedProposal.pages?.slice(0, 4).map((page, index) => (
                    <div key={index} className="page-thumbnail">
                      <span className="page-number">第{page.pageNumber}页</span>
                      <p className="page-title">{page.title}</p>
                    </div>
                  ))}
                  {selectedSolution.content.detailedProposal.pages?.length > 4 && (
                    <div className="page-thumbnail more">
                      <span>+{selectedSolution.content.detailedProposal.pages.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 版本历史 */}
        <div className="version-history-section">
          <h4>版本历史</h4>
          <div className="versions-list">
            {versionHistory.map((version, index) => (
              <div key={index} className="version-item">
                <div className="version-info">
                  <span className="version-number">{version.version}</span>
                  <span className="version-time">{version.modified_at}</span>
                  <span className="version-desc">{version.description}</span>
                </div>
                <button 
                  onClick={() => handleRestoreVersion(version)}
                  className="restore-button"
                >
                  恢复此版本
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 操作区域 */}
        <Card className="card-shadow">
          <h4>操作选项</h4>
          <div className="action-buttons">
            <div className="export-options">
              <Space>
                <Select 
                  value={exportFormat}
                  onChange={(value) => setExportFormat(value)}
                  style={{ width: 150 }}
                >
                  {exportFormats.map(format => (
                    <Select.Option key={format.value} value={format.value}>
                      {format.label}
                    </Select.Option>
                  ))}
                </Select>
                <Button 
                  type="primary"
                  onClick={handleExportSolution}
                  disabled={isExporting}
                >
                  {isExporting ? '导出中...' : '导出方案'}
                </Button>
              </Space>
            </div>
            <Button 
              danger
              onClick={() => handleDeleteSolution(selectedSolution.id)}
              style={{ marginTop: 16 }}
            >
              删除方案
            </Button>
          </div>
        </Card>

        {/* 分享链接模态框 */}
        <Modal
          title="分享方案"
          open={shareModalOpen}
          onCancel={() => setShareModalOpen(false)}
          footer={null}
        >
          <p>生成分享链接，方便与团队成员共享此方案：</p>
          <div className="share-link-section">
            <Space style={{ width: '100%', marginBottom: 16 }}>
              <Input 
                value={shareLink}
                readOnly
                style={{ flex: 1 }}
              />
              <Button 
                type="primary"
                onClick={handleGenerateShareLink}
              >
                生成链接
              </Button>
            </Space>
          </div>
          <p className="share-tip">链接有效期：7天 | 访问权限：只读查看</p>
        </Modal>
      </div>
    );
  };

  // 渲染新建方案视图
  const renderNewSolutionView = () => {
    return (
      <div className="new-solution-view">
        <Card className="card-shadow">
          {/* 顶部导航 */}
          <div className="new-solution-header">
            <Button onClick={() => setCurrentView('list')}>
              ← 返回列表
            </Button>
            <h3 style={{ margin: '0 20px' }}>新建方案</h3>
          </div>
          <div className="new-solution-form">
            <div className="form-group">
              <label htmlFor="solutionName">方案名称：</label>
              <Input 
                id="solutionName"
                value={newSolutionName}
                onChange={(e) => setNewSolutionName(e.target.value)}
                placeholder="请输入方案名称"
                style={{ marginTop: 8 }}
              />
            </div>
            <div className="form-tips">
              <p>提示：</p>
              <ul>
                <li>方案名称将作为文件和展示的主要标识</li>
                <li>新方案将基于当前进度自动填充数据</li>
                <li>创建后可在方案列表中查看和编辑</li>
              </ul>
            </div>
            <div className="form-actions">
              <Button 
                type="primary"
                onClick={handleCreateNewSolution}
                style={{ marginTop: 16 }}
              >
                创建方案
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // 辅助函数
  const getStatusText = (status) => {
    const statusMap = { draft: '草稿', completed: '已完成', exported: '已导出' };
    return statusMap[status] || status;
  };

  const getSchoolTypeText = (type) => {
    const typeMap = { 
      primary: '小学', 
      middle: '初中', 
      high: '高中', 
      vocational: '职校', 
      university: '大学' 
    };
    return typeMap[type] || '未知类型';
  };

  const formatBudget = (budget) => {
    if (budget < 10000) return `${budget}元`;
    return `${(budget / 10000).toFixed(1)}万元`;
  };

  return (
    <div className="solution-manager">
      {/* 顶部导航 */}
      <div className="step-nav">
        <h2>方案管理</h2>
        <div className="progress-indicator">
          <div className="step active">预算方案</div>
          <div className="step active">硬件配置</div>
          <div className="step active">设计方案</div>
          <div className="step active">方案生成</div>
          <div className="step active current">方案管理</div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="manager-content">
        {currentView === 'list' && renderListView()}
        {currentView === 'detail' && renderDetailView()}
        {currentView === 'new' && renderNewSolutionView()}
      </div>

      {/* 返回按钮 */}
      <div className="bottom-actions">
        <button onClick={onBack} className="back-to-previous-button">
          上一步
        </button>
      </div>
    </div>
  );
};

export default SolutionManager;
