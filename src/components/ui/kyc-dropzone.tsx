import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, CheckCircle, X, RefreshCw, FileImage, AlertCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KycDropzoneProps {
  onUploadSuccess: (url: string) => void;
  onReset: () => void;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export const KycDropzone: React.FC<KycDropzoneProps> = ({ onUploadSuccess, onReset }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File is too large. Max 10MB.");
      return;
    }
    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
    
    startUpload(selectedFile);
  };

  const startUpload = (fileToUpload: File) => {
    setUploadState('uploading');
    setProgress(0);
    setTimeLeft('Calculating...');
    startTimeRef.current = Date.now();

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', 'Proglobal KYC');

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
        
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
        const uploadSpeed = event.loaded / timeElapsed;
        const bytesRemaining = event.total - event.loaded;
        const secondsRemaining = bytesRemaining / uploadSpeed;
        
        if (secondsRemaining > 60) {
          setTimeLeft(`${Math.round(secondsRemaining / 60)}m ${Math.round(secondsRemaining % 60)}s left`);
        } else if (secondsRemaining > 0 && secondsRemaining !== Infinity) {
          setTimeLeft(`${Math.round(secondsRemaining)}s left`);
        } else {
          setTimeLeft('Finishing up...');
        }
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setUploadState('success');
        onUploadSuccess(response.secure_url);
      } else {
        setUploadState('error');
      }
    };

    xhr.onerror = () => {
      setUploadState('error');
    };

    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dm12f7lnc/upload', true);
    xhr.send(formData);
  };

  const handleRetry = () => {
    if (file) startUpload(file);
  };

  const handleRemove = () => {
    if (xhrRef.current) xhrRef.current.abort();
    setFile(null);
    setPreview(null);
    setUploadState('idle');
    setProgress(0);
    onReset();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {uploadState === 'idle' && (
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-out cursor-pointer bg-card/50
            ${isDragActive 
              ? 'border-gold bg-[hsl(43_85%_52%/0.1)] shadow-[0_0_30px_rgba(234,179,8,0.2)]' 
              : 'border-[hsl(43_85%_52%/0.3)] hover:border-gold/50 hover:bg-[hsl(43_85%_52%/0.05)]'}
          `}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleFileInput}
            accept="image/*,.pdf"
          />
          <div className={`transition-transform duration-300 ease-out flex flex-col items-center justify-center ${isDragActive ? '-translate-y-2' : ''}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${isDragActive ? 'bg-gold/20 scale-110' : 'bg-[hsl(43_85%_52%/0.1)]'}`}>
              <UploadCloud className={`w-8 h-8 transition-colors duration-300 ${isDragActive ? 'text-gold drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'text-gold'}`} />
            </div>
            <p className={`font-semibold text-foreground transition-colors ${isDragActive ? 'text-gold' : ''}`}>
              {isDragActive ? 'Drop file to upload' : 'Click or drag to upload ID'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">PNG, JPG or PDF up to 10MB</p>
          </div>
        </div>
      )}

      {(uploadState === 'uploading' || uploadState === 'error') && file && (
        <div className="border border-[hsl(43_85%_52%/0.2)] rounded-2xl p-6 bg-card/50 relative overflow-hidden">
          {uploadState === 'uploading' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(43_85%_52%/0.05)] to-transparent animate-pulse" />
          )}
          
          <div className="flex items-start gap-4 relative z-10">
            {preview ? (
              <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-[hsl(43_85%_52%/0.2)]" />
            ) : (
              <div className="w-16 h-16 bg-white/5 rounded-lg border border-[hsl(43_85%_52%/0.2)] flex items-center justify-center">
                <FileImage className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-sm truncate pr-4">{file.name}</p>
                <button onClick={handleRemove} type="button" className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                <span>{formatSize(file.size)}</span>
                {uploadState === 'uploading' && (
                  <span className="flex items-center gap-1"><Timer className="w-3 h-3"/> {timeLeft}</span>
                )}
              </div>

              {uploadState === 'uploading' ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gold">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-gold transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">Upload failed</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" type="button" variant="outline" className="text-gold border-gold/30 hover:bg-gold/10 flex-1" onClick={handleRetry}>
                      <RefreshCw className="w-3.5 h-3.5 mr-2" /> Retry Upload
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {uploadState === 'success' && file && (
        <div className="border border-emerald-500/30 rounded-2xl p-6 bg-emerald-500/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="flex items-start gap-4 relative z-10">
             {preview ? (
              <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" />
            ) : (
              <div className="w-16 h-16 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center justify-center">
                <FileImage className="w-8 h-8 text-emerald-500" />
              </div>
            )}
            
            <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <p className="font-bold text-sm truncate text-emerald-50">{file.name}</p>
              </div>
              <p className="text-xs text-emerald-500/70 font-medium">{formatSize(file.size)} • Ready for submission</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-emerald-500/10 flex justify-end gap-3 relative z-10">
             <Button size="sm" type="button" variant="ghost" className="text-muted-foreground hover:text-white" onClick={handleRemove}>
               Remove
             </Button>
             <div className="relative">
               <input 
                 type="file" 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                 onChange={handleFileInput}
                 accept="image/*,.pdf"
               />
               <Button size="sm" type="button" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 pointer-events-none">
                 Replace File
               </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
