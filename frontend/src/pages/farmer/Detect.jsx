import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon, ArrowLeft, HelpCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { mockFarms, mockCrops } from '../../data/mockData';
import './Detect.css';

const Detect = () => {
  const navigate = useNavigate();
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState('upload'); // upload, analyzing, result

  const handleAnalyze = useCallback(async () => {
    if (!selectedFarm || !selectedCrop || !uploadedImage) return;
    
    setAnalyzing(true);
    setStep('analyzing');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalyzing(false);
    setStep('result');
    
    // Navigate to result page with mock case ID
    const mockCaseId = `case-${Date.now()}`;
    navigate(`/farmer/detection/result/${mockCaseId}`);
  }, [selectedFarm, selectedCrop, uploadedImage, navigate]);

  const handleImageChange = useCallback((files) => {
    if (files && files.length > 0) {
      setUploadedImage(files[0]);
    } else {
      setUploadedImage(null);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
  }, []);

  const handleBack = () => {
    if (step === 'result') {
      setStep('upload');
    } else {
      navigate(-1);
    }
  };

  const farmOptions = mockFarms.map(farm => ({
    value: farm.id,
    label: `${farm.name} (${mockCrops.find(c => c.id === farm.primaryCropId)?.name || farm.primaryCropId})`
  }));

  const cropOptions = mockCrops.map(crop => ({
    value: crop.id,
    label: crop.name
  }));

  return (
    <div className="detect-page">
      {/* Page Header */}
      <header className="detect-page__header">
        <Button variant="ghost" size="sm" onClick={handleBack} className="detect-page__back-btn">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back</span>
        </Button>
        <div className="detect-page__title-section">
          <h1 className="detect-page__title">Detect Crop Disease</h1>
          <p className="detect-page__subtitle">Upload a crop image for AI health assessment</p>
        </div>
      </header>

      {step === 'upload' && (
        <form className="detect-page__form" onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}>
          {/* Farm Selector */}
          <Card variant="outlined" className="detect-page__card">
            <CardHeader>
              <CardTitle>Select Farm</CardTitle>
              <CardSubtitle>Choose the farm where the image was taken</CardSubtitle>
            </CardHeader>
            <CardContent>
              <Select
                label="Farm"
                placeholder="Select a farm"
                options={farmOptions}
                value={selectedFarm}
                onChange={(e) => setSelectedFarm(e.target.value)}
                required
                helperText="Farm location helps with weather-based risk assessment"
              />
            </CardContent>
          </Card>

          {/* Crop Selector */}
          <Card variant="outlined" className="detect-page__card">
            <CardHeader>
              <CardTitle>Select Crop</CardTitle>
              <CardSubtitle>Choose the crop type for accurate disease detection</CardSubtitle>
            </CardHeader>
            <CardContent>
              <Select
                label="Crop"
                placeholder="Select crop type"
                options={cropOptions}
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                required
                helperText="AI model uses crop-specific detection heads"
              />
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card variant="outlined" className="detect-page__card">
            <CardHeader>
              <CardTitle>Upload Crop Image</CardTitle>
              <CardSubtitle>Clear, well-lit photos of affected leaves give best results</CardSubtitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={uploadedImage}
                onChange={handleImageChange}
                onRemove={handleRemoveImage}
                label="Upload crop image"
                helperText="Drag & drop or click to upload (JPG, PNG, WebP, max 10MB)"
                showPreview={true}
              />
            </CardContent>
            <CardFooter>
              <div className="detect-page__upload-tips">
                <h4>Tips for better results:</h4>
                <ul>
                  <li>Focus on affected leaves - fill the frame</li>
                  <li>Use natural daylight - avoid flash</li>
                  <li>Capture both sides of the leaf if possible</li>
                  <li>Avoid shadows and blurred images</li>
                  <li>Include some healthy leaves for comparison</li>
                </ul>
              </div>
            </CardFooter>
          </Card>

          {/* Analyze Button */}
          <div className="detect-page__actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!selectedFarm || !selectedCrop || !uploadedImage || analyzing}
              className="detect-page__analyze-btn"
            >
              {analyzing ? (
                <>
                  <span className="btn__spinner" aria-hidden="true" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Camera size={20} aria-hidden="true" />
                  Analyze Image
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {step === 'analyzing' && (
        <Card variant="elevated" className="detect-page__analyzing-card">
          <CardContent>
            <div className="analyzing-card">
              <div className="analyzing-card__spinner" aria-hidden="true" />
              <h2 className="analyzing-card__title">Analyzing your image...</h2>
              <div className="analyzing-card__steps">
                <div className="analyzing-card__step analyzing-card__step--complete">
                  <CheckCircle size={20} aria-hidden="true" />
                  <span>Image uploaded</span>
                </div>
                <div className="analyzing-card__step analyzing-card__step--active">
                  <div className="analyzing-card__step-spinner" aria-hidden="true" />
                  <span>Running AI model</span>
                </div>
                <div className="analyzing-card__step analyzing-card__step--pending">
                  <AlertTriangle size={20} aria-hidden="true" />
                  <span>Generating advisory</span>
                </div>
                <div className="analyzing-card__step analyzing-card__step--pending">
                  <ImageIcon size={20} aria-hidden="true" />
                  <span>Preparing results</span>
                </div>
              </div>
              <p className="analyzing-card__note">This usually takes 10-30 seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'result' && (
        <Card variant="elevated" className="detect-page__result-card">
          <CardContent>
            <div className="result-card">
              <div className="result-card__success">
                <div className="result-card__success-icon">
                  <CheckCircle size={48} aria-hidden="true" />
                </div>
                <h2 className="result-card__title">Analysis Complete!</h2>
                <p className="result-card__description">Your crop image has been analyzed. View the AI assessment and advisory.</p>
              </div>
              <div className="result-card__actions">
                <Link to={`/farmer/detection/result/case-${Date.now()}`}>
                  <Button variant="primary" size="lg">
                    View Results
                    <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} aria-hidden="true" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => setStep('upload')}>
                  <X size={18} aria-hidden="true" />
                  New Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <section className="detect-page__help" aria-labelledby="help-heading">
        <h2 id="help-heading" className="sr-only">Image Capture Guidelines</h2>
        <Card variant="outlined" className="detect-page__help-card">
          <CardContent>
            <div className="help-card__header">
              <HelpCircle size={24} aria-hidden="true" />
              <h3>How to Take a Good Crop Image</h3>
            </div>
            <div className="help-card__grid">
              <div className="help-card__item">
                <div className="help-card__item-icon">
                  <Camera size={24} aria-hidden="true" />
                </div>
                <h4>Lighting</h4>
                <p>Use natural daylight. Avoid direct sun causing harsh shadows. Early morning or late afternoon is ideal.</p>
              </div>
              <div className="help-card__item">
                <div className="help-card__item-icon">
                  <ImageIcon size={24} aria-hidden="true" />
                </div>
                <h4>Focus & Distance</h4>
                <p>Get close to affected leaves. Fill the frame with the symptom. Tap to focus on the lesion.</p>
              </div>
              <div className="help-card__item">
                <div className="help-card__item-icon">
                  <CheckCircle size={24} aria-hidden="true" />
                </div>
                <h4>Angles</h4>
                <p>Capture top and bottom of leaves. Include leaf edges and stems if affected.</p>
              </div>
              <div className="help-card__item">
                <div className="help-card__item-icon">
                  <X size={24} aria-hidden="true" />
                </div>
                <h4>What to Avoid</h4>
                <p>Blurry images, heavy shadows, flash glare, soil background only, multiple crops in one shot.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

Detect.displayName = 'Detect';

export default Detect;