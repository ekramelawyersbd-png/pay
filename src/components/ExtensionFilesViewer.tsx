import React, { useState } from 'react';
import { extensionFiles } from '../data/mockData';
import { FileCode, Folder, Copy, Check, ExternalLink, Download } from 'lucide-react';

export const ExtensionFilesViewer: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = extensionFiles[activeFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = () => {
    alert('Preparing UddoktaPay Paymenter extension package zip archive for download...');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Repository</span>
            <span aria-hidden="true">·</span>
            <span>github.com/uddoktapay/paymenter</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Extension Source Files</h2>
          <p className="text-sm text-slate-600 mt-1">
            Explore the PHP source code, manifest, and service provider for the UddoktaPay Paymenter gateway extension.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Extension ZIP</span>
          </button>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-4">
        
        {/* File Tree Sidebar */}
        <div className="bg-slate-50 border-r border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">
            extensions/Gateways/UddoktaPay
          </div>
          <div className="space-y-1">
            {extensionFiles.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setActiveFileIndex(idx)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${activeFileIndex === idx ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'}`}
              >
                <FileCode className="w-4 h-4 shrink-0" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 mb-2">Installation Guide</h4>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4">
              <li>Upload folder to <code className="text-slate-900 font-mono">extensions/Gateways</code></li>
              <li>Go to Paymenter Admin Panel</li>
              <li>Gateways &gt; Add New</li>
              <li>Select &quot;UddoktaPay Hosted&quot;</li>
            </ol>
          </div>
        </div>

        {/* Code View Panel */}
        <div className="lg:col-span-3 flex flex-col bg-slate-950 text-slate-100">
          
          {/* File Header Bar */}
          <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeFile.path}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Description */}
          <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-800/80 text-xs text-slate-400">
            {activeFile.description}
          </div>

          {/* Code Content */}
          <div className="p-6 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
            <pre>{activeFile.content}</pre>
          </div>

          {/* Footer status */}
          <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Language: {activeFile.language.toUpperCase()}</span>
            <span>UTF-8 · LF</span>
          </div>

        </div>

      </div>
    </div>
  );
};
