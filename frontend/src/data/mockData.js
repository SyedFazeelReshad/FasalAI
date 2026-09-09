// FasalAI Mock Data - Centralized for easy replacement with real API data

export const mockUser = {
  id: 'usr-001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  phone: '+91 98765 43210',
  role: 'farmer',
  avatarUrl: null,
  preferredLanguage: 'en',
  createdAt: '2025-01-15T10:30:00Z'
};

export const mockFarms = [
  {
    id: 'farm-001',
    userId: 'usr-001',
    name: 'North Field',
    location: { lat: 28.6139, lng: 77.2090 },
    address: 'Village Khampur, Delhi',
    areaValue: 5,
    areaUnit: 'acre',
    primaryCropId: 'tomato',
    soilType: 'Loamy',
    irrigationType: 'Drip',
    isActive: true,
    createdAt: '2025-02-01T08:00:00Z'
  },
  {
    id: 'farm-002',
    userId: 'usr-001',
    name: 'East Plot',
    location: { lat: 28.6200, lng: 77.2150 },
    address: 'Village Khampur, Delhi',
    areaValue: 3,
    areaUnit: 'acre',
    primaryCropId: 'maize',
    soilType: 'Clay Loam',
    irrigationType: 'Sprinkler',
    isActive: true,
    createdAt: '2025-03-15T08:00:00Z'
  },
  {
    id: 'farm-003',
    userId: 'usr-001',
    name: 'South Garden',
    location: { lat: 28.6050, lng: 77.2000 },
    address: 'Village Khampur, Delhi',
    areaValue: 2,
    areaUnit: 'acre',
    primaryCropId: 'grape',
    soilType: 'Sandy Loam',
    irrigationType: 'Drip',
    isActive: true,
    createdAt: '2025-04-10T08:00:00Z'
  }
];

export const mockCrops = [
  { id: 'cotton', code: 'cotton', name: 'Cotton', scientificName: 'Gossypium hirsutum', iconUrl: null },
  { id: 'tomato', code: 'tomato', name: 'Tomato', scientificName: 'Solanum lycopersicum', iconUrl: null },
  { id: 'maize', code: 'maize', name: 'Maize', scientificName: 'Zea mays', iconUrl: null },
  { id: 'grape', code: 'grape', name: 'Grape', scientificName: 'Vitis vinifera', iconUrl: null },
  { id: 'rice', code: 'rice', name: 'Rice', scientificName: 'Oryza sativa', iconUrl: null },
  { id: 'potato', code: 'potato', name: 'Potato', scientificName: 'Solanum tuberosum', iconUrl: null },
  { id: 'sugarcane', code: 'sugarcane', name: 'Sugarcane', scientificName: 'Saccharum officinarum', iconUrl: null },
  { id: 'mango', code: 'mango', name: 'Mango', scientificName: 'Mangifera indica', iconUrl: null }
];

export const mockDiseases = [
  { id: 'tomato_healthy', cropId: 'tomato', code: 'tomato_healthy', name: 'Healthy', category: 'healthy', severityBase: 'low' },
  { id: 'tomato_bacterial_spot', cropId: 'tomato', code: 'tomato_bacterial_spot', name: 'Bacterial Spot', category: 'disease', severityBase: 'high' },
  { id: 'tomato_early_blight', cropId: 'tomato', code: 'tomato_early_blight', name: 'Early Blight', category: 'disease', severityBase: 'high' },
  { id: 'tomato_late_blight', cropId: 'tomato', code: 'tomato_late_blight', name: 'Late Blight', category: 'disease', severityBase: 'critical' },
  { id: 'tomato_ylcv', cropId: 'tomato', code: 'tomato_ylcv', name: 'Tomato Yellow Leaf Curl Virus', category: 'disease', severityBase: 'critical' },
  { id: 'maize_healthy', cropId: 'maize', code: 'maize_healthy', name: 'Healthy', category: 'healthy', severityBase: 'low' },
  { id: 'maize_common_rust', cropId: 'maize', code: 'maize_common_rust', name: 'Common Rust', category: 'disease', severityBase: 'high' },
  { id: 'maize_gray_leaf_spot', cropId: 'maize', code: 'maize_gray_leaf_spot', name: 'Gray Leaf Spot', category: 'disease', severityBase: 'high' },
  { id: 'maize_northern_leaf_blight', cropId: 'maize', code: 'maize_northern_leaf_blight', name: 'Northern Leaf Blight', category: 'disease', severityBase: 'high' },
  { id: 'grape_healthy', cropId: 'grape', code: 'grape_healthy', name: 'Healthy', category: 'healthy', severityBase: 'low' },
  { id: 'grape_black_rot', cropId: 'grape', code: 'grape_black_rot', name: 'Black Rot', category: 'disease', severityBase: 'high' },
  { id: 'grape_esca', cropId: 'grape', code: 'grape_esca', name: 'Black Measles / Esca', category: 'disease', severityBase: 'high' },
  { id: 'grape_leaf_blight', cropId: 'grape', code: 'grape_leaf_blight', name: 'Leaf Blight', category: 'disease', severityBase: 'medium' }
];

export const mockCases = [
  {
    id: 'case-001',
    farmerId: 'usr-001',
    farmId: 'farm-001',
    cropId: 'tomato',
    status: 'verified',
    images: [
      { url: 'https://images.unsplash.com/photo-1592841200221-6e4e3c2f0d4b?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1592841200221-6e4e3c2f0d4b?w=300', isPrimary: true }
    ],
    location: { lat: 28.6139, lng: 77.2090 },
    capturedAt: '2026-08-25T10:30:00Z',
    submittedAt: '2026-08-25T10:35:00Z',
    reviewedAt: '2026-08-26T14:00:00Z',
    notes: 'Noticed yellowing on lower leaves',
    createdAt: '2026-08-25T10:30:00Z'
  },
  {
    id: 'case-002',
    farmerId: 'usr-001',
    farmId: 'farm-001',
    cropId: 'tomato',
    status: 'under_review',
    images: [
      { url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300', isPrimary: true }
    ],
    location: { lat: 28.6145, lng: 77.2095 },
    capturedAt: '2026-09-01T08:15:00Z',
    submittedAt: '2026-09-01T08:20:00Z',
    notes: 'Spots appearing after heavy rain',
    createdAt: '2026-09-01T08:15:00Z'
  },
  {
    id: 'case-003',
    farmerId: 'usr-001',
    farmId: 'farm-002',
    cropId: 'maize',
    status: 'verified',
    images: [
      { url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300', isPrimary: true }
    ],
    location: { lat: 28.6200, lng: 77.2150 },
    capturedAt: '2026-08-20T14:00:00Z',
    submittedAt: '2026-08-20T14:05:00Z',
    reviewedAt: '2026-08-21T10:00:00Z',
    notes: 'Rust colored pustules on leaves',
    createdAt: '2026-08-20T14:00:00Z'
  },
  {
    id: 'case-004',
    farmerId: 'usr-001',
    farmId: 'farm-003',
    cropId: 'grape',
    status: 'submitted',
    images: [
      { url: 'https://images.unsplash.com/photo-1537640138216-f591a950b660?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1537640138216-f591a950b660?w=300', isPrimary: true }
    ],
    location: { lat: 28.6050, lng: 77.2000 },
    capturedAt: '2026-09-03T16:45:00Z',
    submittedAt: '2026-09-03T16:50:00Z',
    notes: 'Black spots on berries',
    createdAt: '2026-09-03T16:45:00Z'
  },
  {
    id: 'case-005',
    farmerId: 'usr-001',
    farmId: 'farm-001',
    cropId: 'tomato',
    status: 'rejected',
    images: [
      { url: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300', isPrimary: true }
    ],
    location: { lat: 28.6139, lng: 77.2090 },
    capturedAt: '2026-08-15T11:00:00Z',
    submittedAt: '2026-08-15T11:05:00Z',
    reviewedAt: '2026-08-16T09:00:00Z',
    notes: 'Suspected nutrient deficiency',
    createdAt: '2026-08-15T11:00:00Z'
  }
];

export const mockPredictions = [
  {
    id: 'pred-001',
    caseId: 'case-001',
    modelVersion: 'v1.2.0-tomato',
    diseaseId: 'tomato_early_blight',
    confidence: 0.87,
    allScores: {
      tomato_early_blight: 0.87,
      tomato_healthy: 0.08,
      tomato_bacterial_spot: 0.03,
      tomato_late_blight: 0.02
    },
    riskLevel: 'high',
    riskFactors: { weather: 0.8, confidence: 0.87, severity: 0.9, spreadRisk: 0.7 },
    inferenceTimeMs: 145,
    isPrimary: true,
    createdAt: '2026-08-25T10:30:00Z'
  },
  {
    id: 'pred-002',
    caseId: 'case-002',
    modelVersion: 'v1.2.0-tomato',
    diseaseId: 'tomato_late_blight',
    confidence: 0.72,
    allScores: {
      tomato_late_blight: 0.72,
      tomato_early_blight: 0.18,
      tomato_bacterial_spot: 0.07,
      tomato_healthy: 0.03
    },
    riskLevel: 'high',
    riskFactors: { weather: 0.9, confidence: 0.72, severity: 0.95, spreadRisk: 0.85 },
    inferenceTimeMs: 152,
    isPrimary: true,
    createdAt: '2026-09-01T08:15:00Z'
  },
  {
    id: 'pred-003',
    caseId: 'case-003',
    modelVersion: 'v1.1.0-maize',
    diseaseId: 'maize_common_rust',
    confidence: 0.91,
    allScores: {
      maize_common_rust: 0.91,
      maize_healthy: 0.05,
      maize_gray_leaf_spot: 0.03,
      maize_northern_leaf_blight: 0.01
    },
    riskLevel: 'medium',
    riskFactors: { weather: 0.6, confidence: 0.91, severity: 0.8, spreadRisk: 0.6 },
    inferenceTimeMs: 138,
    isPrimary: true,
    createdAt: '2026-08-20T14:00:00Z'
  },
  {
    id: 'pred-004',
    caseId: 'case-004',
    modelVersion: 'v1.0.0-grape',
    diseaseId: 'grape_black_rot',
    confidence: 0.65,
    allScores: {
      grape_black_rot: 0.65,
      grape_leaf_blight: 0.20,
      grape_esca: 0.10,
      grape_healthy: 0.05
    },
    riskLevel: 'high',
    riskFactors: { weather: 0.75, confidence: 0.65, severity: 0.85, spreadRisk: 0.7 },
    inferenceTimeMs: 165,
    isPrimary: true,
    createdAt: '2026-09-03T16:45:00Z'
  },
  {
    id: 'pred-005',
    caseId: 'case-005',
    modelVersion: 'v1.2.0-tomato',
    diseaseId: 'tomato_bacterial_spot',
    confidence: 0.42,
    allScores: {
      tomato_bacterial_spot: 0.42,
      tomato_early_blight: 0.28,
      tomato_healthy: 0.20,
      tomato_late_blight: 0.10
    },
    riskLevel: 'critical',
    riskFactors: { weather: 0.5, confidence: 0.42, severity: 0.8, spreadRisk: 0.6 },
    inferenceTimeMs: 158,
    isPrimary: true,
    createdAt: '2026-08-15T11:00:00Z'
  }
];

export const mockVerifications = [
  {
    id: 'ver-001',
    caseId: 'case-001',
    extensionWorkerId: 'ext-001',
    action: 'confirmed',
    correctedDiseaseId: null,
    confidenceAgreement: 'agree',
    fieldObservations: 'Observed concentric rings on lower leaves, 30% canopy affected. Typical early blight symptoms confirmed.',
    fieldImages: [],
    recommendations: [
      { type: 'treatment', description: 'Copper oxychloride 50% WP @ 2.5g/L', priority: 'high', timing: 'immediate' },
      { type: 'monitoring', description: 'Repeat application after 10 days if needed', priority: 'medium', timing: '10 days' }
    ],
    statusBefore: 'under_review',
    statusAfter: 'verified',
    reviewedAt: '2026-08-26T14:00:00Z'
  },
  {
    id: 'ver-002',
    caseId: 'case-003',
    extensionWorkerId: 'ext-001',
    action: 'confirmed',
    correctedDiseaseId: null,
    confidenceAgreement: 'agree',
    fieldObservations: 'Orange-brown pustules on upper and lower leaf surfaces. Confirmed common rust.',
    fieldImages: [],
    recommendations: [
      { type: 'treatment', description: 'Propiconazole 25% EC @ 1ml/L', priority: 'high', timing: 'immediate' },
      { type: 'cultural', description: 'Remove severely infected leaves', priority: 'medium', timing: 'immediate' }
    ],
    statusBefore: 'under_review',
    statusAfter: 'verified',
    reviewedAt: '2026-08-21T10:00:00Z'
  }
];

export const mockAdvisories = {
  tomato_early_blight: {
    immediateActions: [
      'Remove and destroy infected leaves immediately',
      'Apply copper-based fungicide (Copper oxychloride 50% WP @ 2.5g/L)',
      'Avoid overhead irrigation - use drip irrigation only',
      'Improve air circulation by proper spacing'
    ],
    monitoring: [
      'Check plants daily for spread to upper leaves',
      'Monitor humidity levels - disease spreads in high humidity',
      'Watch for new lesions on stems and fruit'
    ],
    expertConsultation: [
      'Contact local extension worker for field verification',
      'Share this case for expert review if confidence is below 70%',
      'Consult KVK (Krishi Vigyan Kendra) for region-specific advice'
    ],
    inputGuidance: [
      'Use only label-approved fungicides registered for tomato',
      'Follow pre-harvest interval (PHI) strictly',
      'Rotate fungicide groups to prevent resistance',
      'Consult local agricultural department for approved products'
    ],
    preventiveMeasures: [
      'Use certified disease-free seeds',
      'Practice crop rotation (avoid solanaceous crops for 2-3 years)',
      'Mulch around plants to reduce soil splash',
      'Apply preventive copper sprays during humid weather'
    ]
  },
  tomato_late_blight: {
    immediateActions: [
      'Remove and destroy all infected plant material immediately',
      'Apply systemic fungicide (Metalaxyl + Mancozeb) as per label',
      'Destroy severely infected plants to prevent spread',
      'Ensure excellent drainage - avoid waterlogging'
    ],
    monitoring: [
      'Inspect field twice daily during cool, wet weather',
      'Monitor for white sporulation on leaf undersides',
      'Check neighboring fields for early signs'
    ],
    expertConsultation: [
      'URGENT: Contact extension worker immediately',
      'Late blight can destroy entire crop in days',
      'Coordinate with neighboring farmers for area-wide management'
    ],
    inputGuidance: [
      'Use only approved late blight fungicides',
      'Follow resistance management guidelines strictly',
      'Do not exceed maximum applications per season'
    ],
    preventiveMeasures: [
      'Plant resistant varieties where available',
      'Space plants for good air circulation',
      'Apply preventive sprays before disease onset',
      'Remove volunteer potato/tomato plants'
    ]
  },
  maize_common_rust: {
    immediateActions: [
      'Apply triazole fungicide (Propiconazole 25% EC @ 1ml/L)',
      'Remove severely infected lower leaves',
      'Ensure adequate nitrogen - avoid deficiency'
    ],
    monitoring: [
      'Check for new pustules every 3-4 days',
      'Monitor weather - rust favors cool, humid conditions',
      'Track spread to upper canopy leaves'
    ],
    expertConsultation: [
      'Consult extension worker for variety-specific resistance',
      'Regional rust races may affect variety performance'
    ],
    inputGuidance: [
      'Use fungicides registered for maize rust only',
      'Follow PHI for grain harvest',
      'Rotate fungicide modes of action'
    ],
    preventiveMeasures: [
      'Plant rust-resistant hybrids',
      'Early planting to escape peak rust season',
      'Balanced fertilization - avoid excess nitrogen'
    ]
  },
  grape_black_rot: {
    immediateActions: [
      'Remove and destroy all infected berries and leaves',
      'Apply protective fungicide (Mancozeb 75% WP @ 2g/L)',
      'Improve canopy management for air flow',
      'Sanitize pruning tools between vines'
    ],
    monitoring: [
      'Weekly inspection during fruit development',
      'Watch for bird damage creating entry points',
      'Monitor for mummy berries on ground'
    ],
    expertConsultation: [
      'Consult viticulture specialist for canopy management',
      'Regional disease pressure varies significantly'
    ],
    inputGuidance: [
      'Use only grape-registered fungicides',
      'Respect PHI for table grapes vs wine grapes',
      'Copper sprays may cause phytotoxicity on some varieties'
    ],
    preventiveMeasures: [
      'Winter sanitation - remove all mummy berries',
      'Proper dormant pruning for open canopy',
      'Pre-bloom and post-bloom protective sprays'
    ]
  }
};

export const mockWeather = {
  current: {
    temperature: 28,
    humidity: 78,
    rainfall: 12.5,
    windSpeed: 8,
    condition: 'Partly Cloudy',
    timestamp: '2026-09-05T10:00:00Z'
  },
  forecast: [
    { date: '2026-09-05', tempMin: 24, tempMax: 31, humidity: 80, rainfall: 5, condition: 'Light Rain' },
    { date: '2026-09-06', tempMin: 23, tempMax: 29, humidity: 85, rainfall: 15, condition: 'Moderate Rain' },
    { date: '2026-09-07', tempMin: 24, tempMax: 30, humidity: 75, rainfall: 2, condition: 'Partly Cloudy' }
  ]
};

export const mockDashboardStats = {
  farmer: {
    totalFarms: 3,
    activeCases: 2,
    highRiskCases: 1,
    recentlyMonitored: 5
  },
  extension: {
    pendingCases: 12,
    inReview: 5,
    verifiedToday: 3,
    thisWeek: 18
  },
  official: {
    totalCases: 1247,
    activeDiseases: 8,
    highRiskAreas: 23,
    verificationRate: 78
  }
};

export const mockTrends = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  datasets: [
    { label: 'Tomato Early Blight', data: [12, 18, 25, 32, 28, 35, 42, 38], color: '#C62828' },
    { label: 'Maize Common Rust', data: [8, 12, 15, 18, 22, 20, 25, 23], color: '#F57F17' },
    { label: 'Grape Black Rot', data: [5, 7, 9, 11, 10, 13, 15, 14], color: '#2E7D32' }
  ]
};

export const mockHotspots = [
  { id: 'hs-1', lat: 28.6139, lng: 77.2090, count: 45, disease: 'tomato_early_blight', risk: 'high' },
  { id: 'hs-2', lat: 28.6562, lng: 77.2410, count: 32, disease: 'maize_common_rust', risk: 'medium' },
  { id: 'hs-3', lat: 28.7041, lng: 77.1025, count: 28, disease: 'tomato_late_blight', risk: 'high' },
  { id: 'hs-4', lat: 28.5355, lng: 77.3910, count: 18, disease: 'grape_black_rot', risk: 'medium' },
  { id: 'hs-5', lat: 28.4089, lng: 77.3178, count: 15, disease: 'tomato_bacterial_spot', risk: 'low' }
];

export const mockRiskAreas = [
  { region: 'North Delhi', caseCount: 89, dominantDisease: 'Tomato Early Blight', avgConfidence: 0.82, trend: 'up', riskScore: 87 },
  { region: 'South Delhi', caseCount: 67, dominantDisease: 'Maize Common Rust', avgConfidence: 0.78, trend: 'up', riskScore: 72 },
  { region: 'East Delhi', caseCount: 45, dominantDisease: 'Grape Black Rot', avgConfidence: 0.71, trend: 'stable', riskScore: 58 },
  { region: 'West Delhi', caseCount: 34, dominantDisease: 'Tomato Late Blight', avgConfidence: 0.69, trend: 'up', riskScore: 65 },
  { region: 'Central Delhi', caseCount: 28, dominantDisease: 'Tomato Bacterial Spot', avgConfidence: 0.65, trend: 'down', riskScore: 42 }
];

export const mockExtensionCases = [
  ...mockCases.slice(0, 3).map(c => ({ ...c, assignedTo: 'ext-001', distance: '2.3 km' })),
  { ...mockCases[3], assignedTo: 'ext-001', distance: '5.1 km' }
];

export const mockOfficialCases = mockCases.map(c => ({
  ...c,
  farmerName: 'Rajesh Kumar',
  farmerPhone: '+91 98765 43210',
  extensionWorker: 'Priya Sharma',
  verificationStatus: c.status === 'verified' ? 'Verified' : c.status === 'under_review' ? 'Under Review' : 'Pending'
}));