# FasalAI — ML Specification

## ML Objective
Build a crop-agnostic, extensible image classification system that:
1. Identifies crop health status (healthy vs. specific diseases/pests) from plant images
2. Outputs calibrated confidence scores for risk assessment
3. Supports human-in-the-loop verification workflow
4. Allows adding new crops/diseases without retraining entire system
5. Works on real-field images with varying lighting, background, quality

---

## Crop-Agnostic Architecture

### Design Principle
**No hard-coded crop assumptions in model architecture or inference pipeline.**

```
┌─────────────────────────────────────────────────────────────┐
│                     Inference Pipeline                       │
├─────────────────────────────────────────────────────────────┤
│  1. Image Preprocessing (resize, normalize, augment)        │
│  2. Crop Detection (optional: detect crop type first)       │
│  3. Disease Classification (crop-specific head)             │
│  4. Confidence Calibration (temperature scaling)            │
│  5. Risk Assessment (confidence + severity + context)       │
└─────────────────────────────────────────────────────────────┘
```

### Two Architecture Options

#### Option A: Single Multi-Crop Model (Preferred for MVP)
- One backbone (EfficientNet-B3 / ConvNeXt-Tiny)
- Multiple classification heads (one per crop)
- Crop selection routes to correct head
- Shared features, crop-specific output layers
- **Pros:** Single model file, shared low-level features, easier deployment
- **Cons:** Head count grows with crops

#### Option B: Crop-Specific Models
- Separate model file per crop
- Router detects crop → loads appropriate model
- **Pros:** Independent optimization, smaller individual models
- **Cons:** Multiple artifacts, crop detection needed first

**Decision:** Start with **Option A** for MVP. Migrate to Option B if model size > 500MB or crops > 15.

---

## Initial Crop/Class Baseline (Working Prototype)

| Crop | Classes (Code : Display Name) |
|------|-------------------------------|
| **Tomato** | `tomato_healthy` : Healthy<br>`tomato_bacterial_spot` : Bacterial Spot<br>`tomato_early_blight` : Early Blight<br>`tomato_late_blight` : Late Blight<br>`tomato_ylcv` : Tomato Yellow Leaf Curl Virus |
| **Maize** | `maize_healthy` : Healthy<br>`maize_common_rust` : Common Rust<br>`maize_gray_leaf_spot` : Gray Leaf Spot<br>`maize_northern_leaf_blight` : Northern Leaf Blight |
| **Grape** | `grape_healthy` : Healthy<br>`grape_black_rot` : Black Rot<br>`grape_esca` : Black Measles / Esca<br>`grape_leaf_blight` : Leaf Blight |

**Total:** 3 crops × ~4-5 classes = ~13 classes + healthy per crop

**Note:** Classes may change after dataset inspection. Architecture must not assume fixed classes.

---

## Dataset Strategy

### Data Sources (Priority Order)
1. **PlantDoc** — Real-field images, diverse conditions, multiple crops (~2600 images, 13 crops, 80+ classes)
2. **PlantVillage** — Lab/controlled images, large volume (~54k images, 14 crops, 38 classes) — **use with caution**
3. **Custom Collection** — Farmer/extension worker contributed images (long-term)
4. **Public Datasets** — IP102, CropDoc, Rice Disease Dataset, etc.

### PlantVillage Limitations (Critical)
- **Lab conditions:** Uniform background, controlled lighting, detached leaves
- **Domain gap:** Does not represent real-field variability
- **Overfitting risk:** Models trained only on PlantVillage fail on field images
- **Strategy:** Use PlantVillage for **pre-training only**, fine-tune on PlantDoc + real-field data

### PlantDoc Advantages
- Real farmer-taken photos
- Complex backgrounds, varying angles, lighting
- Multiple crops and diseases
- Better generalization to target domain

### Data Split Strategy
| Split | Ratio | Purpose |
|-------|-------|---------|
| Train | 70% | Model training |
| Validation | 15% | Hyperparameter tuning, early stopping |
| Test | 15% | Final unbiased evaluation |

**Stratification:** By crop + disease class + source (PlantDoc vs PlantVillage) to ensure distribution.

### Data Augmentation (Critical for Field Robustness)
- **Geometric:** Random rotation (±30°), horizontal flip, random crop (0.8-1.0), perspective transform
- **Photometric:** Color jitter (brightness, contrast, saturation ±20%), Gaussian noise, blur
- **Field-specific:** Random background mixing (CutMix with soil/sky textures), random shadow, weather effects
- **Albumentations** pipeline for speed

### Class Imbalance Handling
- Weighted loss (inverse frequency)
- Oversampling minority classes
- Focal loss (γ=2) for hard examples
- Target: minimum 200 images per class for training

---

## Model Architecture

### Backbone
- **Primary:** ConvNeXt-Tiny (ImageNet-1K pretrained) — 28M params, fast inference
- **Alternative:** EfficientNet-B3 — 12M params, good accuracy/speed tradeoff
- **Input:** 224×224 or 384×384 (higher for fine-grained diseases)

### Head Architecture (Per Crop)
```
Backbone Features (768-d) → Dropout(0.3) → Linear(768, num_classes_crop)
```

### Training Strategy
1. **Stage 1:** Freeze backbone, train heads on PlantVillage (multi-crop, multi-label via crop routing)
2. **Stage 2:** Unfreeze backbone, fine-tune on PlantDoc + custom data (lower LR)
3. **Stage 3:** Confidence calibration on validation set (temperature scaling)

### Loss Function
- **Primary:** CrossEntropyLoss with class weights
- **Auxiliary:** Label smoothing (ε=0.1)
- **Calibration:** Temperature scaling post-training

### Optimization
- Optimizer: AdamW (lr=3e-4 head, 1e-5 backbone)
- Scheduler: Cosine annealing with warmup (5 epochs)
- Batch size: 32 (mixed precision)
- Epochs: 30-50 with early stopping (patience=7)

---

## Confidence Handling

### Calibration
- **Method:** Temperature Scaling (Guo et al., 2017) on validation set
- **Target:** ECE (Expected Calibration Error) < 0.05
- **Monitoring:** Reliability diagrams per crop

### Confidence Thresholds for Risk
| Confidence | Risk Level | Action |
|------------|------------|--------|
| ≥ 0.85 | Low | Show prediction, standard advisory |
| 0.70 – 0.84 | Medium | Show prediction, flag for review, extended advisory |
| 0.50 – 0.69 | High | Show prediction, **require extension verification**, cautionary advisory |
| < 0.50 | Critical | "Uncertain — expert review required", no specific advisory |

### Low-Confidence Behavior
1. **Do not** show single top prediction as definitive
2. **Show** top-3 predictions with scores
3. **Display:** "AI is uncertain. Please consult an extension worker."
4. **Auto-flag** case for priority extension review
5. **Log** for model improvement (active learning)

---

## Model Evaluation

### Metrics (Per Crop & Overall)
| Metric | Target | Notes |
|--------|--------|-------|
| Top-1 Accuracy | > 90% | On test set (real-field) |
| Top-3 Accuracy | > 95% | For low-confidence fallback |
| Macro F1 | > 0.85 | Per-class balance |
| ECE | < 0.05 | Calibration |
| Inference Time | < 200ms | On CPU (ONNX) |
| Model Size | < 100MB | For mobile/edge deployment |

### Evaluation Protocol
1. **Hold-out test set** (never seen during training/validation)
2. **Per-crop, per-class** metrics
3. **Confusion matrix** analysis for similar diseases
4. **Domain shift test:** PlantVillage-only vs. PlantDoc-only vs. Mixed
5. **Robustness tests:** Brightness, rotation, blur, occlusion

### Continuous Evaluation
- Track prediction distributions in production
- Monitor confidence calibration drift
- Collect extension worker corrections as labeled data
- Quarterly retraining with new data

---

## Future Model Improvements

### Short-term (Post-MVP)
- [ ] Ensemble of 3 models (different backbones/augmentations)
- [ ] Test-time augmentation (TTA) for higher accuracy
- [ ] Uncertainty estimation via MC Dropout or Deep Ensembles
- [ ] Crop detection head (auto-route without user selection)

### Medium-term
- [ ] Object detection for multi-leaf / multi-symptom images
- [ ] Segmentation for lesion localization
- [ ] Multi-image input (whole plant + close-up)
- [ ] Temporal modeling (sequence of images over days)

### Long-term
- [ ] Foundation model fine-tuning (DINOv2, MAE, CLIP)
- [ ] Few-shot learning for new diseases (5-10 samples)
- [ ] Multi-modal: image + weather + soil + text symptoms
- [ ] On-device inference (TensorRT, CoreML, TFLite)

---

## ML Service Integration

### Service Interface
```python
class MLService:
    async def predict(
        self,
        image: bytes,
        crop_id: str,
        location: Optional[Location] = None,
        weather: Optional[WeatherSnapshot] = None
    ) -> PredictionResult:
        ...
    
    async def predict_batch(self, requests: List[PredictRequest]) -> List[PredictionResult]:
        ...
    
    def get_model_info(self) -> ModelInfo:
        ...
    
    def health_check(self) -> bool:
        ...
```

### Deployment Options (Priority)
1. **FastAPI + ONNX Runtime** — CPU inference, easy scaling, <200ms
2. **Triton Inference Server** — Multi-model, batching, GPU support
3. **TorchServe** — Native PyTorch, model management

### Model Versioning
- Semantic versioning: `v{major}.{minor}.{patch}-{crop}`
- Example: `v1.2.0-tomato`, `v1.1.0-maize`
- Store: Model registry (MLflow) + artifact storage (S3/MinIO)
- A/B testing: Route % traffic to new version

### Monitoring
- **Latency:** p50, p95, p99
- **Throughput:** req/s
- **Prediction distribution:** Class frequencies
- **Confidence distribution:** Histogram
- **Drift detection:** Input distribution (image stats), prediction distribution
- **Business metrics:** Verification agreement rate, correction rate

---

## Data Pipeline (Future)
- Automated ingestion from farmer uploads (consented)
- Extension worker corrections → labeled dataset
- Active learning: Select low-confidence / high-disagreement for labeling
- Continuous training pipeline (Kubeflow / Airflow)
- Model validation gates before deployment

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| PlantVillage domain gap | Pre-train only, fine-tune on PlantDoc+real |
| Class imbalance | Weighted loss, focal loss, oversampling |
| New disease emergence | Crop-agnostic arch, few-shot heads, active learning |
| Confidence miscalibration | Temperature scaling, monitor ECE in production |
| Model size for mobile | Quantization (INT8), distillation, ONNX |
| Adversarial images | Input validation, OOD detection |
| Bias (geographic, variety) | Diverse training data, stratified evaluation |