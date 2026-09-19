import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { IssueCategory, Location } from '../../types';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { CivicMap, reverseGeocodeCoordinates } from '../../components/map/CivicMapAbstraction';
import { uploadEvidencePhoto } from '../../services/s3Service';
import {
  FileText,
  MapPin,
  Camera,
  X,
  UploadCloud,
  CheckCircle2,
  Cpu,
  Loader2,
  Layers,
  AlertTriangle,
  Compass
} from 'lucide-react';

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { addReport } = useData();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Road Infrastructure');
  const [location, setLocation] = useState<Location>({
    latitude: 37.7749,
    longitude: -122.4194,
    address: '402 Main St, San Francisco, CA',
    district: 'District 1 - Downtown',
  });

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [tempLat, setTempLat] = useState(location.latitude);
  const [tempLng, setTempLng] = useState(location.longitude);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setIsUploadingPhoto(true);
    try {
      const result = await uploadEvidencePhoto(file, `draft-${Date.now()}`);
      setPhotoUrl(result.url);
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to upload photo evidence.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const address = await reverseGeocodeCoordinates(lat, lng);
          setLocation({
            latitude: lat,
            longitude: lng,
            address,
            district: 'Detected Location',
          });
        },
        () => {
          setErrorMessage('Could not fetch GPS location. Please select manually on the map.');
        }
      );
    }
  };

  const handleMapLocationConfirm = async () => {
    const address = await reverseGeocodeCoordinates(tempLat, tempLng);
    setLocation({
      latitude: tempLat,
      longitude: tempLng,
      address,
      district: 'Manual Map Pin',
    });
    setIsMapModalOpen(false);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a title for the civic issue.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please describe the problem in detail.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    setAnalysisStage('Understanding description...');

    try {
      // Simulate real-time progress steps for UX clarity
      await new Promise((r) => setTimeout(r, 600));
      setAnalysisStage('Identifying category & assessing severity...');
      await new Promise((r) => setTimeout(r, 700));
      setAnalysisStage('Checking nearby reports & calculating relationship confidence...');
      await new Promise((r) => setTimeout(r, 800));

      const result = await addReport({
        title,
        description,
        category,
        location,
        photoUrls: photoUrl ? [photoUrl] : [],
        reporterId: currentUser.id,
        reporterName: currentUser.name,
      });

      setAnalysisResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze report.');
    } finally {
      setIsSubmitting(false);
      setAnalysisStage(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-civic-navy tracking-tight">Report a civic problem</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Submit details and photos of civic hazards. Our Amazon Bedrock AI engine will classify severity and search for related community reports.
        </p>
      </div>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {!analysisResult ? (
        <Card>
          <form onSubmit={handleSubmitReport}>
            <CardBody className="space-y-6">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
                  Problem Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep pothole near Main St intersection"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-civic-border rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue, hazards caused, or specific landmarks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border border-civic-border rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white resize-y"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="w-full px-3.5 py-2 border border-civic-border rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-civic-accent bg-white"
                >
                  <option value="Road Infrastructure">Road Infrastructure</option>
                  <option value="Water & Sewerage">Water & Sewerage</option>
                  <option value="Sanitation & Waste">Sanitation & Waste</option>
                  <option value="Electricity & Lighting">Electricity & Lighting</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Parks & Environment">Parks & Environment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Location Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
                  Location Pin
                </label>
                <div className="p-3 bg-slate-50 border border-civic-border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <MapPin className="w-4 h-4 text-civic-accent flex-shrink-0" />
                    <span>{location.address || `Lat: ${location.latitude}, Lng: ${location.longitude}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1 text-civic-dark"
                    >
                      <Compass className="w-3.5 h-3.5" /> Detect Location
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="px-2.5 py-1 text-xs font-semibold bg-civic-navy text-white rounded hover:bg-civic-blue flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Adjust on Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Evidence Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-civic-navy uppercase tracking-wider">
                  Photo Evidence (S3 Storage)
                </label>
                {photoUrl ? (
                  <div className="relative inline-block border rounded-lg overflow-hidden group">
                    <img src={photoUrl} alt="Evidence preview" className="w-48 h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(null)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-civic-accent cursor-pointer bg-slate-50/50 transition-colors">
                    {isUploadingPhoto ? (
                      <Loader2 className="w-6 h-6 animate-spin text-civic-accent mb-2" />
                    ) : (
                      <Camera className="w-8 h-8 text-slate-400 mb-2" />
                    )}
                    <span className="text-xs font-semibold text-civic-navy">
                      {isUploadingPhoto ? 'Uploading to S3 Storage...' : 'Upload Evidence Photo'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">JPEG, PNG, or WebP up to 5MB</span>
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                )}
                {photoError && <p className="text-xs text-red-600">{photoError}</p>}
              </div>

              {/* Real-time Processing Indicator during submission */}
              {isSubmitting && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md space-y-2 animate-pulse">
                  <div className="flex items-center gap-2 text-civic-blue font-bold text-xs uppercase tracking-wider">
                    <Cpu className="w-4 h-4 animate-spin" />
                    Analyzing Report with Bedrock AI...
                  </div>
                  <p className="text-xs text-blue-900 font-medium">{analysisStage}</p>
                </div>
              )}
            </CardBody>

            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <Button type="button" variant="outline" size="md" onClick={() => navigate('/citizen')}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} icon={<UploadCloud className="w-4 h-4" />}>
                  Submit & Analyze Report
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      ) : (
        /* Bedrock AI Analysis Result Screen */
        <Card className="border-2 border-civic-accent">
          <CardHeader className="bg-blue-900 text-white">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 font-bold text-base">
                <Cpu className="w-5 h-5 text-amber-400" />
                <span>AI Analysis Complete</span>
              </div>
              <Badge variant="blue" size="sm">
                AI Confidence: {analysisResult.aiConfidence}%
              </Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <Alert variant="info" title="Probabilistic AI Framing Notice">
              AI analysis is probabilistic. Original citizen reports are strictly preserved and never silently merged or overwritten. Human review by municipal authority is recommended.
            </Alert>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border rounded-md">
                <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                  Category Identified
                </span>
                <span className="font-bold text-civic-navy text-sm mt-1 block">
                  {analysisResult.issue.category}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border rounded-md">
                <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                  Severity Assessed
                </span>
                <div className="mt-1">
                  <Badge severity={analysisResult.issue.severity} size="sm" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border rounded-md">
                <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                  Recommended Department
                </span>
                <span className="font-bold text-civic-navy text-sm mt-1 block">
                  {analysisResult.issue.department}
                </span>
              </div>
            </div>

            {/* Possible Civic Incident Association Card */}
            {analysisResult.incident && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-amber-700" />
                    Possible Related Civic Incident
                  </span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    AI confidence: {analysisResult.aiConfidence}%
                  </span>
                </div>
                <h4 className="font-bold text-sm text-civic-navy">{analysisResult.incident.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysisResult.incident.summary}
                </p>

                {analysisResult.incident.relationshipSignals && (
                  <div className="mt-3 pt-2 border-t border-amber-200/80 space-y-1 text-[11px] text-amber-950">
                    <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-900">
                      Why these reports may be related:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {analysisResult.incident.relationshipSignals.explanation.map((exp: string, idx: number) => (
                        <li key={idx}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardBody>

          <CardFooter className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => navigate('/citizen')}>
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/issue/${analysisResult.issue.id}`)}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              View Submitted Report &rarr;
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Adjust Location Modal */}
      <Modal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        title="Adjust Location Pin on Civic Map"
        maxWidth="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsMapModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleMapLocationConfirm}>
              Confirm Location
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Click anywhere on the map to place the location pin for your report.
          </p>
          <CivicMap
            center={[tempLat, tempLng]}
            zoom={14}
            isSelectable={true}
            onLocationSelect={(lat, lng) => {
              setTempLat(lat);
              setTempLng(lng);
            }}
            markers={[
              {
                id: 'temp-pin',
                latitude: tempLat,
                longitude: tempLng,
                title: 'Selected Pin Location',
                category: category,
              },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};
