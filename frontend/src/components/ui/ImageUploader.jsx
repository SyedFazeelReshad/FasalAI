import { useState, useRef, useCallback } from 'react';
import { Upload, Image, X, Loader2, Check } from 'lucide-react';
import './ImageUploader.css';

const ImageUploader = ({
  value = null,
  onChange,
  onRemove,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles = 1,
  label = 'Upload crop image',
  helperText = 'Drag and drop or click to upload (JPG, PNG, WebP, max 10MB)',
  disabled = false,
  showPreview = true,
  className = ''
}) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} files.`;
    }
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit.`;
    }
    return null;
  };

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      const filesToUse = multiple ? [...(value || []), ...validFiles].slice(0, maxFiles) : [validFiles[0]];
      onChange?.(filesToUse);
      
      if (showPreview && validFiles[0]) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(validFiles[0]);
      }
    }
  }, [value, onChange, multiple, maxFiles, showPreview]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (file, e) => {
    e.stopPropagation();
    setPreview(null);
    onRemove?.(file);
  };

  const uploadAreaClasses = [
    'image-uploader__dropzone',
    dragActive ? 'image-uploader__dropzone--active' : '',
    disabled ? 'image-uploader__dropzone--disabled' : '',
    preview ? 'image-uploader__dropzone--has-preview' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={`image-uploader ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="image-uploader__input"
        aria-label={label}
      />

      <div
        className={uploadAreaClasses}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }}}
        aria-disabled={disabled}
      >
        {preview && showPreview ? (
          <div className="image-uploader__preview">
            <img src={preview} alt="Uploaded crop image" className="image-uploader__image" />
            <button
              type="button"
              className="image-uploader__remove"
              onClick={(e) => handleRemove(value, e)}
              aria-label="Remove image"
              disabled={uploading}
            >
              <X size={18} aria-hidden="true" />
            </button>
            {uploading && (
              <div className="image-uploader__uploading">
                <Loader2 size={24} aria-hidden="true" className="image-uploader__spinner" />
                <span>Analyzing...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="image-uploader__placeholder">
            <div className="image-uploader__icon">
              <Image size={48} aria-hidden="true" />
            </div>
            <p className="image-uploader__label">{label}</p>
            <p className="image-uploader__helper">{helperText}</p>
          </div>
        )}
      </div>

      {value && !multiple && !showPreview && (
        <div className="image-uploader__file-info">
          <Check size={16} aria-hidden="true" className="image-uploader__check" />
          <span>{value.name || 'File selected'}</span>
          <button
            type="button"
            className="image-uploader__remove-small"
            onClick={(e) => handleRemove(value, e)}
            aria-label="Remove file"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

ImageUploader.displayName = 'ImageUploader';

export { ImageUploader };