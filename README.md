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

## 🔑 Environment Variables & AWS / API Credentials Setup

CivicForge uses a central `.env` file to dynamically configure AWS Amplify, Cognito authentication, AppSync GraphQL API, S3 storage, Amazon Bedrock AI, and Google Maps.

### 1. Create your `.env` file
Copy the provided `.env.example` template to create your local `.env` file:

```bash
# On Linux/macOS or Git Bash
cp .env.example .env

# On Windows PowerShell
copy .env.example .env
```

---

### 2. Configure AWS & Service URLs in `.env`

Open `.env` in your editor and replace the placeholder values with your real AWS resource links and credentials:

```ini
# ==============================================================================
# CIVICFORGE — ENVIRONMENT CONFIGURATION & AWS / API CREDENTIALS
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. AWS IAM CREDENTIALS (Used by AWS Amplify CLI for backend deployment)
# ------------------------------------------------------------------------------
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1

# ------------------------------------------------------------------------------
# 2. AWS AMPLIFY, COGNITO & APPSYNC FRONTEND CONFIGURATION
# ------------------------------------------------------------------------------
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOLS_ID=us-east-1_abcdef123
VITE_AWS_USER_POOLS_WEB_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m
VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
VITE_AWS_S3_BUCKET=civicforge-evidence-storage

# Optional Frontend Credentials for Direct Amazon Bedrock Access
VITE_AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
VITE_AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ------------------------------------------------------------------------------
# 3. GOOGLE MAPS PLATFORM (India Geographic Layer & Geocoding)
# ------------------------------------------------------------------------------
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ------------------------------------------------------------------------------
# 4. AMAZON BEDROCK AI MODEL ID
# ------------------------------------------------------------------------------
VITE_BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

---

### 3. How to Obtain Each Variable & URL from AWS & Google Consoles

| Variable | Description | Where to Obtain from AWS / Google Console |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | IAM User Access Key | **AWS Console** → IAM → Users → Your User → *Security credentials* → *Create access key*. |
| `AWS_SECRET_ACCESS_KEY` | IAM User Secret Key | **AWS Console** → Provided when creating your IAM access key. |
| `AWS_REGION` | Target AWS Region | AWS region identifier where your stack is deployed (e.g. `us-east-1` or `ap-south-1`). |
| `VITE_AWS_USER_POOLS_ID` | Cognito User Pool ID | **AWS Console** → Amazon Cognito → User Pools → Copy **User Pool ID** (e.g. `us-east-1_abc123`). |
| `VITE_AWS_USER_POOLS_WEB_CLIENT_ID` | Cognito App Client ID | **AWS Console** → Amazon Cognito → User Pools → App Integration → Copy **App client ID**. |
| `VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT` | AppSync GraphQL URL | **AWS Console** → AWS AppSync → APIs → Select API → Settings → Copy **GraphQL endpoint URL**. |
| `VITE_AWS_S3_BUCKET` | S3 Evidence Bucket Name | **AWS Console** → Amazon S3 → Buckets → Copy target bucket name (e.g. `civicforge-evidence-storage`). |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API Key | **Google Cloud Console** → APIs & Services → Credentials → *Create Credentials* → *API Key*. |
| `VITE_BEDROCK_MODEL_ID` | Amazon Bedrock LLM | Model identifier (default: `anthropic.claude-3-haiku-20240307-v1:0`). |

---

### 4. How the Application Fetches & Links `.env` Variables

- **Vite Frontend Bundler**: Exposes variables prefixed with `VITE_` at runtime via `import.meta.env`.
- **Dynamic Amplify Configuration**: `src/main.tsx` automatically detects whether `VITE_AWS_USER_POOLS_ID`, `VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT`, and `VITE_AWS_S3_BUCKET` are set in `.env` and initializes AWS Amplify dynamically.
- **Backend Deployment**: Running `npx ampx sandbox --once` uses `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from your environment to automatically deploy infrastructure and generate `amplify_outputs.json`.

---

## 🚀 Local Development Setup

```bash
# 1. Clone & install dependencies
git clone https://github.com/user/civicforge.git
cd civicforge
npm install

# 2. Setup your .env file
copy .env.example .env

# 3. Run local development server
npm run dev

# 4. Build & verify TypeScript compilation
npm run build
```

---

## 🔒 Security & Best Practices

- **Zero Secrets in Git**: Secrets, AWS credentials, and `.env` files are excluded via `.gitignore`.
- **Server-Side Validation**: Permissions, severity levels, and incident relationships are derived/verified server-side.
- **Least-Privilege IAM**: AWS resources enforce strict IAM access policies.
- **Private S3 Uploads**: Image evidence files are stored with restricted access control.

