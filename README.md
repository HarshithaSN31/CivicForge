# CivicForge

> **"From scattered reports to actionable civic intelligence."**

CivicForge is a civic intelligence platform that transforms scattered, independent citizen reports into structured, potentially related civic incidents for authority review and action.

---

## 🏛️ The Fundamental Problem

Citizens frequently report the same underlying municipal issue independently (e.g., a deep pothole, a water main break, or a corridor street light outage). Traditional complaint management systems treat each submission as an isolated ticket, resulting in:
- Fragmented authority response queues
- Duplicate field dispatches
- Inability to recognize the true scope of community hazards
- Citizen frustration when complaints disappear into ticket boxes

---

## 💡 Key Innovation: Probabilistic Incident Grouping

CivicForge introduces **Probabilistic Civic Incident Grouping**:
1. **Never Merges or Deletes Reports**: Every original citizen report, photo evidence, and timestamp is 100% preserved.
2. **Transparent Relationship Scoring**: Uses a deterministic multi-factor algorithm combining:
   - **Geographic Proximity**: Haversine distance calculations (< 500m weighting)
   - **Category Match**: Structural & related category alignment
   - **Semantic Similarity**: Description token overlap & Jaccard similarity
   - **Time Window**: Temporal proximity weighting
3. **Probabilistic Framing**: AI output is explicitly framed with confidence scores (*"AI confidence: 91%"*, *"Human review recommended"*) rather than false claims of absolute duplicate detection.

---

## 🏗️ AWS Cloud Architecture

```
React / Vite Frontend (Mobile & Desktop UX)
                       │
                       ▼
            AWS Amplify Hosting
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
Amazon Cognito    Amazon DynamoDB  Amazon S3 Bucket
 User Pools        (Amplify Data)   (Private Evidence)
(CITIZEN/AUTHORITY)    │               │
       │               │               │
       └───────────────┼───────────────┘
                       ▼
         AWS Lambda Backend API
                       │
                       ▼
            Amazon Bedrock AI
     (Anthropic Claude 3 Haiku)
```

### AWS Services Utilized
- **AWS Amplify Gen 2**: Backend infrastructure orchestration, hosting, and data clients.
- **Amazon Cognito**: User Authentication, JWT session security, and role-based access control (`CITIZEN`, `AUTHORITY`).
- **Amazon DynamoDB**: Scalable NoSQL database storing Issues, CivicIncidents, IssueEvents, AIAnalyses, and Notifications.
- **Amazon S3**: Secure private image storage for citizen photo evidence.
- **AWS Lambda**: Server-side request execution, validation, and Bedrock API invocation.
- **Amazon Bedrock**: LLM classification, severity rating, department recommendation, and predictive analytics insights.

---

## 📊 Core Data Models

- **`User`**: User profile, Cognito ID, email, name, role (`CITIZEN` | `AUTHORITY`), department.
- **`Issue`**: Independent citizen report with location, category, severity, status, photo URLs, and optional `incidentId`.
- **`CivicIncident`**: Grouped civic incident containing multiple original report IDs, primary location, AI confidence score, and transparent relationship signals.
- **`IssueEvent`**: Audit log of status transitions, officer dispatches, and notes.
- **`AIAnalysis`**: Bedrock classification JSON output, confidence rating, and raw signals.
- **`Evidence`**: S3 key, URL, MIME type, and upload metadata.
- **`Notification`**: User alert notifications for status changes and resolutions.

---

## ⏱️ 3-Minute Hackathon Presentation Flow

- **0:00 - Problem**: Citizens report identical hazards independently; traditional systems treat them as separate tickets.
- **0:20 - Citizen Flow**: Citizen submits a photo and description of a severe road crater on Main St & 4th Ave.
- **0:50 - AI Analysis**: Amazon Bedrock classifies the issue as High Severity Road Infrastructure and recommends Road Maintenance.
- **1:05 - Incident Grouping**: Multi-factor relationship engine groups 3 nearby reports into **Possible Civic Incident #42 (91% AI confidence)** with transparent signal explanations.
- **1:30 - Authority Command Dashboard**: Authority reviews signature Incident #42, checks aggregated evidence matrix and GIS map.
- **1:50 - GIS & Intelligence Map**: Authority inspects cluster hotspots across municipal zones.
- **2:15 - Authority Action & Resolution**: Authority assigns Road Maintenance team, changes status to `IN_PROGRESS` → `RESOLVED`, and citizen sees live status update.
- **2:30 - AWS Architecture**: Demonstration of Cognito, DynamoDB, S3, Lambda, and Bedrock.
- **2:45 - Reliability & Fallbacks**: Deterministic relationship scoring and fallback handling when AI is low confidence or offline.
- **3:00 - Final Message**: *"CivicForge turns scattered citizen reports into actionable civic intelligence."*

---

## 🚀 Local Development Setup

```bash
# 1. Clone & install dependencies
git clone https://github.com/user/civicforge.git
cd civicforge
npm install

# 2. Run local development server
npm run dev

# 3. Build & verify TypeScript compilation
npm run build
```

---

## 🔒 Security & Best Practices

- **Zero Secrets in Git**: Secrets, AWS credentials, and `.env` files are excluded via `.gitignore`.
- **Server-Side Validation**: Permissions, severity levels, and incident relationships are derived/verified server-side.
- **Least-Privilege IAM**: AWS resources enforce strict IAM access policies.
- **Private S3 Uploads**: Image evidence files are stored with restricted access control.
