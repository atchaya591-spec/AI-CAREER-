import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidFileDefinition } from '../services/androidProjectFiles';
import JSZip from 'jszip';
import { Download, Copy, Check, FileCode, Folder, ChevronRight, X } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidFileDefinition>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'java' | 'xml' | 'gradle' | 'config'>('all');

  if (!isOpen) return null;

  const filteredFiles = ANDROID_PROJECT_FILES.filter(
    (f) => filterCategory === 'all' || f.category === filterCategory
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const zip = new JSZip();

      // Add each file into zip with its relative path
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AI_Career_Guidance_Android_Project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to create project ZIP:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#F4F2EC] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col border border-[#122036]/20 overflow-hidden">
        {/* Header */}
        <div className="bg-[#122036] text-[#EFEDE4] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E4A23C] text-[#122036] flex items-center justify-center font-bold text-lg">
              🤖
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">
                Android Studio Project Explorer
              </h2>
              <p className="text-xs text-[#A9B7C6] font-mono-code">
                Complete Java &amp; XML Source Implementation for Android Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center gap-2 bg-[#E4A23C] hover:bg-[#C0812A] text-[#122036] font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Preparing ZIP...' : 'Download Android Studio ZIP'}
            </button>
            <button
              onClick={onClose}
              className="text-[#A9B7C6] hover:text-[#EFEDE4] p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-[#E7E3D8] px-6 py-2 border-b border-[#122036]/10 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#4F6070] font-mono-code font-bold mr-2">Filter:</span>
          {(['all', 'java', 'xml', 'gradle', 'config'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full font-mono-code text-xs uppercase transition cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#122036] text-[#EFEDE4] font-bold'
                  : 'bg-white/60 text-[#17232E] hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#4F6070] font-mono-code">
            {filteredFiles.length} files available
          </span>
        </div>

        {/* Explorer Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-72 border-r border-[#122036]/10 bg-white/50 overflow-y-auto p-3 flex flex-col gap-1">
            <div className="text-[11px] font-mono-code uppercase text-[#4F6070] px-2 py-1 font-bold">
              Project Structure
            </div>
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono-code flex items-start gap-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#122036] text-[#EFEDE4] shadow-sm'
                      : 'text-[#17232E] hover:bg-[#E7E3D8]'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-[#E4A23C]' : 'text-[#4FA88C]'
                    }`}
                  />
                  <div className="truncate">
                    <div className="font-semibold truncate">
                      {file.path.split('/').pop()}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-[#A9B7C6]' : 'text-[#4F6070]'
                      }`}
                    >
                      {file.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-[#122036] text-[#EFEDE4] overflow-hidden">
            {/* File info and Copy */}
            <div className="bg-[#1B3153] px-6 py-2.5 flex items-center justify-between border-b border-white/10 text-xs">
              <div className="flex items-center gap-2 font-mono-code text-[#A9B7C6]">
                <Folder className="w-3.5 h-3.5 text-[#E4A23C]" />
                <span className="text-[#EFEDE4] font-semibold">{selectedFile.path}</span>
                <span className="text-white/40">·</span>
                <span className="text-[11px]">{selectedFile.description}</span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-[#EFEDE4] px-3 py-1 rounded-md text-xs font-mono-code transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#4FA88C]" />
                    <span className="text-[#4FA88C] font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono-code text-xs leading-relaxed selection:bg-[#E4A23C]/40">
              <pre className="text-[#EFEDE4] whitespace-pre">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#E7E3D8] px-6 py-3 border-t border-[#122036]/10 flex items-center justify-between text-xs text-[#4F6070]">
          <div>
            Place files directly into Android Studio under <code className="bg-white/60 px-1 py-0.5 rounded font-mono-code">app/src/main/</code>
          </div>
          <div className="font-semibold">
            Java 8+ · Android SDK 34 · Cloud Firestore · Firebase Auth
          </div>
        </div>
      </div>
    </div>
  );
};
