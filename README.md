# NeuDetect

NeuDetect is an AI-assisted brain MRI analysis application designed to classify brain MRI images into four categories: glioma, meningioma, pituitary tumor, and no tumor.

The system combines a deep learning model with a web-based interface, authenticated user accounts, analysis history, and Grad-CAM visualizations to make model predictions easier to inspect.

NeuDetect is intended for research and decision-support purposes. Its predictions and visual explanations should not be treated as a substitute for professional medical diagnosis.

---

## Overview

NeuDetect provides an end-to-end workflow for submitting a brain MRI image and reviewing the resulting AI-assisted analysis.

The application consists of three main parts:

- **AI Model** — a ResNet50-based image classification model for brain tumor classification.
- **Backend** — a FastAPI application responsible for authentication, database access, image analysis, prediction handling, and Grad-CAM generation.
- **Frontend** — a Next.js application providing the interface for authentication, MRI upload, analysis results, dashboard information, and analysis history.

The current classification categories are:

- Glioma
- Meningioma
- No Tumor
- Pituitary

---

## Key Features

### Brain MRI Classification

NeuDetect uses a TensorFlow/Keras ResNet50 model to classify submitted MRI images into the supported categories.

The model uses a target image size of `224 × 224` pixels.

### Explainable AI with Grad-CAM

NeuDetect provides a Grad-CAM visualization alongside the model prediction.

The visualization highlights image regions that received stronger attention from the model when producing its prediction.

Grad-CAM is provided as an interpretability aid. The highlighted regions should not be interpreted as confirmed tumor boundaries or as a medical diagnosis.

### User Authentication

The backend provides account registration and login functionality using:

- Password hashing
- JWT-based authentication
- Protected API routes
- User-specific access to analysis records

Authenticated users can access their own profile and analysis history.

### Analysis History

Completed analyses are stored in PostgreSQL and associated with the authenticated user.

The history interface allows users to:

- View previous analyses
- Search by patient name or prediction
- Filter results by prediction category
- Open an individual analysis result

### Analysis Results

An analysis result can display:

- Patient information
- Predicted class
- Model confidence
- Original MRI image
- Grad-CAM visualization
- Analysis date and time

### Dashboard

The dashboard provides an overview of analysis activity, including:

- Total analyses
- Completed analyses
- Latest prediction
- Latest model confidence
- Recent analyses
- Quick actions for starting a new analysis

---

## System Architecture

NeuDetect follows a frontend/backend architecture in which the Next.js frontend communicates with the FastAPI backend through HTTP requests.

```text
                         ┌──────────────────────┐
                         │      NeuDetect       │
                         │      Frontend        │
                         │      Next.js         │
                         └──────────┬───────────┘
                                    │
                              HTTP / REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      NeuDetect       │
                         │       Backend        │
                         │       FastAPI        │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └────────────┐
                    ▼                                 ▼
          ┌──────────────────┐              ┌──────────────────┐
          │ TensorFlow/Keras │              │    PostgreSQL    │
          │     ResNet50     │              │     Database     │
          └────────┬─────────┘              └──────────────────┘
                   │
                   ▼
             ┌─────────────┐
             │   Grad-CAM  │
             │ Explanation │
             └─────────────┘
```

---

## Project Structure

```text
NeuDetect/
│
├── AI_Model/
│   ├── Neudetect.ipynb
│   ├── class_names.json
│   └── training_config.json
│
├── Backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── analysis.py
│   │   │   ├── model_loader.py
│   │   │   └── user.py
│   │   │
│   │   ├── routes/
│   │   │   ├── analyses.py
│   │   │   ├── analyze.py
│   │   │   ├── auth.py
│   │   │   ├── gradcam.py
│   │   │   └── prediction.py
│   │   │
│   │   ├── services/
│   │   │   ├── gradcam.py
│   │   │   └── prediction.py
│   │   │
│   │   ├── utils/
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── create_tables.py
│   ├── requirements.txt
│   └── test_database.py
│
├── Frontend/
│   └── neudetect/
│       ├── app/
│       │   ├── (dashboard)/
│       │   │   ├── dashboard/
│       │   │   ├── history/
│       │   │   ├── profile/
│       │   │   ├── result/
│       │   │   └── upload/
│       │   │
│       │   ├── login/
│       │   ├── register/
│       │   └── page.tsx
│       │
│       ├── components/
│       │   ├── dashboard/
│       │   ├── history/
│       │   ├── layout/
│       │   ├── result/
│       │   ├── ui/
│       │   └── upload/
│       │
│       ├── public/
│       └── package.json
│
└── .gitignore
```

---

## Tech Stack

### AI / Machine Learning

- **Language:** Python
- **Deep Learning:** TensorFlow, Keras
- **Model Architecture:** ResNet50
- **Image Processing:** OpenCV, Pillow
- **Explainability:** Grad-CAM

### Backend

- **API Framework:** FastAPI
- **Server:** Uvicorn
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Data Validation:** Pydantic
- **Authentication:** JWT
- **Password Hashing:** pwdlib

### Frontend

- **Framework:** Next.js
- **UI Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS

---

## Model Configuration

The current model configuration is defined in [`AI_Model/training_config.json`](AI_Model/training_config.json):

```json
{
    "model": "ResNet50",
    "task": "Brain Tumor Classification",
    "classes": [
        "glioma",
        "meningioma",
        "notumor",
        "pituitary"
    ],
    "image_size": "224x224",
    "dataset": "Masoud Nickparvar Brain Tumor MRI Dataset",
    "optimizer": "Adam",
    "loss": "categorical_crossentropy",
    "explainability": "Grad-CAM",
    "framework": "TensorFlow Keras"
}
```

The trained model is loaded by the backend from:

```text
Backend/model/NeuDetect_ResNet50.keras
```

The trained model file is excluded from Git through the repository's `.gitignore` configuration.

---

## Application Workflow

The main analysis workflow is:

```text
User
 │
 ▼
Login / Register
 │
 ▼
Dashboard
 │
 ▼
Upload MRI + Patient Information
 │
 ▼
FastAPI Analysis Endpoint
 │
 ▼
Image Processing
 │
 ▼
ResNet50 Prediction
 │
 ├───────────────► Predicted Class
 │
 └───────────────► Confidence
 │
 ▼
Grad-CAM Generation
 │
 ▼
Analysis Stored in PostgreSQL
 │
 ▼
Result Page
 │
 ├── Prediction
 ├── Confidence
 ├── Original MRI
 └── Grad-CAM Visualization
 │
 ▼
Analysis History
```

---

## Backend Setup

### 1. Create a virtual environment

From the `Backend` directory:

```powershell
cd Backend
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file inside the `Backend` directory:

```env
POSTGRES_PASSWORD=your_postgres_password
JWT_SECRET_KEY=your_long_random_secret_key
```

Do not commit the `.env` file to Git.

### 4. Create the PostgreSQL database

Create a PostgreSQL database named:

```text
neudetect
```

The current backend configuration expects PostgreSQL to be available at:

```text
localhost:5432
```

with the PostgreSQL user:

```text
postgres
```

### 5. Create database tables

From the `Backend` directory:

```powershell
python create_tables.py
```

### 6. Test the database connection

```powershell
python test_database.py
```

A successful connection should report:

```text
SUCCESS: PostgreSQL connection is working.
```

### 7. Start the backend

```powershell
uvicorn app.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Open a second terminal and move to the Next.js application:

```powershell
cd Frontend\neudetect
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

## Running NeuDetect Locally

Run the backend and frontend in separate terminals.

### Terminal 1 — Backend

```powershell
cd Backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

```powershell
cd Frontend\neudetect
npm run dev
```

Then open:

```text
http://localhost:3000
```

Register an account, sign in, and use the upload workspace to submit an MRI image for analysis.

---

## Authentication and Data Access

NeuDetect uses JWT access tokens for authenticated API requests.

After login, the frontend stores the access token for the current browser session and sends it with protected API requests through the `Authorization` header.

Analysis records are associated with the authenticated user through the `user_id` field in the database.

The backend verifies the token and retrieves the corresponding user before allowing access to protected resources.

---

## Database

NeuDetect uses PostgreSQL with SQLAlchemy.

### Users

The `users` table stores account information including:

- Name
- Email address
- Password hash
- Role
- Institution
- Account status
- Account creation time

Passwords are stored as password hashes rather than plain text.

### Analyses

The `analyses` table stores information associated with completed analyses, including:

- User ID
- Patient information
- Prediction
- Confidence
- Original MRI reference
- Grad-CAM result reference
- File name
- Analysis timestamp

---

## API Overview

The backend provides API routes for authentication, analysis, and explainability.

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Analysis

```text
POST /analyze/
GET  /analyses/
GET  /analyses/{analysis_id}
```

### Grad-CAM

```text
POST /gradcam/
```

The complete API can be inspected through the FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Explainability

NeuDetect uses Grad-CAM to provide a visual explanation of the model prediction.

The generated visualization is intended to show which image regions contributed more strongly to the model's output.

It is important to distinguish model attention from medical localization:

- Grad-CAM does not establish a tumor boundary.
- A highlighted region is not automatically a tumor.
- A prediction confidence value is not equivalent to clinical certainty.
- The visualization should be reviewed together with appropriate medical expertise.

---

## Data and Model

The current model configuration identifies the **Masoud Nickparvar Brain Tumor MRI Dataset** as the dataset used for the model configuration.

The repository does not include the trained model file or generated upload/result files because these files are excluded through `.gitignore`.

Model files and other generated data should be managed separately from the source-code repository where appropriate.

---

## Development Notes

NeuDetect separates the machine learning model, backend services, database layer, and frontend interface.

This structure allows the individual components to be developed and tested independently while maintaining an end-to-end workflow from MRI upload to analysis result.

The current configuration is primarily intended for local development.

---

## Limitations

NeuDetect should be considered an AI-assisted software system rather than an autonomous diagnostic system.

Important limitations include:

- Model predictions depend on the data and training process used to develop the model.
- Model confidence does not guarantee prediction correctness.
- Grad-CAM provides an interpretability visualization rather than clinical segmentation.
- The current backend configuration is intended for local development.
- The application does not replace professional medical evaluation.
- Further validation would be required before considering the system for clinical deployment.

---

## Security Considerations

The repository is configured to exclude environment files and other sensitive or generated files through `.gitignore`.

In particular, the following should not be committed:

- Database credentials
- JWT secret keys
- Environment files
- Trained model files
- Generated patient uploads
- Generated analysis results

For production deployment, additional security measures would be required, including secure secret management, HTTPS, appropriate access controls, secure file handling, production database configuration, and further validation of the authentication and application infrastructure.

---

## Disclaimer

NeuDetect is an AI-assisted research and decision-support application.

It is not intended to provide a definitive medical diagnosis. Predictions, confidence values, and Grad-CAM visualizations are generated by a machine learning system and may be incorrect.

NeuDetect should not be used as a substitute for evaluation, diagnosis, or treatment by a qualified healthcare professional.

Any clinical use would require appropriate technical, medical, regulatory, security, and validation processes beyond the current implementation.

---

## License

No open-source license has currently been specified for this repository.

If the project is intended to be distributed publicly, an appropriate license should be selected and added to the repository.

---

## Project Status

NeuDetect is under active development.

The current implementation includes the core workflow for user authentication, MRI upload, AI-assisted classification, Grad-CAM visualization, analysis storage, dashboard information, and analysis history.

Further development may focus on model evaluation, validation, security hardening, user experience improvements, deployment configuration, and additional testing.